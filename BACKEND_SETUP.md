# AURA Backend Setup Instructions

## 🎯 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web server framework
- `pg` - PostgreSQL client
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `concurrently` - Run frontend + backend together

### 2. Initialize Database
The database will be automatically initialized when you start the backend server. The schema includes:
- **users** table - Stores user accounts and progress
- **insights** table - Stores all career insights/tasks

### 3. Start the Application
```bash
npm run dev
```

This command runs both:
- **Frontend** on `http://localhost:3000`
- **Backend** on `http://localhost:3001`

## 📁 Backend Structure

```
backend/
├── server.js           # Main Express server
├── db.js              # PostgreSQL connection pool
├── schema.sql         # Database schema
├── routes/
│   ├── auth.js       # Login, signup, user progress
│   └── insights.js   # CRUD operations for insights
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Create new account
- `PUT /api/auth/progress` - Update user progress

### Insights
- `GET /api/insights/:username` - Get all user insights
- `POST /api/insights` - Create single insight
- `POST /api/insights/bulk` - Create multiple insights
- `PUT /api/insights/:id/status` - Update insight status

## 🗄️ Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- password (plain text - should be hashed in production!)
- has_onboarded
- growth_level
- readiness
- target_role
- created_at
- updated_at
```

### Insights Table
```sql
- id (UUID PRIMARY KEY)
- user_id (FOREIGN KEY)
- type ('success' | 'actionable' | 'gap')
- title
- description
- status ('active' | 'completed' | 'shared')
- mission_title
- mission_brief
- action_content
- timestamp
- created_at
```

## 🔐 Environment Variables

Configure in `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_postgres_connection_url_here
```

Get your credentials from:
- **Gemini API Key:** [Google AI Studio](https://aistudio.google.com/apikey)
- **Database URL:** Your Aiven PostgreSQL dashboard

## 🚀 What Changed

### From LocalStorage → PostgreSQL
- **Before:** All data stored in browser's localStorage
- **After:** All data persisted in PostgreSQL database on Aiven cloud

### Services Updated
- `authService.ts` - Now makes API calls instead of localStorage operations
- `App.tsx` - All functions now use async/await for API calls

### New Features
- Real database persistence
- Multi-device support (login from any device)
- Scalable architecture
- Production-ready setup

## ⚠️ Important Notes

1. **Password Security:** Passwords are currently stored in plain text. In production, use bcrypt to hash them.

2. **Session Management:** Currently using in-memory username. In production, implement JWT tokens.

3. **CORS:** Backend allows all origins. In production, restrict to your domain.

4. **Database Connection:** Using SSL with Aiven PostgreSQL. Connection is automatically managed by pg pool.

## 🐛 Troubleshooting
## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if database is accessible using your Aiven connection string
psql "YOUR_DATABASE_URL_FROM_ENV_FILE"
```

### Backend Not Starting
- Ensure port 3001 is available
- Check .env.local file exists
- Verify DATABASE_URL is correct

### Frontend Can't Reach Backend
- Check Vite proxy configuration in `vite.config.ts`
- Ensure backend is running on port 3001
- Check browser console for CORS errors

## ✅ Verification

After starting the app:
1. Open browser at `http://localhost:3000`
2. Create a new account (signup)
3. Complete onboarding
4. Check backend console - you should see SQL queries
5. Login from another browser/incognito - your data persists!

## 📊 Monitoring

Backend logs show:
- Database connection status
- SQL query execution
- API endpoint hits
- Errors and warnings

Look for:
- `✅ Connected to PostgreSQL database`
- `✅ Database schema initialized`
- `🚀 AURA Backend Server running on http://localhost:3001`
