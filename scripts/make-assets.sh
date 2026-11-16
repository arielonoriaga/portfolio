#!/usr/bin/env bash
# Regenerates the two binary assets from the built site: the CV PDF and the social preview image.
# Run after changing content or design:  bun run build && scripts/make-assets.sh && bun run build
# Needs a Chromium binary (CHROME=/path/to/chrome, default: Playwright's cached one).
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome 2>/dev/null | tail -1)}"
[ -x "$CHROME" ] || { echo "no Chromium found; set CHROME=" >&2; exit 1; }
PORT=4398
python3 -m http.server "$PORT" --directory dist >/dev/null 2>&1 &
SRV=$!; trap 'kill $SRV 2>/dev/null' EXIT
until curl -s -o /dev/null "http://127.0.0.1:$PORT/"; do sleep 0.3; done
"$CHROME" --headless --no-sandbox --no-pdf-header-footer --virtual-time-budget=4000 \
  --print-to-pdf=public/ariel-onoriaga-cv.pdf "http://127.0.0.1:$PORT/cv/" >/dev/null 2>&1
"$CHROME" --headless --no-sandbox --hide-scrollbars --virtual-time-budget=5000 --window-size=1200,630 \
  --screenshot=public/og.png "http://127.0.0.1:$PORT/" >/dev/null 2>&1
ls -la public/ariel-onoriaga-cv.pdf public/og.png
