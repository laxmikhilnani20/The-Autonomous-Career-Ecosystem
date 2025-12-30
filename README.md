# AURA - AI-Powered Career Growth Agent

> **📌 Version: BASIC STABLE BUILD (v1.0)**  
> **Status:** ✅ Working - All core features functional  
> **Last Updated:** December 30, 2025  
> **Commit:** `e4281e8` - Stable baseline version with login-based sessions

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🌟 Overview

AURA is an AI-powered career ecosystem visualization where your professional growth is a digital garden. Track skills, set goals, and receive AI-generated insights to advance your career.

**This is the basic working version** with core functionality:
- ✅ User authentication (login required every session)
- ✅ PostgreSQL database for data persistence
- ✅ AI-powered resume analysis and insights
- ✅ Personalized growth metrics
- ✅ Cross-device access (all data in cloud)
- ✅ Mission-based skill tracking

## 🚀 Quick Start

### Local Development

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (create .env.local)
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_postgres_connection_url_here

# 3. Initialize database
npm run init-db

# 4. Start development servers
npm run dev
```

### Vercel Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete instructions.

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Vercel Serverless Functions
- **Database:** PostgreSQL (Aiven)
- **AI:** Google Gemini API
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## 📦 Features

- 🌱 **Growth Garden:** Visual representation of skill development
- 🎯 **North Star Goals:** Set and track career objectives
- 📊 **AI Insights:** Personalized gap analysis and recommendations
- ✅ **Mission Checklist:** Step-by-step action items
- 🏆 **Achievement Tracking:** Celebrate wins and progress

## 🔧 Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features |
| `DATABASE_URL` | PostgreSQL connection string |

## 📄 License

MIT License - feel free to use this project as you wish.
