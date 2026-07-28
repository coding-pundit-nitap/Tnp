# Docker App Setup Guide

## Prerequisites

Make sure Docker Desktop is running in the background with the engine running.

## Step 1: Setup Project Folder

1. Create a folder named `tester`
2. Open that folder in VS Code
3. Open a new terminal

## Step 2: Clone the Repository

In the terminal, paste the git clone URL:

```bash
git clone https://github.com/Charancherry-code/TNP-MAIN-PRODUCTION.git
```

Then navigate to the project directory:

```bash
cd .\TNP-MAIN-PRODUCTION\
```

## Step 3: Replace docker-compose.yml

Find `docker-compose.yml` and replace its code with the below:

```yaml
services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: tnp-portal-db
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-tnp_portal}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${DB_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - tnp-network
    restart: unless-stopped

  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: tnp-portal-app
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@postgres:5432/${DB_NAME:-tnp_portal}
      JWT_SECRET: ${JWT_SECRET:-your-secret-jwt-key-change-in-production}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:-your-secret-key-change-in-production}
      NEXTAUTH_URL: http://localhost:3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./.env.local:/app/.env.local:ro
    networks:
      - tnp-network
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--no-verbose",
          "--tries=1",
          "--spider",
          "http://localhost:3000",
        ]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 5s

volumes:
  postgres_data:
    driver: local

networks:
  tnp-network:
    driver: bridge
```

## Step 4: Replace Dockerfile

Find `Dockerfile` and replace it with:

```dockerfile
# Build stage
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Reduce npm network overhead in CI builds
ENV npm_config_audit=false \
  npm_config_fund=false \
  npm_config_fetch_retries=3 \
  npm_config_fetch_retry_maxtimeout=120000

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --no-audit --no-fund

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Production stage
FROM node:20-bullseye-slim

WORKDIR /app

# Reduce npm network overhead in CI builds
ENV npm_config_audit=false \
  npm_config_fund=false \
  npm_config_fetch_retries=3 \
  npm_config_fetch_retry_maxtimeout=120000

# Install dumb-init, wget, and OpenSSL for Prisma
RUN apt-get update \
  && apt-get install -y --no-install-recommends dumb-init wget openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --omit=dev --no-audit --no-fund

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Create non-root user for security
RUN groupadd -g 1001 nodejs \
  && useradd -u 1001 -g nodejs -m -s /usr/sbin/nologin nextjs

# Create cache directories and set permissions
RUN mkdir -p /app/.next/cache/images \
  && chown -R nextjs:nodejs /app/.next \
  && chmod -R 755 /app/.next

USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["npm", "start"]
```

## Step 5: Create docker-start.bat

Create a new file named `docker-start.bat` and paste the below content:

```batch
@echo off
setlocal EnableExtensions EnableDelayedExpansion
REM Quick start script for T&P Portal

echo.
echo ============================================
echo  T^&P Portal - Quick Start
echo ============================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker daemon is not running
    echo.
    echo Please start Docker Desktop and try again
    echo.
    pause
    exit /b 1
)

REM Detect Docker Compose command
set "COMPOSE_CMD="
docker compose version >nul 2>&1
if not errorlevel 1 set "COMPOSE_CMD=docker compose"

if not defined COMPOSE_CMD (
    docker-compose --version >nul 2>&1
    if not errorlevel 1 set "COMPOSE_CMD=docker-compose"
)

if not defined COMPOSE_CMD (
    echo ERROR: Docker Compose is not available
    pause
    exit /b 1
)

REM Start containers
echo Starting containers...
call %COMPOSE_CMD% up -d

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start containers
    echo.
    echo Try running docker-setup.bat for complete setup
    echo.
    pause
    exit /b 1
)

echo.
echo Waiting for application to start...
timeout /t 5 /nobreak >nul

REM Check container status
docker ps --filter "name=tnp-portal" --format "table {{.Names}}\t{{.Status}}"
echo.

echo ============================================
echo  Application Started!
echo ============================================
echo.
echo Access at: http://localhost:3000
echo.
echo Admin Login:
echo   Email:    admin@nitap.ac.in
echo   Password: admin@123
echo.
echo Commands:
echo   View logs:  docker logs tnp-portal-app -f
echo   Stop:       docker compose down
echo   Restart:    docker compose restart app
echo.
echo ============================================
echo.

REM Open browser
start "" "http://localhost:3000"

```

## Step 6: Create admin-seed.bat

Create a new file named `admin-seed.bat` and paste the below content:

```batch

@echo off
setlocal EnableExtensions EnableDelayedExpansion
REM Seed admin user credentials

echo.
echo Creating admin user...
echo.

REM Ensure Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker daemon is not running
    pause
    exit /b 1
)

REM Create admin user SQL
echo INSERT INTO "User" (id, name, email, password, role, status, "createdAt", "updatedAt") > .temp-admin.sql
echo VALUES (gen_random_uuid(), 'Administrator', 'admin@nitap.ac.in', '$2b$10$FVqKyQwJVge/cFioXWoVNuP3Pm7K6jqgCkDEwXcQJS3RoQwjXh63.', 'ADMIN', 'ACTIVE', NOW(), NOW()) >> .temp-admin.sql
echo ON CONFLICT (email) DO UPDATE SET password = '$2b$10$FVqKyQwJVge/cFioXWoVNuP3Pm7K6jqgCkDEwXcQJS3RoQwjXh63.', status = 'ACTIVE', "updatedAt" = NOW(); >> .temp-admin.sql

if not exist .temp-admin.sql (
    echo ERROR: Failed to create SQL file
    pause
    exit /b 1
)

docker cp .temp-admin.sql tnp-portal-db:/tmp/create-admin.sql
if errorlevel 1 (
    echo ERROR: Failed to copy SQL file to container
    if exist .temp-admin.sql del .temp-admin.sql
    pause
    exit /b 1
)

docker exec tnp-portal-db psql -U postgres -d tnp_portal -f /tmp/create-admin.sql
if errorlevel 1 (
    echo ERROR: Failed to execute SQL
    if exist .temp-admin.sql del .temp-admin.sql
    pause
    exit /b 1
)

if exist .temp-admin.sql del .temp-admin.sql

REM Verify admin user was created
echo.
echo Verifying admin user...
for /f "tokens=*" %%A in ('docker exec tnp-portal-db psql -U postgres -d tnp_portal -t -c "SELECT email FROM \"User\" WHERE email='admin@nitap.ac.in';"') do set "ADMIN_EMAIL=%%A"

if "!ADMIN_EMAIL!"=="admin@nitap.ac.in" (
    echo.
    echo ============================================
    echo Admin user created successfully!
    echo ============================================
    echo.
    echo Email:    admin@nitap.ac.in
    echo Password: admin@123
    echo.
) else (
    echo ERROR: Admin user not found in database
```

## Step 7: Run Initial Setup

Run the following command to run the whole application in a Docker container:

```bash
.\docker-setup.bat
```

The application will open and run on port 3000. Come back to VS Code terminal and press `Ctrl + C`.

## Step 8: Run Docker Start

Run the below command:

```bash
.\docker-start.bat
```

The application will open again. Come back to VS Code terminal and press `Ctrl + C`.

## Step 9: Deploy Prisma Migrations

Run this command:

```bash
docker exec tnp-portal-app npx prisma migrate deploy
```

## Step 10: Restart Application

Run again:

```bash
.\docker-setup.bat
```

The application will start. Come back to VS Code and press `Ctrl + C`.

## Step 11: Seed Admin User

Run this final seed command:

```bash
.\admin-seed.bat
```

## Step 12: Start Application

Start using this command:

```bash
.\docker-setup.bat
```

then start use this command

.\docker-setup.bat


then application will run and you can start testing test cases can be found in docs -testing TESTING_GUIDE.md

use below commands to start or stop the application 

docker compose up //to start docker application 
docker compose down //to stop docker application 

