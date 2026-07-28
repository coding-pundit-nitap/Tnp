#!/bin/bash
# ============================================
# TNP Portal - Production Deployment Script
# Run this on your Linux college server
# ============================================

set -e

echo "============================================"
echo "  TNP Portal - Production Deployment"
echo "============================================"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    echo ""
    echo "Install Docker using the official script:"
    echo "  curl -fsSL https://get.docker.com | sudo sh"
    echo "  sudo usermod -aG docker \$USER"
    echo "  newgrp docker"
    echo ""
    exit 1
fi

echo "[✓] Docker found: $(docker --version)"

# Check Docker Compose (v2 plugin or standalone)
COMPOSE_CMD=""
if docker compose version &> /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
else
    echo "ERROR: Docker Compose not found!"
    echo ""
    echo "If you installed Docker via get.docker.com, compose plugin should be included."
    echo "Otherwise install standalone:"
    echo "  sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose"
    echo "  sudo chmod +x /usr/local/bin/docker-compose"
    echo ""
    exit 1
fi

echo "[✓] Docker Compose found: $COMPOSE_CMD"
echo ""

# Check for .env.production
if [ ! -f ".env.production" ]; then
    echo "ERROR: .env.production not found!"
    echo ""
    echo "Create it from the template:"
    echo "  nano .env.production"
    echo ""
    echo "Fill in real values for DB_PASSWORD, JWT_SECRET, etc."
    exit 1
fi

# Validate secrets are not defaults (grep-based, no source)
if grep -q "CHANGE_THIS" .env.production; then
    echo "ERROR: You must change the default secrets in .env.production!"
    echo ""
    echo "Generate secrets with:"
    echo "  openssl rand -hex 64"
    exit 1
fi

echo "[✓] Environment file validated"
echo ""

# Create SSL directory if it doesn't exist
mkdir -p nginx/ssl

# Build and start containers
echo "Building and starting containers..."
echo "(First run takes 3-5 minutes to build)"
echo ""

$COMPOSE_CMD -f docker-compose.prod.yml --env-file .env.production up -d --build

echo ""
echo "Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "Running database migrations..."
$COMPOSE_CMD -f docker-compose.prod.yml exec app npx prisma migrate deploy

echo ""
echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo ""
echo "Portal running at: ${NEXTAUTH_URL:-http://localhost}"
echo ""
echo "Useful commands:"
echo "  View logs:     $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
echo "  Stop:          $COMPOSE_CMD -f docker-compose.prod.yml down"
echo "  Restart:       $COMPOSE_CMD -f docker-compose.prod.yml restart"
echo "  DB backup:     docker exec tnp-portal-db pg_dump -U ${DB_USER} ${DB_NAME} > backup.sql"
echo ""
