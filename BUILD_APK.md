# Build UltraStream Android APK

## ✅ Quick Start (3 Steps)

### 1. Download Android Studio
- Go to: https://developer.android.com/studio
- Download and install
- Launch Android Studio

### 2. Clone and Open Project
```bash
git clone https://github.com/Arkhan1986/Ultrastream.git
```

In Android Studio:
- File → Open
- Select `Ultrastream/android` folder
- Click OK
- Wait for Gradle sync (5-10 minutes first time)

### 3. Build APK
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- Wait 2-3 minutes
- Click "locate" when done
- APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

**Done!** Copy APK to your phone and install.

---

## 📱 Install on Phone

1. Copy `app-debug.apk` to your Android device
2. Open the APK file
3. Allow "Install from unknown sources" if prompted
4. Install and launch UltraStream

---

## 🎬 Using the App

1. Launch UltraStream
2. Go to player page
3. Enter M3U URL: `https://iptv-org.github.io/iptv/index.m3u`
4. Click "Load Playlist"
5. Browse and play channels

**HTTP streams work perfectly!** No mixed content errors.

---

## 🔧 Troubleshooting

### Gradle Sync Failed
- Tools → SDK Manager
- Install Android SDK Platform 34
- Install Android SDK Build-Tools 34.0.0
- Sync again

### Build Failed
- Build → Clean Project
- Build → Rebuild Project

### Device Not Detected
- Enable USB Debugging on phone
- Settings → Developer Options → USB Debugging
- Connect via USB
- Allow debugging on phone

---

## 📦 What's Configured

✅ **AndroidManifest.xml** - `usesCleartextTraffic="true"` (allows HTTP)
✅ **Hardware Acceleration** - Smooth video playback  
✅ **Capacitor** - Web-to-native bridge configured
✅ **HLS.js** - Video player optimized for Android
✅ **M3U Parser** - Playlist parsing ready

---

## 🚀 Publishing (Optional)

To publish on Google Play Store:

1. Build → Generate Signed Bundle/APK
2. Create keystore (one-time)
3. Build release APK
4. Upload to Google Play Console
5. Complete app listing
6. Submit for review

---

**That's it! Your Android app is ready to build.**
