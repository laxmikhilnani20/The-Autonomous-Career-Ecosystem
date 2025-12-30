# AURA - AI-Powered Career Growth Agent 🌱

<div align="center">

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-stable-success.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

**[Live Demo](https://the-autonomous-career-ecosystem.vercel.app/) • [Documentation](./docs) • [Report Bug](https://github.com/laxmikhilnani20/The-Autonomous-Career-Ecosystem/issues) • [Request Feature](https://github.com/laxmikhilnani20/The-Autonomous-Career-Ecosystem/issues)**

</div>

<div align="center">
<img width="1200" height="475" alt="AURA Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

---

## 🌟 What is AURA?

**AURA** (Autonomous Universal Resume Architect) is an intelligent career growth platform that transforms your professional journey into a living digital garden. Powered by Google's Gemini AI, AURA analyzes your resume, identifies skill gaps, celebrates wins, and provides personalized roadmaps to reach your dream role.

### ✨ Why AURA?

- 🎯 **AI-Powered Insights**: Get personalized career advice from Gemini 3 Flash
- 🌱 **Visual Growth Tracking**: Watch your career bloom with dynamic skill trees
- 📊 **Smart Gap Analysis**: Identify exactly what skills you need to level up
- 🚀 **Actionable Roadmaps**: Step-by-step plans to reach your target role
- 🎨 **Beautiful UI**: Premium neumorphic design with soft shadows and gradients
- ☁️ **Cloud Sync**: Access your data anywhere, anytime

---

## 🚀 Live Demo

**Try it now:** [https://the-autonomous-career-ecosystem.vercel.app/](https://the-autonomous-career-ecosystem.vercel.app/)

**Demo Credentials:**
- Create your own account
- Upload any resume (PDF/DOC/DOCX)
- Set your target role
- Watch AURA analyze your career path!

---

## 🎯 Key Features

### 🤖 AI-Powered Analysis
- **Resume Parsing**: Upload your resume and let Gemini AI extract key insights
- **Skill Gap Detection**: Identifies missing skills for your target role
- **Career Readiness Score**: 0-100 metric showing preparedness
- **Growth Level Tracking**: Visualize your career progression

### 🌳 Growth Garden Visualization
- **Dynamic Skill Tree**: Animated SVG that grows with your progress
- **Three Growth Phases**: Seedling → Blooming → Mature
- **Real-time Updates**: Watch your garden flourish as you complete goals

### 📋 Smart Insights System
- **Success Insights**: Celebrate your achievements with LinkedIn-ready posts
- **Gap Insights**: Identify areas for improvement with actionable plans
- **Actionable Items**: Quick wins and immediate next steps
- **Auto-categorization**: Insights organized into Live Feed and Strategy Checklist

### 🗺️ Personalized Roadmap
- **Step-by-step Plans**: Numbered action items to reach your goal
- **Progress Tracking**: Monitor completion percentage per task
- **Priority Ordering**: Focus on high-impact activities first
- **Mission Briefs**: Detailed action plans for each insight

### 💼 Profile Management
- **Resume Uploads**: Drag-and-drop file management
- **Achievement Tracking**: Add certifications and course completions
- **Progress Dashboard**: View growth metrics at a glance
- **Cross-device Sync**: Access from anywhere with cloud storage

### 🎨 Premium Design (v4.0)
- **Neumorphic UI**: Soft shadows and elevated surfaces
- **Light Color Palette**: Easy on the eyes with blue/purple gradients
- **Responsive Layout**: Perfect on desktop, tablet, and mobile
- **Smooth Animations**: Delightful micro-interactions throughout

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19.2.3 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling system |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Vercel Serverless | API functions |
| PostgreSQL (Aiven) | Database |
| Node.js | Runtime |
| pg | Database driver |

### AI & Services
| Service | Purpose |
|---------|---------|
| Google Gemini 3 Flash | AI insights generation |
| Vercel Edge Network | Content delivery |
| SSL/HTTPS | Security |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Aiven account)
- Google Gemini API key

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/laxmikhilnani20/The-Autonomous-Career-Ecosystem.git
   cd The-Autonomous-Career-Ecosystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Initialize database**
   ```bash
   npm run init-db
   ```
   
   Or manually visit: `http://localhost:5173/api/init`

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Fork/clone this repository**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables**
   - Add `GEMINI_API_KEY`
   - Add `DATABASE_URL`

4. **Deploy**
   - Vercel will auto-deploy on every push to main
   - Your app will be live at `your-project.vercel.app`

5. **Initialize database**
   - Visit `your-project.vercel.app/api/init` once

For detailed deployment instructions, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture and design patterns |
| [BACKEND.md](./docs/BACKEND.md) | Backend structure and database schema |
| [API.md](./docs/API.md) | Complete API reference |
| [FEATURES.md](./docs/FEATURES.md) | Detailed feature documentation |

---

## 🎨 Design System (v4.0)

AURA uses a custom neumorphic design language with the following principles:

### Color Palette
```css
/* Backgrounds */
--bg-primary: linear-gradient(to bottom right, #f5f5f5, #f9fafb, #dbeafe);
--bg-card: #f5f5f5;

/* Gradients */
--gradient-primary: linear-gradient(to right, #60a5fa, #a78bfa);
--gradient-success: linear-gradient(to right, #10b981, #14b8a6);

/* Text */
--text-primary: #1f2937;
--text-secondary: #4b5563;
--text-muted: #6b7280;
```

### Shadow System
```css
/* Elevated (cards) */
box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;

/* Hover state */
box-shadow: 6px 6px 16px #bebebe, -6px -6px 16px #ffffff;

/* Inset (inputs) */
box-shadow: inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff;
```

---

## 🗂️ Project Structure

```
AURA/
├── api/                      # Serverless API functions
│   ├── auth/                 # Authentication endpoints
│   │   ├── login.js
│   │   ├── signup.js
│   │   └── progress.js
│   ├── insights/             # Insights management
│   │   ├── [username].js
│   │   ├── create.js
│   │   ├── bulk.js
│   │   ├── status.js
│   │   └── cleanup.js
│   ├── db.js                 # Database connection
│   └── init.js               # Database initialization
│
├── components/               # React components
│   ├── ActionModal.tsx       # Insight detail modal
│   ├── Auth.tsx              # Login/signup page
│   ├── Garden.tsx            # Growth visualization
│   ├── Insights.tsx          # Live feed component
│   ├── Milestone.tsx         # Goal tracking
│   ├── Onboarding.tsx        # New user flow
│   ├── Roadmap.tsx           # Strategy checklist
│   └── Sidebar.tsx           # User profile & uploads
│
├── services/                 # Business logic
│   ├── auraService.ts        # AI service layer
│   └── authService.ts        # Auth utilities
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md
│   ├── BACKEND.md
│   ├── API.md
│   └── FEATURES.md
│
├── App.tsx                   # Main app component
├── index.tsx                 # Entry point
├── types.ts                  # TypeScript definitions
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `API_KEY` | Alias for GEMINI_API_KEY (fallback) | No |

### Getting API Keys

**Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and add to environment variables

**PostgreSQL Database:**
1. Sign up at [Aiven](https://aiven.io) (free tier available)
2. Create a PostgreSQL service
3. Copy connection string
4. Add to environment variables

---

## 🧪 Usage Examples

### 1. Create an Account
```typescript
// Navigate to signup page
// Enter username and password
// Click "Create Account"

POST /api/auth/signup
{
  "username": "johndoe",
  "password": "securepass"
}
```

### 2. Upload Resume
```typescript
// Drag and drop resume file
// Set target role: "Senior Software Engineer"
// AI analyzes and generates initial roadmap

// Behind the scenes:
const metrics = await analyzeResumeMetrics(filename, targetRole);
const insights = await generateInitialRoadmap(filename, targetRole);
```

### 3. View Insights
```typescript
// Navigate to Live Feed tab
// See success insights and actionable items
// Click insight to open detailed view

GET /api/insights/johndoe
```

### 4. Complete Action Items
```typescript
// Click "Mark as Complete"
// Insight moves to completed state
// Progress updates automatically

POST /api/insights/status
{
  "id": "42",
  "status": "completed"
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add TypeScript types for new features
- Test thoroughly before submitting PR
- Update documentation for new features

---

## 🐛 Known Issues

- [ ] Password hashing not implemented (plaintext storage - **upgrade recommended**)
- [ ] No rate limiting on API endpoints
- [ ] Limited error handling for network failures
- [ ] No data export functionality yet

See [Issues](https://github.com/laxmikhilnani20/The-Autonomous-Career-Ecosystem/issues) for full list.

---

## 🗺️ Roadmap

### v4.1 (Q1 2026)
- [ ] JWT authentication
- [ ] Password hashing with bcrypt
- [ ] Rate limiting
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

### v5.0 (Q2 2026)
- [ ] Team collaboration features
- [ ] Mentor matching system
- [ ] Interview preparation AI
- [ ] Job board integration
- [ ] Mobile app (React Native)

### v6.0 (Q3 2026)
- [ ] Premium subscriptions
- [ ] Advanced analytics dashboard
- [ ] Industry benchmarks
- [ ] Certification tracking
- [ ] Salary insights

---

## 📊 Performance

| Metric | Target | Current |
|--------|--------|---------|
| Initial Load | < 2s | ~1.8s |
| API Response | < 500ms | ~350ms |
| AI Generation | < 30s | ~15s |
| Database Query | < 200ms | ~150ms |

---

## 🔒 Security

AURA takes security seriously:

- ✅ HTTPS encryption for all traffic
- ✅ SQL injection prevention (parameterized queries)
- ✅ Environment variable protection
- ✅ User data isolation
- ⚠️ **Needs Improvement**: Password hashing, rate limiting

For security issues, please email: [your-email@example.com]

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Laxmi Khilnani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👏 Acknowledgments

- **Google Gemini AI** for powering intelligent insights
- **Vercel** for seamless deployment and hosting
- **Aiven** for reliable PostgreSQL database
- **Lucide** for beautiful icon library
- **Tailwind CSS** for rapid UI development

---

## 📞 Contact & Support

- **Live Demo**: [https://the-autonomous-career-ecosystem.vercel.app/](https://the-autonomous-career-ecosystem.vercel.app/)
- **GitHub**: [@laxmikhilnani20](https://github.com/laxmikhilnani20)
- **Issues**: [Report a bug](https://github.com/laxmikhilnani20/The-Autonomous-Career-Ecosystem/issues)
- **Email**: [your-email@example.com]

---

## ⭐ Star History

If you find AURA helpful, please consider giving it a star on GitHub! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=laxmikhilnani20/The-Autonomous-Career-Ecosystem&type=Date)](https://star-history.com/#laxmikhilnani20/The-Autonomous-Career-Ecosystem&Date)

---

<div align="center">

**Made with ❤️ by [Laxmi Khilnani](https://github.com/laxmikhilnani20)**

*Transform your career journey into a blooming digital garden* 🌱

[⬆ Back to top](#aura---ai-powered-career-growth-agent-)

</div>
