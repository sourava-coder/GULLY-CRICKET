// Lazily inject the YouTube IFrame API and the Spotify Embed IFrame API,
// each resolving once (subsequent callers reuse the same promise).

let ytPromise
export function loadYouTube() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (ytPromise) return ytPromise
  ytPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev()
      resolve(window.YT)
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return ytPromise
}

let spPromise
export function loadSpotify() {
  if (window.__spotifyIframeApi) return Promise.resolve(window.__spotifyIframeApi)
  if (spPromise) return spPromise
  spPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      window.__spotifyIframeApi = IFrameAPI
      resolve(IFrameAPI)
    }
    const tag = document.createElement('script')
    tag.src = 'https://open.spotify.com/embed/iframe-api/v1'
    document.head.appendChild(tag)
  })
  return spPromise
}
