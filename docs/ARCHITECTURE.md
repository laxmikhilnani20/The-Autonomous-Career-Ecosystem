# System Architecture

## Overview

AURA is a full-stack AI-powered career growth platform built with a modern serverless architecture. The application follows a client-server model with real-time AI processing and persistent data storage.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         React 19 + TypeScript + Vite                │   │
│  │  • Neumorphic UI Components                         │   │
│  │  • State Management (React Hooks)                   │   │
│  │  • Real-time Updates                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   API LAYER (Vercel)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Serverless Functions (Node.js)              │   │
│  │  • /api/auth/* - Authentication endpoints           │   │
│  │  • /api/insights/* - AI insights management         │   │
│  │  • /api/init.js - Database initialization           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                    ↕                        ↕
          ┌─────────────────┐      ┌─────────────────┐
          │   PostgreSQL    │      │  Gemini API     │
          │   (Aiven)       │      │  (Google)       │
          │  • User Data    │      │  • AI Analysis  │
          │  • Insights     │      │  • Insights     │
          │  • Progress     │      │  • Roadmaps     │
          └─────────────────┘      └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 19.2.3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js (Serverless)
- **Platform**: Vercel Serverless Functions
- **Database**: PostgreSQL (Aiven)
- **ORM**: Raw SQL queries with pg library
- **AI**: Google Gemini 3 Flash Preview

### Infrastructure
- **Hosting**: Vercel
- **Database**: Aiven (Cloud PostgreSQL)
- **CDN**: Vercel Edge Network
- **SSL**: Automatic (Vercel)

## Data Flow

### 1. User Authentication Flow
```
User Input → Login/Signup API → PostgreSQL
                ↓
          Validate Credentials
                ↓
          Return User Data → Store in State → Navigate to App
```

### 2. Resume Analysis Flow
```
File Upload → Onboarding Component
                ↓
          Extract filename & target role
                ↓
          Gemini API Analysis
                ↓
          Parse JSON Response
                ↓
          Store in PostgreSQL → Display Initial Metrics
```

### 3. AI Insights Generation Flow
```
User Profile + Progress Data
                ↓
          Gemini API (Structured Output)
                ↓
          Generate Insights (Gaps, Wins, Actions)
                ↓
          Bulk Insert to PostgreSQL
                ↓
          Update UI with Live Feed
```

### 4. Progress Tracking Flow
```
User Interaction (Mark Complete/Add Milestone)
                ↓
          Update API Endpoint
                ↓
          PostgreSQL Update
                ↓
          Return Updated Data → Re-render Components
```

## Security Model

### Authentication
- Password hashing (bcrypt recommended for production)
- Session-based authentication
- Username-based access control

### API Security
- Environment variable protection (API keys)
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- CORS configuration

### Data Privacy
- User data isolation by username
- No cross-user data access
- Secure database connections (SSL)

## Scalability Considerations

### Current Architecture
- **Serverless Functions**: Auto-scaling with Vercel
- **Database**: Connection pooling with pg
- **AI Processing**: Sequential (one user at a time)

### Future Enhancements
- **Caching**: Redis for session management
- **Queue System**: Background job processing for AI
- **CDN**: Static asset optimization
- **Database**: Read replicas for scaling reads

## Design Patterns

### Frontend Patterns
- **Component Composition**: Reusable UI components
- **Container/Presenter**: Separation of logic and UI
- **Hooks Pattern**: Custom hooks for shared logic
- **Prop Drilling**: Minimal via direct state management

### Backend Patterns
- **RESTful API**: Standard HTTP methods
- **Error Handling**: Try-catch with fallbacks
- **Timeout Protection**: 30s timeout on AI requests
- **Graceful Degradation**: Fallback data on failures

## Performance Optimization

### Frontend
- Lazy loading components
- Memoization of expensive computations
- Debouncing user inputs
- Optimistic UI updates

### Backend
- Connection pooling (max 10 connections)
- Query optimization (indexed columns)
- Timeout handling for external APIs
- Response compression

## Monitoring & Observability

### Logs
- Console logging for debugging
- Error tracking in production
- API request/response logging

### Metrics (Recommended)
- API response times
- Database query performance
- AI generation success rate
- User engagement metrics

## Deployment Architecture

```
GitHub Repository
        ↓
   Git Push (main branch)
        ↓
   Vercel Auto-Deploy
        ↓
   Build Process (Vite)
        ↓
   Deploy to Edge Network
        ↓
   Live at: the-autonomous-career-ecosystem.vercel.app
```

## Environment Configuration

### Development
- Local Vite dev server
- Environment variables via `.env.local`
- Hot module replacement

### Production
- Vercel build optimization
- Environment variables via Vercel dashboard
- Edge caching enabled

## Database Schema Design

See [BACKEND.md](./BACKEND.md) for detailed schema documentation.

## API Design

See [API.md](./API.md) for complete API reference.
