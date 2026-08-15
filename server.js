import express from 'express'
import cors from 'cors'
import http from 'http'
import { WebSocketServer } from 'ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

app.use(cors())
app.use(express.json())

// Track active users with their session IDs and last ping time
const activeUsers = new Map()

// Send online count to all connected WebSocket clients
const broadcastOnlineCount = () => {
  const count = activeUsers.size
  const data = JSON.stringify({ type: 'online', count })
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(data)
    }
  })
}

// Clean up inactive users (no ping for 60 seconds)
setInterval(() => {
  const now = Date.now()
  for (const [userId, timestamp] of activeUsers.entries()) {
    if (now - timestamp > 60000) {
      activeUsers.delete(userId)
    }
  }
  broadcastOnlineCount()
}, 30000)

// WebSocket connection handler
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      if (data.type === 'ping' && data.userId) {
        activeUsers.set(data.userId, Date.now())
        broadcastOnlineCount()
      }
    } catch (err) {
      console.error('WebSocket message error:', err)
    }
  })

  ws.on('close', () => {
    broadcastOnlineCount()
  })
})

// REST API endpoint for online count
app.get('/api/online', (req, res) => {
  res.json({ online: activeUsers.size })
})

// User ping endpoint
app.post('/api/ping', (req, res) => {
  const { userId } = req.body
  if (userId) {
    activeUsers.set(userId, Date.now())
  }
  res.json({ online: activeUsers.size })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🎵 Server running on http://localhost:${PORT}`)
})
