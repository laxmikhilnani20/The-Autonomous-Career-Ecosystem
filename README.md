# AURA - AI-Powered Career Growth Agent

> **📌 Version: v3.0 STABLE BUILD**  
> **Status:** ✅ Working - Premium UI with neumorphic design and enhanced visualizations  
> **Last Updated:** December 30, 2025  
> **Commit:** `e8da7b9` - Stable version with premium 2025 UI design

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🌟 Overview

AURA is an AI-powered career ecosystem visualization where your professional growth is a digital garden. Track skills, set goals, and receive AI-generated insights to advance your career.

**Version 3.0 Features:**
- ✅ User authentication (login required every session)
- ✅ PostgreSQL database for data persistence
- ✅ AI-powered resume analysis and insights
- ✅ Personalized growth metrics based on your profile
- ✅ Cross-device access (all data in cloud)
- ✅ Proper tab filtering - gaps in Strategy Checklist, wins in Live Feed
- ✅ Smart insight categorization
- ✅ Mission-based skill tracking with checklist
- ✨ **NEW:** Neumorphic light design on auth page with soft shadows
- ✨ **NEW:** Ethereal deep tones with radial gradient background
- ✨ **NEW:** Glassmorphism card surfaces with backdrop blur
- ✨ **NEW:** Dynamic SVG Skill Tree with growth stages
- ✨ **NEW:** Premium gradient progress bars (emerald-to-teal, amber-to-orange)
- ✨ **NEW:** AI-brain message types (Diagnostic, Growth, Proactive)
- ✨ **NEW:** Collapsible sidebar for better screen space
- ✨ **NEW:** Automatic duplicate cleanup system

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
