# UltraStream Android Build Instructions

## 🎯 Overview

Your UltraStream app has been converted to a native Android app using Capacitor. The Android project is ready to build!

**Key Advantage:** Native Android apps don't have mixed content (HTTPS/HTTP) restrictions, so HTTP IPTV streams will work perfectly!

---

## 📦 What's Included

- ✅ Complete Android project in `/android` folder
- ✅ Capacitor configuration with cleartext traffic enabled
- ✅ AndroidManifest.xml configured for HTTP streams
- ✅ Hardware acceleration enabled
- ✅ Direct stream playback (no proxy needed)
- ✅ Optimized HLS.js player for Android WebView

---

## 🔧 Prerequisites

To build the Android APK, you need:

1. **Android Studio** (Latest version)
   - Download: https://developer.android.com/studio
   
2. **Java Development Kit (JDK) 17**
   - Included with Android Studio
   
3. **Android SDK**
   - Installed via Android Studio

---

## 🚀 Method 1: Build with Android Studio (Recommended)

### Step 1: Download the Project

1. Clone from GitHub:
   ```bash
   git clone https://github.com/Arkhan1986/Ultrastream.git
   cd Ultrastream
   ```

2. Or download the ZIP and extract it

### Step 2: Open in Android Studio

1. Launch **Android Studio**
2. Click **"Open an Existing Project"**
3. Navigate to: `Ultrastream/android`
4. Click **"OK"**

### Step 3: Sync Gradle

Android Studio will automatically:
- Download dependencies
- Sync Gradle files
- Index the project

Wait for this to complete (first time may take 5-10 minutes)

### Step 4: Build APK

#### Option A: Debug APK (for testing)
1. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. Click **"locate"** in the notification
4. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Option B: Release APK (for distribution)
1. Click **Build** → **Generate Signed Bundle / APK**
2. Select **APK** → **Next**
3. Create a new keystore or use existing
4. Fill in keystore details
5. Click **Next** → **Finish**
6. APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Step 5: Install on Device

#### Via USB:
1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect device to computer
4. Click **Run** (green play button) in Android Studio
5. Select your device
6. App will install and launch

#### Via APK File:
1. Copy the APK to your device
2. Open the APK file on your device
3. Allow installation from unknown sources if prompted
4. Install and launch

---

## 🚀 Method 2: Build via Command Line

### Prerequisites
```bash
# Install Android SDK command-line tools
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Build Commands

```bash
# Navigate to project
cd Ultrastream

# Install dependencies
pnpm install

# Build Next.js app
pnpm build

# Sync with Capacitor
npx cap sync android

# Navigate to Android folder
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires keystore)
./gradlew assembleRelease

# APK locations:
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🚀 Method 3: Online Build Service (No Android Studio Required)

If you don't want to install Android Studio, use an online build service:

### Option A: EAS Build (Expo)
```bash
npm install -g eas-cli
eas build --platform android
```

### Option B: Ionic Appflow
1. Sign up at https://ionic.io/appflow
2. Connect your GitHub repository
3. Configure build settings
4. Trigger Android build
5. Download APK

### Option C: Codemagic
1. Sign up at https://codemagic.io
2. Connect GitHub repository
3. Configure Android build
4. Download APK

---

## 📱 Testing the App

### 1. Load a Playlist

When the app launches:
1. You'll see the login screen (can skip in demo mode)
2. Go to the player page
3. Enter an M3U URL:
   ```
   https://iptv-org.github.io/iptv/index.m3u
   ```
4. Click "Load Playlist"

### 2. Play Channels

- Browse channels in the sidebar
- Click any channel to play
- HTTP streams will work (no mixed content errors!)
- Enjoy live TV!

---

## 🔧 Customization

### Change App Name
Edit: `android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">UltraStream</string>
```

### Change App Icon
Replace icons in:
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

### Change Package Name
Edit: `android/app/build.gradle`
```gradle
defaultConfig {
    applicationId "com.ultrastream.app"
    ...
}
```

---

## 🐛 Troubleshooting

### Gradle Build Failed
```bash
cd android
./gradlew clean
./gradlew build
```

### SDK Not Found
1. Open Android Studio
2. Go to **Tools** → **SDK Manager**
3. Install **Android SDK Platform 34** (or latest)
4. Install **Android SDK Build-Tools**

### Device Not Detected
1. Enable USB Debugging on device
2. Install device drivers (Windows)
3. Run: `adb devices` to verify connection

### App Crashes on Launch
1. Check Android version (minimum: Android 7.0)
2. Clear app data and cache
3. Reinstall the app

---

## 📊 App Features

### What Works in Android App

✅ **HTTP Stream Playback** - No mixed content errors!
✅ **Direct Fetch** - No proxy needed (faster)
✅ **HLS Streaming** - Full HLS.js support
✅ **M3U Parsing** - Load any M3U/M3U8 playlist
✅ **Channel Navigation** - Browse and search channels
✅ **Offline Capability** - App works without internet (for UI)
✅ **Hardware Acceleration** - Smooth video playback

### What Doesn't Work (Yet)

❌ **Stripe Payments** - Requires web version or native payment integration
❌ **Supabase Auth** - Requires backend API or native SDK
❌ **Push Notifications** - Needs Capacitor plugin

---

## 🚀 Publishing to Google Play Store

### 1. Create Google Play Developer Account
- Cost: $25 one-time fee
- Sign up: https://play.google.com/console

### 2. Prepare Release APK
- Build signed release APK
- Test thoroughly on multiple devices

### 3. Create App Listing
- App name, description, screenshots
- Privacy policy URL
- Content rating

### 4. Upload APK
- Upload signed APK
- Set pricing (free or paid)
- Select countries
- Submit for review

### 5. Review Process
- Usually takes 1-3 days
- Fix any issues if rejected
- Publish when approved

---

## 📦 Alternative: Android App Bundle (AAB)

For Google Play Store, use AAB instead of APK:

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🎉 Success!

Your UltraStream Android app is ready to build!

**Quick Start:**
1. Install Android Studio
2. Open `Ultrastream/android` folder
3. Click **Build** → **Build APK**
4. Install on your device
5. Enjoy IPTV streaming!

---

## 📞 Support

For build issues:
- Check Android Studio logs
- Review Gradle console output
- Check device logcat: `adb logcat`

For app issues:
- Open Chrome DevTools: `chrome://inspect`
- Debug WebView in Android app
- Check console for errors

---

**Happy Building! 🚀**
