# ──────────────────────────────────────────────
# Stage 1 — Install dependencies
# ──────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ──────────────────────────────────────────────
# Stage 2 — Build the application
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN test -f scripts/migrate-and-seed.sh && \
    test -f scripts/seed-about.ts && test -f data/seed/about.json && \
    test -f scripts/seed-uses.ts  && test -f data/seed/uses.json && \
    test -f scripts/seed-projects.ts && test -f data/seed/projects.json && \
    test -f scripts/seed-settings.ts && test -f data/seed/settings.json && \
    test -f scripts/seed-admin.ts

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build args for build-time env vars (DB not needed at build time for dynamic pages)
ARG DATABASE_URL=""
ARG BETTER_AUTH_SECRET="build-placeholder"
ARG BETTER_AUTH_URL="http://localhost:3000"

RUN npm run build

# ──────────────────────────────────────────────
# Stage 3 — Production runner (minimal image)
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what's needed for standalone mode
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Drizzle migrations (so we can run them at startup)
COPY --from=builder /app/src/db ./src/db
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/node_modules/drizzle-kit ./node_modules/drizzle-kit
COPY --from=builder /app/node_modules/drizzle-orm ./node_modules/drizzle-orm

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
