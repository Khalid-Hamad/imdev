#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/imdev"
SSH_REMOTE="git@github.com:Khalid-Hamad/imdev.git"
cd "${APP_DIR}"

echo "=== Deploying imdev ==="

# Force SSH origin: avoids HTTPS prompts and lets deploy keys do the auth.
CURRENT_REMOTE="$(git remote get-url origin 2>/dev/null || echo "")"
if [[ "${CURRENT_REMOTE}" == https://* ]]; then
    echo ">>> Switching origin from HTTPS to SSH..."
    git remote set-url origin "${SSH_REMOTE}"
fi

echo ">>> Pulling latest code..."
git pull origin main

echo ">>> Building and restarting containers..."
docker compose --env-file .env.production up --build -d

echo ">>> Cleaning up old images..."
docker image prune -f

echo ""
echo "=== Deploy Complete ==="
docker compose --env-file .env.production ps
