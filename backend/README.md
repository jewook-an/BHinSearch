# 백엔드 API 서버

보험업계 ATS 백엔드 서버 - FastAPI + MongoDB

## � 문서

- **[배포 가이드](DEPLOYMENT.md)** - Render, Railway 등 클라우드 배포 방법
- **API 문서**: http://localhost:8001/docs (로컬)
- **배포된 API**: https://your-app.onrender.com/docs

## �📊 프로젝트 현황

✅ **완료된 작업**
- [x] 백엔드 프로젝트 구조 생성
- [x] FastAPI 서버 구축 및 설정
- [x] MongoDB Atlas 클라우드 DB 연결
- [x] JWT 인증 시스템 구현
- [x] 회원가입/로그인 API 구현
- [x] 프로필 CRUD API 구현 (완성도 계산 알고리즘 포함)
- [x] 포지션 관리 API 구현 (필터링/검색 기능)
- [x] 지원 관리 API 구현 (상태 추적)
- [x] 파일 업로드 기능 구현 (이력서/자기소개서/프로필 이미지)
- [x] 알림 시스템 구축 (지원/상태변경 알림)
- [x] API 테스트 완료 (Swagger UI)

🚀 **다음 작업**
- [ ] 프론트엔드-백엔드 연동
- [ ] 실시간 알림 (WebSocket) 추가 (선택사항)
- [ ] 이메일 알림 기능 (선택사항)

## 기술 스택

- **FastAPI**: 고성능 웹 프레임워크
- **MongoDB**: NoSQL 데이터베이스
- **Beanie**: MongoDB ODM
- **JWT**: 토큰 기반 인증
- **Python 3.10+**

## 설치 및 실행

### 1. 가상환경 생성 (선택사항)

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. MongoDB 설정

**현재 MongoDB Atlas (클라우드) 사용 중**

`.env` 파일에 이미 MongoDB Atlas 연결 문자열이 설정되어 있습니다.

```env
MONGODB_URL=mongodb+srv://bhinsearch_user:PASSWORD@bhinsearch-cluster.9cvdnxk.mongodb.net/?appName=bhinsearch-cluster
```

로컬 MongoDB 사용 시:
- [MongoDB 설치 가이드](https://www.mongodb.com/try/download/community)
- 기본 포트: 27017
- `.env`의 MONGODB_URL을 `mongodb://localhost:27017`로 변경

### 4. 환경 변수 설정

`.env` 파일을 생성하거나 기존 파일을 수정합니다.

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=bhinsearch_db
SECRET_KEY=your-secret-key-here
```

### 5. 서버 실행

```bash
# 개발 모드 (자동 리로드)
uvicorn main:app --host 0.0.0.0 --port 8001 --reload

# 또는 기본 포트 8000
uvicorn main:app --reload
```

서버가 실행되면:
- API: http://localhost:8001 (또는 8000)
- API 문서 (Swagger): http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

**현재 서버 상태**: ✅ 포트 8001에서 실행 중

## API 엔드포인트

### 인증 (Auth)

- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/token` - 토큰 발급 (폼 데이터)

### 사용자 (Users)

- `GET /api/v1/users/me` - 내 정보 조회
- `GET /api/v1/users/{user_id}` - 사용자 정보 조회

### 프로필 (Profiles)

- `POST /api/v1/profiles/` - 프로필 생성
- `GET /api/v1/profiles/me` - 내 프로필 조회
- `PUT /api/v1/profiles/me` - 내 프로필 수정
- `GET /api/v1/profiles/{user_id}` - 사용자 프로필 조회

### 포지션 (Positions)

- `GET /api/v1/positions/` - 포지션 목록 조회
- `GET /api/v1/positions/{position_id}` - 포지션 상세 조회
- `POST /api/v1/positions/` - 포지션 등록 (리크루터/관리자)
- `PUT /api/v1/positions/{position_id}` - 포지션 수정
- `DELETE /api/v1/positions/{position_id}` - 포지션 삭제

### 지원 관리 (Applications)

- `POST /api/v1/applications/` - 포지션 지원
- `GET /api/v1/applications/my-applications` - 내 지원 내역
- `GET /api/v1/applications/{application_id}` - 지원 상세
- `PUT /api/v1/applications/{application_id}/status` - 지원 상태 변경
- `GET /api/v1/applications/position/{position_id}/applicants` - 포지션 지원자 목록

### 파일 업로드 (Files)

- `POST /api/v1/files/upload-resume` - 이력서 업로드
- `POST /api/v1/files/upload-cover-letter` - 자기소개서 업로드
- `GET /api/v1/files/download-resume` - 내 이력서 다운로드
- `GET /api/v1/files/download-cover-letter` - 내 자기소개서 다운로드
- `GET /api/v1/files/download-resume/{user_id}` - 지원자 이력서 다운로드 (리크루터)
- `GET /api/v1/files/download-cover-letter/{user_id}` - 지원자 자기소개서 (리크루터)
- `DELETE /api/v1/files/delete-resume` - 내 이력서 삭제
- `DELETE /api/v1/files/delete-cover-letter` - 내 자기소개서 삭제

### 알림 (Notifications)

- `GET /api/v1/notifications/` - 알림 목록 조회 (페이지네이션)
- `GET /api/v1/notifications/unread-count` - 안 읽은 알림 개수
- `GET /api/v1/notifications/stats` - 알림 통계
- `GET /api/v1/notifications/{notification_id}` - 알림 상세
- `PATCH /api/v1/notifications/{notification_id}/read` - 알림 읽음 표시
- `PATCH /api/v1/notifications/read-all` - 모든 알림 읽음
- `DELETE /api/v1/notifications/{notification_id}` - 알림 삭제
- `DELETE /api/v1/notifications/` - 알림 전체 삭제

## 프로젝트 구조

```
backend/
├── main.py                 # FastAPI 앱 진입점
├── requirements.txt        # 의존성
├── .env                    # 환경 변수
├── .env.example           # 환경 변수 예시
├── uploads/               # 업로드된 파일 저장
│   ├── resumes/           # 이력서
│   ├── cover_letters/     # 자기소개서
│   └── profile_images/    # 프로필 이미지
└── app/
    ├── __init__.py
    ├── config.py          # 설정
    ├── database.py        # DB 연결
    ├── models/            # 데이터 모델
    │   ├── user.py
    │   ├── profile.py
    │   ├── position.py
    │   ├── application.py
    │   └── notification.py
    ├── schemas/           # Pydantic 스키마
    │   ├── user.py
    │   ├── profile.py
    │   └── notification.py
    ├── routers/           # API 라우터
    │   ├── auth.py
    │   ├── users.py
    │   ├── profiles.py
    │   ├── positions.py
    │   ├── applications.py
    │   ├── files.py
    │   └── notifications.py
    └── utils/             # 유틸리티
        └── auth.py        # 인증 헬퍼
```

## 데이터 모델

### User (사용자)
- email, password, name, phone
- user_type: experienced|recruiter|admin|guest

### Profile (프로필)
- 기본 정보, 경력, 학력, 자격증, 기술
- 프로필 완성도 자동 계산

### Position (포지션)
- 채용 공고 정보
- 조회수, 지원자 수 통계

### Application (지원)
- 지원 현황 관리
- 상태: pending|reviewing|interview|accepted|rejected

### Notification (알림)
- 사용자 알림 관리
- 타입: 지원완료, 상태변경, 면접일정 등
- 자동 알림 생성 (지원 시, 상태 변경 시)

## 인증 방식

JWT (JSON Web Token) 기반 인증

```python
# 로그인 후 토큰 받기
response = requests.post("/api/v1/auth/login", json={
    "email": "user@example.com",
    "password": "password123"
})
token = response.json()["access_token"]

# API 요청 시 헤더에 포함
headers = {"Authorization": f"Bearer {token}"}
```

## 테스트

API 문서 (http://localhost:8001/docs)에서 직접 테스트 가능합니다.

### Swagger UI에서 인증 테스트

1. **회원가입**: `POST /api/v1/auth/register` 실행
2. **Authorize 클릭**: 페이지 우측 상단의 🔒 버튼
3. **로그인 정보 입력**:
   - username: 이메일
   - password: 비밀번호
   - (client_id, client_secret는 비워두기)
4. **Authorize** 후 Close
5. 🔒 아이콘이 닫힌 상태가 되면 인증 완료!
6. 이제 인증이 필요한 API 테스트 가능

## 🚀 배포 가이드

### GitHub vs 실제 배포

**GitHub에 코드를 올리는 것 ≠ 서버 배포**

- **GitHub**: 소스코드 저장소 (코드 보관만 가능)
- **서버 배포**: 실제로 서버를 실행시켜서 외부에서 접속 가능하게 만드는 것

### 로컬 vs 배포 환경

| 구분 | 로컬 개발 | 배포 후 |
|------|-----------|---------|
| 접속 URL | `http://localhost:8001` | `https://your-app.onrender.com` |
| API 문서 | `http://localhost:8001/docs` | `https://your-app.onrender.com/docs` |
| 데이터베이스 | MongoDB Atlas (이미 클라우드) | 동일 (MongoDB Atlas) |
| 환경 변수 | `.env` 파일 | 호스팅 서비스의 환경변수 설정 |

### 백엔드 배포 옵션

#### 1. Railway (추천 ⭐)
- 무료 플랜: $5 크레딧/월
- Python FastAPI 지원 우수
- 자동 HTTPS

**배포 방법:**
```bash
# 1. Railway CLI 설치
npm i -g @railway/cli

# 2. 로그인
railway login

# 3. 프로젝트 초기화
railway init

# 4. 배포
railway up
```

**환경 변수 설정:**
```
MONGODB_URL=mongodb+srv://...
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=["https://jewook-an.github.io"]
```

**배포 후 접속:**
- Railway가 제공하는 URL: `https://your-project.up.railway.app`
- API 문서: `https://your-project.up.railway.app/docs`

#### 2. Render
- 무료 플랜 제공 (제한적)
- 자동 배포 지원

**배포 방법:**
1. [Render.com](https://render.com) 회원가입
2. "New Web Service" 클릭
3. GitHub 저장소 연결
4. 설정:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. 환경 변수 추가 (MONGODB_URL, SECRET_KEY 등)
6. Create Web Service

**배포 후 접속:**
- Render가 제공하는 URL: `https://your-app.onrender.com`
- API 문서: `https://your-app.onrender.com/docs`

#### 3. Heroku
- 무료 플랜 폐지 (유료만 가능)
- $7/월부터 시작

**필요 파일:**
1. `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. `runtime.txt`:
```
python-3.10.12
```

#### 4. AWS EC2 / Azure / GCP
- 완전한 제어 가능
- 복잡한 설정 필요
- 비용 발생 가능

### 배포 후 테스트 방법

**1. API 문서 접속**
```
https://your-deployed-url.com/docs
```

**2. Postman/Insomnia 사용**
```
POST https://your-deployed-url.com/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**3. curl 명령어**
```bash
# 회원가입
curl -X POST https://your-app.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","name":"테스트"}'

# 로그인
curl -X POST https://your-app.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

**4. 브라우저 개발자 도구**
```javascript
// 콘솔에서 테스트
fetch('https://your-app.com/api/v1/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'test@example.com', password: 'test1234'})
})
.then(r => r.json())
.then(console.log)
```

### 프론트엔드 연동

**GitHub Pages (jewook-an.github.io)와 연결 시:**

1. **백엔드 CORS 설정 업데이트** (`.env`):
```env
ALLOWED_ORIGINS=["https://jewook-an.github.io","http://localhost:3000"]
```

2. **프론트엔드에서 API 호출**:
```javascript
// config.js
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-app.onrender.com/api/v1'
  : 'http://localhost:8001/api/v1';

// API 호출 예시
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email, password})
})
```

### 배포 체크리스트

배포 전 확인사항:
- [ ] `.env` 파일을 `.gitignore`에 추가 (보안)
- [ ] `SECRET_KEY`를 강력한 랜덤 값으로 변경
- [ ] `ALLOWED_ORIGINS`에 프론트엔드 도메인 추가
- [ ] MongoDB Atlas 연결 문자열 확인
- [ ] `requirements.txt` 업데이트됨
- [ ] 모든 API 엔드포인트 로컬에서 테스트 완료

배포 후 확인사항:
- [ ] `https://your-app.com/docs` 접속 확인
- [ ] 회원가입/로그인 테스트
- [ ] 프론트엔드에서 API 호출 테스트
- [ ] CORS 에러 없는지 확인
- [ ] MongoDB 연결 확인

### 로그 확인

**Railway:**
```bash
railway logs
```

**Render:**
- 대시보드에서 "Logs" 탭 확인

**Heroku:**
```bash
heroku logs --tail
```

### 일반적인 배포 문제 해결

**1. CORS 에러**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
→ `.env`의 `ALLOWED_ORIGINS`에 프론트엔드 도메인 추가

**2. MongoDB 연결 실패**
```
ServerSelectionTimeoutError: ...
```
→ MongoDB Atlas에서 Network Access에 `0.0.0.0/0` (모든 IP) 허용

**3. 환경 변수 인식 안됨**
→ 호스팅 서비스의 환경변수 설정 페이지에서 수동 입력 필요

**4. Port 에러**
```
Error: Port 8001 is already in use
```
→ 배포 환경에서는 `PORT` 환경변수 사용:
```python
# main.py 마지막에
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
```

---

## 🌐 프로덕션 배포

### 빠른 시작 (Render - 무료)

1. **Render.com 가입**: https://render.com
2. **New Web Service** 생성
3. **GitHub 저장소 연결**
4. **설정**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **환경 변수 추가** (`.env` 내용 복사)
6. **Deploy** 클릭

**배포 완료!** 🎉
→ API 주소: `https://your-app.onrender.com/docs`

### 자세한 배포 가이드

**[📖 DEPLOYMENT.md](DEPLOYMENT.md) 문서를 참조하세요:**
- Render, Railway, Vercel 배포 방법
- 무료 플랜 비교
- 배포 트러블슈팅
- 모니터링 설정

---

## 🔗 관련 링크

- **프론트엔드**: https://jewook-an.github.io/BHinSearch
- **GitHub**: https://github.com/jewook-an/bhinsearch
- **FastAPI 문서**: https://fastapi.tiangolo.com
- **MongoDB Atlas**: https://www.mongodb.com/atlas

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 Issue를 남겨주세요.

---

## 라이선스

Private Project

## 라이선스

Private Project
