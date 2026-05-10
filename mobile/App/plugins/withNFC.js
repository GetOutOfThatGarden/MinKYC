const { withAndroidManifest, withInfoPlist, withEntitlementsPlist } = require('@expo/config-plugins');

/**
 * Custom Expo Config Plugin for NFC configuration.
 * 1. Adds NFC permissions and feature to AndroidManifest.xml.
 * 2. Adds NFCReaderUsageDescription and AIDs to Info.plist for iOS.
 * 3. Adds NFC entitlements for iOS.
 */
const withNFC = (config) => {
  // --- Android ---
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }
    if (!androidManifest.manifest['uses-permission'].find(p => p.$['android:name'] === 'android.permission.NFC')) {
      androidManifest.manifest['uses-permission'].push({
        $: { 'android:name': 'android.permission.NFC' },
      });
    }

    if (!androidManifest.manifest['uses-feature']) {
      androidManifest.manifest['uses-feature'] = [];
    }
    if (!androidManifest.manifest['uses-feature'].find(f => f.$['android:name'] === 'android.hardware.nfc')) {
      androidManifest.manifest['uses-feature'].push({
        $: { 'android:name': 'android.hardware.nfc', 'android:required': 'true' },
      });
    }

    return config;
  });

  // --- iOS Info.plist ---
  config = withInfoPlist(config, (config) => {
    config.modResults.NFCReaderUsageDescription = 'MinKYC requires NFC access to scan your ePassport for identity verification.';
    config.modResults['com.apple.developer.nfc.readersession.iso7816.select-identifiers'] = [
      'A0000002471001', // ICAO AID for ePassports
    ];
    return config;
  });

  // --- iOS Entitlements ---
  config = withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.developer.nfc.readersession.formats'] = [
      'TAG', // Required for NFC tag reading
    ];
    return config;
  });

  return config;
};

module.exports = withNFC;
