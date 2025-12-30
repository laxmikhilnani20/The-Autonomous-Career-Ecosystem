# Features Documentation

## Overview

AURA is an AI-powered career growth platform that visualizes your professional journey as a digital garden. This document details all features and their usage.

## Core Features

### 1. User Authentication

**Description**: Secure login system to protect user data and enable cross-device access.

**Features:**
- Username/password authentication
- Account creation (signup)
- Session persistence
- User profile storage

**Usage:**
1. Navigate to the login page
2. Enter credentials or create new account
3. Access persists until logout

**Benefits:**
- Data privacy and security
- Access from any device
- Personalized experience

---

### 2. Resume Analysis

**Description**: AI-powered resume analysis that extracts career insights and sets initial metrics.

**Features:**
- Drag-and-drop file upload
- Automatic filename extraction
- AI-driven skill assessment
- Growth level calculation
- Career readiness scoring

**Workflow:**
1. Upload resume file (PDF/DOC/DOCX)
2. Set target role (e.g., "Senior Software Engineer")
3. AI analyzes profile
4. Receive initial metrics and roadmap

**AI Analysis Output:**
- **Growth Level** (0-100): Overall career development
- **Career Readiness** (0-100): Preparedness for target role
- **Phase**: seedling/blooming/mature

**Example:**
```
Resume: "john_doe_resume.pdf"
Target: "Product Manager"
→ Growth Level: 65
→ Readiness: 70
→ Phase: mature
```

---

### 3. Growth Garden Visualization

**Description**: Visual representation of career development using an animated skill tree.

**Features:**
- Dynamic SVG skill tree
- Growth stage animations
- Real-time metric updates
- Phase-based visuals

**Growth Stages:**
- **Seedling** (0-33): Early career, learning foundations
- **Blooming** (34-66): Active skill development
- **Mature** (67-100): Experienced professional

**Visual Elements:**
- Animated tree growing with progress
- Color gradients reflecting growth
- Branch complexity increasing with level

---

### 4. North Star Goals

**Description**: Set and track career objectives with milestone management.

**Features:**
- Target role display
- Resume reference
- Milestone tracking
- Progress bars
- Add/complete milestones

**Milestone Structure:**
- Title: Goal name
- Progress: 0-100%
- Status: active/completed
- Visual progress indicators

**Usage:**
```
1. View current target role
2. Add milestone: "Complete React certification"
3. Track progress with slider
4. Mark complete when done
```

---

### 5. AI-Powered Insights (Live Feed)

**Description**: Real-time AI-generated career insights tailored to your profile.

**Insight Types:**

#### a) Success Insights (Wins)
- **Badge**: Green "BRAIN OUTPUT"
- **Purpose**: Celebrate achievements
- **Content**: Skills to showcase
- **Action**: LinkedIn post draft
- **Tab**: Live Feed (Wins)

**Example:**
```
Title: "JavaScript Mastery"
Description: Your 5 years of JS experience...
LinkedIn Post: "Excited to share my journey..."
```

#### b) Gap Insights
- **Badge**: Purple "BRAIN OUTPUT"
- **Purpose**: Identify skill gaps
- **Content**: Areas to develop
- **Action**: Learning roadmap
- **Tab**: Strategy Checklist (Gaps)

**Example:**
```
Title: "System Design Gap"
Description: For senior roles, you need...
Mission: "Study distributed systems..."
```

#### c) Actionable Insights
- **Badge**: Blue "BRAIN OUTPUT"
- **Purpose**: Immediate actions
- **Content**: Quick wins
- **Action**: Step-by-step plan
- **Tab**: Both (based on context)

---

### 6. Strategy Checklist (Roadmap)

**Description**: Step-by-step action plan to reach your target role.

**Features:**
- Numbered action items
- Progress tracking per item
- Completion checkboxes
- Priority ordering
- Gap focus

**Roadmap Structure:**
```
1. ▢ Master React Hooks (0%)
2. ▢ Build portfolio project (0%)
3. ☑ Complete LinkedIn profile (100%)
```

**Usage:**
1. View generated roadmap
2. Click item to see details
3. Update progress as you work
4. Check off completed items

---

### 7. Action Modal

**Description**: Detailed view of insights with action plans and LinkedIn drafts.

**Features:**
- Full insight description
- Mission brief (action plan)
- LinkedIn post draft
- Copy-to-clipboard function
- Mark as complete
- Undo completion

**Modal Sections:**
- **Overview**: Detailed explanation
- **Action Plan**: Step-by-step guide
- **Share on LinkedIn**: Pre-written post

**Status Management:**
- Active → Completed
- Completed → Undo to Active

---

### 8. Sidebar (Profile & Uploads)

**Description**: User profile management and file upload hub.

**Features:**

#### Profile Card
- Username display
- Growth level stat
- Career readiness stat
- Visual progress indicators

#### Resume Management
- Current resume display
- Drag-and-drop re-upload
- File name preview
- Processing status indicator

#### Achievement Uploads
- Add certifications
- Upload course completions
- Track learning milestones
- File management

#### Logout
- Secure session termination
- Return to login page

---

### 9. Tab Filtering System

**Description**: Smart categorization of insights across tabs.

**Filter Rules:**

#### Live Feed Tab
- Shows: Success insights (wins)
- Shows: Actionable items (urgent)
- Hides: Gap insights
- **Purpose**: Celebrate achievements, take action

#### Strategy Checklist Tab
- Shows: Gap insights (areas to improve)
- Shows: Roadmap items
- Hides: Success insights
- **Purpose**: Plan and execute growth

---

### 10. Automatic Duplicate Prevention

**Description**: System prevents duplicate insights from cluttering your feed.

**Features:**
- Title-based deduplication
- Automatic cleanup on new generation
- Maintains latest insights only
- SQL-based duplicate removal

**How It Works:**
```
1. AI generates new insights
2. System checks for existing titles
3. Removes older duplicates
4. Inserts only unique insights
```

---

## Design System (v4.0)

### Neumorphic Light Design

**Visual Features:**
- Soft shadow depth effects
- Light gray backgrounds
- Blue/purple gradients
- Rounded corners
- Inset shadows for inputs
- Elevated shadows for cards

**Color Palette:**
- Background: `#f5f5f5` → `#e8f0fe` gradient
- Cards: `#f5f5f5`
- Primary: Blue (`#60a5fa`) to Purple (`#a78bfa`)
- Success: Emerald (`#10b981`)
- Text: Dark gray (`#1f2937`)

**Shadow System:**
- Cards: `8px 8px 16px #bebebe, -8px -8px 16px #ffffff`
- Hover: `6px 6px 16px #bebebe, -6px -6px 16px #ffffff`
- Inset: `inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff`

---

## User Workflows

### Complete Onboarding Flow
```
1. Create account (signup)
2. Upload resume
3. Set target role
4. AI analyzes profile
5. Receive initial insights
6. Enter main application
```

### Daily Usage Flow
```
1. Login to account
2. Check Live Feed for wins
3. Review Strategy Checklist
4. Update roadmap progress
5. Complete action items
6. Mark insights as done
```

### Growth Tracking Flow
```
1. Upload new achievements
2. AI generates updated insights
3. Review new gaps/wins
4. Update milestones
5. Track progress metrics
6. Celebrate completions
```

---

## AI-Powered Features

### Gemini 3 Flash Integration

**Model**: `gemini-3-flash-preview`

**Capabilities:**
- Resume analysis
- Skill gap detection
- Career advice generation
- LinkedIn post writing
- Action plan creation
- Personalized recommendations

**Input Data:**
- Resume filename
- Target role
- Current skills
- Career history
- User progress

**Output Format:**
- Structured JSON
- Type-safe responses
- Consistent schema
- Fallback handling

---

## Mobile Responsiveness

**Adaptive Features:**
- Collapsible sidebar
- Responsive grid layouts
- Touch-friendly buttons
- Mobile-optimized modals
- Swipe gestures support

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## Performance Features

### Optimization
- Lazy loading components
- Debounced user inputs
- Optimistic UI updates
- Connection pooling
- Response caching (planned)

### Timeout Protection
- AI requests: 30s max
- Database queries: 2s timeout
- API responses: Graceful failures
- Fallback data provided

---

## Accessibility

**Current Features:**
- Semantic HTML
- Keyboard navigation
- Focus indicators
- Color contrast compliant
- Screen reader friendly labels

**Future Enhancements:**
- ARIA labels
- Voice commands
- High contrast mode
- Font size controls

---

## Data Privacy

**User Data Protection:**
- Isolated user data
- No cross-user access
- Secure password storage
- Database encryption (SSL)
- No third-party data sharing

**AI Processing:**
- No data retention by Gemini
- Real-time processing only
- No training on user data
- Privacy-first architecture

---

## Future Feature Roadmap

### Phase 2 (Q1 2026)
- [ ] Team collaboration
- [ ] Mentor matching
- [ ] Skill assessments
- [ ] Interview prep AI
- [ ] Job board integration

### Phase 3 (Q2 2026)
- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] API webhooks

### Phase 4 (Q3 2026)
- [ ] Premium subscriptions
- [ ] Advanced AI models
- [ ] Industry benchmarks
- [ ] Certification tracking
- [ ] Salary insights
