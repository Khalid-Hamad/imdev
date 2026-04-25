#!/bin/sh
# Used by docker-compose "migrate" service. Keep non-interactive (no TTY).
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ">>> drizzle-kit push"
npx drizzle-kit push

echo ">>> seed about (idempotent)"
node ./node_modules/tsx/dist/cli.mjs scripts/seed-about.ts

echo ">>> migrate + seed done"
