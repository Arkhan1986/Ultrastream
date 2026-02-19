import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ultrastream.app',
  appName: 'UltraStream',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true, // Allow HTTP traffic
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;
