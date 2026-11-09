# MAKE DARK – AMOLED Launcher for Android

A high-performance, minimalist, battery-saving Android Home Launcher specifically engineered for **AMOLED/OLED displays** and optimized for entry-level and low-RAM devices such as the **itel Vision 1 LTE (Android 9 Pie, API 28+)**.

---

## 📱 Target Device Profile: itel Vision 1 LTE

| Specification | Target Details | Optimization Implemented |
| :--- | :--- | :--- |
| **Model** | itel Vision 1 LTE (L6005) | Tailored DPI and layout margins |
| **SoC** | Unisoc SC9863A (8x Cortex-A55 @ 1.6GHz) | Offloaded heavy queries to `Dispatchers.IO` |
| **RAM** | 2 GB / 3 GB LPDDR4 | `largeHeap="false"`, no background services, transient icon cache |
| **Display** | 6.088″ HD+ Waterdrop (720 × 1560, 19.5:9) | Edge-to-edge `#000000` AMOLED rendering |
| **Android Version** | Android 9.0 (Pie) – API Level 28 | `minSdk = 28`, backward & forward compatible up to API 34 |
| **Battery** | 4000 mAh Li-Po | Zero continuous polling; uses passive battery broadcasts |

---

## 🎨 Design System

1. **Pure Black Canvas (`#000000`)**: Deactivates self-emitting OLED pixels, dropping display power consumption to near zero.
2. **Dark Charcoal Cards (`#121212`)**: Subdued structural elevation for widgets, docks, and search controls.
3. **Secondary Charcoal (`#1A1A1A`)**: Crisp contrast for app icon backgrounds and modal containers.
4. **Primary Typography (`#FFFFFF`)**: Crisp white with optical compensation for dark surfaces.
5. **Secondary Typography (`#9E9E9E`)**: Quiet metadata and category labels.
6. **Subtle Accent (`#448AFF`)**: High-intent electric blue for selection states, clock indicators, and buttons.
7. **Squircle & Rounded Icons**: Smooth 14dp–16dp corner radius matching modern Android aesthetics.
8. **60 FPS Hardware-Accelerated Animations**: Light compositing transforms without layout reflows.

---

## ✨ Features

- **Standard Android HOME Activity**: Declares `android.intent.category.HOME` and `android.intent.category.DEFAULT` with `launchMode="singleTask"` and `clearTaskOnLaunch="true"`.
- **Custom Home Screen**: Minimalist AMOLED digital clock widget (12h/24h), dynamic date and day banner, real-time battery status widget, custom folder shortcuts, and favorite apps dock.
- **Custom App Drawer**: Fast lazy vertical grid with instant search filter, alphabetical quick-jump, and categorization (All, Favorites, User, System).
- **Custom Folders**: Create, rename, delete, and group applications into clean dark charcoal cards.
- **App Shortcuts & Long Press**: Contextual menu to launch, favorite/unfavorite, open Android App Info, or uninstall applications.
- **Zero-Intrusive Permissions**: Requires only `QUERY_ALL_PACKAGES` (for reading installed applications) and `VIBRATE`. No root, no accessibility services, no invasive telemetry.
- **Default Launcher Picker & Restore Option**: Deep links into `Settings.ACTION_HOME_SETTINGS` with clear fallback instructions to easily restore the factory itel launcher at any time.

---

## 🏗️ Android Studio Project Structure

```text
android/
├── build.gradle.kts                   # Top-level build config
├── settings.gradle.kts                # Subproject and plugin management
├── gradle.properties                  # Low-RAM memory limits for Gradle daemon
├── gradlew                            # Gradle wrapper script
├── gradle/wrapper/
│   └── gradle-wrapper.properties      # Gradle 8.4 binary distribution
└── app/
    ├── build.gradle.kts               # App module build file (minSdk 28, Jetpack Compose)
    ├── proguard-rules.pro             # Release optimization rules
    └── src/main/
        ├── AndroidManifest.xml        # HOME and LAUNCHER intent-filters
        ├── java/com/makedark/launcher/
        │   ├── MainActivity.kt        # Root Activity, back press handling, edge-to-edge
        │   ├── LauncherViewModel.kt   # Coroutine-backed state, app queries, folders
        │   ├── data/
        │   │   ├── AppModel.kt        # Minimalist AppInfo data class
        │   │   ├── FolderModel.kt     # FolderModel definition
        │   │   └── LauncherPreferences.kt # SharedPreferences storage
        │   ├── receiver/
        │   │   ├── BatteryReceiver.kt # Passive battery broadcaster
        │   │   └── PackageChangeReceiver.kt # Dynamic app install/remove listener
        │   └── ui/
        │       ├── HomeScreen.kt      # Clock widget, battery, folders, favorites dock
        │       ├── AppDrawer.kt       # Fast search, filter chips, lazy grid
        │       ├── FolderDialog.kt    # AMOLED popup for folder management
        │       ├── AppShortcutsDialog.kt # Long-press contextual actions
        │       ├── SettingsScreen.kt  # Default home setup & low-RAM toggles
        │       └── theme/
        │           ├── Color.kt       # AMOLED palette
        │           └── Theme.kt       # Jetpack Compose dark theme configuration
        └── res/
            ├── values/
            │   ├── strings.xml
            │   ├── colors.xml
            │   └── themes.xml         # Pure black window background
            ├── drawable/
            │   ├── ic_launcher_background.xml
            │   └── ic_launcher_foreground.xml
            └── mipmap-anydpi-v26/
                ├── ic_launcher.xml
                └── ic_launcher_round.xml
```

---

## 🚀 Building & Installing

### Method 1: Android Studio (Recommended)
1. Open Android Studio (Hedgehog 2023.1.1 or newer).
2. Select **Open** and choose the `android/` directory.
3. Allow Gradle to synchronize dependencies.
4. Connect your **itel Vision 1 LTE** via USB with **USB Debugging** enabled in Developer Options.
5. Click **Run** (`Shift + F10`) or select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

### Method 2: Command Line (Gradle)
```bash
cd android
./gradlew assembleDebug
```
The output APK is generated at:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Method 3: Install via ADB
```bash
# Push and install onto device
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Launch directly
adb shell am start -n com.makedark.launcher/.MainActivity
```

---

## ⚙️ Setting as Default Launcher on itel Vision 1 LTE

1. When you press the physical or on-screen **Home** button for the first time after installation, Android will prompt:
   - *"Select a Home app: MAKE DARK or itel OS Launcher"*
   - Select **MAKE DARK** and tap **Always**.
2. Or navigate manually to:
   - **Settings** > **Apps & notifications** > **Default apps** > **Home app** > Select **MAKE DARK**.

### Restoring the Stock itel Launcher
Open **MAKE DARK Settings** > Tap **"How to restore previous launcher?"** > Open **Android Settings > Default apps > Home app** and reselect your original launcher.

---

## 🤖 GitHub Actions CI/CD

This repository includes a continuous integration workflow at `.github/workflows/build-apk.yml`. Every commit to `main` compiles the project with Temurin JDK 17 and publishes the debug APK as an automated downloadable release artifact.
