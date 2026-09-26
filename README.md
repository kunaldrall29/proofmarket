# MED-Health Locker

Personal health records + AI analysis — production Next.js app for Vercel.

## Stack

- Next.js App Router (TypeScript) + Tailwind design system
- PostgreSQL via Prisma
- Auth.js (NextAuth v5) with `USER` / `ADMIN` roles
- **xAI Grok** for report analysis (server-side only via `XAI_API_KEY`)
- Vercel Blob for report image storage

## Setup

1. Copy `.env.example` → `.env.local` and fill:

```bash
DATABASE_URL=           # Neon / Postgres connection string
AUTH_SECRET=            # openssl rand -base64 32
AUTH_URL=               # http://localhost:3000 or https://med-health-locker.vercel.app
ADMIN_EMAILS=ygulia3012@gmail.com
XAI_API_KEY=            # xAI API key from https://console.x.ai
XAI_MODEL=grok-2-vision-1212
BLOB_READ_WRITE_TOKEN=  # from Vercel Blob store
SEED_SECRET=            # random string to protect /api/setup/bootstrap
ADMIN_SEED_PASSWORD=    # password for admin seed account
DEMO_SEED_PASSWORD=     # password for demo user seed account
```

2. Install and push schema:

```bash
npm install
npx prisma db push
npm run dev
```

3. Seed admin + demo accounts (after DB is live):

```bash
curl -X POST https://med-health-locker.vercel.app/api/setup/bootstrap \
  -H "x-seed-secret: $SEED_SECRET"
```

## Admin login

1. Open https://med-health-locker.vercel.app/login
2. Sign in with the admin email/password from bootstrap
3. Open **Admin** in the nav, or go directly to `/admin`
4. Regular users are redirected away from `/admin` (enforced server-side)

## Roles

- Regular users access `/home` and health features.
- Admins access `/admin` (enforced in proxy + `/api/admin`).
- Emails listed in `ADMIN_EMAILS` are promoted to admin on signup; bootstrap also forces admin role.
