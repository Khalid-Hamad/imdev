# im.dev

Personal website and portfolio — [im.dev](https://im.dev)

Built with Next.js 16, Drizzle ORM, PostgreSQL, and Cloudflare R2.

## Quick start (local)

```sh
docker compose up --build -d
open http://localhost:3000
```

This starts Postgres, runs migrations + seeds (about/CV, demo projects, demo tools), and launches the app. No extra config needed.

## Local development (without Docker)

```sh
cp .env.example .env
npm install
npm run db:push        # push schema to Postgres
npm run db:seed:all    # seed about + uses + projects + admin
npm run dev            # http://localhost:3000
```

## Production (VPS)

See [DEPLOY.md](./DEPLOY.md) for full Hostinger/Ubuntu deployment guide.

```sh
# First time:
bash scripts/setup.sh

# Subsequent deploys:
bash scripts/deploy.sh
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run db:push` | Push schema changes to DB |
| `npm run db:seed:all` | Run all seed scripts |
| `npm run db:seed:about:reset` | Truncate + re-seed about/CV |
| `npm run docker:up` | Build and start (local) |
| `npm run docker:prod` | Build and start (production) |

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: PostgreSQL 16 + Drizzle ORM
- **Auth**: better-auth (email/password)
- **i18n**: next-intl (English + Arabic)
- **Storage**: Cloudflare R2 (S3-compatible) / local fallback
- **Styling**: Tailwind CSS 4
- **Deployment**: Docker Compose, Nginx, Cloudflare
