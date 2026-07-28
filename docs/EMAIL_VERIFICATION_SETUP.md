# Email Verification Setup Guide

## Overview

Students and recruiters must verify their email addresses before login. A 6-digit OTP code is sent to their email during registration.

## Quick Setup

### 1. Configure SMTP Settings

Edit `.env` (or `.env.local` for Docker) and add:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="NIT Arunachal T&P <your-email@gmail.com>"
```

### 2. Gmail Setup (Recommended for Testing)

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not already)
3. Security → App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Use it as `SMTP_PASSWORD` in `.env`

### 3. Restart Server

```bash
# Local development
npm run dev

# Docker
docker-compose restart
```

---

## How It Works

### Registration Flow

1. **Student/Recruiter registers** → 6-digit OTP sent to email
2. **User goes to login page** → verification form appears
3. **Enter email + OTP** → email verified
4. **Login normally** → access granted

### Admin Users

Admins do **not** require email verification and can login immediately.

---

## Testing Without Real Emails

If you don't configure SMTP, verification codes are logged to the console:

```
📧 Email sent to student@nitap.ac.in
Subject: Verify Your Email Address
```

Check terminal output for the 6-digit code.

---

## Troubleshooting

### Emails Not Sending

**Check:**

- SMTP credentials are correct
- `SMTP_USER` and `SMTP_PASSWORD` are set
- Gmail: App Password is enabled (not regular password)
- Port 587 is not blocked by firewall

### Verification Code Expired

Codes expire after 24 hours. Click "Resend Code" on login page.

### Already Verified Error

Email is already verified. Just login normally.

---

## SMTP Providers

### Gmail

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

### Outlook/Hotmail

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

### SendGrid

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
```

### Mailgun

```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_SECURE="false"
```

---

## Production Deployment

For production:

1. Use a dedicated email service (SendGrid, Mailgun, AWS SES)
2. Set `SMTP_SECURE="true"` and `SMTP_PORT="465"` if using SSL
3. Use a custom domain for `EMAIL_FROM`
4. Set `NEXT_PUBLIC_APP_URL` to production URL

---

## Security Notes

- OTP codes are 6 digits (100,000 - 999,999)
- Codes expire after 24 hours
- Codes are hashed before storage
- Admin accounts bypass verification
- SMTP credentials should never be committed to git
