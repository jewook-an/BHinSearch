# BHinSearch 모바일 앱 배포 가이드

React + Capacitor 기반으로 Google Play Store / Apple App Store 동시 출시

---

## 목차

1. [환경 준비](#1-환경-준비)
2. [패키지 설치 & Capacitor 초기화](#2-패키지-설치--capacitor-초기화)
3. [앱 아이콘 & 스플래시 생성](#3-앱-아이콘--스플래시-생성)
4. [Android 빌드 & Google Play 배포](#4-android-빌드--google-play-배포)
5. [iOS 빌드 & App Store 배포](#5-ios-빌드--app-store-배포)
6. [Google OAuth 모바일 설정](#6-google-oauth-모바일-설정)
7. [CORS & 백엔드 설정](#7-cors--백엔드-설정)

---

## 1. 환경 준비

### 공통 (Windows)
```bash
# Node.js 18 이상 확인
node --version

# Android Studio 설치
# https://developer.android.com/studio 에서 다운로드 & 설치
# 설치 후 SDK 설정:
#   Android Studio → SDK Manager → API Level 35 설치

# 환경변수 추가 (Windows 시스템 환경변수)
# ANDROID_SDK_ROOT = C:\Users\{사용자}\AppData\Local\Android\Sdk
# PATH 에 추가: %ANDROID_SDK_ROOT%\tools\bin
#              %ANDROID_SDK_ROOT%\platform-tools
```

### iOS (macOS만 가능 — Windows에서는 EAS Build 사용)
```bash
# macOS에서만:
xcode-select --install
sudo gem install cocoapods
```

---

## 2. 패키지 설치 & Capacitor 초기화

```bash
cd e:\Project\bhinsearch

# 1) 패키지 설치
npm install

# 2) Capacitor 초기화 (처음 한 번만)
npm run cap:init

# 3) Android/iOS 플랫폼 추가 (처음 한 번만)
npm run cap:add:android
npm run cap:add:ios        # macOS에서만

# 4) 웹 빌드 후 네이티브 동기화
npm run cap:sync
```

---

## 3. 앱 아이콘 & 스플래시 생성

```bash
# @capacitor/assets 설치
npm install --save-dev @capacitor/assets

# resources/ 폴더에 이미지 준비 (resources/README.md 참고)
# - resources/icon.png     (1024x1024)
# - resources/splash.png   (2732x2732)

# 자동 생성
npx capacitor-assets generate
```

---

## 4. Android 빌드 & Google Play 배포

### 4-1. 개발자 계정 등록
- https://play.google.com/console 접속
- 개발자 계정 등록 ($25 일회성 등록비)

### 4-2. 디버그 빌드 (테스트용)
```bash
npm run android
# → Android Studio가 열림 → Run 버튼으로 에뮬레이터/실기기 테스트
```

### 4-3. 릴리즈 키스토어 생성 (최초 1회)
```bash
# Android Studio Terminal 또는 PowerShell에서:
keytool -genkey -v -keystore bhinsearch.keystore \
  -alias bhinsearch \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 생성 후 bhinsearch.keystore 파일을 안전한 곳에 보관!
# (분실 시 앱 업데이트 불가)
```

### 4-4. 릴리즈 AAB 빌드

Android Studio에서 직접 빌드:
```
Build → Generate Signed Bundle/APK
  → Android App Bundle (AAB) 선택
  → 위에서 만든 키스토어 정보 입력
  → Release 선택
  → Finish
```

결과물: `android/app/build/outputs/bundle/release/app-release.aab`

### 4-5. Google Play Console 업로드
1. Google Play Console → 앱 만들기
2. 앱 정보 입력:
   - 앱 이름: `BHinSearch - 보험업계 채용`
   - 기본 언어: 한국어 (ko-KR)
   - 앱 카테고리: 비즈니스
3. 내부 테스트 → 새 릴리즈 만들기 → AAB 업로드
4. 앱 콘텐츠 설문 작성 (개인정보처리방침 URL 필요)
5. 심사 제출

### 개인정보처리방침 URL
```
현재 GitHub Pages 사이트 활용 가능:
https://jewook-an.github.io/BHinSearch/privacy-policy.html
```

---

## 5. iOS 빌드 & App Store 배포

> **Windows 사용자**: macOS 없이도 클라우드 빌드 서비스를 통해 가능

### 5-1. Apple Developer 계정 등록
- https://developer.apple.com/programs/ ($99/년)

### 옵션 A: macOS에서 직접 빌드
```bash
npm run ios
# → Xcode가 열림

# Xcode에서:
# 1) Team 설정 (Signing & Capabilities)
# 2) Bundle Identifier: com.bhinsearch.app
# 3) Product → Archive
# 4) Distribute App → App Store Connect
```

### 옵션 B: Ionic Cloud Build (Windows에서 iOS 빌드)
```bash
# Ionic Cloud 계정 필요 (https://ionic.io/cloud)
npm install -g @ionic/cloud-cli
ionic cloud build ios
```

### 옵션 C: GitHub Actions + Fastlane (CI/CD)
아래 `.github/workflows/ios-build.yml` 참고

### 5-2. App Store Connect 업로드
1. https://appstoreconnect.apple.com 접속
2. 새 앱 등록:
   - 번들 ID: `com.bhinsearch.app`
   - SKU: `bhinsearch-001`
   - 앱 이름: `BHinSearch`
3. 빌드 업로드 후 심사 제출
4. 심사 소요: 보통 1~3일

---

## 6. Google OAuth 모바일 설정

Google Cloud Console에서 모바일 클라이언트 ID를 별도 생성해야 합니다.

```
Google Cloud Console → API 및 서비스 → 사용자 인증정보
→ 사용자 인증 정보 만들기 → OAuth 클라이언트 ID

[Android]
  패키지 이름: com.bhinsearch.app
  SHA-1 인증서 지문:
  keytool -list -v -keystore bhinsearch.keystore -alias bhinsearch

[iOS]
  번들 ID: com.bhinsearch.app
```

### .env에 추가
```env
REACT_APP_GOOGLE_CLIENT_ID_ANDROID=발급받은_안드로이드_클라이언트ID
REACT_APP_GOOGLE_CLIENT_ID_IOS=발급받은_iOS_클라이언트ID
```

---

## 7. CORS & 백엔드 설정

모바일 앱에서 백엔드 호출 시 Origin이 `capacitor://localhost` 또는 `https://localhost`로 변경됩니다.

### backend/main.py (또는 CORS 설정 파일)에 추가 필요
```python
origins = [
    "http://localhost:3000",
    "https://jewook-an.github.io",
    "capacitor://localhost",       # ← Android Capacitor
    "https://localhost",           # ← iOS Capacitor
    "http://localhost",
]
```

---

## 빠른 시작 체크리스트

- [ ] Android Studio 설치 완료
- [ ] `npm install` 실행
- [ ] `npm run cap:add:android` 실행
- [ ] `npm run cap:sync` 실행
- [ ] `resources/icon.png` (1024x1024) 준비
- [ ] `resources/splash.png` (2732x2732) 준비
- [ ] `npx capacitor-assets generate` 실행
- [ ] Google Play Console 개발자 계정 등록
- [ ] 키스토어 생성 및 백업
- [ ] 릴리즈 AAB 빌드
- [ ] Google Play Console 업로드 & 제출

---

## 트러블슈팅

### Android 빌드 에러: SDK not found
```bash
# 환경변수 확인
echo $ANDROID_SDK_ROOT
# 설정 안 되어있으면 local.properties 파일에 추가:
# android/local.properties
# sdk.dir=C:\\Users\\{사용자}\\AppData\\Local\\Android\\Sdk
```

### 앱에서 API 호출 안 됨 (Network Error)
- `capacitor.config.ts`의 `server.cleartext: false` 확인
- 백엔드 Origin 허용 목록에 `capacitor://localhost` 추가 확인

### 스플래시 안 사라짐
- `npm run cap:sync` 재실행
- `SplashScreen.hide()` 호출이 되는지 확인 (App.js AppInitializer)
