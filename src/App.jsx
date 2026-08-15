import { useEffect, useRef, useState } from 'react'
import { loadYouTube } from './utils/loadApi'

const QUOTES = [
  'Ek tappa out!',
  "Jiska bat, pehli batting uski!",
  "Deewar ko lagi toh chauka, paar gayi toh out!",
  'Dheeme daal bhai, leather ki ball nahi hai!',
  'Arey bhai, ye toh trial ball thi!',
  'Cheating mat kar, saaf wicket keeper catch tha!',
  'NO PAIN, NO GAIN.',
  'STAY HUNGRY.',
  'SHUT UP AND SQUAT.',
  'YEP! YEP! YEP!',
]

const DEFAULT_PLAYLIST = 'PLHYMoQ2kSUSU'
const START_KG = 5
const MAX_KG = 35
const STEP_KG = 5

export default function App() {
  const [playing, setPlaying] = useState(false)
  const [trackTitle, setTrackTitle] = useState('Gane Load ho rahe...')
  const [quote, setQuote] = useState(QUOTES[0])
  const [quoteVisible, setQuoteVisible] = useState(true)
  const [onlineCount, setOnlineCount] = useState(0)

  const playerRef = useRef(null)
  const hostRef = useRef(null)
  const contentRef = useRef(null)
  const lightRef = useRef(null)
  const progressRef = useRef(null)
  const wsRef = useRef(null)

  // --- Track online visitors with WebSocket ---
  useEffect(() => {
    // Generate unique session ID
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
      localStorage.setItem('session_id', sessionId)
    }

    // Determine WebSocket URL based on environment
    const getWebSocketUrl = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      
      // Production deployment detection
      if (import.meta.env.PROD) {
        // For production, use environment variable or same domain with /api/ws
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        if (backendUrl) {
          // Convert https:// to wss:// and http:// to ws://
          const wsBackend = backendUrl.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:')
          return wsBackend
        }
        // Fallback: try to connect to same domain on different port
        return `${protocol}//${window.location.hostname}:3001`
      }
      
      // Development: always use localhost:3001
      return `${protocol}//localhost:3001`
    }
    
    const wsUrl = getWebSocketUrl()
    
    try {
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('✅ Connected to online tracker:', wsUrl)
        // Send initial ping
        wsRef.current?.send(JSON.stringify({ type: 'ping', userId: sessionId }))
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'online') {
            setOnlineCount(data.count)
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }

      wsRef.current.onerror = (err) => {
        console.error('WebSocket error:', err)
      }
    } catch (err) {
      console.error('WebSocket connection failed:', err)
    }

    // Send ping every 10 seconds to keep user active
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping', userId: sessionId }))
      }
    }, 10000)

    return () => {
      clearInterval(pingInterval)
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // --- Boot the YouTube IFrame player with the default playlist ---
  useEffect(() => {
    let cancelled = false
    let target

    loadYouTube().then((YT) => {
      if (cancelled || !hostRef.current) return
      target = document.createElement('div')
      hostRef.current.appendChild(target)

      playerRef.current = new YT.Player(target, {
        height: '0',
        width: '0',
        playerVars: {
          listType: 'playlist',
          list: DEFAULT_PLAYLIST,
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            // Just cue the first song (loaded, not playing) and show its title.
            const data = e.target.getVideoData?.()
            if (data?.title) setTrackTitle(data.title.toUpperCase())
          },
          onStateChange: (e) => {
            const s = e.data
            setPlaying(s === YT.PlayerState.PLAYING)
            // Update the track name once the first (playing or cued) song has metadata.
            if (s === YT.PlayerState.PLAYING || s === YT.PlayerState.CUED) {
              const data = playerRef.current?.getVideoData?.()
              if (data?.title) setTrackTitle(data.title.toUpperCase())
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      try {
        playerRef.current && playerRef.current.destroy()
      } catch {
        /* ignore */
      }
      playerRef.current = null
      if (hostRef.current) hostRef.current.innerHTML = ''
    }
  }, [])

  // --- Progress bar loop ---
  useEffect(() => {
    let raf
    const tick = () => {
      const p = playerRef.current
      if (p && p.getDuration) {
        const duration = p.getDuration()
        const current = p.getCurrentTime?.() || 0
        if (duration > 0 && progressRef.current) {
          progressRef.current.style.width = `${(current / duration) * 100}%`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // --- Rotating quotes ---
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setQuoteVisible(false)
      setTimeout(() => {
        i = (i + 1) % QUOTES.length
        setQuote(QUOTES[i])
        setQuoteVisible(true)
      }, 500)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // --- Ambient light follows the cursor ---
  useEffect(() => {
    const onMove = (e) => {
      if (!lightRef.current) return
      lightRef.current.style.left = `${e.clientX - 300}px`
      lightRef.current.style.top = `${e.clientY - 300}px`
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])



  // --- Transport controls ---
  const togglePlay = () => {
    const p = playerRef.current
    if (!p) return
    p.getPlayerState?.() === 1 ? p.pauseVideo() : p.playVideo()
  }
  const nextVideo = () => playerRef.current?.nextVideo?.()
  const prevVideo = () => playerRef.current?.previousVideo?.()

  return (
    <>
      <div className="vhs-overlay" />
      <div className="grain" />
      <div className="ambient-light" ref={lightRef} />

      <div className="container" ref={contentRef}>
        <div className="header-labels">
          <div>EST. 2026</div>
          <div>STATUS: Match Start</div>
          <div>LOCATION: Cricket Field</div>
        </div>

        <div className="online-counter">
          <span className="online-dot"></span>
          ONLINE: <span className="online-number">{onlineCount}</span>
        </div>

        <h1 className="main-title">गली क्रिकेट</h1>

        <div className="quote-container" style={{ opacity: quoteVisible ? 1 : 0 }}>
          &ldquo;{quote}&rdquo;
        </div>
      </div>

      {/* Music Player */}
      <div className="player-wrap">
        <div className="player-controls">
          <button className="control-btn" onClick={prevVideo} aria-label="Previous">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button className="control-btn" onClick={togglePlay} aria-label="Play/Pause">
            {playing ? (
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button className="control-btn" onClick={nextVideo} aria-label="Next">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>
        <div className="track-info">
          <div className="track-name">{trackTitle}</div>
          <div className="progress-container">
            <div className="progress-bar" ref={progressRef} />
          </div>
        </div>
      </div>

      {/* Credit */}
      <a
        className="insta-credit"
        href="https://instagram.com/still.sourav_.99"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram @still.sourav_.99"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
        </svg>
        sourava-coder
      </a>

      {/* Hidden YT player host */}
      <div className="youtube-host" ref={hostRef} />
    </>
  )
}
