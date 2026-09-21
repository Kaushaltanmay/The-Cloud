# 🕹️ Face Flap — Mobile Game (React Native & Expo)

> **“Your friend's face. Your friend's obstacles.”**

A custom Flappy Bird-style mobile arcade game built from the ground up with **React Native**, **Expo**, and **TypeScript**.

---

## 🌟 Game Highlights

- **Player Character**: Only **Friend 1's face/head** floating through the air. No cartoon bird body, no wings, pure face flight with velocity-based tilt physics!
- **Obstacle Towers**: Vertical towers formed entirely by stacking **Friend 2's face** up and down.
- **Customization Studio**:
  - Upload real photos of Friend 1 and Friend 2 directly from device gallery or camera.
  - Automatic circular face framing and permanent local storage using `expo-file-system`.
  - Seamless placeholder fallbacks (`Friend 1: Loaded/Default`, `Friend 2: Loaded/Default`).
- **60 FPS Physics Engine**:
  - Smooth gravity and jump impulses.
  - Gradual difficulty ramp (speed increases and gap tightens as score climbs).
  - Fair circle-to-box collision detection.
  - Screen shake impact animation on crash.
- **Synthesized Audio & Haptics**:
  - Built-in arcade sound waveforms (Flap, Score Coin, Impact, Game Over).
  - Native haptic feedback vibrations.
  - Sound on/off toggle.
- **Persistent High Scores**:
  - Saves your personal best across app launches with `@react-native-async-storage/async-storage`.
  - Celebration banner on beating high score (`NEW BEST! 🎉`).
- **Mobile First**:
  - Locked to portrait orientation.
  - Safe-area notch protection on modern Android and iOS devices.

---

## 🚀 How to Run & Play

### 1. Start the Expo Development Server
```bash
npm start
# or
npx expo start
```

### 2. Test on Your Android Device (Recommended)
1. Install **[Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)** on your Android phone from Google Play Store.
2. Scan the terminal QR code with your phone.
3. The game will launch instantly with live hot-reloading!

### 3. Test on Android Studio Emulator
Press **`a`** in the terminal running `npx expo start`.

---

## 📱 Controls
- **Tap Anywhere** on the game screen to flap upward.
- **Pause Button** in top right to pause/resume.
- **Audio Button** in header to mute/unmute sounds.
