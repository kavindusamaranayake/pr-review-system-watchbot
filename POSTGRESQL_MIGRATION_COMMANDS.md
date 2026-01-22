# ⚡ PostgreSQL Migration - Quick Commands

## 🎯 Copy These Commands in Order

### 1️⃣ Navigate to Backend
```powershell
cd backend
```

### 2️⃣ Clean SQLite Artifacts
```powershell
# Delete SQLite database
Remove-Item -ErrorAction SilentlyContinue dev.db
Remove-Item -ErrorAction SilentlyContinue prisma/dev.db

# Delete old migrations (important!)
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue prisma/migrations
```

### 3️⃣ Update Dependencies
```powershell
npm install
```

### 4️⃣ Generate Prisma Client
```powershell
npx prisma generate
```

### 5️⃣ Push Schema to Supabase
```powershell
npx prisma db push
```

### 6️⃣ Test with Prisma Studio (Optional)
```powershell
npx prisma studio
```

### 7️⃣ Start Backend Server
```powershell
npm run dev
```

---

## ✅ Expected Success Output

### After `npx prisma db push`:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database

🚀  Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client
```

### After `npm run dev`:
```
Server is running on port 3000
```

---

## 🔑 Before Running Commands

Make sure `backend/.env` has these variables:

```env
POSTGRES_PRISMA_URL="postgresql://postgres.[REF]:[PASS]@...pooler.supabase.com:6543/postgres?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://postgres.[REF]:[PASS]@...pooler.supabase.com:5432/postgres"
```

Get these from: **Vercel Dashboard → Storage → Supabase**

---

## 🚀 Deploy to Vercel

```powershell
git add .
git commit -m "Migrate to PostgreSQL (Supabase)"
git push origin main
```

Vercel will automatically use Supabase environment variables from the Storage integration!

---

## 📚 Full Guide

See [POSTGRESQL_MIGRATION_GUIDE.md](POSTGRESQL_MIGRATION_GUIDE.md) for detailed explanation.
