# 앱 아이콘 & 스플래시 이미지 가이드

이 폴더에 아래 이미지 파일들을 준비해주세요.

## 필수 파일

| 파일명 | 크기 | 용도 |
|---|---|---|
| `icon.png` | 1024 x 1024px | 앱 아이콘 마스터 이미지 |
| `splash.png` | 2732 x 2732px | 스플래시 스크린 마스터 이미지 |

## 디자인 가이드

- **배경색**: `#1a365d` (다크 네이비)
- **로고/아이콘 색**: `#ffffff` (흰색)
- **아이콘 내부 여백**: 상하좌우 최소 15% 여백 확보
- **스플래시**: 중앙에 로고 배치, 배경은 브랜드 색상

## 자동 리사이즈 방법 (@capacitor/assets 사용)

```bash
# @capacitor/assets 설치
npm install --save-dev @capacitor/assets

# 위 파일 준비 후 자동 리사이즈 실행
npx capacitor-assets generate
```

이 명령어 한 번으로 Android / iOS 에 필요한 모든 해상도 아이콘과 스플래시가 자동 생성됩니다.

## 생성되는 파일 위치

```
android/app/src/main/res/
  mipmap-hdpi/     ic_launcher.png (72x72)
  mipmap-mdpi/     ic_launcher.png (48x48)
  mipmap-xhdpi/    ic_launcher.png (96x96)
  mipmap-xxhdpi/   ic_launcher.png (144x144)
  mipmap-xxxhdpi/  ic_launcher.png (192x192)
  drawable/        splash.png

ios/App/App/Assets.xcassets/
  AppIcon.appiconset/  (모든 iOS 사이즈 자동 생성)
  Splash.imageset/     (스플래시 이미지)
```
