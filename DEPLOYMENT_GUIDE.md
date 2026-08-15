# 🚀 Production Deployment Guide

## Frontend Deployment (Vercel) ✅

### 1. Build the Frontend
```bash
npm run build
```

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel for auto-deployment.

---

## Backend Deployment (Choose One)

Your backend server needs to run 24/7 to track online users. Here are the easiest options:

### Option 1: Railway.app (Recommended - Easiest)

1. Go to https://railway.app
2. Connect your GitHub repo
3. Railway will automatically detect `server.js`
4. Deploy with one click!

**Cost**: Free tier available ($5 credit/month)

### Option 2: Render.com

1. Go to https://render.com
2. Create new "Web Service"
3. Connect GitHub repo
4. Set command: `node server.js`
5. Deploy!

**Cost**: Free tier available (with limitations)

### Option 3: Heroku

1. Go to https://heroku.com
2. Create new app
3. Connect GitHub and deploy
4. Keep your dyno awake with free tier

---

## Step-by-Step Setup for Railway

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/gully-cricket.git
git push -u origin main
```

### Step 2: Deploy Backend on Railway
1. Visit https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repo
5. Railway auto-detects Node.js app
6. Set these variables in Settings:
   - `PORT=3001`
7. Deploy!

You'll get a URL like: `https://your-app.railway.app`

### Step 3: Update Frontend for Production
Open `src/App.jsx` and update the WebSocket URL:

```javascript
// Before
const wsUrl = `${wsProtocol}//${window.location.hostname}:3001`

// After (for production)
const wsUrl = wsProtocol === 'https:' 
  ? 'wss://your-railway-app.railway.app'  // Your Railway backend URL
  : `${wsProtocol}//${window.location.hostname}:3001`  // Local development
```

### Step 4: Deploy Frontend on Vercel
1. Go to https://vercel.com
2. Import your GitHub project
3. Vercel auto-detects Vite
4. Click "Deploy"
5. You get a URL like: `https://your-app.vercel.app`

---

## Environment Variables

Create a `.env.production` file:
```
VITE_BACKEND_URL=https://your-railway-app.railway.app
```

Then update App.jsx to use:
```javascript
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
const wsUrl = `${wsProtocol}//${new URL(backendUrl).host}`
```

---

## Final Result

- **Frontend**: `https://your-app.vercel.app` (Hosted on Vercel)
- **Backend**: `https://your-app.railway.app` (Hosted on Railway)
- **Real Online Tracking**: ✅ Works 24/7!

When someone visits your website from anywhere in the world, their online count will be tracked in real-time!

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | FREE | Frontend hosting |
| Railway | $5/month | Backend hosting (free tier available) |
| Domain | $10-15/year | Optional custom domain |
| **Total** | **~$5-15/month** | Very affordable! |

---

## Testing Before Deployment

1. Deploy backend on Railway first
2. Update WebSocket URL in App.jsx with Railway URL
3. Test locally: `npm run dev:full`
4. Then deploy frontend to Vercel

That's it! 🎉
