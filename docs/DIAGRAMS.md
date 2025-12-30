# AURA - Data Flow & System Diagrams

## Table of Contents
- [System Overview](#system-overview)
- [User Journey Flow](#user-journey-flow)
- [Authentication Flow](#authentication-flow)
- [Resume Analysis Flow](#resume-analysis-flow)
- [AI Insights Generation Flow](#ai-insights-generation-flow)
- [Data Models](#data-models)
- [Component Hierarchy](#component-hierarchy)
- [API Request Flow](#api-request-flow)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │         │
│  │   Browser    │  │   Browser    │  │   Browser    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                     HTTPS (TLS 1.3)                             │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Global CDN & Load Balancer                   │  │
│  │   • SSL Termination                                       │  │
│  │   • DDoS Protection                                       │  │
│  │   • Geographic Routing                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
┌───────▼──────────┐                    ┌────────▼────────┐
│  FRONTEND        │                    │  API LAYER      │
│  (React + Vite)  │                    │  (Serverless)   │
│                  │                    │                 │
│  • App.tsx       │◄──────JSON───────►│  • /auth/*      │
│  • Components    │                    │  • /insights/*  │
│  • Services      │                    │  • /init        │
│  • State Mgmt    │                    │                 │
└──────────────────┘                    └────────┬────────┘
                                                 │
                        ┌────────────────────────┴──────────────┐
                        │                                       │
                 ┌──────▼─────────┐                   ┌────────▼────────┐
                 │  PostgreSQL     │                   │   Gemini API    │
                 │  (Aiven Cloud)  │                   │  (Google Cloud) │
                 │                 │                   │                 │
                 │  • Users        │                   │  • AI Analysis  │
                 │  • Insights     │                   │  • Generation   │
                 │  • Progress     │                   │  • Structured   │
                 └─────────────────┘                   └─────────────────┘
```

---

## User Journey Flow

### Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      START: User Visits App                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Has Account?   │
                    └────┬──────┬─────┘
                         │      │
                    Yes  │      │  No
                         │      │
            ┌────────────▼      ▼────────────┐
            │                                 │
        ┌───▼────┐                      ┌────▼─────┐
        │ LOGIN  │                      │  SIGNUP  │
        │ Page   │                      │  Page    │
        └───┬────┘                      └────┬─────┘
            │                                │
            │  Credentials                   │  New User Info
            │                                │
            └────────────┬───────────────────┘
                         │
                         │  Authentication
                         │
                ┌────────▼──────────┐
                │  Auth Successful?  │
                └────┬──────┬────────┘
                     │      │
                 Yes │      │ No (Error)
                     │      │
                     │      └──────► Show Error ──┐
                     │                            │
            ┌────────▼──────────┐                │
            │  First Time User? │                │
            └────┬──────┬────────┘                │
                 │      │                         │
            Yes  │      │  No                     │
                 │      │                         │
      ┌──────────▼      └─────────┐              │
      │                            │              │
┌─────▼──────┐            ┌───────▼────────┐     │
│ ONBOARDING │            │  MAIN APP      │     │
│  Flow      │            │  Dashboard     │     │
└─────┬──────┘            └───────┬────────┘     │
      │                           │              │
      │                           │              │
┌─────▼──────────────────┐        │              │
│  Step 1: Upload Resume │        │              │
│  • Drag & Drop         │        │              │
│  • File Selection      │        │              │
└─────┬──────────────────┘        │              │
      │                           │              │
      │  File Uploaded            │              │
      │                           │              │
┌─────▼──────────────────┐        │              │
│  Step 2: Set Goal      │        │              │
│  • Target Role Input   │        │              │
│  • Career Objective    │        │              │
└─────┬──────────────────┘        │              │
      │                           │              │
      │  Submit                   │              │
      │                           │              │
┌─────▼──────────────────┐        │              │
│  AI Analysis           │        │              │
│  • Resume Parsing      │        │              │
│  • Metrics Calculation │        │              │
│  • Initial Insights    │        │              │
└─────┬──────────────────┘        │              │
      │                           │              │
      │  Complete                 │              │
      │                           │              │
      └───────────────────────────┘              │
                 │                               │
                 │  Redirect                     │
                 │                               │
        ┌────────▼────────────────┐              │
        │     MAIN DASHBOARD      │◄─────────────┘
        │                         │
        │  ┌───────────────────┐ │
        │  │  Sidebar          │ │
        │  │  • Profile        │ │
        │  │  • Uploads        │ │
        │  │  • Logout         │ │
        │  └───────────────────┘ │
        │                         │
        │  ┌───────────────────┐ │
        │  │  Tabs             │ │
        │  │  • Live Feed      │ │
        │  │  • Strategy List  │ │
        │  └───────────────────┘ │
        │                         │
        │  ┌───────────────────┐ │
        │  │  Growth Garden    │ │
        │  │  • Skill Tree     │ │
        │  │  • Metrics        │ │
        │  └───────────────────┘ │
        │                         │
        │  ┌───────────────────┐ │
        │  │  Milestone Tracker│ │
        │  │  • Goals          │ │
        │  │  • Progress       │ │
        │  └───────────────────┘ │
        │                         │
        │  ┌───────────────────┐ │
        │  │  AI Insights      │ │
        │  │  • Gaps           │ │
        │  │  • Wins           │ │
        │  │  • Actions        │ │
        │  └───────────────────┘ │
        └─────────┬───────────────┘
                  │
                  │  User Actions:
                  │  • Mark Complete
                  │  • Add Milestone
                  │  • Upload Files
                  │  • View Details
                  │
        ┌─────────▼───────────────┐
        │  ACTION MODAL           │
        │  • Full Details         │
        │  • Mission Brief        │
        │  • LinkedIn Post        │
        │  • Complete/Undo        │
        └─────────┬───────────────┘
                  │
                  │  Continue Using
                  │
                  └──────► Back to Dashboard
```

---

## Authentication Flow

### Detailed Auth Sequence

```
┌──────────┐            ┌──────────┐            ┌──────────┐
│  Client  │            │   API    │            │ Database │
│ (React)  │            │(Vercel)  │            │  (Aiven) │
└────┬─────┘            └────┬─────┘            └────┬─────┘
     │                       │                       │
     │  1. User enters       │                       │
     │     credentials       │                       │
     │                       │                       │
     │  2. POST /auth/login  │                       │
     ├──────────────────────►│                       │
     │  {username, password} │                       │
     │                       │                       │
     │                       │  3. Query user        │
     │                       ├──────────────────────►│
     │                       │  SELECT * FROM users  │
     │                       │  WHERE username = ?   │
     │                       │                       │
     │                       │  4. User data         │
     │                       │◄──────────────────────┤
     │                       │  {id, username, ...}  │
     │                       │                       │
     │                       │  5. Validate password │
     │                       │  (compare hashes)     │
     │                       │                       │
     │                       ├──┐                    │
     │                       │  │ Check credentials  │
     │                       │◄─┘                    │
     │                       │                       │
     │  6. Success response  │                       │
     │◄──────────────────────┤                       │
     │  {success, user}      │                       │
     │                       │                       │
     │  7. Store user state  │                       │
     ├──┐                    │                       │
     │  │ setState(user)     │                       │
     │◄─┘                    │                       │
     │                       │                       │
     │  8. Navigate to app   │                       │
     ├──┐                    │                       │
     │  │ setIsAuthenticated │                       │
     │◄─┘                    │                       │
     │                       │                       │
     │  9. Render Dashboard  │                       │
     │                       │                       │
```

### Signup Flow

```
User Input              API Layer               Database
    │                       │                       │
    │  username: "john"     │                       │
    │  password: "pass123"  │                       │
    │                       │                       │
    ├───POST /auth/signup──►│                       │
    │                       │                       │
    │                       ├───Check existing──────►│
    │                       │   username            │
    │                       │                       │
    │                       │◄──────Result──────────┤
    │                       │   (none found)        │
    │                       │                       │
    │                       ├───INSERT new user─────►│
    │                       │   (username, hash)    │
    │                       │                       │
    │                       │◄──────Success─────────┤
    │                       │   (user created)      │
    │                       │                       │
    │◄───Success response───┤                       │
    │   {success: true}     │                       │
    │                       │                       │
    ├───Auto-login──────────►│                       │
    │                       │                       │
```

---

## Resume Analysis Flow

### AI-Powered Resume Processing

```
┌───────────────────────────────────────────────────────────────┐
│                  RESUME UPLOAD & ANALYSIS                      │
└───────────────────────────────────────────────────────────────┘

User Action                  Frontend               Backend                 AI Service
     │                          │                      │                         │
     │  1. Drag resume file     │                      │                         │
     │  onto dropzone           │                      │                         │
     ├─────────────────────────►│                      │                         │
     │                          │                      │                         │
     │                          │  2. Extract metadata │                         │
     │                          │     • filename       │                         │
     │                          │     • file type      │                         │
     │                          │     • file size      │                         │
     │                          │                      │                         │
     │  3. Input target role    │                      │                         │
     │     "Senior Engineer"    │                      │                         │
     ├─────────────────────────►│                      │                         │
     │                          │                      │                         │
     │  4. Click "Continue"     │                      │                         │
     ├─────────────────────────►│                      │                         │
     │                          │                      │                         │
     │                          │  5. Call API         │                         │
     │                          ├─────────────────────►│                         │
     │                          │  analyzeResumeMetrics│                         │
     │                          │  (filename, role)    │                         │
     │                          │                      │                         │
     │                          │                      │  6. Generate prompt     │
     │                          │                      ├────────────────────────►│
     │                          │                      │  "Analyze: john.pdf     │
     │                          │                      │   Target: Senior Eng"   │
     │                          │                      │                         │
     │                          │                      │  7. AI Processing       │
     │                          │                      │     • Parse filename    │
     │                          │                      │     • Infer experience  │
     │                          │                      │     • Match to role     │
     │                          │                      │     • Calculate scores  │
     │                          │                      │                         │
     │                          │                      │  8. Structured JSON     │
     │                          │                      │◄────────────────────────┤
     │                          │                      │  {                      │
     │                          │                      │    growthLevel: 65,     │
     │                          │                      │    readiness: 70,       │
     │                          │                      │    phase: "mature"      │
     │                          │                      │  }                      │
     │                          │                      │                         │
     │                          │  9. Store metrics    │                         │
     │                          │◄─────────────────────┤                         │
     │                          │  Update database     │                         │
     │                          │                      │                         │
     │                          │  10. Generate        │                         │
     │                          │      initial roadmap │                         │
     │                          │─────────────────────►│                         │
     │                          │                      │                         │
     │                          │                      │  11. Create insights    │
     │                          │                      ├────────────────────────►│
     │                          │                      │  "Generate 3-5 insights"│
     │                          │                      │                         │
     │                          │                      │  12. Insights array     │
     │                          │                      │◄────────────────────────┤
     │                          │                      │  [{type, title, ...}]   │
     │                          │                      │                         │
     │                          │  13. Bulk insert     │                         │
     │                          │      insights        │                         │
     │                          │◄─────────────────────┤                         │
     │                          │                      │                         │
     │  14. Navigate to app     │                      │                         │
     │◄─────────────────────────┤                      │                         │
     │  Show growth garden      │                      │                         │
     │  Display insights        │                      │                         │
     │                          │                      │                         │
```

---

## AI Insights Generation Flow

### Periodic Insight Generation

```
┌─────────────────────────────────────────────────────────────────┐
│              AI INSIGHTS GENERATION WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

Trigger                  Service Layer           Gemini API              Database
  │                          │                        │                      │
  │  User requests           │                        │                      │
  │  new insights            │                        │                      │
  ├─────────────────────────►│                        │                      │
  │                          │                        │                      │
  │                          │  1. Fetch user data    │                      │
  │                          ├────────────────────────────────────────────────►│
  │                          │  SELECT * FROM users   │                      │
  │                          │  WHERE username = ?    │                      │
  │                          │                        │                      │
  │                          │  2. User profile       │                      │
  │                          │◄────────────────────────────────────────────────┤
  │                          │  {growthLevel,         │                      │
  │                          │   targetRole, etc}     │                      │
  │                          │                        │                      │
  │                          │  3. Fetch existing     │                      │
  │                          │     insights           │                      │
  │                          ├────────────────────────────────────────────────►│
  │                          │                        │                      │
  │                          │  4. Insights data      │                      │
  │                          │◄────────────────────────────────────────────────┤
  │                          │  [{id, type, title}]   │                      │
  │                          │                        │                      │
  │                          │  5. Build AI prompt    │                      │
  │                          │  with context          │                      │
  │                          │                        │                      │
  │                          │  6. Generate insights  │                      │
  │                          ├───────────────────────►│                      │
  │                          │  POST /generateContent │                      │
  │                          │  {                     │                      │
  │                          │    model: gemini-3,    │                      │
  │                          │    prompt: "...",      │                      │
  │                          │    schema: {...}       │                      │
  │                          │  }                     │                      │
  │                          │                        │                      │
  │                          │                        │  7. AI Processing    │
  │                          │                        │  • Analyze profile   │
  │                          │                        │  • Identify gaps     │
  │                          │                        │  • Find strengths    │
  │                          │                        │  • Create actions    │
  │                          │                        │  • Write posts       │
  │                          │                        │                      │
  │                          │  8. Structured response│                      │
  │                          │◄───────────────────────┤                      │
  │                          │  {                     │                      │
  │                          │    insights: [         │                      │
  │                          │      {                 │                      │
  │                          │        type: "gap",    │                      │
  │                          │        title: "...",   │                      │
  │                          │        description...  │                      │
  │                          │      },                │                      │
  │                          │      {...}             │                      │
  │                          │    ]                   │                      │
  │                          │  }                     │                      │
  │                          │                        │                      │
  │                          │  9. Cleanup duplicates │                      │
  │                          ├────────────────────────────────────────────────►│
  │                          │  DELETE duplicates     │                      │
  │                          │  by title              │                      │
  │                          │                        │                      │
  │                          │  10. Bulk insert new   │                      │
  │                          ├────────────────────────────────────────────────►│
  │                          │  INSERT INTO insights  │                      │
  │                          │  (...values...)        │                      │
  │                          │                        │                      │
  │                          │  11. Confirmation      │                      │
  │                          │◄────────────────────────────────────────────────┤
  │                          │  {insertedCount: N}    │                      │
  │                          │                        │                      │
  │  12. Refresh UI          │                        │                      │
  │◄─────────────────────────┤                        │                      │
  │  Display new insights    │                        │                      │
  │                          │                        │                      │
```

---

## Data Models

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS TABLE                             │
├────────────────────┬────────────────────────────────────────┤
│ PK  id             │ INTEGER (Auto-increment)               │
│ UQ  username       │ VARCHAR(255) UNIQUE NOT NULL           │
│     password_hash  │ VARCHAR(255) NOT NULL                  │
│     resume_filename│ VARCHAR(255)                           │
│     target_role    │ VARCHAR(255)                           │
│     growth_level   │ INTEGER (0-100) DEFAULT 0              │
│     career_readiness│ INTEGER (0-100) DEFAULT 0             │
│     phase          │ VARCHAR(50) DEFAULT 'seedling'         │
│     created_at     │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
│     last_analysis  │ TIMESTAMP                              │
└────────────────────┴────────────────────────────────────────┘
                             │
                             │ 1:N relationship
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    INSIGHTS TABLE                            │
├────────────────────┬────────────────────────────────────────┤
│ PK  id             │ INTEGER (Auto-increment)               │
│ FK  username       │ VARCHAR(255) NOT NULL                  │
│     type           │ VARCHAR(50) NOT NULL                   │
│                    │   • 'gap'                              │
│                    │   • 'success'                          │
│                    │   • 'actionable'                       │
│     title          │ VARCHAR(500) NOT NULL                  │
│     description    │ TEXT                                   │
│     status         │ VARCHAR(50) DEFAULT 'active'           │
│                    │   • 'active'                           │
│                    │   • 'completed'                        │
│     mission_title  │ VARCHAR(500)                           │
│     mission_brief  │ TEXT                                   │
│     action_content │ TEXT                                   │
│     created_at     │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP    │
└────────────────────┴────────────────────────────────────────┘
          │
          │ Foreign Key Constraint
          │ ON DELETE CASCADE
          │
          └──────────────► REFERENCES users(username)
```

### Data Flow Through System

```
┌──────────────┐
│  User Input  │
└──────┬───────┘
       │
       │  Resume File + Target Role
       │
       ▼
┌──────────────┐
│  Frontend    │  Extract: filename, targetRole
│  Processing  │  State: isProcessing = true
└──────┬───────┘
       │
       │  API Call: analyzeResumeMetrics()
       │
       ▼
┌──────────────┐
│   Gemini AI  │  Analyze → growthLevel, readiness, phase
│   Service    │  Output: Structured JSON
└──────┬───────┘
       │
       │  Metrics Object
       │
       ▼
┌──────────────┐
│  PostgreSQL  │  INSERT/UPDATE users table
│  Database    │  Store metrics with username
└──────┬───────┘
       │
       │  Success confirmation
       │
       ▼
┌──────────────┐
│  Frontend    │  Update UI state
│  State       │  Display growth garden
└──────────────┘  Show metrics
```

---

## Component Hierarchy

### React Component Tree

```
App.tsx (Root)
│
├─ Auth.tsx (Conditional)
│  ├─ Login Form
│  └─ Signup Form
│
├─ Onboarding.tsx (Conditional, First-time users)
│  ├─ Step 1: Resume Upload
│  │  ├─ File Drop Zone
│  │  └─ File Preview
│  └─ Step 2: Goal Setting
│     ├─ Target Role Input
│     └─ Submit Button
│
└─ Main App (Authenticated)
   │
   ├─ Sidebar.tsx
   │  ├─ User Profile Card
   │  │  ├─ Username Display
   │  │  └─ Stats (Growth, Readiness)
   │  ├─ Resume Upload Zone
   │  ├─ Achievement Upload Zone
   │  ├─ Processing Indicator
   │  └─ Logout Button
   │
   ├─ Tab Navigation
   │  ├─ Live Feed Tab
   │  └─ Strategy Checklist Tab
   │
   ├─ Content Area
   │  │
   │  ├─ Garden.tsx
   │  │  ├─ Growth Level Display
   │  │  ├─ Skill Tree SVG
   │  │  │  ├─ Tree Base
   │  │  │  ├─ Trunk Animation
   │  │  │  ├─ Branches
   │  │  │  └─ Leaves/Blooms
   │  │  └─ Career Readiness Bar
   │  │
   │  ├─ Milestone.tsx
   │  │  ├─ Target Role Display
   │  │  ├─ Resume Info
   │  │  ├─ Milestones List
   │  │  │  ├─ Milestone Item
   │  │  │  │  ├─ Title
   │  │  │  │  ├─ Progress Bar
   │  │  │  │  └─ Complete Button
   │  │  │  └─ [...]
   │  │  └─ Add Milestone Button
   │  │
   │  ├─ Insights.tsx (Live Feed Tab)
   │  │  ├─ Insight Cards
   │  │  │  ├─ AI Badge
   │  │  │  ├─ Title
   │  │  │  ├─ Description
   │  │  │  ├─ Status Indicator
   │  │  │  └─ Click Handler → ActionModal
   │  │  └─ Empty State
   │  │
   │  └─ Roadmap.tsx (Strategy Checklist Tab)
   │     ├─ Roadmap Items
   │     │  ├─ Number Circle
   │     │  ├─ Title
   │     │  ├─ Progress Bar
   │     │  ├─ Checkbox
   │     │  └─ Click Handler → ActionModal
   │     └─ Empty State
   │
   └─ ActionModal.tsx (Overlay)
      ├─ Header
      │  ├─ Type Badge
      │  ├─ Status Indicator
      │  └─ Close Button
      ├─ Content
      │  ├─ Overview Section
      │  ├─ Action Plan Section
      │  │  └─ Mission Brief
      │  └─ LinkedIn Post Section
      │     ├─ Post Draft
      │     └─ Copy Button
      └─ Footer Actions
         ├─ Close Button
         ├─ Mark Complete Button
         └─ Undo Button (if completed)
```

---

## API Request Flow

### Complete Request Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    API REQUEST LIFECYCLE                         │
└─────────────────────────────────────────────────────────────────┘

Client              Vercel Edge         API Function        Database/AI
  │                     │                    │                   │
  │  1. User action     │                    │                   │
  │  (e.g., login)      │                    │                   │
  │                     │                    │                   │
  │  2. Fetch request   │                    │                   │
  ├────────────────────►│                    │                   │
  │  POST /api/auth/    │                    │                   │
  │  login              │                    │                   │
  │  {username, pwd}    │                    │                   │
  │                     │                    │                   │
  │                     │  3. Route to       │                   │
  │                     │     function       │                   │
  │                     ├───────────────────►│                   │
  │                     │                    │                   │
  │                     │                    │  4. Parse request │
  │                     │                    │  body             │
  │                     │                    │                   │
  │                     │                    │  5. Validate      │
  │                     │                    │  input            │
  │                     │                    │                   │
  │                     │                    │  6. Query DB/AI   │
  │                     │                    ├──────────────────►│
  │                     │                    │  Execute action   │
  │                     │                    │                   │
  │                     │                    │  7. Result        │
  │                     │                    │◄──────────────────┤
  │                     │                    │  Data/Error       │
  │                     │                    │                   │
  │                     │                    │  8. Format        │
  │                     │                    │  response         │
  │                     │                    │                   │
  │                     │  9. HTTP response  │                   │
  │                     │◄───────────────────┤                   │
  │                     │  {success, data}   │                   │
  │                     │                    │                   │
  │  10. Response       │                    │                   │
  │◄────────────────────┤                    │                   │
  │  JSON payload       │                    │                   │
  │                     │                    │                   │
  │  11. Parse & update │                    │                   │
  │  state              │                    │                   │
  │                     │                    │                   │
  │  12. Re-render UI   │                    │                   │
  │                     │                    │                   │
```

### Error Handling Flow

```
Request → API Function
            │
            ├─ Try Block
            │   ├─ Parse input
            │   ├─ Validate data
            │   ├─ Execute query
            │   └─ Return success
            │
            └─ Catch Block
                ├─ Log error
                ├─ Classify error type
                │   ├─ 400: Bad Request
                │   ├─ 401: Unauthorized
                │   ├─ 404: Not Found
                │   ├─ 409: Conflict
                │   └─ 500: Server Error
                │
                └─ Return error response
                    {
                      error: "Message",
                      details: "Context"
                    }

Client receives error
    ├─ Display to user
    ├─ Log to console (dev)
    └─ Track in analytics (prod)
```

---

**This document provides comprehensive visual representations of AURA's data flows and system architecture.**

For implementation details, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [BACKEND.md](./BACKEND.md)
- [API.md](./API.md)
