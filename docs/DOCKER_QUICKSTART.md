# 🚀 Docker Quick Start (5 Minutes)

**For: Testers who just want to run the application**

---

## 1️⃣ Install Docker Desktop

Download from: https://www.docker.com/products/docker-desktop

Choose your OS:

- 🪟 **Windows 10/11** → Docker Desktop for Windows
- 🍎 **macOS** → Docker Desktop for Mac
- 🐧 **Linux** → Docker Engine + Docker Compose

After install, **launch Docker Desktop app** and wait for it to start (check system tray).

---

## 2️⃣ Copy Environment File

```bash
# Windows (PowerShell)
copy .env.docker .env.local

# Mac/Linux
cp .env.docker .env.local
```

**📧 Email Configuration (Optional for Testing):**

If you want to test email verification, edit `.env.local` and add SMTP settings:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="NIT Arunachal T&P <your-email@gmail.com>"
```

For Gmail, enable "App Passwords" in Google Account settings. Otherwise, check console logs for verification codes during testing.

---

## 3️⃣ Start Application

### Option A: One-Click Script

**Windows:**

```bash
docker-setup.bat
```

**Mac/Linux:**

```bash
bash docker-setup.sh
```

### Option B: Command Line

```bash
docker-compose up --build
```

**Wait for:**

```
✅ ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 4️⃣ Open Application

Visit: **http://localhost:3000**

### Test Login

```
Email: student@nitap.ac.in
Password: student@123
```

✅ **Done!** Application is running!

---

## 🛑 Stop Application

Press **Ctrl + C** in terminal

Or run:

```bash
docker-compose down
```

---

## 🔄 Update to Latest Version (When Developer Makes Changes)

**⚡ Quick Update:**

```bash
git pull origin main && docker-compose down && docker-compose build --no-cache && docker-compose up -d
```

**📖 Full update guide with troubleshooting:** See [UPDATE_GUIDE.md](./UPDATE_GUIDE.md)

---

## 📋 Test Accounts

| Role      | Email                 | Password      |
| --------- | --------------------- | ------------- |
| Student   | student@nitap.ac.in   | student@123   |
| Recruiter | recruiter@nitap.ac.in | recruiter@123 |
| Admin     | admin@nitap.ac.in     | admin@123     |

---

## ❓ Something Wrong?

1. **Docker not starting?**
   - Restart Docker Desktop app
   - Restart computer if needed

2. **Port 3000 in use?**
   - Stop other applications on port 3000
   - Or edit docker-compose.yml: change `3000:3000` to `3001:3000`
   - Then visit http://localhost:3001

3. **Database not connecting?**
   - Wait 30 seconds (database takes time to start)
   - Run: `docker-compose logs` to check errors
   - Reset: `docker-compose down -v && docker-compose up --build`

---

## 📚 Need More Help?

- **Full Guide:** [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- **Verification:** [DOCKER_VERIFICATION.md](./DOCKER_VERIFICATION.md)
- **Testing Guide:** [docs/TESTING/TESTING_GUIDE.md](./docs/TESTING/TESTING_GUIDE.md)

---

**That's it! Happy testing! 🎉**
