
# PostureAI — Browser Extension for Posture Monitoring

PostureAI is a browser extension for Chrome and Edge that uses AI and MediaPipe to monitor your posture in real time. Built for HackaBull VII, this project aims to help users maintain healthy posture and prevent tech neck while working at their computers.

## Features

- Real-time posture detection using your webcam (no data leaves your device)
- Visual dashboard with live feedback
- Analytics to track postural trends and fatigue
- Calibration for personalized posture alerts
- Streaks and achievements to motivate healthy habits
- Customizable settings for thresholds and notifications

## Getting Started

1. Clone the repository:
	```bash
	git clone <repo-url>
	cd Final-Hackabull-VII-Project/Working-extension/posture-extension-v4/posture-extension
	```
2. Install dependencies and build:
	```bash
	npm install
	npm run build
	```
3. Load the extension in Chrome/Edge:
	- Go to `chrome://extensions/` or `edge://extensions/`
	- Enable Developer mode
	- Click Load unpacked and select the `dist/` folder
4. Click the PostureAI icon and allow camera access when prompted

## Project Structure

- `Working-extension/posture-extension-v4/posture-extension/` — Main extension source code
- `public/mediapipe/` — MediaPipe models and assets

## Technologies Used

- React, Vite, Tailwind CSS
- MediaPipe (Google) for pose estimation

## License

This project is for educational and demonstration purposes at HackaBull VII.