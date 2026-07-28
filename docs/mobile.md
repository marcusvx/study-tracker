# Mobile Apps (Android & iOS)

The Study Tracker mobile apps are Capacitor shells around the React/Vite frontend in `apps/frontend`. Native projects live under:

| Platform | Path |
| --- | --- |
| Android | `apps/frontend/android` |
| iOS | `apps/frontend/ios` |

| Setting | Value |
| --- | --- |
| App name | Study Tracker |
| Bundle / application ID | `info.marcusvinicius.studytracker` |
| Capacitor version | 8.x |
| Android `minSdk` / `targetSdk` | 24 / 36 |
| iOS deployment target | 15.0 |
| Current version | `1.0` (`versionCode` / `CURRENT_PROJECT_VERSION` = `1`) |

---

## Prerequisites

### Shared

- Node.js 20+
- Repository dependencies installed from the monorepo root:

```bash
npm install
```

- Frontend env configured:

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Set at least:

- `VITE_API_BASE_URL` — backend URL reachable from the device/emulator (not `localhost` on a physical device; see [API URL on devices](#api-url-on-devices))
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — if auth/Supabase features are used

### Android

- [Android Studio](https://developer.android.com/studio) (latest stable)
- Android SDK Platform matching `compileSdk` / `targetSdk` (36)
- A device or emulator
- JDK 17+ (bundled with Android Studio is fine)

### iOS

- macOS
- [Xcode](https://developer.apple.com/xcode/) 16+ (or current App Store version)
- Xcode Command Line Tools
- CocoaPods is **not** required for this project — Capacitor iOS uses Swift Package Manager (`CapApp-SPM`)
- Apple Developer account (required to run on a physical device and to publish)

---

## Shared Capacitor workflow

All commands below run from `apps/frontend` unless noted.

### Build the web app and sync native projects

```bash
cd apps/frontend
npm run cap:sync
```

This runs `npm run build` (TypeScript + Vite → `dist/`) then `npx cap sync`, copying the web assets into both Android and iOS projects and updating native dependencies.

Sync a single platform:

```bash
npm run build
npx cap sync android
npx cap sync ios
```

### Open native IDEs

```bash
npm run cap:open:android   # sync + open Android Studio
npm run cap:open:ios       # sync + open Xcode
```

Or after a sync:

```bash
npx cap open android
npx cap open ios
```

**Always re-run `cap:sync` (or at least `build` + `cap copy`) after frontend or env changes before testing on device/emulator.**

---

## API URL on devices

`VITE_*` variables are baked in at Vite build time.

| Target | Suggested `VITE_API_BASE_URL` |
| --- | --- |
| Android emulator → host machine | `http://10.0.2.2:3000` |
| iOS simulator → host machine | `http://localhost:3000` |
| Physical device (same LAN) | `http://<your-lan-ip>:3000` |
| Production / staging | `https://your-api.example.com` |

Ensure the backend allows CORS from the Capacitor origin if applicable, and that the API is reachable over the network you choose. HTTP cleartext may require extra Android/iOS ATS configuration for non-HTTPS APIs; prefer HTTPS for anything beyond local development.

---

## Android

### Run (debug)

1. Start the backend if the app needs the API (`npm run dev:backend` from the repo root, or your deployed API).
2. From `apps/frontend`:

```bash
npm run cap:open:android
```

3. In Android Studio: select a device/emulator → **Run** (▶).

CLI alternative (with a device/emulator already running):

```bash
cd apps/frontend
npm run build
npx cap sync android
cd android
./gradlew installDebug
```

### Build release artifacts

Bump versions in `apps/frontend/android/app/build.gradle` before each store release:

- `versionCode` — integer, must increase for every Play upload
- `versionName` — user-facing string (e.g. `"1.0.1"`)

#### Signing (required for release)

1. Create a keystore (once; store it securely, never commit it):

```bash
keytool -genkey -v -keystore study-tracker-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias study-tracker
```

2. Create `apps/frontend/android/key.properties` (gitignored locally; do not commit secrets):

```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=study-tracker
storeFile=/absolute/path/to/study-tracker-release.jks
```

3. Wire signing in `apps/frontend/android/app/build.gradle` (if not already present):

```gradle
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### AAB (Play Store) and APK

```bash
cd apps/frontend
npm run build
npx cap sync android
cd android
./gradlew bundleRelease   # → app/build/outputs/bundle/release/app-release.aab
./gradlew assembleRelease # → app/build/outputs/apk/release/app-release.apk
```

### Publish to Google Play

1. Create a [Google Play Console](https://play.google.com/console) app with package name `info.marcusvinicius.studytracker`.
2. Complete store listing, content rating, privacy policy, and target audience questionnaires.
3. Upload the signed `.aab` to an internal / closed / open testing track first, then promote to production.
4. For each new release: bump `versionCode` / `versionName`, rebuild with production `VITE_*` values, upload a new AAB.

#### Push notifications (optional)

If using Firebase Cloud Messaging, place `google-services.json` at:

`apps/frontend/android/app/google-services.json`

The Gradle build applies the Google Services plugin automatically when that file is present.

---

## iOS

### Run (debug)

1. Start the backend / configure production API URL as needed.
2. From `apps/frontend`:

```bash
npm run cap:open:ios
```

3. In Xcode:
   - Open the **App** scheme (`apps/frontend/ios/App/App.xcodeproj`).
   - Select a simulator or a signed physical device.
   - Set your **Team** under **Signing & Capabilities** for the `App` target (bundle ID `info.marcusvinicius.studytracker`).
   - Press **Run** (▶).

Do not hand-edit `CapApp-SPM` package sources; Capacitor manages SPM dependencies there.

### Build for distribution

Bump versions in Xcode (**App** target → **General**):

- **Version** (`MARKETING_VERSION`) — e.g. `1.0.1`
- **Build** (`CURRENT_PROJECT_VERSION`) — integer that must increase for each App Store / TestFlight upload

Or set them in `apps/frontend/ios/App/App.xcodeproj/project.pbxproj`.

Archive from Xcode:

1. `npm run cap:sync` (or `cap:open:ios`) with production env vars already applied in the Vite build.
2. Product → Destination → **Any iOS Device (arm64)**.
3. **Product → Archive**.
4. In Organizer: **Distribute App** → App Store Connect (or Ad Hoc / Enterprise as needed).

CLI (requires configured signing):

```bash
cd apps/frontend
npm run build
npx cap sync ios
xcodebuild -project ios/App/App.xcodeproj \
  -scheme App \
  -configuration Release \
  -archivePath build/App.xcarchive \
  archive
```

### Publish to App Store / TestFlight

1. Create the app in [App Store Connect](https://appstoreconnect.apple.com) with bundle ID `info.marcusvinicius.studytracker`.
2. Upload the archive via Xcode Organizer or [Transporter](https://apps.apple.com/app/transporter/id1450874784).
3. Process the build, then add it to a **TestFlight** group for beta testing.
4. Complete App Privacy, screenshots, age rating, and review information; submit for App Review when ready.
5. For each new release: bump Version/Build, rebuild with production `VITE_*` values, upload a new archive.

#### Push notifications (optional)

Enable the **Push Notifications** capability on the App target in Xcode and configure APNs keys/certificates in the Apple Developer portal and your push provider (e.g. Firebase).

---

## Version checklist before a store release

1. Set production `apps/frontend/.env` (`VITE_API_BASE_URL`, Supabase keys).
2. Bump native versions (Android `versionCode`/`versionName`, iOS Version/Build).
3. Run `npm run cap:sync` from `apps/frontend`.
4. Smoke-test on a device/emulator against the production API.
5. Produce signed AAB (Android) and Archive (iOS).
6. Upload to Play Console / App Store Connect and roll out via testing tracks first.

---

## Useful commands (quick reference)

| Command (from `apps/frontend`) | Purpose |
| --- | --- |
| `npm run build` | Build web assets to `dist/` |
| `npm run cap:sync` | Build + sync Android & iOS |
| `npm run cap:open:android` | Sync and open Android Studio |
| `npm run cap:open:ios` | Sync and open Xcode |
| `npx cap sync android` | Sync Android only (after `build`) |
| `npx cap sync ios` | Sync iOS only (after `build`) |
| `cd android && ./gradlew installDebug` | Install debug APK on connected device |
| `cd android && ./gradlew bundleRelease` | Build Play Store AAB |
