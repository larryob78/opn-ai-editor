# Deployment Guide

## ⚠️ Important: Vercel Limitations

This application has a **backend with FFmpeg and file processing** which has limitations on Vercel's serverless platform:

### Issues with Vercel Serverless:
1. **FFmpeg not available** by default (requires custom setup)
2. **File storage is ephemeral** (uploaded files disappear after function execution)
3. **SQLite database** won't persist between requests
4. **500MB limit** on serverless function size
5. **10-second execution timeout** on Hobby plan (video processing takes longer)

## Recommended Deployment Strategies

### Option 1: Split Deployment (RECOMMENDED)
**Frontend on Vercel + Backend on Railway/Render**

This is the best approach for this application:

#### Frontend (Vercel):
```bash
# Deploy just the frontend to Vercel
vercel --prod
```

#### Backend (Railway - Free tier available):
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repo
3. Deploy from branch: `claude/editor-ai-tools-011CUxCPTxHkYRWRcAL2XfxE`
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `PORT=3000`
5. Railway automatically installs FFmpeg

Then update the frontend's `API_URL` in `index.html`:
```javascript
const API_URL = 'https://your-app.railway.app/api';
```

### Option 2: Deploy Backend to Render.com (Free tier)
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables
7. Render includes FFmpeg by default

### Option 3: All-in-One on Railway/Render
Deploy everything (frontend + backend) to Railway or Render:
- No Vercel needed
- Everything works out of the box
- Simpler setup

### Option 4: Vercel-Only (Requires Major Refactoring)
To make this work on Vercel serverless:
- Use FFmpeg Layer (complicated)
- Replace file storage with S3/Cloudinary
- Replace SQLite with external database (PostgreSQL, MongoDB)
- Optimize for serverless execution times
- **Not recommended** for this application

## Quick Start: Deploy to Railway (Easiest)

1. **Push your code to GitHub** (already done ✓)

2. **Sign up at Railway.app**
   - Use GitHub login

3. **Create New Project**
   - Choose "Deploy from GitHub repo"
   - Select `larryob78/opn-ai-editor`
   - Select branch: `claude/editor-ai-tools-011CUxCPTxHkYRWRcAL2XfxE`

4. **Add Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add:
     - `OPENAI_API_KEY`: your-key-here
     - `NODE_ENV`: production
     - `PORT`: 3000

5. **Deploy**
   - Railway automatically deploys
   - Installs FFmpeg
   - Provides a public URL

6. **Done!**
   - Access at: `https://your-app.railway.app`

## Alternative: Use Vercel for Frontend Only

If you want to keep using Vercel:

1. **Create a separate branch for frontend-only**:
```bash
git checkout -b frontend-only
# Remove server/ directory
rm -rf server/
# Create simple vercel.json for static site
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ]
}
EOF
git add .
git commit -m "Frontend-only for Vercel"
git push origin frontend-only
```

2. **Deploy to Vercel**:
```bash
vercel --prod
```

3. **Deploy backend separately** (Railway/Render as shown above)

4. **Update API_URL** in deployed frontend to point to your backend

## Cost Comparison

| Platform | Free Tier | FFmpeg | File Storage | Database |
|----------|-----------|--------|--------------|----------|
| Vercel | ✓ (frontend) | ✗ | ✗ | ✗ |
| Railway | ✓ $5 credit/mo | ✓ | ✓ | ✓ |
| Render | ✓ 750 hrs/mo | ✓ | ✓ | ✓ |
| Heroku | ✗ (paid only) | ✓ | ✓ | ✓ |

## What Would You Like to Do?

1. **Deploy everything to Railway** (recommended, easiest)
2. **Frontend on Vercel + Backend on Railway** (split deployment)
3. **Deploy to Render instead** (similar to Railway)
4. **I can help with any option!**

Let me know which deployment strategy you prefer!
