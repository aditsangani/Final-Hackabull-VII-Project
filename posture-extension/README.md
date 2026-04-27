
# PostureGuard — Real-Time Posture Monitoring Extension

PostureGuard is a Chrome/Edge browser extension that uses MediaPipe and AI to monitor your posture in real time, helping you prevent tech neck and improve your well-being while working at your computer.

## Features

- Live Dashboard: Real-time pose detection with visual feedback and angle readings.
- Analytics: Track postural fatigue and trends over time.
- Calibration: Set your personal baseline for posture alerts.
- Streaks: Stay motivated with posture streaks and achievements.
- Customizable Settings: Adjust thresholds, enable/disable alerts, and personalize notifications.

## Installation (Developer Mode)

1. Clone & Build
   ```bash
   npm install
   npm run build
   ```
   This creates a `dist/` folder.

2. Load the Extension
   - Open `chrome://extensions/` or `edge://extensions/`
   - Enable Developer mode (top right)
   - Click Load unpacked and select the `dist/` folder

3. Grant Camera Access
   - Click the PostureGuard icon in your toolbar
   - Allow camera access when prompted

## How It Works

- Uses MediaPipe Pose to calculate the ear → shoulder → hip angle.
- Good posture: ≥ 165° (blue zone)
- Warning: 150–165°
- Tech neck alert: < 150°

When poor posture is detected for a set duration, you’ll receive a notification to correct it.

## Development

- Hot reload:
  ```bash
  npm run dev
  ```
  Reload the extension in your browser after making changes.

- Built with React, Vite, and Tailwind CSS.
- Powered by MediaPipe for pose estimation.

## Project Structure

- `src/` — React components, screens, and hooks
- `public/mediapipe/` — MediaPipe models and assets
- `background.js` — Extension background logic
- `manifest.json` — Chrome/Edge extension manifest

## Credits

- MediaPipe by Google
- Icons and UI inspired by modern productivity tools
