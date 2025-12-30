# API Reference

Complete API documentation for AURA backend endpoints.

## Base URL

**Development**: `http://localhost:5173/api`  
**Production**: `https://the-autonomous-career-ecosystem.vercel.app/api`

## Authentication

Currently using session-based authentication with username/password. JWT implementation recommended for production.

---

## Endpoints

### Authentication

#### `POST /api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "username": "johndoe"
  }
}
```

**Error Response (409):**
```json
{
  "error": "Username already exists"
}
```

**Error Response (400):**
```json
{
  "error": "Username and password required"
}
```

---

#### `POST /api/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "username": "johndoe",
    "resumeFilename": "john_resume.pdf",
    "targetRole": "Senior Software Engineer",
    "growthLevel": 65,
    "careerReadiness": 75,
    "phase": "mature"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

#### `GET /api/auth/progress`

Fetch user progress and metrics.

**Query Parameters:**
- `username` (required): User identifier

**Example:**
```
GET /api/auth/progress?username=johndoe
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "username": "johndoe",
    "growthLevel": 65,
    "careerReadiness": 75,
    "phase": "mature",
    "resumeFilename": "john_resume.pdf",
    "targetRole": "Senior Software Engineer",
    "lastAnalysis": "2025-12-30T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "User not found"
}
```

---

### Insights

#### `GET /api/insights/[username]`

Retrieve all insights for a specific user.

**URL Parameters:**
- `username`: User identifier

**Example:**
```
GET /api/insights/johndoe
```

**Success Response (200):**
```json
{
  "insights": [
    {
      "id": "1",
      "type": "success",
      "title": "JavaScript Expertise Recognized",
      "description": "Your 5+ years of JavaScript experience is a strong foundation...",
      "status": "active",
      "missionTitle": "Showcase Your Skills",
      "missionBrief": "Create a LinkedIn post highlighting...",
      "actionContent": "🚀 Excited to share my journey with JavaScript...",
      "createdAt": "2025-12-30T10:00:00Z"
    },
    {
      "id": "2",
      "type": "gap",
      "title": "System Design Knowledge Gap",
      "description": "To advance to senior roles, distributed systems expertise is crucial...",
      "status": "active",
      "missionTitle": "Master System Design",
      "missionBrief": "Study distributed systems patterns...",
      "actionContent": null,
      "createdAt": "2025-12-30T10:01:00Z"
    }
  ]
}
```

---

#### `POST /api/insights/create`

Create a single insight for a user.

**Request Body:**
```json
{
  "username": "johndoe",
  "insight": {
    "type": "actionable",
    "title": "Update LinkedIn Profile",
    "description": "Your LinkedIn profile needs optimization for recruiter visibility.",
    "missionTitle": "Profile Optimization",
    "missionBrief": "1. Add 'Senior Engineer' to headline\n2. Update summary with keywords\n3. Request recommendations",
    "actionContent": "LinkedIn profile tip: Always include your target role in your headline!"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "insightId": "42"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid insight data"
}
```

---

#### `POST /api/insights/bulk`

Create multiple insights at once (optimized for AI-generated batches).

**Request Body:**
```json
{
  "username": "johndoe",
  "insights": [
    {
      "type": "gap",
      "title": "TypeScript Proficiency",
      "description": "TypeScript is essential for modern frontend development...",
      "missionTitle": "Learn TypeScript",
      "missionBrief": "Complete TypeScript course...",
      "actionContent": null
    },
    {
      "type": "success",
      "title": "React Mastery",
      "description": "Your React skills are impressive...",
      "missionTitle": "Share Your Knowledge",
      "missionBrief": "Write a blog post...",
      "actionContent": "Blog post draft..."
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "insertedCount": 2
}
```

**Error Response (400):**
```json
{
  "error": "Insights array required"
}
```

---

#### `POST /api/insights/status`

Update the status of an insight (mark as complete/undo).

**Request Body:**
```json
{
  "id": "42",
  "status": "completed"
}
```

**Valid Status Values:**
- `"active"`: Insight is pending/in-progress
- `"completed"`: Insight is finished

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (404):**
```json
{
  "error": "Insight not found"
}
```

---

#### `POST /api/insights/cleanup`

Remove duplicate insights for a user (based on title matching).

**Request Body:**
```json
{
  "username": "johndoe"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Duplicates removed",
  "deletedCount": 5
}
```

**Error Response (400):**
```json
{
  "error": "Username required"
}
```

---

### Database

#### `GET /api/init`

Initialize database tables (run once during setup).

**No Parameters Required**

**Success Response (200):**
```json
{
  "success": true,
  "message": "Database tables initialized successfully"
}
```

**Error Response (500):**
```json
{
  "error": "Database initialization failed",
  "details": "Table 'users' already exists"
}
```

**⚠️ Warning**: This endpoint should be protected in production or removed after initial setup.

---

## Error Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Invalid credentials |
| 404 | Not Found | User or resource doesn't exist |
| 409 | Conflict | Duplicate username or data |
| 500 | Server Error | Database or AI service failure |

---

## Rate Limiting

**Current**: No rate limiting implemented  
**Recommended for Production**:
- 100 requests/minute per IP
- 1000 requests/hour per user
- Stricter limits on AI endpoints (5/minute)

---

## CORS Configuration

**Development**: Allows all origins  
**Production**: Restricted to Vercel domain

```javascript
// Recommended production CORS
headers: {
  'Access-Control-Allow-Origin': 'https://the-autonomous-career-ecosystem.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

---

## Response Times

**Target SLAs:**
- Auth endpoints: < 500ms
- Insight retrieval: < 300ms
- AI generation: < 30s (with timeout)
- Database queries: < 200ms

---

## Versioning

**Current Version**: v4.0  
**API Version**: Unversioned (all endpoints at `/api/*`)

**Future**: Consider implementing `/api/v1/` for breaking changes

---

## Testing

### Example cURL Requests

**Login:**
```bash
curl -X POST https://the-autonomous-career-ecosystem.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"pass123"}'
```

**Get Insights:**
```bash
curl https://the-autonomous-career-ecosystem.vercel.app/api/insights/johndoe
```

**Create Insight:**
```bash
curl -X POST https://the-autonomous-career-ecosystem.vercel.app/api/insights/create \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "insight": {
      "type": "actionable",
      "title": "Test Insight",
      "description": "Test description"
    }
  }'
```

---

## Webhook Support (Planned)

Future feature for real-time notifications:

```json
POST /api/webhooks/insights
{
  "event": "insight.created",
  "username": "johndoe",
  "insightId": "42",
  "timestamp": "2025-12-30T10:00:00Z"
}
```

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Validate all inputs** before database queries
3. **Use parameterized queries** to prevent SQL injection
4. **Implement JWT** for stateless authentication
5. **Add rate limiting** to prevent abuse
6. **Log failed attempts** for security monitoring
7. **Never expose API keys** in client code
8. **Hash passwords** with bcrypt (upgrade needed)

---

## Support

For API issues or questions:
- GitHub Issues: [Repository Link]
- Documentation: `/docs` folder
- Contact: [Your Email/Contact]
