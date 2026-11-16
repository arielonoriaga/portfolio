---
layout: ../../layouts/Article.astro
title: 'Payments that survive retries: idempotency keys, guarded transitions and an outbox in Rust'
description: 'How a commerce backend avoids double charges and lost orders when requests, webhooks and workers are all allowed to retry.'
date: '2026-11-16'
---

Everything in a payment flow retries. The point-of-sale app retries when the network drops. The payment platform redelivers an event until it gets a 200. A background worker picks a job up again after a crash. Each retry is correct behaviour on its own, and each one is a chance to charge someone twice or lose an order.

Ez-Stock is the commerce backend I build and run: Rust with Axum and SQLx on PostgreSQL. This is how it stays correct under retries. There are three mechanisms, and each covers a different failure. I'll also show where they still leak, because the gaps taught me more than the parts that work.

## 1. Idempotency keys for requests

The client sends an `Idempotency-Key` header. The server namespaces it as `<company>:<endpoint>:<key>`, so two tenants, or two endpoints, can never collide on the same value. Some endpoints fold the resource id into the tag as well, so a key used to void one sale cannot be replayed against another.

The first request claims the key by inserting a row with an empty response. One statement does the claim, and it also takes over a claim that has expired:

```rust
let claim = sqlx::query(
    "INSERT INTO idempotency_keys (key)
     VALUES ($1)
     ON CONFLICT (key) DO UPDATE
     SET response = NULL, created_at = NOW(), updated_at = NOW(),
         expires_at = NOW() + INTERVAL '24 hours'
     WHERE idempotency_keys.expires_at <= NOW()
     RETURNING id",
)
.bind(&key)
.execute(pool)
.await;
```

If the insert returns a row, this request owns the key and runs the handler. If not, someone else does. What happens next depends on the state of that other request:

| Situation | Response |
|---|---|
| First request | Runs the handler, stores status and body |
| Same key, first request finished | Stored response, with an `Idempotent-Replayed: true` header |
| Same key, first request still running | Waits up to two seconds, then `409 IDEMPOTENCY_KEY_IN_FLIGHT` |
| Same key, different body | `422 IDEMPOTENCY_KEY_CONFLICT` |

<figure class="diagram">
<svg viewBox="0 0 720 345" role="img" aria-labelledby="d1t d1d">
<title id="d1t">One idempotency key, three requests</title>
<desc id="d1d">A sequence diagram. The first request claims the key and runs the handler. A duplicate that arrives while it is running gets 409. After the response is stored, a replay gets the stored response and the handler does not run again.</desc>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke"/></marker></defs>
<text class="lane" x="110" y="28">POS client</text><line class="life" x1="110" y1="42" x2="110" y2="330"/>
<text class="lane" x="360" y="28">API</text><line class="life" x1="360" y1="42" x2="360" y2="330"/>
<text class="lane" x="610" y="28">idempotency_keys</text><line class="life" x1="610" y1="42" x2="610" y2="330"/>
<rect class="run s2" x="352" y="108" width="16" height="108"/><text class="note s2" x="376" y="166">handler running</text>
<g class="msg s1 "><path pathLength="1" d="M110 78 H360" marker-end="url(#ah)"/><text x="235.0" y="71">POST /charge · key abc</text></g>
<g class="msg s2 "><path pathLength="1" d="M360 108 H610" marker-end="url(#ah)"/><text x="485.0" y="101">claim key abc</text></g>
<g class="msg s3 "><path pathLength="1" d="M110 150 H360" marker-end="url(#ah)"/><text x="235.0" y="143">retry · same key</text></g>
<g class="msg s4 bad"><path pathLength="1" d="M360 176 H110" marker-end="url(#ah)"/><text x="235.0" y="169">409 in flight</text></g>
<g class="msg s5 "><path pathLength="1" d="M360 216 H610" marker-end="url(#ah)"/><text x="485.0" y="209">store response</text></g>
<g class="msg s6 "><path pathLength="1" d="M360 242 H110" marker-end="url(#ah)"/><text x="235.0" y="235">200 OK</text></g>
<g class="msg s7 "><path pathLength="1" d="M110 284 H360" marker-end="url(#ah)"/><text x="235.0" y="277">retry · same key</text></g>
<g class="msg s8 good"><path pathLength="1" d="M360 310 H110" marker-end="url(#ah)"/><text x="235.0" y="303">200 replayed · handler not run</text></g>
</svg>
<figcaption>One key, three requests. The duplicate that arrives mid-flight is refused, and the replay after completion gets the stored response. The handler runs exactly once.</figcaption>
</figure>

Four details matter more than the happy path.

**A duplicate never falls through to the handler.** When the first request is slow, the tempting fix is to let the second one run after a timeout. The first request may still be inside an external billing call. So the duplicate gets a 409 and the client retries later.

**The body is hashed.** The stored record includes a SHA-256 of the request body. A replay with the same key and a different payload is a client bug, and it gets an error instead of someone else's response.

**Only successes are cached.** A non-2xx response deletes the claim, so the request stays retryable. A cached failure would turn one bad moment into a permanent error for that key.

**Storage errors fail closed.** If the key table can't be reached, the request is refused. Running a money mutation without protection is worse than a 500.

Keys expire after 24 hours and an hourly job deletes the expired rows.

### The bug that only showed up in production

The first version ran the handler inside the request future. That is the natural way to write an Axum handler, and it was wrong.

The POS client gives up after 15 seconds. Tax invoicing can take 20. When the client disconnects, Axum drops the handler future. Dropped at that point, the claim was neither completed nor released, so every retry of that ticket got "in flight" for the next 24 hours. The sale was stuck behind its own idempotency key.

The fix is to detach the work from the connection:

```rust
// Detached from the request future: when the client gives up, axum drops
// the handler future. Dropped here, the claim was never stored or released
// and every retry got IDEMPOTENCY_KEY_IN_FLIGHT for 24 h.
let pool = pool.clone();
match tokio::spawn(run_claimed(pool, key, req_hash, handler)).await {
    Ok(response) => response,
    // ...
```

The spawned task finishes and settles the key whether or not anyone is still listening. A test named `client_disconnect_still_settles_the_key` now pins that behaviour.

An earlier lesson from the same file: the original global middleware inserted a marker row and never cached a response, so it deduplicated nothing. It looked like protection and was not. I removed it as dead code.

## 2. A guarded transition for payment events

Payment events arrive from my platform service, which owns the provider credentials and the provider's webhook. Events are redelivered and can arrive out of order.

I did not build a table of seen delivery ids. The delivery id is kept for audit only. Deduplication is the state transition itself:

```rust
let result = sqlx::query(
    "UPDATE mercadopago_payment_intents \
        SET status = $2, reconciled_at = NOW(), updated_at = NOW() \
      WHERE id = $1 AND status = 'pending' \
        AND EXISTS ( \
          SELECT 1 FROM sales s \
           WHERE s.id = mercadopago_payment_intents.sale_id AND s.status <> 'voided' \
        )",
)
.bind(id)
.bind(new_status)
.execute(&self.pool)
.await?;
Ok(result.rows_affected() == 1)
```

One row affected means this delivery won. Zero means it was a replay, or the sale was voided while the payment was in flight, and nothing is applied. The first terminal event wins and later ones are logged as already reconciled. The `EXISTS` clause closes a race between a cashier voiding a sale and a payment landing on it.

Three rules around that statement:

- **Check the signature before reading anything.** The event is signed with HMAC-SHA256 over the timestamp and the raw body, and a timestamp outside the replay window is refused. A forged delivery is rejected before a single read or write.
- **Answer 200 to every business outcome.** Unknown charge, already reconciled, amount mismatch: all acknowledged. A non-2xx would be retried forever and fix nothing.
- **Never take the amount from the event.** The amount always comes from the sale total on the server, held as a `Decimal` in Rust and `NUMERIC(12,2)` in PostgreSQL. A difference of more than one cent is logged as a mismatch for a human to look at.

On the creation side, a partial unique index allows one pending intent per sale, so a double-tap on "charge" cannot open two.

## 3. An outbox for the events that follow

After a sale commits, other systems need to hear about it. If the backend published that event after committing, a crash in between would lose it. So the event is written in the same transaction as the sale:

```rust
pub async fn enqueue<'e, E>(executor: E, company_id: Uuid, sale_id: Uuid) -> Result<(), sqlx::Error>
where
    E: Executor<'e, Database = Postgres>,
{
    sqlx::query(
        "INSERT INTO revenue_event_outbox (company_id, sale_id) VALUES ($1, $2)
         ON CONFLICT (sale_id) DO NOTHING",
    )
    .bind(company_id).bind(sale_id).execute(executor).await.map(|_| ())
}

// call site, inside the sale-creation transaction:
outbox::enqueue(&mut **tx, company_id, sale.id).await?;
```

`enqueue` takes any SQLx executor, so the caller passes the open transaction. Either the sale and its outbox row both exist, or neither does. The comment on the migration says it plainly: a sale must never be lost merely because a downstream service is unavailable when the POS commits it.

A relay loop polls every 30 seconds, sends a batch in order, deletes rows on success, and counts failures. After five failures a row is parked for a human. The event carries the sale id as its key, so the receiver can discard a duplicate.

### The locking mistake

The relay's first claim query was a `SELECT ... FOR UPDATE SKIP LOCKED`, the standard way to let several workers share a queue. It ran directly on the connection pool, outside a transaction.

In autocommit mode the row locks are released when the statement ends, which is before the HTTP call starts. Two replicas could claim and send the same row. `SKIP LOCKED` only protects work done inside the transaction that holds the lock.

The fix I used on a sibling outbox was a lease: the claim is an `UPDATE` that stamps the rows, and it survives the statement.

```sql
UPDATE reco_push_outbox
SET claimed_at = NOW()
WHERE id IN (
    SELECT id
    FROM reco_push_outbox
    WHERE retry_count < $2
      AND (claimed_at IS NULL
           OR claimed_at < NOW() - make_interval(secs => $3))
    ORDER BY enqueued_at, id
    LIMIT $1
    FOR UPDATE SKIP LOCKED
)
RETURNING id, company_id, sale_id, kind, retry_count, enqueued_at
```

A worker that dies mid-send simply lets its lease expire, and another worker takes the row. Delivery is at-least-once either way, which is why the consumer's dedup key is not optional.

## What is still not solved

- **Charge creation has a window.** Creating a charge calls the platform, then inserts the local intent. No transaction spans both. If the call times out, the error releases the idempotency claim and a retry calls the platform again. The platform's own one-live-charge-per-sale rule is what prevents a double charge there, not my code.
- **Fee bookkeeping runs after the transition.** The fee and its expense entry are written in separate statements after the guarded update. A crash between them loses the fee entry, because the replay is a no-op by design.
- **A sale voided after the customer has paid** is left for a person. There is no automatic refund.

## What I'd tell someone starting this

1. Decide what each mechanism is for. Idempotency keys protect requests. Guarded transitions protect state. The outbox protects events. None of them covers the others.
2. Write the test for the duplicate before the test for the success. Mine are named after the failure: `concurrent_same_key_handler_runs_exactly_once`, `payment_event_credits_once_despite_replayed_delivery`, `reconcile_never_applies_to_an_already_voided_sale`.
3. Assume the client will hang up. Anything that must finish cannot live in the request future.
4. Check where your locks actually end.
