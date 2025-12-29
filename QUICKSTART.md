# 🚀 Quick Start Guide - AURA with Backend

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Initialize Database
```bash
npm run init-db
```

This will:
- ✅ Test connection to PostgreSQL
- ✅ Create users table
- ✅ Create insights table
- ✅ Set up indexes and triggers

## Step 3: Start the Application
```bash
npm run dev
```

This starts:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

## 🎯 What to Expect

### First Time Setup
1. Backend connects to PostgreSQL on Aiven
2. Frontend loads at localhost:3000
3. You'll see the login/signup screen

### Creating an Account
1. Click "Sign Up"
2. Enter username and password
3. Account is saved to PostgreSQL database

### Onboarding
1. Upload your resume (any file)
2. Set your target role (e.g., "Senior Developer")
3. AI generates 3 personalized gap insights
4. All data saved to database

### Using the App
- **Upload Resume** → Discovers skill gaps
- **Share Achievement** → Celebrates your wins
- **Complete Tasks** → Increases readiness score
- **Set Goals** → Updates your North Star

## 📊 Database Structure

Your PostgreSQL database now has:
- **users** - All user accounts and progress
- **insights** - All career tasks and achievements

## 🔧 Troubleshooting

### "Cannot connect to database"
Run the init script to test connection:
```bash
npm run init-db
```

### "Port 3000 already in use"
Change port in `vite.config.ts`

### "Port 3001 already in use"
Change port in `backend/server.js`

## ✅ Success Indicators

You should see:
```
✅ Connected to PostgreSQL database
✅ Database schema initialized
🚀 AURA Backend Server running on http://localhost:3001
```

Then visit http://localhost:3000 and start using AURA!
