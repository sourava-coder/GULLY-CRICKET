// Parse a pasted music link into a normalized descriptor the players understand.
//
// Returns one of:
//   { source: 'youtube', kind: 'playlist' | 'video', id }
//   { source: 'spotify', kind: 'playlist' | 'album' | 'track', id, uri }
//   { error: 'human readable reason' }

export function parseLink(raw) {
  const input = (raw || '').trim()
  if (!input) return { error: 'Paste a YouTube or Spotify link to get rolling.' }

  let url
  try {
    url = new URL(input.includes('://') ? input : `https://${input}`)
  } catch {
    return { error: "That doesn't look like a valid link." }
  }

  const host = url.hostname.replace(/^www\./, '').toLowerCase()

  // ---- YouTube / YouTube Music ----
  if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'music.youtube.com' ||
    host === 'youtu.be'
  ) {
    const list = url.searchParams.get('list')
    if (list) return { source: 'youtube', kind: 'playlist', id: list }

    // youtu.be/<id> or youtube.com/watch?v=<id> or /shorts/<id>
    let videoId = url.searchParams.get('v')
    if (!videoId && host === 'youtu.be') videoId = url.pathname.slice(1)
    if (!videoId) {
      const m = url.pathname.match(/\/(shorts|embed|v)\/([^/?]+)/)
      if (m) videoId = m[2]
    }
    if (videoId) return { source: 'youtube', kind: 'video', id: videoId }

    return { error: "Couldn't find a playlist or video id in that YouTube link." }
  }

  // ---- Spotify ----
  if (host === 'open.spotify.com' || host === 'spotify.com') {
    const m = url.pathname.match(/\/(playlist|album|track)\/([a-zA-Z0-9]+)/)
    if (m) {
      const kind = m[1]
      const id = m[2]
      return { source: 'spotify', kind, id, uri: `spotify:${kind}:${id}` }
    }
    return { error: 'Only Spotify playlist, album or track links are supported.' }
  }

  // spotify:playlist:xyz URI pasted directly
  if (input.startsWith('spotify:')) {
    const m = input.match(/^spotify:(playlist|album|track):([a-zA-Z0-9]+)/)
    if (m) return { source: 'spotify', kind: m[1], id: m[2], uri: input }
  }

  return { error: 'Unsupported link. Use a YouTube / YouTube Music or Spotify URL.' }
}
