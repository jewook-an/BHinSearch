# GitHub Pages 배포 문제 해결 가이드

## 📋 발생한 문제

### 증상
- ✅ `http://localhost:3000` - 정상 작동
- ❌ `https://jewook-an.github.io/BHinSearch` - 빈 화면 표시

### 원인 분석

#### 1️⃣ **React Router의 basename 미설정**
**문제**: GitHub Pages는 서브디렉토리(`/BHinSearch`)로 배포되는데, React Router가 이를 인식하지 못함

```
GitHub Pages URL 구조:
https://jewook-an.github.io/BHinSearch
                          ↑
                    이 부분을 Router가 인식 못함
```

**증상**:
- 라우팅이 루트(`/`)에서만 작동 시도
- 모든 경로가 404 또는 빈 화면
- CSS/JS 파일 경로도 잘못 참조

**원인 코드**:
```javascript
// src/App.js (수정 전)
<Router>
  <Routes>
    <Route path="/" element={...} />  // ❌ /BHinSearch 인식 못함
  </Routes>
</Router>
```

---

#### 2️⃣ **SPA 라우팅 처리 미흡**
**문제**: Single Page Application(SPA)의 클라이언트 라우팅 특성

GitHub Pages는 정적 파일 호스팅만 제공하므로:
- `/BHinSearch/positions` 같은 경로로 직접 접근 시 → 서버는 해당 HTML 파일을 찾으려 함
- 실제로는 `index.html` 하나만 존재
- 결과: **404 Not Found 에러**

**발생 시나리오**:
```
❌ 직접 URL 입력: https://jewook-an.github.io/BHinSearch/positions
❌ 페이지 새로고침: F5 키 누름
❌ 브라우저 뒤로가기 후 새로고침
```

---

#### 3️⃣ **404 에러 처리 없음**
**문제**: GitHub Pages에 404.html 파일이 없어서 에러 발생 시 처리 불가

---

## 🔧 수정 사항

### 1. React Router에 basename 추가

**파일**: `src/App.js`

```javascript
// 수정 전
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        ...
      </Routes>
    </Router>
  );
}

// 수정 후
function App() {
  return (
    <Router basename="/BHinSearch">  {/* ✅ basename 추가 */}
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        ...
      </Routes>
    </Router>
  );
}
```

**효과**:
- 모든 경로 앞에 `/BHinSearch` 자동 추가
- `path="/"` → 실제로는 `/BHinSearch/`로 작동
- `path="/positions"` → 실제로는 `/BHinSearch/positions`로 작동

---

### 2. 404.html 파일 추가 (SPA 폴백)

**파일**: `public/404.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>BHinSearch - Redirecting...</title>
    <script type="text/javascript">
      // GitHub Pages SPA 라우팅 해결
      // 404 에러 발생 시 → index.html로 리다이렉트하면서 경로 정보 유지
      var pathSegmentsToKeep = 1; // /BHinSearch 유지
      
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

**동작 원리**:
1. 사용자가 `/BHinSearch/positions` 직접 접근
2. GitHub Pages: "해당 파일 없음" → 404.html 표시
3. 404.html 스크립트: 경로를 쿼리 파라미터로 변환하여 index.html로 리다이렉트
4. index.html 스크립트: 쿼리 파라미터를 다시 경로로 복원
5. React Router: 복원된 경로로 정상 라우팅

**변환 예시**:
```
입력: /BHinSearch/positions
  ↓ (404 발생)
변환: /BHinSearch/?/positions
  ↓ (index.html 로드)
복원: /BHinSearch/positions
  ↓
React Router 처리 ✅
```

---

### 3. index.html에 SPA 라우팅 스크립트 추가

**파일**: `public/index.html`

```html
<head>
  <!-- 기존 내용... -->
  
  <!-- Single Page Apps for GitHub Pages -->
  <script type="text/javascript">
    // 404.html에서 리다이렉트된 경로를 복원
    (function(l) {
      if (l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    }(window.location))
  </script>
  
  <title>보험업계 ATS - 채용관리 솔루션</title>
</head>
```

**효과**:
- 404.html에서 전달받은 경로 정보를 브라우저 주소창에 복원
- 사용자는 정상적인 URL을 보게 됨
- 브라우저 히스토리도 올바르게 유지

---

### 4. 타이틀 변경

**파일**: `public/index.html`

```html
<!-- 수정 전 -->
<title>React App</title>

<!-- 수정 후 -->
<title>보험업계 ATS - 채용관리 솔루션</title>
```

---

## 📊 문제 해결 흐름도

### 수정 전 (빈 화면)
```
사용자 접근: https://jewook-an.github.io/BHinSearch
    ↓
index.html 로드 ✅
    ↓
React Router 시작 (basename 없음)
    ↓
경로 인식: "/" (❌ /BHinSearch를 인식 못함)
    ↓
매칭되는 라우트 없음
    ↓
빈 화면 표시 ❌
```

### 수정 후 (정상 작동)
```
사용자 접근: https://jewook-an.github.io/BHinSearch
    ↓
index.html 로드 ✅
    ↓
React Router 시작 (basename="/BHinSearch")
    ↓
경로 인식: "/BHinSearch" ✅
    ↓
HomePage 렌더링
    ↓
정상 화면 표시 ✅
```

### 직접 URL 접근 시 (수정 후)
```
사용자 접근: https://jewook-an.github.io/BHinSearch/positions
    ↓
GitHub Pages: 해당 파일 없음
    ↓
404.html 제공 ✅
    ↓
리다이렉트 스크립트 실행
    ↓
변환: /BHinSearch/?/positions
    ↓
index.html 로드
    ↓
경로 복원 스크립트 실행
    ↓
주소창: /BHinSearch/positions
    ↓
React Router: PositionsPage 렌더링 ✅
```

---

## ✅ 배포 단계

### 1. 빌드
```bash
npm run build
```

### 2. 배포
```bash
npm run deploy
```

또는 수동:
```bash
npm run build
npx gh-pages -d build
git checkout main
```

### 3. 확인
- GitHub Pages 설정: Settings → Pages → Source를 `gh-pages` 브랜치로 설정
- URL 접근: https://jewook-an.github.io/BHinSearch

---

## 🔍 로컬 테스트 방법

### basename과 함께 로컬 테스트
```bash
# 로컬에서도 /BHinSearch 경로로 테스트하려면
npm start
# 브라우저: http://localhost:3000/BHinSearch
```

**주의**: `basename="/BHinSearch"`가 설정되어 있으므로:
- ✅ `http://localhost:3000/BHinSearch` - 정상 작동
- ❌ `http://localhost:3000` - 빈 화면 (basename이 다름)

### 로컬 개발 시 basename 제거 (선택사항)
개발 시 편의를 위해 환경변수로 basename 조건부 설정 가능:

```javascript
// src/App.js
const basename = process.env.NODE_ENV === 'production' ? '/BHinSearch' : '';

function App() {
  return (
    <Router basename={basename}>
      ...
    </Router>
  );
}
```

이렇게 하면:
- 개발 환경: `http://localhost:3000` (basename 없음)
- 프로덕션: `https://jewook-an.github.io/BHinSearch` (basename 적용)

---

## 📚 추가 참고사항

### GitHub Pages의 제약사항
1. **정적 호스팅만 가능** - 서버 사이드 로직 불가
2. **모든 경로는 파일로 해석** - 클라이언트 라우팅 직접 지원 안함
3. **루트 또는 서브디렉토리만 가능** - 복잡한 URL 구조 불가

### React Router의 basename
- basename은 앱의 "기본 URL"을 설정
- 모든 라우트는 이 basename을 기준으로 작동
- Link, useNavigate 등도 자동으로 basename 포함

### 404.html의 필요성
- **서버 사이드 렌더링(SSR)을 사용하지 않는 모든 SPA에 필요**
- Vercel, Netlify 등은 자동으로 처리해주지만, GitHub Pages는 수동 설정 필요

---

## 🎯 체크리스트

배포 전 확인사항:

- [ ] `package.json`에 `homepage` 설정됨
- [ ] `src/App.js`에 `basename` 설정됨
- [ ] `public/404.html` 파일 존재
- [ ] `public/index.html`에 SPA 라우팅 스크립트 추가
- [ ] 빌드 성공 (`npm run build`)
- [ ] 로컬에서 빌드 파일 테스트 (`npx serve -s build`)
- [ ] GitHub Pages 설정 확인 (gh-pages 브랜치)

---

## 🔧 트러블슈팅

### Q1: 여전히 빈 화면이 나옵니다
**A**: 브라우저 캐시 문제일 수 있습니다.
- 하드 새로고침: `Ctrl + Shift + R` (Windows) 또는 `Cmd + Shift + R` (Mac)
- 시크릿 모드로 접속
- 브라우저 캐시 완전 삭제

### Q2: CSS가 적용되지 않습니다
**A**: `package.json`의 `homepage` 설정을 확인하세요. 대소문자까지 정확해야 합니다.

### Q3: 일부 페이지만 작동합니다
**A**: 404.html이 제대로 배포되었는지 확인하세요.
```bash
# build 폴더에 404.html이 있는지 확인
ls build/404.html
```

### Q4: GitHub Pages에서 404 에러가 계속 발생합니다
**A**: GitHub Pages 설정에서 소스 브랜치가 `gh-pages`로 되어 있는지 확인하세요.

---

## 📌 요약

### 핵심 수정 3가지
1. **basename="/BHinSearch"** - React Router가 서브디렉토리 인식
2. **404.html** - 직접 URL 접근 시 SPA 라우팅 유지
3. **index.html 스크립트** - 404에서 전달된 경로 복원

### 작동 원리
```
GitHub Pages (정적 호스팅)
    ↓
basename으로 서브디렉토리 인식
    ↓
404.html로 SPA 라우팅 폴백
    ↓
index.html에서 경로 복원
    ↓
React Router로 페이지 렌더링 ✅
```

이제 로컬과 GitHub Pages 모두에서 정상적으로 작동합니다! 🎉
