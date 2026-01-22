# 🐘 SQLite to PostgreSQL Migration Guide

## ✅ Schema Updated

Your [schema.prisma](backend/prisma/schema.prisma) has been updated to use PostgreSQL with Supabase connection strings.

---

## 📋 Step-by-Step Migration

### **Step 1: Get Supabase Connection Strings**

1. Go to **Vercel Dashboard** → Your Project → **Storage** tab
2. Click on your **Supabase** integration
3. Copy the connection strings:
   - `POSTGRES_PRISMA_URL` (for pooling)
   - `POSTGRES_URL_NON_POOLING` (for migrations)

---

### **Step 2: Update Local Environment Variables**

Create/update `backend/.env` with your Supabase credentials:

```env
# Database - Supabase PostgreSQL
POSTGRES_PRISMA_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Other required variables
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key
GITHUB_TOKEN=your_github_token
NOTION_API_KEY=your_notion_api_key
FRONTEND_URL=http://localhost:5173
```

⚠️ **Replace `[PROJECT-REF]` and `[PASSWORD]` with your actual values from Vercel/Supabase.**

---

### **Step 3: Clean Up SQLite Artifacts**

Delete the following SQLite-related files/folders:

```bash
# Navigate to backend directory
cd backend

# Delete SQLite database file (if exists)
Remove-Item -ErrorAction SilentlyContinue dev.db
Remove-Item -ErrorAction SilentlyContinue prisma/dev.db

# Delete old migrations folder (SQLite migrations won't work with PostgreSQL)
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue prisma/migrations
```

**What we're deleting:**
- ❌ `dev.db` - SQLite database file
- ❌ `prisma/migrations/` - Old SQLite migrations

**What we're keeping:**
- ✅ `prisma/schema.prisma` - Already updated to PostgreSQL
- ✅ `prisma/migration_lock.toml` - Will be updated automatically

---

### **Step 4: Install PostgreSQL Client (if needed)**

Prisma already includes the PostgreSQL driver, but ensure dependencies are up to date:

```bash
cd backend
npm install
```

---

### **Step 5: Generate New Prisma Client**

Regenerate the Prisma Client for PostgreSQL:

```bash
npx prisma generate
```

This creates the new client that works with PostgreSQL instead of SQLite.

---

### **Step 6: Push Schema to Supabase**

Push your schema to the Supabase database:

```bash
npx prisma db push
```

**What this does:**
- Creates the `Review` table in your Supabase PostgreSQL database
- Updates the schema without creating migration files (good for prototyping)
- Uses `POSTGRES_URL_NON_POOLING` for the direct connection

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database

🚀  Your database is now in sync with your Prisma schema. Done in 2.45s
✔ Generated Prisma Client
```

---

### **Step 7: Verify Database Connection**

Test the connection:

```bash
npx prisma studio
```

This opens Prisma Studio (http://localhost:5555) where you can view your database tables.

---

## 🔄 Alternative: Use Migrations (Production-Ready)

If you want proper migration history (recommended for production):

```bash
# Create initial migration
npx prisma migrate dev --name init

# This will:
# 1. Create a new migrations/ folder
# 2. Generate SQL migration files
# 3. Apply migrations to database
# 4. Generate Prisma Client
```

---

## 🧪 Test Your Setup

### Test Backend Locally:

```bash
cd backend
npm run dev
```

### Test API Endpoint:
```bash
# PowerShell
Invoke-RestMethod -Uri http://localhost:3000/api/reviews -Method GET
```

---

## 🚀 Deploy to Vercel

Your Vercel deployment will automatically use the Supabase environment variables from the Storage integration.

**No additional configuration needed!** ✨

Just push your changes:

```bash
git add .
git commit -m "Migrate from SQLite to PostgreSQL (Supabase)"
git push origin main
```

---

## 📊 Key Differences: SQLite vs PostgreSQL

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| File location | Local `dev.db` | Cloud (Supabase) |
| Connection | File path | Connection string |
| Pooling | Not needed | Uses PgBouncer (`POSTGRES_PRISMA_URL`) |
| Migrations | Direct connection | Uses `POSTGRES_URL_NON_POOLING` |
| Auto-increment | `@default(autoincrement())` | Works the same |

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"
**Solution:** Check your connection strings in `.env` file. Ensure no extra spaces.

### Error: "SSL connection required"
**Solution:** Add `?sslmode=require` to connection string:
```
POSTGRES_URL_NON_POOLING="postgresql://...?sslmode=require"
```

### Error: "Database does not exist"
**Solution:** Supabase auto-creates the `postgres` database. Use exactly as shown in Vercel.

### Prisma Studio shows empty tables
**Solution:** This is normal for a fresh migration. Add test data via API or Studio.

---

## 📝 Summary

✅ **Updated:** `schema.prisma` → PostgreSQL provider  
✅ **Updated:** `.env.example` files with Supabase variables  
✅ **Cleaned:** SQLite artifacts (`dev.db`, old migrations)  
✅ **Generated:** New Prisma Client for PostgreSQL  
✅ **Pushed:** Schema to Supabase database  
✅ **Local Dev:** Connects directly to cloud database  
✅ **Vercel:** Uses automatic Supabase integration  

---

## 🎉 You're Done!

Your backend now uses **PostgreSQL (Supabase)** instead of SQLite. Both local development and production connect to the same cloud database.

**Next Steps:**
1. Run the migration commands above
2. Test locally with `npm run dev`
3. Deploy to Vercel with `git push`
