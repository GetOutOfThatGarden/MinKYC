# Research: NFC ePassport Scanning (ICAO Doc 9303)

**Project:** MinKYC
**Focus:** React Native / Android / Expo
**Date:** March 2025
**Confidence:** HIGH (Based on ecosystem analysis and current codebase)

## 1. Library Evaluation

### react-native-nfc-manager (The Standard)
*   **Role:** Provides low-level access to the NFC chip (transceive APDUs).
*   **Android Support:** Excellent. It's the most used NFC library in the ecosystem.
*   **Reliability:** High, but requires manual implementation of the ICAO 9303 protocol.
*   **Status in MinKYC:** Currently used for initial tag detection (`IsoDep`).

### react-native-nfc-passport-reader (Specialized)
*   **Role:** High-level wrapper that implements BAC (Basic Access Control) and secure messaging.
*   **Android Support:** Good, but often relies on older native dependencies (like an old `jMRTD` or `OpenSSL` wrapper).
*   **Reliability:** Mixed. Many versions only support BAC. If a passport requires PACE (common in newer EU passports), this library will fail.
*   **Status in MinKYC:** Currently used for the actual reading process. Version `0.2.5` is relatively old.

### Recommended Alternative: @2060.io/react-native-eid-reader
*   **Why:** It is a modern, active fork that supports both **BAC** and **PACE**.
*   **Benefits:** TurboModule support, better image extraction, and more robust error handling for modern Android versions.

---

## 2. Universal Android Support & Reliability

Android's NFC landscape is fragmented. Key considerations for "Universal" support:

*   **Chip Variability:** Some phones (mostly older or budget models) use NFC controllers that have shorter timeouts or smaller buffer sizes, which can cause `Transceive` errors during large data transfers (like the high-res photo in DG2).
*   **Polling Rate:** Android handles polling differently than iOS. The "Tag Lost" error is common if the user moves the phone even slightly.
*   **Permissions:** Requires `android.permission.NFC` and `<uses-feature android:name="android.hardware.nfc" />`.
*   **Foreground Dispatch:** On Android, the app must manage the `ForegroundDispatch` to "capture" the NFC event before the system does.

---

## 3. Expo Limitations & Configuration

While MinKYC is currently a Bare React Native project, if it moves toward an Expo-managed workflow or uses EAS, the following applies:

### The "Expo Go" Wall
*   **NFC is NOT supported in Expo Go.**
*   You **must** use **Development Builds** (`npx expo run:android`).

### Configuration Requirements (Config Plugins)
To make these libraries work in an Expo/EAS environment, a Config Plugin is required to:
1.  **Add Permissions:** Inject NFC permissions into `AndroidManifest.xml`.
2.  **AIDs (Application Identifiers):** On iOS, passports require specific AIDs (`A0000002471001`) to be listed in `Info.plist` under `com.apple.developer.nfc.readersession.iso7816.select-identifiers`.
3.  **Entitlements:** Enable the NFC capability in the Xcode project.

---

## 4. Technical Constraints (ICAO 9303)

| Standard | Description | Support Status |
| :--- | :--- | :--- |
| **BAC** | Basic Access Control (Uses Passport No, DOB, Expiry). | Supported by `passport-reader`. |
| **PACE** | Password Authenticated Connection Establishment. | **NOT** supported by current `passport-reader` (requires library upgrade). |
| **Passive Auth** | Verifies that the data hasn't been tampered with. | Often skipped in MVPs but critical for production KYC. |
| **Active Auth** | Verifies the chip isn't a clone (requires private key). | High complexity, requires hardware support on the chip. |

---

## 5. Recommendation for MinKYC

1.  **Upgrade the NFC Library:** Transition from `react-native-nfc-passport-reader` to `@2060.io/react-native-eid-reader` to ensure future compatibility with PACE-enabled passports.
2.  **Implement MRZ OCR:** Relying on manual entry of passport details for the BAC key is error-prone. Use `react-native-vision-camera` (already in `package.json`) to scan the MRZ first.
3.  **Haptic Feedback:** Implement haptics to signal "Tag Detected" vs "Reading Progress" vs "Finished" to improve the user UX (NFC is invisible and frustrating without it).
4.  **Error Recovery:** The current `useNFC.ts` stops `NfcManager` before calling the reader. This is correct, but ensure there's a reliable "Reset" state if the read fails halfway.

## Sources
*   [ICAO Doc 9303 Part 11](https://www.icao.int/publications/pages/publication.aspx?docnum=9303)
*   [react-native-nfc-manager GitHub](https://github.com/revtel/react-native-nfc-manager)
*   [@2060.io/react-native-eid-reader Documentation](https://github.com/2060-io/react-native-eid-reader)
