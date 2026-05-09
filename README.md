# QR Master Pass Platform 🛡️

A premium, highly secure, single-purpose QR Generation and Scanning platform designed for generating an "Official Master Pass" and verifying it at the gate.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- **Single Master Pass Generation**: Generates one unique, highly secure Master QR Code with a custom red-bordered aesthetic and an "MS" verification badge.
- **Secure Custom URI**: The QR payload uses a proprietary URI scheme (`msauth://secure-gate/...`). This prevents random users from scanning it with their default phone cameras (like Apple Camera or Google Lens) and getting any useful data. It will only resolve as a "broken link" or unknown app on standard devices.
- **Dedicated Platform Scanner**: A built-in high-performance camera scanner using `jsqr`. It is programmed to *only* accept and verify the specific Master Pass.
- **Premium UI/UX**: Designed with a sleek, modern glassmorphism aesthetic, dark mode support, fluid animations, and satisfying sound effects for entry verification.

## 🚀 How It Works

1. **The Generator (`/`)**: Creates the Master Pass QR Code. You can securely download this as a high-quality PNG image to display or print.
2. **The Scanner (`/scanner`)**: The gate volunteer opens this view. They point the camera at a QR code.
   - If it scans the exact Master Pass, the screen flashes Green with a **"GRANTED"** message and a success tone.
   - If it scans any other QR code (or an invalid pass), the screen flashes Red with a **"DENIED"** message and an error tone.

## 🛠️ Setup & Installation

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## 🎨 Design System

- **Colors**: Uses a stark red (`#ef4444`) branding for the Master Pass, with deep dark mode backgrounds (`#09090b`).
- **Typography**: Uses the `Outfit` font for a modern, geometric look.
- **Icons**: Powered by `lucide-react`.

## 🔒 Security Note
The payload is statically defined inside the app. For a production deployment with multiple events, you may want to move the `masterPayload` secret to an environment variable (`.env`).
