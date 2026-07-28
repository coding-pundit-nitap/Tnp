# Deployment Context & History

This document captures the full context of the TNP Portal deployment so any future developer or AI agent understands the current state, decisions made, and how to manage the server.

---

## Project Overview

- **What:** Training & Placement Cell website for NIT Arunachal Pradesh
- **Stack:** Next.js 16, React 19, TypeScript, PostgreSQL, Prisma ORM, Tailwind CSS 4
- **Deployment:** Docker on a Linux server inside the college network
- **Repo:** https://github.com/Charancherry-code/TNP-MAIN-PRODUCTION.git

---

## Server Details

| Item | Value |
|------|-------|
| Public IP (college NAT) | `14.139.214.164` |
| Server Internal IP | `172.16.17.73` |
| OS | Linux (Debian/Ubuntu-based) |
| User | `tnp` |
| Home directory | `/home/tnp` (had to be created manually with `sudo mkdir -p /home/tnp`) |
| Project location | `/opt/tnp-portal` |
| Docker version | 29.5.3 |
| Docker Compose | v2 plugin (`docker compose`) |

### Network Situation

- The server is behind the college NAT/firewall.
- **Internal access works:** `http://172.16.17.73:3000` — accessible from college WiFi.
- **External access does NOT work** unless college IT forwards port 80/3000 from `14.139.214.164` to `172.16.17.73`.
- Domain `tnp.nitap.ac.in` is NOT yet configured in DNS — needs college IT to add an A record pointing to `14.139.214.164`.

---

## How Docker Was Installed

The server did NOT have `curl`, `docker`, or proper package repos set up.

```bash
# curl wasn't available, used wget instead
wget -qO- https://get.docker.com | sudo sh

# Added user to docker group
sudo usermod -aG docker tnp
newgrp docker

# Home directory didn't exist, had to create it
sudo mkdir -p /home/tnp
sudo chown tnp:tnp /home/tnp
```

---

## How the App Was Deployed

```bash
# Clone (required GitHub PAT token for private repo)
sudo mkdir -p /opt/tnp-portal
sudo chown tnp:tnp /opt/tnp-portal
git clone https://Charancherry-code:<TOKEN>@github.com/Charancherry-code/TNP-MAIN-PRODUCTION.git /opt/tnp-portal

# Configure environment
cd /opt/tnp-portal
nano .env.production
# Filled in DB_PASSWORD, JWT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL

# Build and start
sudo docker compose --env-file .env.production up -d --build
```

---

## Database Setup

The app container uses Next.js standalone output, which does NOT include `npx` or full `node_modules`. So Prisma commands must be run from a separate temporary container.

### Push Schema (Create Tables)

```bash
sudo docker run --rm --network tnp-portal_tnp-network \
  -e DATABASE_URL="postgresql://tnp_admin:<URL_ENCODED_PASSWORD>@tnp-portal-db:5432/tnp_portal" \
  -v /opt/tnp-portal/prisma:/app/prisma \
  -w /app \
  node:20-alpine sh -c "apk add --no-cache openssl && npm install prisma@5 @prisma/client@5 && npx prisma db push --schema=/app/prisma/schema.prisma"
```

### Important Notes on Prisma Version

- Project uses **Prisma v5** (`prisma@5`, `@prisma/client@5`).
- If you run `npm install prisma` without a version, it installs v7 which has BREAKING CHANGES (removed `url` from datasource schema).
- **Always pin to v5:** `npm install prisma@5 @prisma/client@5`
- Alpine containers need `apk add --no-cache openssl` for Prisma to work.

### Seeding Admin User

The seed script (`prisma/seed.ts`) requires `ts-node` and full dev dependencies, which are NOT in the production container. Admin was seeded via raw SQL:

```bash
sudo docker exec -it tnp-portal-db psql -U tnp_admin -d tnp_portal -c "
CREATE EXTENSION IF NOT EXISTS pgcrypto;
INSERT INTO \"User\" (id, name, email, password, role, status, \"emailVerified\", \"createdAt\", \"updatedAt\")
VALUES (gen_random_uuid(), 'Administrator', 'admin@nitap.ac.in', crypt('admin@123', gen_salt('bf', 10)), 'ADMIN', 'ACTIVE', true, NOW(), NOW());
"
```

- Password: `admin@123`
- The `pgcrypto` extension generates bcrypt hashes compatible with the app's `bcryptjs` verification.

---

## Environment File (.env.production)

Located at `/opt/tnp-portal/.env.production`. Contains:

```
DB_USER=tnp_admin
DB_PASSWORD=<actual password with special chars>
DB_NAME=tnp_portal
JWT_SECRET=<64-byte hex>
NEXTAUTH_SECRET=<64-byte hex>
NEXTAUTH_URL=http://tnp.nitap.ac.in
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=placement@nitap.ac.in
SMTP_PASSWORD=<app password>
EMAIL_FROM=placement@nitap.ac.in
```

### Password URL Encoding Issue

The DB password contains `@` and `#` characters. When used in DATABASE_URL:
- `@` → `%40`
- `#` → `%23`

Docker Compose handles this automatically via env var interpolation, but when running manual `docker run` commands with `-e DATABASE_URL=...`, you must URL-encode the password.

---

## How to Update the Server After Code Changes

```bash
# On Windows (after making changes)
git add .
git commit -m "description"
git push

# On the Linux server
cd /opt/tnp-portal
git pull
sudo docker compose --env-file .env.production up -d --build
```

If the database schema (`prisma/schema.prisma`) changed:

```bash
sudo docker run --rm --network tnp-portal_tnp-network \
  -e DATABASE_URL="postgresql://tnp_admin:<URL_ENCODED_PASSWORD>@tnp-portal-db:5432/tnp_portal" \
  -v /opt/tnp-portal/prisma:/app/prisma \
  -w /app \
  node:20-alpine sh -c "apk add --no-cache openssl && npm install prisma@5 @prisma/client@5 && npx prisma db push --schema=/app/prisma/schema.prisma"
```

---

## Docker Architecture

```
┌─────────────────────────────────────────┐
│  docker compose (tnp-portal_tnp-network)│
│                                         │
│  ┌──────────────┐   ┌────────────────┐  │
│  │ tnp-portal-db│   │ tnp-portal-app │  │
│  │ PostgreSQL 16│◄──│ Next.js        │  │
│  │ Alpine       │   │ Standalone     │  │
│  │ Port: 5432   │   │ Port: 3000     │  │
│  └──────────────┘   └────────────────┘  │
│         ▲                    ▲           │
│         │                    │           │
│    postgres_data        exposed:3000     │
│    (persistent)                          │
└─────────────────────────────────────────┘
```

- **Dockerfile** uses multi-stage build: builder (node:20-alpine) → runner (node:20-alpine standalone)
- `next.config.ts` has `output: "standalone"` for lean production images
- The standalone server runs with `node server.js` (no `npm start` or `npx`)
- Prisma client is copied into the image at build time

---

## Cleanup Done (from initial setup)

### Files Removed
- `setup.bat`, `setup.sh` — local dev scripts
- `docker-setup.bat`, `docker-setup.sh` — convenience scripts
- `issues-solved.md` — dev changelog
- `public/file.svg`, `globe.svg`, `window.svg`, `next.svg`, `vercel.svg` — unused template assets
- `.idea/` — removed from git tracking

### Critical Fix: Middleware
- **Renamed `proxy.ts` → `middleware.ts`** (Next.js requires this exact filename)
- **Renamed function `proxy()` → `middleware()`** (Next.js requires this exact export name)
- **Added `export const runtime = "nodejs"`** because `jsonwebtoken` doesn't work in Edge runtime
- **Without this fix, route protection was completely broken** — no auth checking was happening

### Config Changes
- `next.config.ts` — added `output: "standalone"` for Docker optimization
- `.gitignore` — added `.idea/`, SSL certs, backups
- `.dockerignore` — proper exclusions for lean builds
- `.env.production` — removed `<>` from EMAIL_FROM (broke shell parsing)

---

## Design Redesign (Latest)

The landing page was redesigned from a dark theme to a professional light theme matching the NIT AP official website (nitap.ac.in) style:

- **Primary color:** Navy blue `#1a237e`
- **Theme:** Light (white/gray backgrounds)
- **Style:** Clean, institutional, professional
- **Components redesigned:** Navbar, Hero, PlacementOverview, OverallStats, DepartmentPlacements, PlacedStudents, TnpTeam, Footer
- **Login page:** Gradient updated to navy theme

---

## Pending / TODO

1. **Domain setup** — Need college IT to add DNS A record: `tnp.nitap.ac.in → 14.139.214.164`
2. **Port forwarding** — Need IT to forward port 80 from public IP to `172.16.17.73:3000`
3. **SSL/HTTPS** — Once domain works, set up Let's Encrypt or get cert from college IT
4. **Port 80 redirect** — `sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000`
5. **Email setup** — SMTP credentials needed for verification emails to work
6. **Student/Recruiter seeding** — Only admin is seeded; students and recruiters register themselves
7. **Team photos** — `/public/team/` images referenced but may not exist (will show broken images)
8. **Backup cron** — `scripts/backup-db.sh` exists but cron not configured yet
9. **nginx** — `docker-compose.prod.yml` includes nginx service but hasn't been used yet (running simple compose)

---

## Useful Commands (on server)

```bash
# Check running containers
sudo docker ps

# View app logs
sudo docker compose --env-file .env.production logs -f app

# View DB logs
sudo docker compose --env-file .env.production logs -f postgres

# Restart everything
sudo docker compose --env-file .env.production restart

# Stop everything
sudo docker compose --env-file .env.production down

# Full rebuild
sudo docker compose --env-file .env.production up -d --build

# Database backup
sudo docker exec tnp-portal-db pg_dump -U tnp_admin tnp_portal > backup_$(date +%Y%m%d).sql

# Connect to database
sudo docker exec -it tnp-portal-db psql -U tnp_admin -d tnp_portal

# Check disk usage
sudo docker system df
```

---

## Known Issues / Gotchas

1. **`sudo` required** — The `tnp` user needs `sudo` for all docker commands because of home directory permissions issue
2. **Password special chars** — DB password has `@` and `#` which must be URL-encoded in DATABASE_URL strings
3. **No `npx` in production container** — Standalone build strips node_modules; use temp containers for prisma commands
4. **Prisma v7 breaks everything** — Always use `prisma@5` and `@prisma/client@5`
5. **Git clone needs PAT** — Repo is private; GitHub doesn't allow password auth
6. **`curl` not installed** — Server didn't have curl; used `wget` for Docker install
7. **Home directory missing** — `/home/tnp` didn't exist on initial SSH; had to create manually
