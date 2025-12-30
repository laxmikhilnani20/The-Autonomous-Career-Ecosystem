# AURA - Complete Setup Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Database Configuration](#database-configuration)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up AURA, ensure you have:

| Requirement | Version | Installation Link |
|-------------|---------|-------------------|
| Node.js | 18.0.0+ | [nodejs.org](https://nodejs.org) |
| npm | 9.0.0+ | (Included with Node.js) |
| Git | Latest | [git-scm.com](https://git-scm.com) |
| PostgreSQL | 14.0+ | [postgresql.org](https://postgresql.org) or Aiven |

---

## Local Development Setup

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/laxmikhilnani20/The-Autonomous-Career-Ecosystem.git

# Navigate to project directory
cd The-Autonomous-Career-Ecosystem
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install
```

Expected output:
```
added 234 packages, and audited 235 packages in 15s
```

### Step 3: Create Environment File

Create a `.env.local` file in the root directory:

```bash
# Create environment file
touch .env.local
```

Add the following variables:
```env
# Required: Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Required: PostgreSQL Connection String
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Optional: Fallback API key
API_KEY=your_gemini_api_key_here
```

---

## Database Configuration

### Option 1: Aiven Cloud PostgreSQL (Recommended)

1. **Create Account**
   - Visit [Aiven.io](https://aiven.io)
   - Sign up for free tier (no credit card required)

2. **Create PostgreSQL Service**
   ```
   Service: PostgreSQL
   Plan: Hobbyist (Free)
   Cloud: Any region close to you
   ```

3. **Get Connection String**
   - Navigate to "Overview" tab
   - Copy "Service URI"
   - Add to `.env.local` as `DATABASE_URL`

4. **Initialize Database Tables**
   ```bash
   # Start dev server first
   npm run dev
   
   # Visit initialization endpoint
   curl http://localhost:5173/api/init
   ```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS with Homebrew
   brew install postgresql@14
   brew services start postgresql@14
   
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE aura_db;
   
   # Create user
   CREATE USER aura_user WITH PASSWORD 'your_password';
   
   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE aura_db TO aura_user;
   
   # Exit
   \q
   ```

3. **Configure Connection String**
   ```env
   DATABASE_URL=postgresql://aura_user:your_password@localhost:5432/aura_db
   ```

4. **Initialize Tables**
   ```bash
   npm run dev
   curl http://localhost:5173/api/init
   ```

---

## Environment Variables

### Required Variables

#### `GEMINI_API_KEY`
Your Gemini API key for AI-powered features.

**Format:**
```
GEMINI_API_KEY=AIzaSyD...your_key_here
```

#### `DATABASE_URL`
PostgreSQL connection string with SSL enabled.

**Format:**
```
DATABASE_URL=postgresql://user:pass@host:port/dbname?sslmode=require
```

**Example (Aiven):**
```
DATABASE_URL=postgresql://avnadmin:password@aura-db-12345.a.aivencloud.com:12345/defaultdb?sslmode=require
```

**Example (Local):**
```
DATABASE_URL=postgresql://aura_user:password@localhost:5432/aura_db
```

### Optional Variables

#### `API_KEY`
Fallback alias for `GEMINI_API_KEY`.

```
API_KEY=AIzaSyD...your_key_here
```

---

## Running the Application

### Development Mode

```bash
# Start Vite dev server
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Access the app:**
- Open browser: `http://localhost:5173`
- Login page should appear
- Create an account to get started

### Build for Production

```bash
# Create optimized production build
npm run build
```

Expected output:
```
vite v5.0.0 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-a1b2c3d4.js    345.67 kB
✓ built in 8.12s
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

---

## Production Deployment

### Vercel Deployment (Recommended)

#### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Import to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration

#### Step 3: Configure Environment Variables
In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables:
   ```
   GEMINI_API_KEY = your_key_here
   DATABASE_URL = your_postgres_connection
   ```
3. Apply to: Production, Preview, Development

#### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2 minutes)
3. Visit your deployed URL

#### Step 5: Initialize Database
```bash
# Visit initialization endpoint once
curl https://your-project.vercel.app/api/init
```

### Custom Domain (Optional)
1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-configured

---

## Troubleshooting

### Issue: Database Connection Failed

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Verify `DATABASE_URL` is correct
2. Check database service is running
3. Ensure SSL mode is enabled for cloud databases
4. Test connection:
   ```bash
   psql "postgresql://user:pass@host:port/dbname?sslmode=require"
   ```

---

### Issue: Gemini API Errors

**Symptoms:**
```
Error: API key not valid
```

**Solutions:**
1. Verify `GEMINI_API_KEY` is set correctly
2. Check for extra spaces in `.env.local`
3. Restart dev server after changing env variables
4. Test API key:
   ```bash
   curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY"
   ```

---

### Issue: Port Already in Use

**Symptoms:**
```
Error: Port 5173 is already in use
```

**Solutions:**
1. Kill existing process:
   ```bash
   # macOS/Linux
   lsof -ti:5173 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```
2. Or use different port:
   ```bash
   npm run dev -- --port 3000
   ```

---

### Issue: Build Errors

**Symptoms:**
```
TypeScript errors in production build
```

**Solutions:**
1. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```
2. Install missing dependencies:
   ```bash
   npm install
   ```
3. Clear cache and rebuild:
   ```bash
   rm -rf node_modules dist .vite
   npm install
   npm run build
   ```

---

### Issue: Vercel Deployment Failed

**Symptoms:**
```
Build failed with exit code 1
```

**Solutions:**
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Ensure `package.json` has correct build script:
   ```json
   {
     "scripts": {
       "build": "vite build"
     }
   }
   ```
4. Test build locally:
   ```bash
   npm run build
   ```

---

## Verification Checklist

After setup, verify everything works:

- [ ] Dev server starts without errors
- [ ] Database connection successful
- [ ] Can create new account (signup)
- [ ] Can login with credentials
- [ ] Can upload resume file
- [ ] AI generates initial insights
- [ ] Insights display in Live Feed
- [ ] Can mark insights as complete
- [ ] Profile sidebar shows stats
- [ ] No console errors in browser

---

## Next Steps

After successful setup:

1. **Explore Features**: Upload a resume and set your target role
2. **Review Insights**: Check AI-generated career advice
3. **Track Progress**: Update milestones and complete action items
4. **Customize**: Modify components to fit your needs
5. **Deploy**: Push to production on Vercel

---

## Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review logs in terminal/Vercel dashboard
3. Search [GitHub Issues](https://github.com/laxmikhilnani20/The-Autonomous-Career-Ecosystem/issues)
4. Create new issue with error details

---

## Quick Commands Reference

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Database
curl http://localhost:5173/api/init  # Initialize tables

# Git
git add .               # Stage changes
git commit -m "message" # Commit changes
git push origin main    # Push to GitHub

# Troubleshooting
lsof -ti:5173 | xargs kill -9  # Kill port process
rm -rf node_modules dist       # Clean install
npm install                     # Reinstall
```

---

**Setup Complete!** 🎉 Your AURA application is ready to use.
