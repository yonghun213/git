# Deploying to Vercel (FREE Tier)

This guide explains how to deploy the Store Launch Platform to Vercel's FREE tier with zero cost.

## Prerequisites

- **GitHub account** (to connect repository)
- **Vercel account** (FREE, sign up at https://vercel.com)
- **Supabase account** (FREE, sign up at https://supabase.com) - for production database

**Important:** No credit card required for any of these services!

---

## Step 1: Set Up Supabase Database (FREE)

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign up (FREE, no credit card)
2. Click **"New project"**
3. Fill in:
   - **Name:** store-launch-platform (or your choice)
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** FREE (default)
4. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Get Database Connection String

1. Once created, go to **Settings** > **Database**
2. Scroll to **Connection string** section
3. Select **"URI"** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@[REGION].pooler.supabase.com:5432/postgres
   ```
5. **Important:** Replace `[YOUR-PASSWORD]` with the password you set in step 1.1
6. Add `?pgbouncer=true&connection_limit=1` to the end for Prisma compatibility

**Final format:**
```
postgresql://postgres.xxxxx:yourpassword@xxxx.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```

### 1.3 Get Supabase Storage Keys (Optional - for file uploads)

1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (⚠️ Keep secret!)

---

## Step 2: Generate NextAuth Secret

You need a random secret key for authentication. Generate it using one of these methods:

**Method 1: Command line (Mac/Linux)**
```bash
openssl rand -base64 32
```

**Method 2: Online generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

**Example output:** `Xn2r5u8x/A?D(G+KbPeShVmYq3t6w9y$`

---

## Step 3: Deploy to Vercel

### 3.1 Import Repository

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository: `yonghun213/git`
4. Set **Root Directory** to: `jules_session_1274542992032960091/store-launch-platform`
5. Click **"Import"**

### 3.2 Configure Environment Variables

Before deploying, click **"Environment Variables"** and add these:

**Required Variables:**

| Key | Value | Example |
|-----|-------|---------|
| `DATABASE_URL` | Supabase connection string (from Step 1.2) | `postgresql://postgres.xxx:password@...` |
| `NEXTAUTH_URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Generated secret (from Step 2) | `Xn2r5u8x/A?D(G+KbPe...` |

**Optional Variables (for file uploads):**

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Step 1.3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Step 1.3 |
| `SUPABASE_SERVICE_KEY` | From Step 1.3 |
| `MAX_FILE_SIZE` | `10485760` (10MB) |

**Notes:**
- For `NEXTAUTH_URL`, use the deployment URL Vercel will provide (you'll update this after first deploy)
- All environment variables should be set for **Production** environment

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. You'll get a deployment URL like: `https://your-app.vercel.app`

### 3.4 Update NEXTAUTH_URL

1. Go to your Vercel project **Settings** > **Environment Variables**
2. Find `NEXTAUTH_URL`
3. Update value to your actual deployment URL: `https://your-app.vercel.app`
4. Click **"Save"**
5. Redeploy (Vercel will auto-redeploy or click **"Redeploy"** in Deployments tab)

---

## Step 4: Initialize Database

After successful deployment, you need to run migrations and seed data.

### Method A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Link to your project:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.production
   ```

4. Run migrations:
   ```bash
   DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma migrate deploy
   ```

5. Seed database:
   ```bash
   DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx tsx prisma/seed.ts
   ```

### Method B: Manual (Local with Production Database)

1. Create a temporary `.env` file with your production `DATABASE_URL`
2. Run:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```
3. Delete the temporary `.env` file

---

## Step 5: Verify Deployment

1. Visit your Vercel deployment URL: `https://your-app.vercel.app`
2. You should see the login page
3. Select a user (e.g., "Alice Admin")
4. Click "Enter Platform"
5. You should see the dashboard with sample store data

---

## Step 6: Set Up Supabase Storage (Optional - for file uploads)

Only needed if you want document upload/download functionality:

### 6.1 Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Name: `store-files`
4. Set as **Private** (requires authentication)
5. Click **"Create bucket"**

### 6.2 Set Up Policies

Run this SQL in **Supabase SQL Editor**:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'store-files');

-- Allow authenticated users to download
CREATE POLICY "Allow authenticated downloads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'store-files');

-- Allow authenticated users to delete their files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'store-files');
```

---

## Troubleshooting

### Build Fails

**Error:** `Prisma client not found`
- **Solution:** Ensure `DATABASE_URL` is set in Vercel environment variables
- Add build command: `npx prisma generate && next build`

### Database Connection Issues

**Error:** `Can't reach database server`
- **Solution:** Check DATABASE_URL format includes `?pgbouncer=true&connection_limit=1`
- Verify Supabase project is in same region as Vercel deployment (or use closest)

### Authentication Errors

**Error:** `NEXTAUTH_URL` mismatch
- **Solution:** Ensure `NEXTAUTH_URL` matches your exact Vercel deployment URL
- No trailing slash: `https://your-app.vercel.app` ✅ not `https://your-app.vercel.app/` ❌

### File Upload Not Working

**Error:** Files not uploading
- **Solution:** Check all three Supabase keys are set correctly
- Verify storage bucket `store-files` exists and policies are applied
- If using local fallback, it won't work on Vercel (no filesystem persistence)

---

## Cost Summary (FREE Tier Limits)

| Service | Free Tier Limit | Enough For |
|---------|----------------|------------|
| **Supabase Database** | 500 MB storage | ~10,000 stores |
| **Supabase Storage** | 1 GB files | ~100 PDF documents |
| **Supabase Bandwidth** | 2 GB/month | ~5,000 page loads |
| **Vercel Hosting** | 100 GB bandwidth | ~50,000 page loads |
| **Vercel Functions** | 100 GB-hours | Unlimited for this app |
| **Vercel Builds** | 6,000 mins/month | ~200 deployments |

**Total monthly cost:** $0.00 💰

**Upgrade triggers:**
- You'll get email warnings before hitting limits
- No automatic charges - services will pause, not bill
- Can upgrade to paid plans when needed

---

## Mobile Access

The app is **fully responsive** and works on:
- ✅ Mobile browsers (iOS Safari, Android Chrome)
- ✅ Tablets
- ✅ Desktop browsers

Just visit `https://your-app.vercel.app` from any device!

---

## Maintenance

### Updating Environment Variables

1. Go to Vercel project **Settings** > **Environment Variables**
2. Edit the variable
3. Click **"Save"**
4. Vercel will automatically redeploy

### Monitoring Usage

**Supabase:**
- Dashboard > Settings > Usage
- Monitor database size, bandwidth, storage

**Vercel:**
- Project > Analytics
- Monitor bandwidth, function executions

### Database Backups

**Supabase FREE tier:**
- Automatic daily backups (7-day retention)
- Manual backup: Database > Database Settings > Backups

---

## Next Steps

After deployment:
1. ✅ Change default user passwords (when auth is implemented)
2. ✅ Add your team members as users
3. ✅ Create your first store
4. ✅ Customize branding (update logo, colors in Tailwind config)
5. ✅ Monitor usage in Supabase and Vercel dashboards

---

## Support

**Issues?**
- Check Vercel deployment logs: Project > Deployments > [Latest] > Build Logs
- Check runtime logs: Project > Deployments > [Latest] > Functions Logs
- Check Supabase logs: Dashboard > Logs

**Need help?**
- Open an issue on GitHub
- Check docs: docs/STORE_REGISTRATION_SPEC.md

---

**Deployment Checklist:**

- [ ] Supabase project created
- [ ] DATABASE_URL copied
- [ ] NEXTAUTH_SECRET generated
- [ ] All env vars added to Vercel
- [ ] First deployment successful
- [ ] NEXTAUTH_URL updated to real URL
- [ ] Redeployed with correct URL
- [ ] Database migrated
- [ ] Database seeded
- [ ] Login works
- [ ] Dashboard shows data
- [ ] Mobile access verified
- [ ] (Optional) Storage bucket created
- [ ] (Optional) Storage policies applied

**Congratulations! Your app is live! 🚀**
