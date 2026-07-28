# TNP Portal — NIT Arunachal Pradesh

Training & Placement Cell portal for NIT Arunachal Pradesh. Manages the end-to-end placement workflow for students, recruiters, and the T&P administration.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS 4
- **Auth:** JWT-based session management
- **Email:** Nodemailer (SMTP)
- **Charts:** Recharts
- **Deployment:** Docker + Nginx

## Features

- Student registration, profile management, and resume upload
- Job listings with eligibility-based filtering
- Application tracking with status updates
- Recruiter portal for posting jobs and managing interview rounds
- Admin dashboard with analytics, audit logs, and export tools
- Email notifications and announcements
- Placement statistics and department-wise reports

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy env and fill in values
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Seed test data
npx prisma db seed

# Start dev server
npm run dev
```

The app runs at `http://localhost:3000`.

### Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nitap.ac.in | admin@123 |
| Student | student@nitap.ac.in | student@123 |
| Recruiter | recruiter@nitap.ac.in | recruiter@123 |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Docker Deployment

```bash
# Copy and configure environment
cp .env.example .env.production

# Build and start
docker compose --env-file .env.production up -d --build

# Run migrations
docker compose exec app npx prisma migrate deploy

# Seed admin user
docker compose exec app npx prisma db seed
```

For production with Nginx reverse proxy:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

## Project Structure

```
app/           → Pages and route handlers
  admin/       → Admin dashboard, jobs, recruiters, settings
  recruiter/   → Recruiter portal, job management, rounds
  student/     → Student dashboard, applications, profile
actions/       → Server actions (business logic)
components/    → Reusable UI components
lib/           → Utilities (auth, email, prisma, security)
prisma/        → Schema, migrations, seed
nginx/         → Reverse proxy configuration
scripts/       → Deployment and backup scripts
tests/         → Test suite
docs/          → Documentation
```

## License

Internal use — NIT Arunachal Pradesh Training & Placement Cell.
