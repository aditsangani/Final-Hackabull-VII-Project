# PostureAI — Chrome/Edge Extension

Real-time posture monitoring powered by MediaPipe. Runs as a browser extension popup.

## How to install (Developer Mode)

### Step 1 — Build the extension
```bash
npm install
npm run build
```
This creates a `dist/` folder.

### Step 2 — Load in Edge/Chrome
1. Open Edge → go to `edge://extensions/`  
   (Chrome: `chrome://extensions/`)
2. Turn on **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder inside this project
5. PostureAI icon appears in your toolbar ✅

### Step 3 — Allow camera
Click the PostureAI icon → it'll ask for camera access → click Allow.

## Features
- **Dashboard** — Live MediaPipe pose detection with real angle reading
- **Analytics** — Postural fatigue patterns over time
- **Calibrate** — Set your personal baseline angle
- **Streaks** — Track your posture blocks and achievements
- **Settings** — Thresholds, alerts, notifications, display options

## How it works
MediaPipe Pose calculates the **ear → shoulder → hip angle** in real time.
- ≥165° = Good posture (blue zone)
- 150–165° = Warning
- <150° = Tech neck alert

## Dev mode (hot reload)
```bash
npm run dev
```
Then reload the extension in `edge://extensions/` after changes.
