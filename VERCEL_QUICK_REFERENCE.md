# ⚡ Vercel Deployment Quick Reference

## 🎯 Files Created/Modified

### ✅ New Files:
1. **`/vercel.json`** - Monorepo routing configuration
2. **`/.vercelignore`** - Build optimization
3. **`/.env.production.example`** - Production env template
4. **`/VERCEL_DEPLOYMENT_GUIDE.md`** - Complete deployment guide
5. **`/frontend/.env.example`** - Frontend env template

### ✅ Modified Files:
1. **`/backend/server.js`** - Serverless export + smart CORS
2. **`/frontend/src/services/api.js`** - Dynamic API URL
3. **`/backend/.env.example`** - Updated with all required vars

---

## 🚀 Deploy in 5 Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### 2. Import to Vercel
- Go to https://vercel.com
- Click "Import Project"
- Select your repository

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
DATABASE_URL=postgresql://...
GITHUB_TOKEN=ghp_...
NOTION_API_KEY=secret_...
OPENAI_API_KEY=sk-...
NODE_ENV=production
```

### 4. Deploy
Click "Deploy" button

### 5. Update Webhook URL
GitHub Settings → Webhooks → Edit:
```
https://your-project.vercel.app/webhook/github
```

---

## 🔗 Key URLs After Deployment

| Service | Local Dev | Production |
|---------|-----------|------------|
| Frontend | http://localhost:5173 | https://your-project.vercel.app |
| API | http://localhost:3000/api | https://your-project.vercel.app/api |
| Webhooks | http://localhost:3000/webhook | https://your-project.vercel.app/webhook |

---

## 💻 Local Development

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev
```

---

## ✨ What Changed?

### Backend (`server.js`):
- ✅ Exports `app` for serverless functions
- ✅ Only runs `app.listen()` in development
- ✅ Smart CORS for Vercel URLs

### Frontend (`api.js`):
- ✅ Uses `/api` relative path in production
- ✅ Uses `http://localhost:3000/api` in dev
- ✅ Respects `VITE_API_URL` env variable

### Grading Controller:
- ✅ Already optimized for Vercel (filters files correctly)
- ✅ Ignores node_modules, images, binaries
- ✅ Only reads: `.js`, `.jsx`, `.sol` files

---

## 🛡️ Vercel Free Tier Limits

| Resource | Limit |
|----------|-------|
| Function Timeout | 10 seconds |
| Deployment Size | 50 MB |
| Bandwidth | 100 GB/month |
| Function Invocations | 1000/day |

**Your code is already optimized to stay within these limits!** 🎉

---

## 📞 Need Help?

1. Read: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
2. Check: https://vercel.com/docs
3. Logs: Vercel Dashboard → Deployments → Function Logs
