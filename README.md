# NIT Arunachal Pradesh - Training & Placement Portal

Placement management system for students, recruiters, and administrators.

## Tech Stack

- Next.js 16, React 19, TypeScript
- PostgreSQL + Prisma ORM
- Tailwind CSS 4
- Docker (production deployment)

## Production Deployment (Linux Server)

### Prerequisites

- Git installed on server
- Root or sudo access

### Step 1: Install Docker

The official install script works on Ubuntu, Debian, CentOS, Fedora, RHEL, etc:

```bash
# Install Docker Engine + Compose plugin (works on any distro)
curl -fsSL https://get.docker.com | sudo sh

# Add your user to docker group (so you don't need sudo every time)
sudo usermod -aG docker $USER

# Apply group change (or logout and login again)
newgrp docker

# Verify it works
docker --version
docker compose version
```

### Step 2: Deploy

```bash
# 1. Clone the repo
git clone <repo-url> /opt/tnp-portal
cd /opt/tnp-portal

# 2. Configure environment
cp .env.production .env.production.local
nano .env.production

# Generate secrets:
openssl rand -hex 64  # Use for JWT_SECRET
openssl rand -hex 64  # Use for NEXTAUTH_SECRET

# 3. Deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

The portal will be running at port 80 (via nginx) or port 3000 (direct).

### Without nginx (simpler setup)

```bash
# Start containers
docker compose --env-file .env.production up -d --build

# Run migrations (first time only)
docker compose exec app npx prisma migrate deploy

# Seed initial admin account (first time only)
docker compose exec app npx prisma db seed
```

> If `docker compose` doesn't work, try `docker-compose` (older standalone version).

### Useful Commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f app

# Restart
docker compose -f docker-compose.prod.yml restart

# Stop
docker compose -f docker-compose.prod.yml down

# Database backup
docker exec tnp-portal-db pg_dump -U tnp_admin tnp_portal > backup.sql

# Update deployment
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### SSL/HTTPS Setup

1. Place your SSL certificate files in `nginx/ssl/`:
   - `cert.pem` (certificate)
   - `key.pem` (private key)
2. Uncomment the HTTPS sections in `nginx/nginx.conf`
3. Restart: `docker compose -f docker-compose.prod.yml restart nginx`

## Local Development

```bash
npm install
# Set up .env.local with DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Test Credentials (seeded)

| Role      | Email                 | Password      |
| --------- | --------------------- | ------------- |
| Admin     | admin@nitap.ac.in     | admin@123     |
| Student   | student@nitap.ac.in   | student@123   |
| Recruiter | recruiter@nitap.ac.in | recruiter@123 |

## Project Structure

```
app/           → Next.js pages and routes
actions/       → Server actions
components/    → Shared UI components
lib/           → Utilities (auth, prisma, email, etc.)
prisma/        → Database schema and migrations
nginx/         → Reverse proxy config
scripts/       → Deployment and backup scripts
```
