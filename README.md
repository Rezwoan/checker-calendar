# Checker Calendar

Mobile-first, local-first habit checker with calendar views, streaks, and beautiful, responsive UI. Installable as a PWA and deployable on any static host (e.g. **cPanel**). Optional **GitHub Gist** sync lets you back up/restore or share across devices with a QR code.

---

## ✨ Features

-   **Multi-tab calendars** – track different habits (e.g., Gym, Creatine, Study) in separate tabs with custom names & emojis.
-   **One-tap check/uncheck** – tap a day to mark it done; long-press/right-click to add a **note + emoji**.
-   **Streaks & stats** – current & best streaks, last-30-days completion bar, and counters for **Today / Week / Month / Year**.
-   **Actionable History** – recent activity per tab; tap an item to jump to that day, toggle it, or edit the note right there.
-   **Emoji picker** – curated common emojis + “recent” list wherever emojis are used (new tab, notes).
-   **PWA (Installable)** – offline-ready service worker, works great on mobile and desktop.
-   **Local-first storage** – saves to **IndexedDB** (via `localforage`); no server required.
-   **Optional Gist sync** – enter a GitHub token (gist scope) to upload/download a single Gist; includes **QR share & scan** to set up another device quickly.
-   **Zero-cost hosting** – deploy static files to **cPanel** (or Netlify/Vercel/GitHub Pages—HashRouter friendly).
-   **Dark-mode, polished UX** – subtle animations (Framer Motion), roomy tap targets, and mobile-first layouts.

---

## 🧰 Tech Stack

-   **Vite 5**, **React 18**
-   **Tailwind CSS v4** (via `@tailwindcss/vite`)
-   **React Router** (HashRouter)
-   **Zustand** (state, with persistence)
-   **localforage** (IndexedDB)
-   **vite-plugin-pwa** (PWA & SW)
-   **framer-motion** (animations)
-   **recharts** (charts on Report)
-   **qrcode.react** & **html5-qrcode** (share QR + camera scan)

---

## 📦 Project Structure

```
checker-calendar/
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ apple-touch-icon.png
│  └─ icons/
│     ├─ icon-192.png
│     ├─ icon-512.png
│     ├─ maskable-192.png
│     └─ maskable-512.png
├─ src/
│  ├─ components/
│  │  ├─ BottomNav.jsx
│  │  ├─ ChartPanel.jsx
│  │  ├─ EmojiPicker.jsx
│  │  ├─ MonthCalendar.jsx
│  │  ├─ NoteEditor.jsx
│  │  ├─ OverlayModal.jsx
│  │  ├─ QrScanner.jsx
│  │  ├─ StatCard.jsx
│  │  ├─ Streaks.jsx
│  │  └─ TabBar.jsx
│  ├─ lib/
│  │  ├─ date.js
│  │  ├─ gistSync.js
│  │  ├─ pwaInstall.js
│  │  └─ stats.js
│  ├─ pages/
│  │  ├─ History.jsx
│  │  ├─ Home.jsx
│  │  ├─ Report.jsx
│  │  ├─ Settings.jsx
│  │  └─ Tabs.jsx
│  ├─ store/
│  │  └─ useAppStore.js
│  ├─ main.jsx
│  ├─ router.jsx
│  └─ styles.css
├─ index.html
├─ package.json
├─ vite.config.js
└─ README.md
```

> Screenshots: add your images to `docs/` and reference them in this README if you like.

---

## 🚀 Quick Start (Local)

```bash
# 1) Install dependencies
npm install

# 2) Run the dev server
npm run dev
# open http://localhost:5173/#/

# 3) Production build & preview
npm run build
npm run preview
# open http://localhost:4173/#/
```

**Why `#/`?** The app uses **HashRouter**, which works everywhere (local preview, subfolders, cPanel) without server rewrites.

---

## 📱 PWA Install

The app is a Progressive Web App. For installability:

-   Manifest must include **PNG** icons at least **192×192** and **512×512**.
-   A service worker must be active (**`npm run preview`** or production).
-   Use **HTTPS** on mobile (your cPanel domain is fine).
    Localhost also works for testing.

In the UI: Settings → **Install App**

-   On Android Chrome/Edge: look for the **Install** icon in the address bar, or tap the **Install** button in Settings.
-   On iOS Safari: Share → **Add to Home Screen** (no install prompt).

> If “Install” says **Unavailable**, see **Troubleshooting** below.

---

## 🌐 Deploy to cPanel (Static Hosting)

1. Build the app:

    ```bash
    npm run build
    ```

    This creates a `dist/` folder.

2. In **cPanel → File Manager**, upload the **contents of `dist/`** to:

    - `public_html/` (root), or
    - a subfolder, e.g. `public_html/checker-calendar/`, or
    - a subdomain’s document root.

3. Open your site:

    - Root: `https://yourdomain.com/#/`
    - Subfolder: `https://yourdomain.com/checker-calendar/#/`
    - Subdomain: `https://checker-calendar.yourdomain.com/#/`

**No `.htaccess` needed** because HashRouter keeps routing on the client side.

---

## 🧭 Configuration Notes

-   **`vite.config.js`**

    -   `base: './'` → makes asset paths relative (good for subfolders).
    -   PWA is handled by `vite-plugin-pwa`. We keep dev PWA off unless you run with:

        ```bash
        VITE_PWA_DEV=true npm run dev
        ```

-   **Icons**

    -   Place these PNGs in `public/icons/`:

        -   `icon-192.png`, `icon-512.png`, `maskable-192.png`, `maskable-512.png`

    -   And `public/apple-touch-icon.png` (180×180) for iOS.
    -   The manifest already references these paths.

---

## 🔒 Privacy & Data

-   **Local data** is stored in your browser using IndexedDB (via `localforage`).
-   **Optional sync** uses a GitHub Personal Access Token (**gist** scope) to write a single Gist.
    The token and Gist ID are kept in **localStorage** on each device.
-   **QR Share & Scan** lets you copy these two values safely onto another device.

> For security, use a token with **only the `gist` scope**, and rotate it if it ever leaks.

---

## 🔁 Backup / Sync (Gist)

1. Go to **Settings → Optional GitHub Gist Sync**.
2. Enter your **Personal Access Token** (scope: **gist**) and optionally an existing **Gist ID**.
3. Click **Upload → Gist** (first upload auto-creates a new Gist if no ID is supplied).
4. On the other device:

    - Open **Settings**, tap **Scan from another device**, and scan the **Share QR** from your first device.
    - Tap **Download ← Gist** to pull the data into the app.

You can also enable **Auto Sync** to periodically upload the latest state.

---

## 🧩 Keyboard & Mobile UX Tips

-   Tap a day to toggle check; **long-press** (or right-click) to open the note/emoji editor.
-   Use the **emoji picker** for quick selections; your most recent choices are pinned under “Recent”.
-   Tabs can be renamed, re-ordered, and deleted from **Tabs** page.

---

## 🧪 Testing Scenarios

-   **Fresh user** → starts with **one** “Calendar” tab only (no Gym/Creatine defaults).
-   **Tabs page** → create a new tab using the **Add** form (with emoji picker).
-   **History** → tap an entry to:

    -   Go to that day on the calendar,
    -   Toggle check for that date, or
    -   Edit note/emoji (bottom sheet).

---

## 🛠️ Troubleshooting

**Black/white screen after deploy**

-   Likely an old Service Worker. **Unregister** once:

    -   Desktop Chrome: DevTools → Application → Service Workers → _Unregister_, then hard reload.
    -   Android Chrome: Site settings → **Storage** → _Clear data_.

**“Install unavailable” on mobile**

-   Confirm the icon URLs load as **valid PNGs**:

    -   `https://your-site/icons/icon-192.png`
    -   `https://your-site/icons/icon-512.png`
    -   `https://your-site/icons/maskable-192.png`
    -   `https://your-site/icons/maskable-512.png`

-   Ensure you’re on **HTTPS** (required on phones).
-   Open DevTools → Application → Manifest to verify there are **no red X** next to icons.

**Camera/Scan not working**

-   Camera requires **HTTPS** (or localhost).
-   Allow camera permission in the browser.
-   If still blocked, another tab may be holding the camera—close other tabs and retry.

**Modal appears off-screen**

-   If you see previous (cached) styling, clear the PWA cache (see “Black/white screen” above).

---

## 🧱 Development Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # build production bundle to ./dist
npm run preview   # serve the build locally (with SW) at http://localhost:4173
```

---

## 📐 Design System (brief)

-   **Dark-only** theme.
-   Tailwind utility classes; small custom components:

    -   `card`, `btn`, `btn-primary`, `chip`, borders/lines from theme tokens.

-   Motion: quick, subtle `(duration ~0.15s)`.

---

## ✅ Roadmap Ideas

-   Multi-device merge strategies for Gist sync (conflict handling).
-   More report breakdowns (week heatmap, custom ranges).
-   Optional reminders (client-side notifications).
-   i18n/locale date formats.

---

## 📄 License

MIT — feel free to use this as a template for your own projects.

---

## 🤝 Acknowledgements

-   [Vite](https://vitejs.dev/), [React](https://react.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
-   [Zustand](https://github.com/pmndrs/zustand)
-   [localforage](https://localforage.github.io/localForage/)
-   [Framer Motion](https://www.framer.com/motion/)
-   [Recharts](https://recharts.org/)
-   [html5-qrcode](https://github.com/mebjas/html5-qrcode)
-   [qrcode.react](https://github.com/zpao/qrcode.react)

---
