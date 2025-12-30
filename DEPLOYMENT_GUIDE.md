# 🚀 Vercel Deployment Guide

## Critical Setup Steps

### 1. Add Environment Variables in Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these two variables:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | Your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) |
| `DATABASE_URL` | Your PostgreSQL connection URL from Aiven |

**Important:** After adding, click **"Redeploy"** to apply the changes.

### 2. Initialize Database

After deployment succeeds, visit this URL **once**:

```
https://your-app-name.vercel.app/api/init
```

You should see:
```json
{"success":true,"message":"Database schema initialized successfully"}
```

### 3. Test Your App

Visit:
```
https://your-app-name.vercel.app
```

You should see the login screen.

## Troubleshooting

### "Environment variable not found"
- Make sure you added both `GEMINI_API_KEY` and `DATABASE_URL` in Vercel settings
- Click "Redeploy" after adding variables

### "relation does not exist"
- Visit `/api/init` to create database tables

### "Could not connect to database"
- Check that `DATABASE_URL` is correct
- Ensure Aiven database is running

### "API key invalid"
- Verify `GEMINI_API_KEY` is set correctly

## App Structure

- Frontend: React + Vite (Static Site)
- Backend: Vercel Serverless Functions (`/api/*`)
- Database: Aiven PostgreSQL
- AI: Google Gemini API
