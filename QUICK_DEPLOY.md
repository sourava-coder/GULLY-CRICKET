# 🎉 Gully Cricket - Quick Deployment Guide

## Deploy to Production in 5 Minutes!

Deploy your Gully Cricket app with Vercel (frontend) and Railway (backend):
- ✅ Real-time online user tracking
- ✅ 24/7 uptime monitoring
- ✅ Global accessibility

---

## Deployment Steps (5 Minutes)

### Step 1: Backend Deploy (Railway - 2 min)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select your GitHub repository
5. Deploy! ✅

Railway automatically detects and runs `server.js`.

**You'll get a URL like:** `https://gully-cricket-xyz.railway.app`

### Step 2: Frontend Deploy (Vercel - 2 min)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Add Environment Variable:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `https://gully-cricket-xyz.railway.app` (your Railway URL)

4. Deploy! ✅

**You'll get a URL like:** `https://gully-cricket.vercel.app`

### Step 3: Test Your App

1. Open `https://gully-cricket.vercel.app`
2. Open multiple tabs/windows - watch online count increase
3. Green "ONLINE" counter displays in the top-center ✅

---

## Cost Breakdown

| Service | Price | Notes |
|---------|-------|-------|
| Vercel | FREE | Frontend hosting |
| Railway | $5/month | Backend hosting (free tier available) |
| Total | $5/month | Very affordable! |

---

## Folder Structure for Production

```
gully-cricket/
├── src/                 # React frontend code
├── server.js           # Backend server (runs on Railway)
├── vite.config.js      # Vite build configuration
├── package.json        # Project dependencies
├── .env.example        # Environment variables template
└── dist/               # Build output (deployed to Vercel)
```

---

## Verify Your Deployment

✅ **Railway Dashboard**: Check that server is running  
✅ **Vercel Dashboard**: Check that frontend is deployed  
✅ **Live Website**: Check green "ONLINE" counter is working

---

## Troubleshooting

1. **WebSocket not connecting?**
   - Verify `VITE_BACKEND_URL` environment variable is set in Vercel
   
2. **Online count not updating?**
   - Check backend is running on Railway dashboard
   - Open browser console (F12) and look for errors

3. **CORS errors?**
   - CORS is already configured in `server.js`

---

## Quick Tips

**For local testing:**
```bash
npm run dev:full
```

**For production deployment:**
```bash
npm run build
# Vercel automatically deploys from dist/ folder
```

---

**That's it! Your Gully Cricket app is now live with real-time online tracking!** 🎉🚀
