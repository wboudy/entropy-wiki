# Deployment Troubleshooting Guide

Quick reference for common deployment issues with the entropy-wiki stack (Vercel + Railway + PostgreSQL).

## Quick Diagnostic Flowchart

```
Frontend issue (pages return 404)?
├── Check API: curl https://entropy-wiki-production.up.railway.app/pages
│   ├── Returns {"error":"database_error"} → See #2 or #7 (database issue)
│   ├── Returns {"pages":[]} → Run db:seed (no data)
│   └── Returns {"pages":[...]} → Vercel cache issue, purge CDN
│
Admin login returns 500?
├── Check API: curl -H "X-Admin-Password: XXX" https://entropy-wiki-production.up.railway.app/admin/pages
│   ├── Returns {"error":"database_error"} → See #2 or #7 (database issue)
│   ├── Returns "column X does not exist" → See #7 (missing migration)
│   ├── Returns {"error":"unauthorized"} → Wrong password
│   └── Returns {"pages":[...]} → Frontend CORS issue, see #3
│
Railway API health check fails?
├── curl https://entropy-wiki-production.up.railway.app/health
│   ├── Returns {"status":"ok"} → API is up, issue is database
│   └── Connection refused → Railway service is down, redeploy
```

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Vercel        │────▶│   Railway API   │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Express)     │     │   (Railway)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Vercel**: Hosts Next.js frontend, uses `NEXT_PUBLIC_API_URL` to reach API
- **Railway API**: Express server, uses `DATABASE_URL` to reach Postgres
- **PostgreSQL**: Stores wiki pages, managed by Railway

---

## Common Issues & Fixes

### 1. Vercel Pages Return 404

**Symptoms**: `/beads` or other wiki pages return 404

**Check API first**:
```bash
curl https://your-api.railway.app/pages
```

**If API returns `database_error`**:
- Database tables don't exist
- Run migrations (see "Database Setup" below)

**If API returns empty `{"pages":[]}`**:
- Tables exist but no data
- Run seed: `npm run db:seed`

**If API returns pages but Vercel still 404**:
- Vercel may be caching old response
- Purge CDN cache: Vercel → Settings → Caches → Purge CDN Cache
- Hard refresh browser: Cmd+Shift+R

### 2. API Returns "database_error"

**Symptoms**: All `/pages` endpoints return `{"error":"database_error"}`

**Cause**: PostgreSQL tables don't exist (migrations not run)

**Fix**:
```bash
# Get public DATABASE_URL from Railway PostgreSQL service
# Then run locally:
DATABASE_URL="postgresql://user:pass@host:port/db" npm run db:migrate
DATABASE_URL="postgresql://user:pass@host:port/db" npm run db:seed
```

**Verify**:
```bash
curl https://your-api.railway.app/pages
# Should return {"pages":[...]} not database_error
```

### 3. CORS Errors in Browser Console

**Symptoms**:
```
Access to fetch blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Check CORS config**:
```bash
curl -I -X OPTIONS https://your-api.railway.app/admin/pages \
  -H "Origin: https://your-frontend.vercel.app"
```

**Should see**: `access-control-allow-origin: https://your-frontend.vercel.app`

**If not, fix Railway CORS_ORIGINS**:
- Go to Railway → API service → Variables
- Set `CORS_ORIGINS` to exact frontend URL
- NO trailing slash: `https://entropy-wiki.vercel.app` ✓
- NOT: `https://entropy-wiki.vercel.app/` ✗

### 4. Admin Login Returns 500

**Symptoms**: Enter password on `/admin`, get error

**Check the actual error**:
```bash
curl -H "X-Admin-Password: YOUR_PASSWORD" \
  https://entropy-wiki-production.up.railway.app/admin/pages
```

**If you see `{"error":"database_error"}`**: Database issue (see #2 above)

**If you see `column "X" does not exist`**: Missing migration (see #7 below)

**If you see `{"error":"unauthorized"}`**: Wrong password or `ADMIN_PASSWORD` not set in Railway

### 5. Vercel Not Deploying on Push

**Symptoms**: Push to GitHub, no Vercel deployment triggered

**Causes**:
- Vercel disconnected from repo (e.g., after moving to organization)
- Auto-deploy disabled

**Fix**:
- Vercel → Project → Settings → Git
- Verify "Connected Git Repository" shows correct repo
- Verify "Production Branch" is `master` (or `main`)
- Re-connect if needed

### 6. Environment Variables Not Working

**For Vercel (frontend)**:
- Must be named `NEXT_PUBLIC_*` for client-side access
- Set in Vercel → Settings → Environment Variables
- **Requires redeploy** after adding/changing

**For Railway (API)**:
- Set in Railway → Service → Variables
- `DATABASE_URL` - auto-linked from PostgreSQL service
- `ADMIN_PASSWORD` - your admin password
- `CORS_ORIGINS` - your Vercel frontend URL
- `PORT` - set to `3001` if needed

### 7. Missing Database Column Error (Migration Not Applied)

**Symptoms**: Railway logs show errors like:
```
error: column "parent_id" does not exist
error: column "sort_order" does not exist
error: column "effective_visibility" does not exist
```

**Cause**: Database migrations were not fully applied. The schema has multiple migrations:
- `001_initial.sql` - Creates `pages` and `page_revisions` tables
- `002_hierarchy.sql` - Adds `parent_id`, `sort_order`, `effective_visibility` columns

**The Problem**: Railway's internal `DATABASE_URL` uses `postgres.railway.internal` hostname which is only accessible from within Railway's network. You cannot run migrations from your local machine using this URL.

**Fix - Get the Public Database URL**:

```bash
# 1. Install Railway CLI if needed
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Link to your project (use non-interactive flags)
railway link -p diplomatic-surprise -s Postgres

# 4. Get the public DATABASE_URL
railway variables --json | grep DATABASE_PUBLIC_URL
# Output: "DATABASE_PUBLIC_URL": "postgresql://postgres:PASSWORD@turntable.proxy.rlwy.net:PORT/railway"
```

**Run Migrations with Public URL**:
```bash
cd api

# Use the public URL (from step 4 above)
DATABASE_URL="postgresql://postgres:PASSWORD@turntable.proxy.rlwy.net:PORT/railway" npm run db:migrate

# You should see:
# Running migrations...
# Skipping 001_initial (already applied)
# Applying 002_hierarchy...
# Applied 002_hierarchy
# All migrations complete!
```

**Verify**:
```bash
curl https://entropy-wiki-production.up.railway.app/admin/pages \
  -H "X-Admin-Password: YOUR_PASSWORD"
# Should return {"pages":[...]} with parent_id, sort_order, effective_visibility fields
```

### 8. Railway CLI Quick Reference

**Setup**:
```bash
# Install
npm install -g @railway/cli

# Login (opens browser)
railway login

# Check login status
railway whoami
```

**Link to Project**:
```bash
# List your projects
railway list

# Link (interactive - won't work in scripts)
railway link

# Link (non-interactive)
railway link -p PROJECT_NAME -s SERVICE_NAME

# Check link status
railway status
```

**Environment Variables**:
```bash
# View variables (table format)
railway variables

# View variables (JSON - for scripting)
railway variables --json

# Key variables for entropy-wiki:
# - DATABASE_URL (internal, auto-set by Postgres service)
# - DATABASE_PUBLIC_URL (external, for running migrations locally)
# - ADMIN_PASSWORD (set manually)
# - CORS_ORIGINS (set manually)
```

**Service Management**:
```bash
# View all services
railway service status --all

# View logs
railway logs

# Redeploy
railway up
```

**Database Operations**:
```bash
# Link to Postgres service first
railway link -p diplomatic-surprise -s Postgres

# Get public URL
railway variables --json | grep DATABASE_PUBLIC_URL

# Run migrations (from api/ directory)
DATABASE_URL="postgresql://..." npm run db:migrate

# Seed data
DATABASE_URL="postgresql://..." npm run db:seed
```

---

## Initial Setup Checklist

### Railway API Service
- [ ] `DATABASE_URL` linked from PostgreSQL
- [ ] `ADMIN_PASSWORD` set
- [ ] `CORS_ORIGINS` set to Vercel URL (no trailing slash)
- [ ] `PORT` set to `3001`

### Railway PostgreSQL
- [ ] Database running
- [ ] Get public DATABASE_URL: `railway link -p diplomatic-surprise -s Postgres && railway variables --json | grep DATABASE_PUBLIC_URL`
- [ ] Run migrations: `DATABASE_URL="postgresql://..." npm run db:migrate`
- [ ] Verify both migrations applied: `001_initial` and `002_hierarchy`
- [ ] Data seeded: `DATABASE_URL="postgresql://..." npm run db:seed`

### Vercel
- [ ] Connected to GitHub repo
- [ ] `NEXT_PUBLIC_API_URL` set to Railway API URL
- [ ] Auto-deploy enabled

---

## Debugging Commands

```bash
# Check API health
curl https://your-api.railway.app/health

# Check database connection (should return pages, not error)
curl https://your-api.railway.app/pages

# Check specific page
curl https://your-api.railway.app/pages/beads

# Check CORS headers
curl -I -X OPTIONS https://your-api.railway.app/admin/pages \
  -H "Origin: https://your-frontend.vercel.app"

# Check admin auth
curl -H "X-Admin-Password: YOUR_PASSWORD" \
  https://your-api.railway.app/admin/pages

# Check Vercel page
curl -s -o /dev/null -w "%{http_code}" https://your-frontend.vercel.app/beads
```

---

## Local Development

Always test locally before pushing:

```bash
# Terminal 1: Start Postgres
cd api && docker compose up -d

# Terminal 2: Start API
cd api && npm run dev

# Terminal 3: Start Frontend
npm run dev

# Test at localhost:3000
```

This catches most issues before they reach production.
