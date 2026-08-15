# 🎵 Real-Time Online User Tracking

Your website now tracks **real online users** in real-time!

## How to Run

You need to run two things simultaneously:

### Option 1: Run Both Together (Recommended)
```bash
npm run dev:full
```
This starts:
- Backend server on `http://localhost:3001`
- Frontend Vite dev server on `http://localhost:5173`

### Option 2: Run Separately in Different Terminals

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```

## How It Works

1. **User Joins**: When a user visits your website, they get a unique session ID
2. **WebSocket Connection**: The frontend connects to your backend via WebSocket
3. **Ping System**: Every 10 seconds, the app sends a "ping" to keep the user active
4. **Real-Time Updates**: The server tracks all active users and broadcasts the count
5. **Auto-Cleanup**: Users are removed from the online count after 60 seconds of inactivity

## Features

✅ Real online user count  
✅ Real-time updates via WebSocket  
✅ Auto-removal of inactive users after 60 seconds  
✅ Beautiful UI with blinking dot indicator  
✅ Glow effect around online counter  

## Online Counter Display

The online counter is visible in the **top-right corner** of your website showing:
- 🔴 Blinking orange dot (live indicator)
- **ONLINE: XX** (current user count)

## Building for Production

```bash
npm run build
```

Then deploy the `dist/` folder to your hosting service. 

**Note**: For production, you'll need to deploy the backend server (server.js) separately on a Node.js hosting service.
