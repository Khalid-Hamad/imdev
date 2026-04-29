#!/bin/sh
# Runs inside the "migrate" container on every deploy.
# 1. Push schema changes  2. Seed data  3. Create admin account
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ">>> drizzle-kit push"
npx drizzle-kit push

echo ">>> seed about (idempotent)"
node ./node_modules/tsx/dist/cli.mjs scripts/seed-about.ts

echo ">>> seed uses (idempotent)"
node ./node_modules/tsx/dist/cli.mjs scripts/seed-uses.ts

echo ">>> seed projects (idempotent)"
node ./node_modules/tsx/dist/cli.mjs scripts/seed-projects.ts

echo ">>> seed admin account (idempotent)"
node ./node_modules/tsx/dist/cli.mjs scripts/seed-admin.ts

echo ">>> migrate + seed done"
