# Deployment Troubleshooting Guide

Quick reference for common deployment issues with the entropy-wiki stack (Vercel + Railway + PostgreSQL).

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

**Usually means**: Database error (same as #2 above)

**Verify API auth works**:
```bash
curl -H "X-Admin-Password: YOUR_PASSWORD" \
  https://your-api.railway.app/admin/pages
```

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

---

## Initial Setup Checklist

### Railway API Service
- [ ] `DATABASE_URL` linked from PostgreSQL
- [ ] `ADMIN_PASSWORD` set
- [ ] `CORS_ORIGINS` set to Vercel URL (no trailing slash)
- [ ] `PORT` set to `3001`

### Railway PostgreSQL
- [ ] Database running
- [ ] Migrations run: `npm run db:migrate`
- [ ] Data seeded: `npm run db:seed`

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
