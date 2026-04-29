# Deploy — Hostinger VPS (Ubuntu)

Fully containerized stack: Postgres + migrations/seeds + Next.js app. Nginx on the host as reverse proxy. Cloudflare in front for DNS/CDN/WAF. Cloudflare R2 for uploads.

## Architecture

```
Internet → Cloudflare (DNS + WAF + CDN) → Nginx (:80) → Next.js (:3100 on localhost)
                                                          ↕
                                                       Postgres (:5432 on localhost)
                                                          ↕
                                                    Cloudflare R2 (uploads)
```

## What lives where

| Component | Details |
|-----------|---------|
| **App container** | Next.js standalone (port 3000 inside container, bound to `127.0.0.1:3100` on host) |
| **Postgres container** | Data in named volume `pgdata` |
| **Migrate container** | Runs `drizzle-kit push` + seeds (about, uses, projects, admin) on every deploy |
| **Nginx** | Host-level reverse proxy (`nginx/default.conf`) |
| **Cloudflare R2** | S3-compatible object storage for uploads |
| **Cloudflare WAF** | Blocks admin/login from non-whitelisted IPs; redirects to `/blocked` |

## Single docker-compose.yml

One file for both local and production. Behavior is driven by environment variables:

```sh
# Local (defaults — no .env file needed)
docker compose up --build -d          # → http://localhost:3000

# Production
docker compose --env-file .env.production up --build -d
```

Key env vars that differ between local/prod:

| Variable | Local default | Production |
|----------|--------------|------------|
| `POSTGRES_PASSWORD` | `imdev` | strong random |
| `POSTGRES_PORT` | `5432` | `127.0.0.1:5432` |
| `APP_PORT` | `3000` | `127.0.0.1:3100` |
| `BETTER_AUTH_SECRET` | dev placeholder | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `http://localhost:3000` | `https://im.dev` |
| `ADMIN_EMAIL` | (empty) | your email |
| `ADMIN_PASSWORD` | (empty) | strong password |

## First-time setup on a new VPS

```sh
# As root on a fresh Ubuntu server:
bash scripts/setup.sh
```

This installs Docker, Nginx, clones the repo, generates `.env.production` with random secrets, and starts everything. After running, edit `.env.production` to set:

- `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- `S3_*` credentials (Cloudflare R2)

Then re-deploy: `bash scripts/deploy.sh`

## Subsequent deploys

```sh
bash scripts/deploy.sh
# or:
cd /opt/imdev && git pull && docker compose --env-file .env.production up --build -d
```

## Cloudflare R2 setup

1. R2 → Create bucket (e.g. `imdev-uploads`)
2. R2 → Manage API tokens → token with **Object Read & Write** for that bucket
3. Enable public R2.dev URL or attach custom domain (`cdn.im.dev`)

Add to `.env.production`:
```
S3_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=imdev-uploads
S3_ACCESS_KEY_ID=<key>
S3_SECRET_ACCESS_KEY=<secret>
S3_PUBLIC_URL=https://cdn.im.dev
```

## Cloudflare WAF configuration

Since the admin login is restricted to your home network:

1. **WAF Custom Rule**: Block requests to `/login`, `/admin/*`, `/api/admin/*` unless source IP matches your home IP
2. **Custom error page**: Set the WAF block action to redirect to `https://im.dev/en/blocked`
3. The `/blocked` page shows a friendly message and auto-redirects to home after 5 seconds

## Migrating from another VPS

### 1. Back up Postgres on the OLD VPS
```sh
cd /opt/imdev
docker compose stop app
docker compose exec -T postgres pg_dumpall -U imdev > pgdump.sql
```

### 2. Provision the NEW VPS
```sh
bash scripts/setup.sh
```

### 3. Restore the database
```sh
cd /opt/imdev
docker compose --env-file .env.production up -d postgres
# wait until healthy
docker compose exec -T postgres psql -U imdev -d postgres < pgdump.sql
```

### 4. Bring everything up
```sh
bash scripts/deploy.sh
```

### 5. DNS cutover
Lower TTL ahead of time, then point A record to new IP in Cloudflare.

## Common issues

- **`migrate` exits with code 2** — `sh: can't open script`. Run `git pull && docker compose build --no-cache`
- **Images 404 from R2** — check `S3_PUBLIC_URL` matches bucket's public URL
- **Admin can't log in** — verify `ADMIN_EMAIL`/`ADMIN_PASSWORD` are set in `.env.production`, then re-deploy to trigger `seed-admin`
- **WAF blocking you** — check your IP is whitelisted in Cloudflare WAF rules
