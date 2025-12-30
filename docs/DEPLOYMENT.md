# AURA - Deployment Guide

## Table of Contents
- [Deployment Overview](#deployment-overview)
- [Vercel Deployment](#vercel-deployment)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Steps](#post-deployment-steps)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Rollback Procedures](#rollback-procedures)

---

## Deployment Overview

AURA is optimized for deployment on **Vercel**, a serverless platform that provides:

- ✅ Automatic deployments from Git
- ✅ Serverless function support
- ✅ Global CDN distribution
- ✅ Automatic SSL certificates
- ✅ Preview deployments for PRs
- ✅ Zero-config for Vite projects

### Architecture

```
GitHub Repository (main branch)
        ↓ (push trigger)
    Vercel Build
        ↓
    Production Deployment
        ↓
    the-autonomous-career-ecosystem.vercel.app
        ↓ (optional)
    Custom Domain
```

---

## Vercel Deployment

### Prerequisites

- GitHub account with AURA repository
- Vercel account (free tier available)
- PostgreSQL database (Aiven recommended)
- Gemini API key

### Step-by-Step Deployment

#### 1. Prepare Repository

Ensure your code is ready:

```bash
# Commit all changes
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

Verify `package.json` has correct scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 2. Import to Vercel

**Via Vercel Dashboard:**

1. Visit [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub account
4. Choose `The-Autonomous-Career-Ecosystem` repository
5. Vercel auto-detects configuration:
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `vite build`
   - Output Directory: `dist`

6. Click "Deploy" (will fail due to missing env variables)

**Via Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts
# Set up and deploy: Y
# Link to existing project: N
# Project name: aura-career-growth
# Directory: ./
# Deploy: Y
```

#### 3. Configure Environment Variables

In Vercel Dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add the following:

| Variable | Value | Environment |
|----------|-------|-------------|
| `GEMINI_API_KEY` | Your Gemini API key | Production, Preview |
| `DATABASE_URL` | PostgreSQL connection string | Production, Preview |

3. Click **Save**

**Example:**
```
GEMINI_API_KEY=AIzaSyD...your_key
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
```

#### 4. Trigger Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **...** menu on latest deployment
3. Select **Redeploy**
4. Check "Use existing Build Cache"
5. Click **Redeploy**

Build will complete in ~2-3 minutes.

#### 5. Initialize Database

Once deployed, initialize database tables:

```bash
# Replace with your actual deployment URL
curl https://your-project.vercel.app/api/init
```

Expected response:
```json
{
  "success": true,
  "message": "Database tables initialized successfully"
}
```

#### 6. Verify Deployment

Visit your deployment URL and test:
- [ ] Login page loads
- [ ] Can create account
- [ ] Can login
- [ ] Can upload resume
- [ ] AI generates insights
- [ ] No console errors

---

## Environment Configuration

### Production Environment Variables

#### Required Variables

```env
# Gemini AI API Key
GEMINI_API_KEY=AIzaSyD...your_actual_key

# PostgreSQL Connection (Aiven format)
DATABASE_URL=postgresql://avnadmin:password@aura-db.a.aivencloud.com:12345/defaultdb?sslmode=require
```

#### Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use different keys** for development/production
3. **Rotate keys periodically** (every 90 days)
4. **Restrict API key access** in cloud console
5. **Enable SSL** for database connections

---

## Post-Deployment Steps

### 1. Health Check

Test all critical endpoints:

```bash
# Base URL
export BASE_URL="https://your-project.vercel.app"

# Test auth signup
curl -X POST $BASE_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Test auth login
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Test insights fetch
curl $BASE_URL/api/insights/testuser
```

### 2. Performance Monitoring

Check deployment metrics in Vercel:
- **Build Time**: Should be < 3 minutes
- **Function Duration**: Should be < 10s for API calls
- **Bandwidth**: Monitor for unexpected spikes
- **Error Rate**: Should be < 1%

### 3. Set Up Alerts (Optional)

Vercel Pro features:
- Email notifications for failed deployments
- Slack integration for deploy updates
- Custom webhook alerts

---

## Domain Configuration

### Add Custom Domain

1. **Purchase Domain** (e.g., from Namecheap, GoDaddy)

2. **Add to Vercel**:
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter: `yourdomain.com`
   - Click "Add"

3. **Configure DNS**:

Vercel provides these DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Add these to your domain registrar's DNS settings.

4. **Verify Domain**:
   - Wait 5-10 minutes for DNS propagation
   - Vercel automatically issues SSL certificate
   - Your app will be live at `yourdomain.com`

### SSL Certificate

- ✅ Automatically provisioned by Vercel
- ✅ Auto-renewal enabled
- ✅ Supports custom domains
- ✅ Forces HTTPS redirect

---

## Monitoring & Maintenance

### Vercel Analytics

Enable in Project Settings → Analytics:
- Page views
- Unique visitors  
- Top pages
- Geographic data
- Device breakdown

### Log Viewing

**Real-time Logs:**
```bash
# Install Vercel CLI
vercel logs

# Follow logs
vercel logs --follow
```

**Dashboard Logs:**
1. Go to Deployments → Select deployment
2. Click "View Function Logs"
3. Filter by:
   - Time range
   - Function name
   - Status code

### Error Tracking (Recommended)

Integrate error tracking service:

**Sentry Setup:**
```bash
npm install @sentry/react @sentry/vite-plugin
```

Add to `vite.config.ts`:
```typescript
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default {
  plugins: [
    sentryVitePlugin({
      org: "your-org",
      project: "aura"
    })
  ]
};
```

---

## Rollback Procedures

### Option 1: Instant Rollback (Vercel Dashboard)

1. Go to **Deployments** tab
2. Find last working deployment
3. Click **...** menu
4. Select **Promote to Production**
5. Confirm rollback

Previous version goes live in ~30 seconds.

### Option 2: Git Revert

```bash
# Find commit to revert to
git log --oneline

# Revert to specific commit
git revert <commit-hash>

# Push to trigger deployment
git push origin main
```

### Option 3: Branch Rollback

```bash
# Create rollback branch from working commit
git checkout -b rollback/<version> <commit-hash>

# Push to production
git push origin rollback/<version>

# In Vercel, change Production Branch to rollback/<version>
```

---

## Continuous Deployment

### Automatic Deployments

Every `git push` to `main` triggers:
1. ✅ Automatic build
2. ✅ Run tests (if configured)
3. ✅ Deploy to production
4. ✅ Invalidate CDN cache

### Preview Deployments

Every Pull Request gets:
- Unique preview URL
- Independent environment
- Same env variables as production
- Automatic cleanup after merge

**Preview URL Format:**
```
https://aura-career-<branch>-<username>.vercel.app
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Environment variables configured
- [ ] Database migration complete
- [ ] Build succeeds locally (`npm run build`)
- [ ] `.env.local` not committed
- [ ] Dependencies updated (`npm audit fix`)
- [ ] README updated with latest changes
- [ ] API endpoints tested
- [ ] UI components responsive

After deployment:

- [ ] Health check passes
- [ ] Database initialized
- [ ] Can create account
- [ ] Can login
- [ ] AI features working
- [ ] No console errors
- [ ] Performance acceptable
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)

---

## Troubleshooting Deployments

### Build Fails

**Error: "Command failed with exit code 1"**

Check build logs for:
- TypeScript errors
- Missing dependencies
- Environment variables

Fix:
```bash
npm run build  # Test locally
npx tsc --noEmit  # Check TypeScript
```

### Function Timeout

**Error: "Function execution timeout"**

Vercel limits:
- Free: 10s per function
- Pro: 60s per function

Solutions:
- Optimize database queries
- Add indexes
- Reduce AI prompt complexity
- Implement request caching

### Environment Variables Not Working

**Error: "API key not found"**

Verify:
1. Variables added to correct environment
2. No typos in variable names
3. Redeployed after adding variables
4. No extra spaces in values

---

## Production Best Practices

1. **Use Separate Databases** for dev/prod
2. **Enable Database Backups** (daily snapshots)
3. **Monitor Error Rates** (set up alerts)
4. **Test in Preview** before merging to main
5. **Document Changes** in commit messages
6. **Version Releases** with Git tags
7. **Implement CI/CD** with GitHub Actions
8. **Rate Limit APIs** to prevent abuse

---

## Scaling Considerations

As your app grows:

### Database
- Upgrade Aiven plan for more connections
- Add read replicas for queries
- Implement connection pooling
- Add database indexes

### Serverless Functions
- Upgrade Vercel plan for higher limits
- Implement caching strategy
- Use Edge Functions for global performance
- Add CDN for static assets

### Monitoring
- Upgrade to Vercel Pro for analytics
- Add APM tool (New Relic, Datadog)
- Implement custom metrics
- Set up uptime monitoring

---

## Support

For deployment issues:

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Aiven Docs**: [docs.aiven.io](https://docs.aiven.io)
- **GitHub Issues**: [Report Issue](https://github.com/laxmikhilnani20/The-Autonomous-Career-Ecosystem/issues)

---

**Your AURA app is now live!** 🚀

**Production URL**: https://the-autonomous-career-ecosystem.vercel.app/
