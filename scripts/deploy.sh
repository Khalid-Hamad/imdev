#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/imdev"
cd "${APP_DIR}"

echo "=== Deploying imdev ==="

echo ">>> Pulling latest code..."
git pull origin main

echo ">>> Building and restarting containers..."
docker compose --env-file .env.production up --build -d

echo ">>> Cleaning up old images..."
docker image prune -f

echo ""
echo "=== Deploy Complete ==="
docker compose --env-file .env.production ps
