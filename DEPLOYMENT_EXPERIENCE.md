# Vercel Deployment Experience - Complete Documentation

**Project:** Metana PR Reviewer (AI-Powered Grading System)  
**Deployment Platform:** Vercel  
**Date:** January 30 - February 2, 2026  
**Status:** ✅ Successfully Deployed  
**Live URL:** https://pr-review-system-watchbot.vercel.app

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Initial Setup](#initial-setup)
3. [Issues Encountered & Solutions](#issues-encountered--solutions)
4. [Configuration Details](#configuration-details)
5. [Key Learnings](#key-learnings)
6. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

### Technology Stack

- **Frontend:** React 19.2.0 + Vite 7.2.4, TailwindCSS, React Router
- **Backend:** Express 5.2.1, Prisma ORM 5.22.0, Node.js 18.x
- **Database:** PostgreSQL (Supabase via Vercel Storage)
- **Authentication:** Firebase Auth (Email/Password + Google Sign-In)
- **APIs:** OpenAI, GitHub (Octokit), Notion
- **Deployment:** Vercel Serverless Functions

### Project Structure

```
metana-pr-reviewer/
├── frontend/          # React + Vite app
├── backend/           # Express API server
├── api/
│   └── index.js       # Vercel serverless entry point
├── vercel.json        # Vercel configuration
└── package.json       # Root build scripts
```

---

## 🚀 Initial Setup

### Step 1: Repository Preparation

```bash
# Pushed code to GitHub
git remote add origin https://github.com/kavindusamaranayake/pr-review-system-watchbot.git
git push -u origin main
```

### Step 2: Firebase Configuration Security

**Issue:** Firebase credentials were hardcoded in `frontend/src/firebase.js`

**Solution:**

1. Created `frontend/.env` with environment variables:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSyBIINhAqrZN2CfgyWB65doQJ4fNhZaeqIg
   VITE_FIREBASE_AUTH_DOMAIN=metana-pr-review-auth.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=metana-pr-review-auth
   VITE_FIREBASE_STORAGE_BUCKET=metana-pr-review-auth.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=51436929537
   VITE_FIREBASE_APP_ID=1:51436929537:web:3ca1c4b4b6a4b99d4ff600
   VITE_FIREBASE_MEASUREMENT_ID=G-CGFW6CFJKD
   ```

2. Updated `firebase.js` to use environment variables:

   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     // ... other configs
   };
   ```

3. Added to `.gitignore`:
   ```
   .env
   .env.local
   .env.production
   ```

### Step 3: Vercel Project Creation

1. Connected GitHub repository to Vercel
2. Created root `package.json` with build script:

   ```json
   {
     "scripts": {
       "vercel-build": "cd backend && npm install && npm run build:prisma && cd ../frontend && npm install && npm run build"
     }
   }
   ```

3. Configured `vercel.json` for API routing:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "/api"
       }
     ]
   }
   ```

---

## 🐛 Issues Encountered & Solutions

### Issue #1: Firebase Authentication Not Found

**Error:** `auth/configuration-not-found`

**Root Cause:** Firebase app initialization was commented out in `firebase.js`:

```javascript
// const app = initializeApp(firebaseConfig); // This was commented
```

**Solution:**

1. Uncommented the app initialization
2. Fixed duplicate initialization code blocks
3. Result: Firebase authentication started working

**Files Modified:** `frontend/src/firebase.js`

---

### Issue #2: Unauthorized Domain Error

**Error:** `auth/unauthorized-domain` when trying to log in on Vercel

**Root Cause:** Vercel domain not added to Firebase authorized domains

**Solution:**

1. Opened Firebase Console → Authentication → Settings
2. Added domain: `pr-review-system-watchbot.vercel.app`
3. Result: Login successful on production

**Configuration:** Firebase Console → Authentication → Authorized domains

---

### Issue #3: Backend API 404 Errors

**Error:** API endpoints returning 404 on Vercel

**Root Cause:** Backend not properly exported as serverless function

**Solution Verification:**

1. Confirmed `api/index.js` exports backend:

   ```javascript
   module.exports = require("../backend/server");
   ```

2. Verified `backend/server.js` exports Express app:

   ```javascript
   module.exports = app;
   ```

3. Checked `vercel.json` rewrites configuration

**Result:** API routing working correctly

---

### Issue #4: Database Connection Failed

**Error:** "Failed to fetch reviews" - database not connected

**Root Cause:** No database created, Prisma not configured

**Solution:**

1. Created PostgreSQL database via Vercel Storage:
   - Went to Storage tab → Create Database
   - Selected PostgreSQL (Supabase)
   - Named: `supabase-purple-dog-pr-review-system`

2. Vercel automatically created environment variables:
   - `DATABASE_POSTGRES_PRISMA_URL` (for connection pooling)
   - `DATABASE_POSTGRES_URL_NON_POOLING` (for migrations)
   - Other database credentials

3. Updated `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_POSTGRES_PRISMA_URL")
     directUrl = env("DATABASE_POSTGRES_URL_NON_POOLING")
   }
   ```

**Files Modified:** `backend/prisma/schema.prisma`

---

### Issue #5: Environment Variable Naming Mismatch

**Error:** `Environment variable not found: DATABASE_URL_NON_POOLING`

**Root Cause:** Prisma schema used `DATABASE_*` but Vercel Storage created `DATABASE_POSTGRES_*`

**Solution:**
Updated Prisma schema to match Vercel's native variable names (see Issue #4)

**Key Learning:** Always check what variable names the platform actually creates

---

### Issue #6: Dotenv Module Not Found in Production

**Error:** `Cannot find module 'dotenv'`

**Root Cause:** `backend/server.js` was requiring dotenv unconditionally:

```javascript
require("dotenv").config(); // Always runs
```

**Why This Failed:**

- Vercel injects environment variables directly
- No need for dotenv in production
- dotenv was only in devDependencies

**Solution:**
Made dotenv loading conditional:

```javascript
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
```

**Files Modified:** `backend/server.js`

**Key Learning:** Serverless platforms inject env vars; dotenv only needed for local dev

---

### Issue #7: Missing Root package.json

**Error:** `ENOENT: no such file or directory, open 'package.json'`

**Root Cause:** Vercel expected a root `package.json` for build scripts

**Solution:**
Created root `package.json`:

```json
{
  "name": "metana-pr-reviewer",
  "version": "1.0.0",
  "scripts": {
    "vercel-build": "cd backend && npm install && npm run build:prisma && cd ../frontend && npm install && npm run build"
  }
}
```

**Files Created:** `package.json` (root level)

---

### Issue #8: Prisma Version Conflict

**Error:** Schema syntax errors, unknown fields

**Root Cause:**

- Project used Prisma 5.22.0
- `npx prisma` in vercel-build installed Prisma 7.x (latest)
- Prisma v7 has breaking schema syntax changes

**Solution:**

1. Added `build:prisma` script to `backend/package.json`:

   ```json
   "scripts": {
     "build:prisma": "prisma generate && prisma db push --skip-generate --accept-data-loss"
   }
   ```

2. Updated root `vercel-build` to use local Prisma:
   ```json
   "vercel-build": "cd backend && npm install && npm run build:prisma && cd ../frontend && npm install && npm run build"
   ```

**Key Learning:** Always use project's local Prisma version, not npx

---

### Issue #9: Database Tables Not Created

**Error:** "relation does not exist" when querying reviews

**Root Cause:** Prisma migration not run during deployment

**Solution:**
Added `prisma db push` to build process (see Issue #8 solution)

This command:

- Generates Prisma Client
- Creates/updates database tables
- Runs during every deployment

**Result:** Database tables automatically created on deployment

---

## ⚙️ Configuration Details

### Environment Variables in Vercel

#### 🔐 Required (Must be added manually):

**Firebase (Frontend):**

```env
VITE_FIREBASE_API_KEY=AIzaSyBIINhAqrZN2CfgyWB65doQJ4fNhZaeqIg
VITE_FIREBASE_AUTH_DOMAIN=metana-pr-review-auth.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=metana-pr-review-auth
VITE_FIREBASE_STORAGE_BUCKET=metana-pr-review-auth.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=51436929537
VITE_FIREBASE_APP_ID=1:51436929537:web:3ca1c4b4b6a4b99d4ff600
VITE_FIREBASE_MEASUREMENT_ID=G-CGFW6CFJKD
```

**API Keys (Backend):**

```env
OPENAI_API_KEY=sk-proj-***
GITHUB_TOKEN=ghp_***
NOTION_API_KEY=ntn_***
GITHUB_WEBHOOK_SECRET=mysecret123
GITHUB_ORG_NAME=metana
```

#### 🤖 Auto-Generated (By Vercel Storage):

```env
DATABASE_POSTGRES_PRISMA_URL=postgres://...
DATABASE_POSTGRES_URL_NON_POOLING=postgres://...
DATABASE_POSTGRES_HOST=db.*.supabase.co
DATABASE_POSTGRES_USER=postgres
DATABASE_POSTGRES_PASSWORD=***
```

#### 🔧 Auto-Injected (By Vercel):

```env
NODE_ENV=production
VERCEL_URL=pr-review-system-watchbot.vercel.app
```

---

### Build Configuration

**Root package.json:**

```json
{
  "name": "metana-pr-reviewer",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "vercel-build": "cd backend && npm install && npm run build:prisma && cd ../frontend && npm install && npm run build"
  }
}
```

**Backend package.json (added script):**

```json
{
  "scripts": {
    "build:prisma": "prisma generate && prisma db push --skip-generate --accept-data-loss"
  }
}
```

**vercel.json:**

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ],
  "functions": {
    "api/index.js": {
      "maxDuration": 10
    }
  }
}
```

---

## 💡 Key Learnings

### 1. Environment Variable Management

- **Local:** Use `.env` files with `dotenv` package
- **Production:** Vercel injects variables directly - dotenv not needed
- **Security:** Never commit `.env` files to Git
- **Naming:** Platform-generated variable names may differ from expectations

### 2. Serverless Architecture

- Backend runs as serverless functions, not as a persistent server
- Must export Express app: `module.exports = app;`
- No `app.listen()` in production code
- Each request spawns a new function instance

### 3. Database Management with Prisma

- Use `prisma db push` for serverless deployments (not `prisma migrate`)
- Always use project's local Prisma version via npm scripts
- Specify both `url` (pooled) and `directUrl` (non-pooled) for optimal performance
- Run Prisma generation during build process

### 4. Firebase Configuration

- Firebase config can be public (API key is safe)
- BUT: Must whitelist authorized domains in Firebase Console
- Use environment variables for flexibility across environments

### 5. Build Process Optimization

- Install backend dependencies first (for Prisma)
- Generate Prisma Client before building frontend
- Frontend build goes to `frontend/dist`
- Vercel automatically serves frontend as static CDN

### 6. Debugging Production Issues

1. Check Vercel Function Logs (real-time)
2. Verify environment variables in Vercel dashboard
3. Test locally with `vercel dev` or `vercel env pull`
4. Use conditional code for local vs production

---

## 🔍 Troubleshooting Guide

### Problem: Firebase Auth Not Working

**Symptoms:**

- `auth/configuration-not-found` error
- `auth/unauthorized-domain` error

**Solutions:**

1. Check Firebase app is initialized: `const app = initializeApp(firebaseConfig);`
2. Add Vercel domain to Firebase authorized domains
3. Verify all `VITE_FIREBASE_*` env vars are set in Vercel

---

### Problem: Backend API 404 Errors

**Symptoms:**

- Frontend can't reach `/api/*` endpoints
- Vercel logs show 404

**Solutions:**

1. Verify `api/index.js` exports backend: `module.exports = require('../backend/server');`
2. Check `backend/server.js` exports app: `module.exports = app;`
3. Confirm `vercel.json` has correct rewrites
4. Ensure no `app.listen()` in production code

---

### Problem: Database Connection Failed

**Symptoms:**

- `Error: Failed to fetch reviews`
- Prisma errors about missing DATABASE_URL

**Solutions:**

1. Create database via Vercel Storage
2. Update Prisma schema to use correct env var names
3. Run `prisma db push` in build process
4. Check environment variables in Vercel dashboard

---

### Problem: Build Failures

**Symptoms:**

- Deployment fails during build
- Missing dependencies errors

**Solutions:**

1. Ensure root `package.json` exists with `vercel-build` script
2. Check all dependencies are in `package.json`, not just devDependencies
3. Make dotenv loading conditional: `if (process.env.NODE_ENV !== 'production')`
4. Use local Prisma version via npm scripts, not npx

---

### Problem: Prisma Schema Errors

**Symptoms:**

- Unknown syntax errors in schema
- Version mismatch warnings

**Solutions:**

1. Check project's Prisma version: `npm list prisma`
2. Don't use `npx prisma` - use npm script instead
3. Lock Prisma version in package.json: `"prisma": "5.22.0"`
4. Use `prisma db push` for serverless, not `prisma migrate`

---

## 🚀 Deployment Workflow

### For Future Updates:

1. **Make code changes locally**
2. **Test locally:**

   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

3. **Commit and push:**

   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

4. **Vercel auto-deploys** (takes ~2-3 minutes)

5. **Verify deployment:**
   - Check Vercel dashboard for build logs
   - Test live site: https://pr-review-system-watchbot.vercel.app
   - Monitor function logs for errors

---

## 📈 Future Enhancements

### Optional Improvements:

1. **GitHub Webhook Integration**
   - Automatically trigger reviews on PR creation
   - Set up webhook URL in GitHub repository settings

2. **Custom Domain**
   - Add custom domain in Vercel dashboard
   - Update Firebase authorized domains

3. **Monitoring & Analytics**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry, LogRocket)
   - Add performance monitoring

4. **Security Enhancements**
   - Add rate limiting for API endpoints
   - Implement API key rotation strategy
   - Set up CORS policies more restrictively

5. **Database Optimizations**
   - Add indexes for frequently queried fields
   - Set up automated backups
   - Implement connection pooling monitoring

6. **CI/CD Improvements**
   - Add automated tests in GitHub Actions
   - Set up preview deployments for feature branches
   - Implement staging environment

---

## 📝 Final Checklist

- [x] Code pushed to GitHub
- [x] Vercel project created and connected
- [x] All environment variables configured
- [x] Firebase authorized domains updated
- [x] PostgreSQL database created
- [x] Prisma schema configured correctly
- [x] Build process optimized
- [x] Frontend deployed and accessible
- [x] Backend API responding
- [x] Database tables created
- [x] Authentication working (Email + Google)
- [x] All features tested (Dashboard, Grading Assistant)

---

## 🎓 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

## 📞 Support

If issues arise:

1. Check Vercel Function Logs first
2. Verify environment variables in dashboard
3. Test locally with `vercel dev`
4. Review this document for similar issues
5. Check Vercel community forums

---

**Deployment completed successfully on February 2, 2026** ✅

**Live Application:** https://pr-review-system-watchbot.vercel.app
