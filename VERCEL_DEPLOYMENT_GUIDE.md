# 🚀 Vercel Deployment Guide - Metana PR Reviewer

## ✅ Completed Refactoring

Your project is now configured for Vercel monorepo deployment with the following changes:

### 1. Root Configuration (`vercel.json`) ✅
- Routes all `/api/*` requests to backend serverless functions
- Routes all `/webhook/*` requests to backend
- Serves frontend static files for all other routes
- Sets production environment variables

### 2. Backend Refactoring (`backend/server.js`) ✅
- **Serverless Export**: `module.exports = app` for Vercel
- **Dev Mode Support**: Only runs `app.listen()` when `NODE_ENV !== 'production'`
- **Smart CORS**: Accepts requests from:
  - `localhost:5173` (dev frontend)
  - `localhost:3000` (dev backend)
  - Vercel deployment URLs (via `VERCEL_URL` env var)
  - Custom frontend URL (via `FRONTEND_URL` env var)

### 3. Frontend API Configuration (`frontend/src/services/api.js`) ✅
- Uses environment variable `VITE_API_URL` if available
- Falls back to `/api` (relative path) in production → handled by `vercel.json` rewrites
- Uses `http://localhost:3000/api` in development

### 4. Smart File Filtering (Cost Saving) ✅
The `gradingController.js` already includes optimized file filtering:
- **Only reads**: `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.sol`, `.rs`, `.go`
- **Ignores**: `node_modules`, `.git`, `dist`, `build`, `__pycache__`, `target`
- **Prevents**: Image files, binary files, and large dependencies from being read
- **Vercel-Safe**: Avoids 10-second serverless timeout

---

## 📦 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure for Vercel monorepo deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. **Framework Preset**: Select "Other" (monorepo)
5. **Root Directory**: Leave as `.` (root)

### Step 3: Configure Environment Variables in Vercel Dashboard
Add these in **Settings → Environment Variables**:

#### Backend Variables (Required):
```
DATABASE_URL=your_postgresql_connection_string
GITHUB_TOKEN=your_github_personal_access_token
NOTION_API_KEY=your_notion_integration_token
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
```

#### Frontend Variables (Optional):
```
VITE_API_URL=
(Leave empty to use relative /api path)
```

### Step 4: Configure Build Settings
Vercel should auto-detect from `vercel.json`, but verify:
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install` (runs in root and subdirs)

### Step 5: Deploy
Click "Deploy" and wait for build to complete (~2-3 minutes)

---

## 🔧 Local Development

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and connect to backend at `http://localhost:3000/api`

---

## 🌐 Production URLs

After deployment, your URLs will be:
- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api/*`
- **Webhooks**: `https://your-project.vercel.app/webhook/*`

Update your GitHub webhook URL to:
```
https://your-project.vercel.app/webhook/github
```

---

## 🔍 Verifying Deployment

### Test API Health:
```bash
curl https://your-project.vercel.app/api/reviews
```

### Test Grading Endpoint:
```bash
curl -X POST https://your-project.vercel.app/api/grade/health
```

### Check Logs:
Go to Vercel Dashboard → Your Project → Deployments → [Latest] → View Function Logs

---

## ⚠️ Important Notes

### Vercel Free Tier Limits:
- ⏱️ **10-second timeout** per serverless function
- 📦 **50MB** deployment size limit
- 🔄 **100GB** bandwidth per month
- 💾 **1000** serverless function invocations per day

### Optimization Tips:
1. **File Filtering**: Already implemented in `gradingController.js`
2. **Small Repos**: Grade repos with <50 files for faster processing
3. **Caching**: Consider Redis for repeated grading requests
4. **Async Processing**: For large repos, use a queue system (not covered in free tier)

### Database Considerations:
- Use **Vercel Postgres** (free tier: 60 hours compute/month)
- Or **Neon** (serverless Postgres with generous free tier)
- Or **PlanetScale** (MySQL with free tier)

---

## 🐛 Troubleshooting

### Issue: API calls fail with CORS error
**Solution**: Ensure `FRONTEND_URL` env var is set in Vercel to your deployment URL

### Issue: 504 Gateway Timeout
**Solution**: Grading took >10s. Reduce repo size or optimize AI calls

### Issue: Module not found errors
**Solution**: Ensure all dependencies are in `package.json` and not just devDependencies

### Issue: Environment variables not working
**Solution**: Redeploy after adding env vars (Settings → Environment Variables → Redeploy)

---

## 📚 Additional Files Created

1. ✅ `vercel.json` - Monorepo routing configuration
2. ✅ `.vercelignore` - Ignore unnecessary files during build
3. ✅ `.env.production.example` - Template for production environment variables

---

## 🎉 Ready to Deploy!

Your project is now fully configured for Vercel. Follow the deployment steps above and you'll have both frontend and backend running on Vercel's free tier.

**Need help?** Check Vercel's documentation: https://vercel.com/docs
