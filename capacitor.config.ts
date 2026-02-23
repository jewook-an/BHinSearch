import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhinsearch.app',
  appName: 'BHinSearch',
  webDir: 'build',
  server: {
    // 개발 중에는 아래 androidScheme 사용, 배포 시에는 제거
    androidScheme: 'https',
    hostname: 'localhost',
    // 로컬 개발 테스트 시: url 주석 해제하고 PC IP 입력
    // url: 'http://192.168.x.x:3000',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: '#1a365d',       // 네이비 배경
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',                    // 상태바 아이콘 색상 (밝은 배경에서 어두운 아이콘)
      backgroundColor: '#1a365d',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#1a365d',
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '36041664943-83vrbe08pdalj9r22b12jvr1t7fminj7.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
  android: {
    buildOptions: {
      keystorePath: 'bhinsearch.keystore',
      keystoreAlias: 'bhinsearch',
    },
    minSdkVersion: 23,                  // Android 6.0 이상
    targetSdkVersion: 35,
    backgroundColor: '#ffffff',
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    backgroundColor: '#ffffff',
    scheme: 'BHinSearch',
  },
};

export default config;
