# गली क्रिकेट 🏋️ — Gully Cricket Music Player

A retro, synthwave-flavoured music player themed like an old-school desi street gym.
Play a YouTube / YouTube Music playlist while you press a dumbbell that grows heavier
with every rep — max it out at 35 KG and it starts taunting you (`HULK ho kya bhai? 💪`).

Built with **React + Vite**. Music playback runs through the free **YouTube IFrame Player API**.

---

## Features

- 🎵 Plays any YouTube / YouTube Music playlist (audio + hidden player, prev / play-pause / next controls, progress bar).
- 🏋️ Pressable dumbbell that scales up 5 KG → 35 KG per click, with a metallic clink + screen shake.
- 💪 "HULK ho kya bhai?" pop-up once you hit max weight.
- ⏱️ Dumbbell auto-resets to 5 KG after 5 seconds of no clicks.
- 🎞️ VHS scanlines, film grain, cursor-following ambient light, and a full-screen background image.

---

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) **18+** and npm.

### Install & run

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the URL Vite prints (default **http://localhost:5173/**).

### Build for production

```bash
npm run build     # outputs static files to dist/
npm run preview   # preview the production build locally
```

The `dist/` folder is a plain static site — deploy it to GitHub Pages, Netlify, Vercel, or any static host.

---

## 🎛️ Make it your own

### Change the playlist (most common)

The playlist is a single constant in [`src/App.jsx`](src/App.jsx):

```js
const DEFAULT_PLAYLIST = 'PLf_ANWupyE3bhSLCyaRhSoRnj3QbOhzXn'
```

Replace it with **your own playlist ID**. To find it:

1. Open your playlist on YouTube or YouTube Music.
2. Look at the URL — it contains `list=`:
   ```
   https://music.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxxxxxxxxxx
                                            └────────── this part ──────────┘
   ```
3. Copy everything **after `list=`** and paste it as the value of `DEFAULT_PLAYLIST`.

Save the file — the dev server hot-reloads and your playlist loads automatically.

> The playlist must be **public** or **unlisted** for the YouTube player to load it.

### Other easy tweaks

| What | Where |
|------|-------|
| Background image | Replace [`src/img/back.png`](src/img/back.png) (keep the same name), or edit the `background-image` in [`src/styles.css`](src/styles.css). |
| Dumbbell image | Replace [`src/img/dumbell.png`](src/img/dumbell.png). |
| Title text (`देसी जिम`) | `<h1 className="main-title">` in [`src/App.jsx`](src/App.jsx). |
| Header labels / quotes | `QUOTES` array and the `header-labels` block in [`src/App.jsx`](src/App.jsx). |
| Weight steps / max ("HULK") | `START_KG`, `MAX_KG`, `STEP_KG` in [`src/App.jsx`](src/App.jsx). |
| Colors / theme | CSS variables in `:root` at the top of [`src/styles.css`](src/styles.css). |

---

## Project structure

```
├── index.html            # Fonts + root mount
├── src/
│   ├── App.jsx           # Main UI, YouTube player logic, dumbbell interaction
│   ├── main.jsx          # React entry point
│   ├── styles.css        # All styling / theme
│   ├── img/              # back.png (background) + dumbell.png
│   └── utils/
│       └── loadApi.js    # Loads the YouTube IFrame API
└── vite.config.js
```

---

## Notes

- Browsers block audio autoplay until you interact with the page — so the first track loads but stays paused until you hit **play**. This is expected browser behaviour, not a bug.
- Only **YouTube / YouTube Music** playlists are supported (via the YouTube IFrame API).

Insta - @still.sourav_.99
