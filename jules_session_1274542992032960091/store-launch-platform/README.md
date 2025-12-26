# Store Launch Ops Platform (MVP)

A collaborative, multi-country platform for managing store openings in Latin America.

## Architecture
- **Framework:** Next.js 16.1.1 (App Router)
- **Database:** SQLite (local dev) / Supabase Postgres (production)
- **ORM:** Prisma v5
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4

## Features (MVP Status)
- **Data Layer:** Complete schema for Users, Stores, Tasks, Templates, and Costing/Pricing.
- **Seeding:** Automated seed script populates the database with:
  - Users (Admin, PM, Contributor)
  - Sample Stores (MX, CO) with auto-generated launch tasks.
  - Ingredient & Grocery Price Database (LatAm retailers).
  - Recipes & Competitor Benchmarks.
- **Auth:** Simulated "Dev Mode" login (cookie-based).
- **Dashboard:** Portfolio overview of active store launches.
- **Task Management:** 55 tasks across 8 launch phases with timeline/calendar views.
- **Documentation:** Complete Korean user manual with 100% UI coverage.

## Quick Start (Local Development)

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local if needed (defaults work for local dev)
   ```

3. **Initialize Database**
   ```bash
   # Run migrations
   npx prisma migrate dev

   # Seed sample data
   npx tsx prisma/seed.ts
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel (FREE Tier)

**Complete step-by-step guide:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

**Quick summary:**
1. Sign up for free accounts: [Vercel](https://vercel.com) + [Supabase](https://supabase.com)
2. Create Supabase project, copy DATABASE_URL
3. Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
4. Import repo to Vercel, set environment variables (see [.env.example](./.env.example))
5. Deploy → Update NEXTAUTH_URL → Redeploy
6. Run migrations: `npx prisma migrate deploy`
7. Seed database: `npx tsx prisma/seed.ts`

**No credit card required!** Works entirely on free tiers.

## Environment Variables

See [.env.example](./.env.example) for all required and optional variables.

**Required for production:**
- `DATABASE_URL` - Supabase Postgres connection string
- `NEXTAUTH_URL` - Your deployment URL
- `NEXTAUTH_SECRET` - Random secret for session encryption

**Optional (for file uploads):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

## Operator Runbook (Short)

**Adding a Country:**
1. Add the country code (e.g., "PE") to the `Store` creation logic or UI.
2. Add reference retailers in the Seed script or Admin UI (future).

**Managing Tasks:**
- Tasks are auto-generated from the "Standard Store Opening" Template.
- To modify the standard process, update the `Template` and `TemplatePhase` records in the database (or via seed).

**Pricing:**
- Grocery prices are normalized to `price_per_unit`.
- FX Rates are currently static in the database; update via seed or future Admin UI.
