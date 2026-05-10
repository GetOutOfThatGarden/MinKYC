import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MinKYC',
  slug: 'minkyc',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.minkyc.app',
  },
  android: {
    package: 'com.minkyc.app',
  },
  plugins: [
    'expo-dev-client',
  ],
});
