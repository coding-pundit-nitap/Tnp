# 🔄 Update Guide for Testers (Docker)

**When the developer pushes new code, follow these steps to update your local Docker containers.**

---

## Quick Update (5 Steps)

### 1. Pull Latest Code

```bash
git pull origin main
```

### 2. Stop Running Containers

```bash
docker-compose down
```

### 3. Rebuild Without Cache

```bash
docker-compose build --no-cache
```

### 4. Start Updated Containers

```bash
docker-compose up -d
```

### 5. Clean Old Images (Optional)

```bash
docker image prune -f
```

✅ **Done!** Your containers are now running the latest version.

---

## One-Line Update

**Windows PowerShell:**

```powershell
git pull origin main; docker-compose down; docker-compose build --no-cache; docker-compose up -d
```

**Mac/Linux:**

```bash
git pull origin main && docker-compose down && docker-compose build --no-cache && docker-compose up -d
```

---

## What Each Command Does

| Command                           | What It Does                                        |
| --------------------------------- | --------------------------------------------------- |
| `git pull origin main`            | Downloads latest code from GitHub                   |
| `docker-compose down`             | Stops and removes old containers                    |
| `docker-compose build --no-cache` | Rebuilds Docker images from scratch (no old cache)  |
| `docker-compose up -d`            | Starts containers in background                     |
| `docker image prune -f`           | Removes unused old Docker images to save disk space |

---

## ⚠️ Important Notes

### Database Changes

If the developer made database schema changes (new tables, fields, etc.):

```bash
# After rebuilding, the seeded data will be fresh
# You'll need to re-register test accounts or use default accounts
```

### Environment Variables

If `.env.docker` was updated:

```bash
# Windows
copy .env.docker .env.local

# Mac/Linux
cp .env.docker .env.local

# Then rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Email Configuration

If you added SMTP settings to `.env.local`, they persist across updates (no need to re-add).

---

## Troubleshooting

### "Already running" Error

```bash
docker-compose down
docker-compose up -d
```

### "Port already in use"

```bash
# Find and kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### "Out of disk space"

```bash
# Clean all unused Docker resources
docker system prune -a
```

### Database Connection Error

```bash
# Restart just the database
docker-compose restart db

# Or restart everything
docker-compose restart
```

---

## Verify Update Worked

1. **Check running containers:**

   ```bash
   docker-compose ps
   ```

   Should show `app` and `db` as "Up"

2. **Check logs:**

   ```bash
   docker-compose logs app
   ```

   Should show "ready - started server on 0.0.0.0:3000"

3. **Visit app:**
   Open http://localhost:3000
4. **Check version/features:**
   New features (like email verification) should be visible

---

## When to Update

✅ **Always update when:**

- Developer announces new features
- Bug fixes are released
- Security patches are available
- Before starting a new test session

❌ **Don't update during:**

- Active testing session
- While filling out forms (data loss)
- When containers are still starting up

---

## Email Verification Feature (Latest Update)

After updating, test the new email verification:

1. Register new student: http://localhost:3000/student/register
2. Check terminal logs for 6-digit code (if SMTP not configured)
3. Go to login page - verification form appears
4. Enter email + code → verify
5. Login normally

---

## Need Help?

**Container not starting?**

```bash
docker-compose logs app
```

**Database issues?**

```bash
docker-compose logs db
```

**Full reset (nuclear option):**

```bash
docker-compose down -v
docker system prune -a
rm -rf node_modules
docker-compose up --build
```

---

**Built with ❤️ for NIT Arunachal Pradesh T&P Portal**
