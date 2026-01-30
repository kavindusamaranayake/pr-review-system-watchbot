#!/bin/sh
# Vercel build script that runs Prisma migrations

echo "🔧 Installing dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend && npm install

echo "🗄️ Generating Prisma Client..."
npx prisma generate

echo "🚀 Pushing database schema..."
npx prisma db push --skip-generate --accept-data-loss

echo "✅ Database setup complete!"

echo "🏗️ Building frontend..."
cd ../frontend && npm install && npm run build

echo "🎉 Build complete!"
