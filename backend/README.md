# 백엔드 API 서버

보험업계 ATS 백엔드 서버 - FastAPI + MongoDB

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

### 3. MongoDB 설치 및 실행

MongoDB가 로컬에서 실행 중이어야 합니다.

- [MongoDB 설치 가이드](https://www.mongodb.com/try/download/community)
- 기본 포트: 27017

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
uvicorn main:app --reload

# 또는
python main.py
```

서버가 실행되면:
- API: http://localhost:8000
- API 문서 (Swagger): http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

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

## 프로젝트 구조

```
backend/
├── main.py                 # FastAPI 앱 진입점
├── requirements.txt        # 의존성
├── .env                    # 환경 변수
├── .env.example           # 환경 변수 예시
└── app/
    ├── __init__.py
    ├── config.py          # 설정
    ├── database.py        # DB 연결
    ├── models/            # 데이터 모델
    │   ├── user.py
    │   ├── profile.py
    │   ├── position.py
    │   └── application.py
    ├── schemas/           # Pydantic 스키마
    │   ├── user.py
    │   └── profile.py
    ├── routers/           # API 라우터
    │   ├── auth.py
    │   ├── users.py
    │   ├── profiles.py
    │   ├── positions.py
    │   └── applications.py
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

API 문서 (http://localhost:8000/docs)에서 직접 테스트 가능합니다.

## 프로덕션 배포 시 주의사항

1. `.env` 파일의 `SECRET_KEY`를 강력한 랜덤 값으로 변경
2. CORS 설정 (`ALLOWED_ORIGINS`)을 프로덕션 도메인으로 제한
3. MongoDB를 클라우드 서비스 (MongoDB Atlas 등)로 변경
4. HTTPS 적용
5. 로그 설정
6. 에러 핸들링 강화

## 라이선스

Private Project
