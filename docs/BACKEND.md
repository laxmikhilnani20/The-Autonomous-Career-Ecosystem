# Backend Structure

## Overview

AURA's backend is built on Vercel Serverless Functions with PostgreSQL database, providing a scalable and maintainable API layer for the application.

## Directory Structure

```
api/
├── auth/
│   ├── login.js          # User authentication
│   ├── signup.js         # User registration
│   └── progress.js       # Fetch user progress data
├── insights/
│   ├── [username].js     # Get insights by username
│   ├── create.js         # Create single insight
│   ├── bulk.js           # Bulk create insights
│   ├── status.js         # Update insight status
│   └── cleanup.js        # Remove duplicate insights
├── db.js                 # Database connection pool
└── init.js               # Database initialization

services/
├── auraService.ts        # AI service (Gemini integration)
└── authService.ts        # Authentication utilities
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  resume_filename VARCHAR(255),
  target_role VARCHAR(255),
  growth_level INTEGER DEFAULT 0,
  career_readiness INTEGER DEFAULT 0,
  phase VARCHAR(50) DEFAULT 'seedling',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_analysis TIMESTAMP
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `username`: Unique identifier for login
- `password_hash`: Encrypted password (plaintext in current version - upgrade to bcrypt recommended)
- `resume_filename`: Original resume file name
- `target_role`: User's career goal
- `growth_level`: 0-100 skill development score
- `career_readiness`: 0-100 readiness for target role
- `phase`: 'seedling' | 'blooming' | 'mature'
- `created_at`: Account creation timestamp
- `last_analysis`: Last AI analysis timestamp

### Insights Table
```sql
CREATE TABLE insights (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  mission_title VARCHAR(500),
  mission_brief TEXT,
  action_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `username`: User association (foreign key)
- `type`: 'gap' | 'success' | 'actionable'
- `title`: Short insight title
- `description`: Detailed explanation
- `status`: 'active' | 'completed'
- `mission_title`: Action item title
- `mission_brief`: Detailed action plan
- `action_content`: LinkedIn post draft
- `created_at`: Insight generation timestamp

**Indexes:**
- Primary key on `id`
- Foreign key on `username`
- Composite index recommended: `(username, type, created_at)`

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": { "username": "string" }
}
```

#### POST `/api/auth/login`
Authenticate existing user.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "username": "string",
    "resumeFilename": "string",
    "targetRole": "string",
    "growthLevel": 45,
    "careerReadiness": 60,
    "phase": "blooming"
  }
}
```

#### GET `/api/auth/progress?username=string`
Fetch user progress and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "string",
    "growthLevel": 45,
    "careerReadiness": 60,
    "phase": "blooming",
    "resumeFilename": "string",
    "targetRole": "string"
  }
}
```

### Insights Endpoints

#### GET `/api/insights/[username]`
Retrieve all insights for a user.

**Response:**
```json
{
  "insights": [
    {
      "id": "1",
      "type": "gap",
      "title": "string",
      "description": "string",
      "status": "active",
      "missionTitle": "string",
      "missionBrief": "string",
      "actionContent": "string",
      "createdAt": "2025-12-30T..."
    }
  ]
}
```

#### POST `/api/insights/create`
Create a single insight.

**Request:**
```json
{
  "username": "string",
  "insight": {
    "type": "gap",
    "title": "string",
    "description": "string",
    "missionTitle": "string",
    "missionBrief": "string",
    "actionContent": "string"
  }
}
```

#### POST `/api/insights/bulk`
Create multiple insights at once.

**Request:**
```json
{
  "username": "string",
  "insights": [
    { /* insight object */ },
    { /* insight object */ }
  ]
}
```

#### POST `/api/insights/status`
Update insight status.

**Request:**
```json
{
  "id": "1",
  "status": "completed"
}
```

#### POST `/api/insights/cleanup`
Remove duplicate insights for a user.

**Request:**
```json
{
  "username": "string"
}
```

### Database Initialization

#### GET `/api/init`
Initialize database tables (run once).

**Response:**
```json
{
  "success": true,
  "message": "Database initialized"
}
```

## Database Connection

### Connection Pool Configuration
```javascript
// api/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,                // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

### Best Practices
- Always use parameterized queries to prevent SQL injection
- Close connections after use
- Handle errors gracefully
- Use connection pooling for efficiency

## AI Service Layer

### Gemini Integration
```typescript
// services/auraService.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

// Model: gemini-3-flash-preview
```

### Key Functions

#### `analyzeResumeMetrics(fileName, targetRole)`
Analyzes career profile and returns growth metrics.

**Output:**
```typescript
{
  growthLevel: number,      // 0-100
  readiness: number,        // 0-100
  phase: 'seedling' | 'blooming' | 'mature'
}
```

#### `generateInitialRoadmap(fileName, targetRole)`
Generates initial insights for onboarding.

**Output:**
```typescript
Insight[] // Array of gap/success insights
```

#### `generateAIInsights(username)`
Generates comprehensive career insights.

**Output:**
```typescript
Insight[] // Gaps, wins, and actionable items
```

### AI Response Format
```typescript
interface Insight {
  type: 'gap' | 'success' | 'actionable';
  title: string;
  description: string;
  missionTitle?: string;
  missionBrief?: string;
  actionContent?: string;
}
```

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

### Common Error Codes
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid credentials)
- `404` - Not Found (user/insight doesn't exist)
- `409` - Conflict (duplicate username)
- `500` - Internal Server Error (database/AI failures)

## Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:port/dbname
GEMINI_API_KEY=your_gemini_api_key

# Optional (for development)
API_KEY=alias_for_GEMINI_API_KEY
```

## Data Validation

### Input Validation Rules
- Username: 3-50 characters, alphanumeric + underscore
- Password: Minimum 6 characters (upgrade to stricter rules recommended)
- Insight type: Must be 'gap', 'success', or 'actionable'
- Status: Must be 'active' or 'completed'

## Performance Considerations

### Query Optimization
- Use indexes on frequently queried columns
- Limit result sets with LIMIT clauses
- Use WHERE clauses to filter early
- Avoid SELECT * in production

### Caching Strategy (Recommended)
- Cache user progress data for 5 minutes
- Cache insights for 1 minute
- Invalidate cache on updates

## Security Best Practices

1. **Password Security**: Upgrade to bcrypt/argon2 hashing
2. **SQL Injection**: Always use parameterized queries
3. **API Keys**: Never expose in client code
4. **Rate Limiting**: Implement for production
5. **HTTPS Only**: Enforce SSL in production

## Deployment Checklist

- [ ] Set environment variables in Vercel
- [ ] Initialize database tables
- [ ] Test all API endpoints
- [ ] Verify AI service connectivity
- [ ] Check database connection limits
- [ ] Monitor error logs
- [ ] Set up database backups

## Future Enhancements

1. **Authentication**: JWT tokens, refresh tokens
2. **Database**: Migration system, indexes optimization
3. **Caching**: Redis for session management
4. **Monitoring**: APM tools, error tracking
5. **Testing**: Unit tests, integration tests
6. **API Versioning**: /api/v1/...
