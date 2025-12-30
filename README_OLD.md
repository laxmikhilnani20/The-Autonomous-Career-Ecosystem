# AURA - AI-Powered Career Growth Agent

> **📌 Version: v4.0 STABLE BUILD**  
> **Status:** ✅ Working - Complete neumorphic light design transformation  
> **Last Updated:** December 30, 2025  
> **Commit:** `06385c6` - Complete application redesigned with neumorphic aesthetic

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🌟 Overview

AURA is an AI-powered career ecosystem visualization where your professional growth is a digital garden. Track skills, set goals, and receive AI-generated insights to advance your career.

**Version 4.0 Features:**
- ✅ **Complete neumorphic light design** across all components
- ✅ Soft shadow system with depth and elevation
- ✅ Blue/purple gradient color scheme
- ✅ Light gray backgrounds with dark text for readability
- ✅ Consistent card styling with rounded corners
- ✅ User authentication (login required every session)
- ✅ PostgreSQL database for data persistence
- ✅ AI-powered resume analysis and insights
- ✅ Personalized growth metrics based on your profile
- ✅ Cross-device access (all data in cloud)
- ✅ Proper tab filtering - gaps in Strategy Checklist, wins in Live Feed
- ✅ Smart insight categorization
- ✅ Mission-based skill tracking with checklist
- ✅ Dynamic SVG Skill Tree with growth stages
- ✅ Premium gradient progress bars
- ✅ AI-brain message types (Diagnostic, Growth, Proactive)
- ✅ Collapsible sidebar for better screen space
- ✅ Automatic duplicate cleanup system

### v4.0 Design System
- **Background:** `bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50`
- **Cards:** `bg-gray-100` with `shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]`
- **Inset Elements:** `shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]`
- **Hover States:** `hover:shadow-[6px_6px_16px_#bebebe,-6px_-6px_16px_#ffffff]`
- **Primary Gradients:** `from-blue-400 to-purple-400`, `from-purple-500 to-blue-500`
- **Typography:** `text-gray-800` (headings), `text-gray-600` (body)

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
