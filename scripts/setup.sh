#!/usr/bin/env bash
set -euo pipefail

echo "=== imdev Server Setup ==="
echo "Run this script on a fresh Ubuntu 24.04 Droplet as root."
echo ""

# ── 1. System updates ───────────────────────────
echo ">>> Updating system packages..."
apt-get update && apt-get upgrade -y

# ── 2. Install Docker ───────────────────────────
echo ">>> Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "Docker installed."
else
    echo "Docker already installed."
fi

# ── 3. Install Nginx ────────────────────────────
echo ">>> Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx

# ── 4. Configure UFW Firewall ────────────────────
echo ">>> Configuring UFW firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
echo "Firewall configured: SSH + HTTP + HTTPS allowed."

# ── 5. Create app directory ──────────────────────
APP_DIR="/opt/imdev"
echo ">>> Setting up app directory at ${APP_DIR}..."
mkdir -p "${APP_DIR}"

# ── 6. Clone the repo ───────────────────────────
REPO_URL="${1:-git@github.com:Khalid-Hamad/imdev.git}"
if [ ! -d "${APP_DIR}/.git" ]; then
    echo ">>> Cloning repo..."
    git clone "${REPO_URL}" "${APP_DIR}"
else
    echo ">>> Repo already cloned, pulling latest..."
    cd "${APP_DIR}" && git pull
fi

# ── 7. Copy Nginx config ────────────────────────
echo ">>> Configuring Nginx reverse proxy..."
cp "${APP_DIR}/nginx/default.conf" /etc/nginx/sites-available/imdev
ln -sf /etc/nginx/sites-available/imdev /etc/nginx/sites-enabled/imdev
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "Nginx configured."

# ── 8. Create .env.production if missing ─────────
ENV_FILE="${APP_DIR}/.env.production"
if [ ! -f "${ENV_FILE}" ]; then
    echo ">>> Creating .env.production from template..."
    AUTH_SECRET=$(openssl rand -base64 32)
    PG_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)

    cat > "${ENV_FILE}" <<ENVEOF
POSTGRES_USER=imdev
POSTGRES_PASSWORD=${PG_PASS}
POSTGRES_DB=imdev

BETTER_AUTH_SECRET=${AUTH_SECRET}
BETTER_AUTH_URL=https://im.dev
NEXT_PUBLIC_APP_URL=https://im.dev
BLOB_READ_WRITE_TOKEN=
ENVEOF

    chmod 600 "${ENV_FILE}"
    echo "Created ${ENV_FILE} with generated secrets."
    echo ""
    echo "!!! IMPORTANT: Review and note your secrets:"
    echo "    ${ENV_FILE}"
    echo ""
else
    echo ".env.production already exists, skipping."
fi

# ── 9. Build and start ──────────────────────────
echo ">>> Building and starting the application..."
cd "${APP_DIR}"
docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up --build -d

echo ""
echo "=== Setup Complete ==="
echo "App is running at http://$(hostname -I | awk '{print $1}'):3100 (internal, proxied by Nginx)"
echo ""
echo "Next steps:"
echo "  1. Point your domain (im.dev) A record to this server's IP in Cloudflare"
echo "  2. Set Cloudflare SSL mode to 'Full'"
echo "  3. Visit https://im.dev to verify"
echo "  4. Visit https://im.dev/en/login to create your admin account"
