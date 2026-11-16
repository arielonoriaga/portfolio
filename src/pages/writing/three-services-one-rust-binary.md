---
layout: ../../layouts/Article.astro
title: 'Three services, one Rust binary: a phased live migration'
description: 'Why I merged three separately deployed services into a single Rust API and worker, how each cutover was gated, and the two mistakes that taught me the most.'
date: '2026-11-16'
---

I run a small product ecosystem on one VPS. Until recently, three of its backend services were deployed separately: one for images, one for a product catalog with barcode lookup, one for recommendations. Each had its own containers, its own deploy, and its own idea of API keys, tiers and quotas.

I merged them into one Rust codebase that ships as two processes, an API and a worker. This is why, how each service was cut over while the others kept serving traffic, and what went wrong.

## Why merge at all

The usual advice is the opposite: split things up. Three facts pushed me the other way.

**The box was full.** The server has two cores and under 8 GB of RAM. Before the merge it had a few hundred megabytes free and was already using swap, with several PostgreSQL instances and two Redis instances running. Every extra container was paid for in memory I didn't have.

**Each service had reinvented entitlement.** Tiers, quotas and key authentication existed three times, slightly differently each time. I wanted one place that decides what a key may do.

**One service had a real defect that a rewrite of the edges would fix.** A catalog lookup fans out to many barcode providers. That fan-out was unbounded: sixty-plus concurrent outbound HTTP calls for a single lookup.

The first recommendation in the decision record was to keep catalog and recommendations separate. I overrode it. The operational cost of separate deploys on a box this small outweighed the isolation.

## The target

One Cargo package with two role-specific binaries, plus a small workspace of telemetry crates:

```toml
[[bin]]
name = "ez-addon-api"
path = "src/bin/api.rs"

[[bin]]
name = "ez-addon-worker"
path = "src/bin/worker.rs"
```

I chose two binaries over one binary with `serve` and `worker` subcommands. The container's command line then says exactly what it runs.

Inside, each former service is a module mounted under its own URL prefix with its own readiness probe. The modules keep their own database pools. I did not merge the databases: catalog and recommendations still talk to the PostgreSQL instances they had before. Merging code and merging data are separate risks, and I only took the first one.

The payoff of sharing a process is that network hops become function calls. Recommendations used to call the catalog over HTTP. Now it receives an adapter at startup:

```rust
let catalog_lookup: Arc<dyn recommendations::ez_catalog::CatalogLookup> =
    Arc::new(catalog::adapters::reco_lookup::CatalogLookupAdapter::new(
        catalog_state.pool.clone(),
    ));
let recommendations_state = recommendations::build_state(
    &recommendations_config, billing_state.clone(), Some(catalog_lookup),
).await?;
```

The recommendations module still depends on a trait, not on the catalog's internals. The boundary survived; the serialization, the timeout and the retry policy did not need to.

The worker runs each background loop as its own task: draining the recommendations outbox, the catalog classification sweep, and so on. If any loop fails, the whole process exits and the container restarts. That is a deliberate trade: one crashed loop restarts all of them, and in exchange there is no state where half the worker is silently dead.

## The cutover pattern

Every service followed the same four steps:

1. **Deploy alongside.** The new module goes live next to the old service. Nothing points at it yet.
2. **Verify directly.** Hit the new module on its own address and compare.
3. **Repoint callers.** Reverse-proxy routes, secrets, webhook endpoint rows, scheduled jobs.
4. **Retire only the old API and worker containers.** Every database container stays.

There were no feature flags and no DNS changes. The switch was the reverse proxy and each caller's configuration.

The order was chosen by risk, not by importance:

- **Images first.** It has no database, only object storage, so it was the cheapest way to prove the pattern. Retiring the old service freed about 370 MB of RAM.
- **Recommendations second,** ahead of the catalog, because it was the smaller port.
- **Catalog third.** The largest, with a public API domain.
- **Entitlement last,** once all three lived in one process and could share it.

For the two services with databases, the SQL migrations were carried over byte for byte and the existing test suites came with them. The ports changed where the code lives, not what it does. The one intended behaviour change in the catalog was bounding that fan-out with a concurrency limit.

There was no data migration, because the databases never moved. The entitlement phase was additive only: new tables, legacy tables untouched.

## Moving API keys without reissuing any

Unifying entitlement meant every existing key had to keep working, with its limits intact, without asking a single customer to rotate.

The old model was a tier ladder. The new one is scopes of the form `module:resource:action`, where a trailing `*` matches a prefix:

```rust
pub fn satisfies(&self, required: &str) -> bool {
    if self.0 == "*" { return true; }
    if self.0 == required { return true; }
    // "catalog:admin:*" can never match "catalog:administration:foo".
    match self.0.strip_suffix('*') {
        Some(prefix) if prefix.ends_with(':') => required.starts_with(prefix),
        _ => false,
    }
}
```

Plans carry a default scope set, a rate limit and a monthly quota. A key can be narrowed below its plan, never widened.

The old keys were not all hashed the same way: some with SHA-256, some with Argon2id. Keys are stored hashed, so I could not re-hash them. The new table records which algorithm each row uses and the verifier supports both:

```sql
CREATE TABLE billing_api_keys (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash    TEXT NOT NULL UNIQUE,
    key_prefix  TEXT NULL,  -- argon2id lookup narrows by prefix first
    hash_algo   TEXT NOT NULL CHECK (hash_algo IN ('sha256', 'argon2id')),
    plan_slug   TEXT NOT NULL REFERENCES billing_plans(slug),
    scopes      TEXT[] NOT NULL CHECK (cardinality(scopes) > 0),
    rpm_override INT NULL,
    revoked_at  TIMESTAMPTZ NULL
);
```

The hashes were copied across as they were. One service's keys moved in a SQL migration, the other's through an import command that is safe to run twice.

Then came the part I'd recommend to anyone doing this: a gate. A separate command compares every migrated key against its old limits and must exit zero before any traffic is switched. Its rule is short:

```rust
fn rpm_not_tighter(new_rpm: i32, old_rpm: i32) -> bool {
    if new_rpm == 0 { return true; }   // 0 = unlimited
    if old_rpm == 0 { return false; }
    new_rpm >= old_rpm
}
```

A migrated key may end up with more room than before. It may never end up with less.

## Two mistakes

**The environment I couldn't see.** Retiring the old images service briefly broke uploads in another product. That product still called the old hostname, and I had checked for callers by inspecting containers. Its configuration came from a secrets manager that injects environment variables at start, which `docker inspect` does not show. The rule I wrote down afterwards: before removing a hostname, read each caller's live process environment, not its container definition.

**A tenfold capacity cut, caught in review.** When mapping old plans to new ones, I mapped the recommendations service's "basic" keys onto the catalog's "basic" plan. Same name, very different limits: about a tenth of the requests per minute and an eighth of the monthly volume. It was caught before cutover. The fix was dedicated plans for those keys, and the "never tighter" gate above exists because of it. A check written after a near miss is worth more than one written from imagination.

## What I gave up

- **Per-endpoint usage detail.** Usage is now one pooled count per key.
- **Independent restarts.** One worker loop crashing restarts them all.
- **A clean slate.** Some legacy tables are still read by older code paths, so the old model is not fully gone.

I also have no before-and-after performance comparison to offer. The only baseline I recorded is a liveness check, which says the service answers and nothing about capacity. Measuring authenticated routes is still on the list.

## Would I do it again

On a box this size, yes. The merge removed containers, removed three copies of the same entitlement logic, and turned two network hops into function calls, while the module boundaries stayed in the code where the compiler can see them.

The parts worth copying are not Rust-specific: move one service at a time, keep the databases where they are, carry the migrations and tests over unchanged, and put a gate in front of any step that changes what a customer is allowed to do.
