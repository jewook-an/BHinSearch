# 보험업계 ATS (Applicant Tracking System)

보험업계 전문 채용관리 솔루션

## 프로젝트 개요

보험업계 경력자와 기업을 연결하는 스마트한 채용관리 시스템(ATS)입니다.

### 주요 기능

#### 사용자 유형별 기능

**1. 보험업계 경력자 (Basic User)**
- 경력별 맞춤 포지션 검색 (1년 미만 ~ 10년 이상)
- 프로필 및 이력서 관리
- 관심 포지션 즐겨찾기
- 지원 현황 추적
- 실시간 알림 기능
- 커뮤니티 참여

**2. 일반 구직자 (Job Seeker)**
- 보험업계 포지션 검색 및 지원
- 프로필 작성 및 관리
- 지원 현황 확인

**3. 인사담당자 (Recruiter)**
- 포지션 등록 및 관리
- 지원자 관리 시스템
- 면접 일정 관리
- 채용 통계 및 리포트

**4. 관리자 (Admin)**
- 사용자 관리
- 포지션 승인 및 관리
- 시스템 통계 및 리포트
- 커뮤니티 관리
- 보안 및 시스템 설정

**5. 게스트 사용자 (Guest)**
- 포지션 검색
- 일부 정보 열람
- 회원가입 유도

## 기술 스택

- **Frontend**: React 19.2.4
- **Routing**: React Router DOM
- **Styling**: CSS3 (CSS Variables & Flexbox/Grid)
- **State Management**: React Hooks (useState)

## 프로젝트 구조

```
bhinsearch/
├── public/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Header.js
│   │       ├── Header.css
│   │       ├── Footer.js
│   │       ├── Footer.css
│   │       └── Layout.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── HomePage.css
│   │   ├── LoginPage.js
│   │   ├── LoginPage.css
│   │   ├── RegisterPage.js
│   │   ├── RegisterPage.css
│   │   └── dashboard/
│   │       ├── ExperiencedUserDashboard.js
│   │       ├── ExperiencedUserDashboard.css
│   │       ├── AdminDashboard.js
│   │       ├── AdminDashboard.css
│   │       ├── RecruiterDashboard.js
│   │       └── RecruiterDashboard.css
│   ├── styles/
│   │   └── variables.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속

### 빌드

```bash
npm run build
```

## 주요 페이지

### 1. 메인 페이지 (/)
- Hero 섹션
- 주요 기능 소개
- 사용자 유형별 안내
- 통계 정보
- CTA (Call to Action)

### 2. 로그인 (/login)
- 이메일/비밀번호 로그인
- 소셜 로그인 (Google, Kakao)
- 로그인 상태 유지
- 비밀번호 찾기

### 3. 회원가입 (/register)
- 2단계 회원가입 프로세스
- 사용자 유형 선택
- 필수 정보 입력
- 약관 동의

### 4. 대시보드
- `/dashboard/experienced` - 보험업계 경력자 대시보드
- `/dashboard/recruiter` - 인사담당자 대시보드
- `/dashboard/admin` - 관리자 대시보드

## 개발 예정 기능

### 우선순위 높음
- [ ] 포지션 검색 및 필터링 기능
- [ ] 프로필 상세 페이지
- [ ] 이력서 관리 시스템
- [ ] 지원 프로세스 구현
- [ ] 알림 시스템

### 우선순위 중간
- [ ] 커뮤니티 기능
- [ ] 실시간 채팅 지원
- [ ] 면접 일정 관리
- [ ] 통계 대시보드 (차트 라이브러리 통합)
- [ ] 검색 필터 고도화

### 우선순위 낮음
- [ ] 모바일 앱 개발
- [ ] AI 기반 매칭 시스템
- [ ] 다국어 지원
- [ ] 해외 시장 진출

## 보안 및 규정 준수

- 개인정보 보호법 준수
- 데이터 암호화
- 접근 권한 관리
- 정기적인 보안 점검

## 참고 자료

- [ATS 개념 설명](https://blog.greetinghr.com/applicant-tracking-system/)
- React Documentation
- React Router Documentation

## 라이선스

Private Project

## 문의

지원이 필요하신 경우 이슈를 등록해주세요.
