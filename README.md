# MED-Health Locker

Personal health records + AI analysis — production Next.js app for Vercel.

## Stack

- Next.js App Router (TypeScript) + Tailwind design system
- PostgreSQL via Prisma
- Auth.js (NextAuth v5) with `USER` / `ADMIN` roles
- Anthropic Claude for report analysis (server-side only)
- Vercel Blob for report image storage

## Setup

1. Copy `.env.example` → `.env.local` and fill:

```bash
DATABASE_URL=           # Neon / Postgres connection string
AUTH_SECRET=            # openssl rand -base64 32
AUTH_URL=               # http://localhost:3000 or your Vercel URL
ADMIN_EMAILS=           # comma-separated emails promoted to admin on signup
ANTHROPIC_API_KEY=      # Claude API key
BLOB_READ_WRITE_TOKEN=  # from Vercel Blob store
```

2. Install and push schema:

```bash
npm install
npx prisma db push
npm run dev
```

3. Deploy: connect the GitHub repo to Vercel, set the same env vars, then `prisma db push` against the production database once.

## Roles

- Regular users access `/home` and health features.
- Admins access `/admin` (enforced in middleware + `/api/admin`).
- Set `ADMIN_EMAILS` before first signup, or promote via SQL / admin UI.
