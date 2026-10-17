# TURBO APEX Android Wrapper

This repository includes an Android Studio project under `android-app/` that wraps the game in a simple `WebView` and loads the current HTML from GitHub.

## Build

1. Open Android Studio.
2. Choose `Open` and select the `android-app` folder.
3. Let Gradle sync.
4. Build -> Generate Signed Bundle / APK.

## App URL

The app loads:

https://raw.githubusercontent.com/eslamfathy55/Apex/main/index.html

## Notes

- No extra packaging is required to test immediately.
- If you want a fully offline APK, copy the final `index.html` and all local assets into `app/src/main/assets/www/` and load the local file instead.
- For production, use a proper signed keystore and upload via Play Console.
