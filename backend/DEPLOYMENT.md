# 백엔드 배포 가이드

## 🚀 Render.com 배포 (무료, 추천)

### 1단계: Render 계정 생성
1. https://render.com 접속
2. **Sign Up** → GitHub 계정으로 가입

### 2단계: 새 Web Service 생성
1. Dashboard → **New +** → **Web Service**
2. **Connect GitHub** → 저장소 선택 (`bhinsearch`)
3. 설정:
   - **Name**: `bhinsearch-backend`
   - **Region**: Singapore (가장 가까움)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3단계: 환경 변수 설정
**Environment Variables** 섹션에서 추가:

```
MONGODB_URL=mongodb+srv://bhinsearch_user:13JG62DMVuNNXK9A@bhinsearch-cluster.9cvdnxk.mongodb.net/?appName=bhinsearch-cluster
DATABASE_NAME=bhinsearch_db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALLOWED_ORIGINS=["https://jewook-an.github.io","https://bhinsearch-backend.onrender.com"]
API_V1_PREFIX=/api/v1
ACCESS_TOKEN_EXPIRE_MINUTES=43200
ALGORITHM=HS256
```

### 4단계: 무료 플랜 선택
- **Instance Type**: Free
- **Create Web Service** 클릭

### 5단계: 배포 대기 (5-10분)
- 로그 확인: "✅ 데이터베이스 연결 완료" 메시지 대기
- 배포 완료 후 URL: `https://bhinsearch-backend.onrender.com`

### 6단계: 테스트
- API 문서: `https://bhinsearch-backend.onrender.com/docs`
- 헬스체크: `https://bhinsearch-backend.onrender.com/health`

---

## 🌐 Railway (대안 1 - 무료)

### 배포 방법
1. https://railway.app 접속
2. **Start a New Project** → **Deploy from GitHub repo**
3. `bhinsearch` 선택
4. **Environment Variables** 설정 (위와 동일)
5. **Settings** → **Root Directory**: `/backend`
6. **Deploy**

배포 URL: `https://bhinsearch-backend.railway.app`

---

## ☁️ Vercel + Serverless (대안 2)

### 주의사항
⚠️ Vercel은 Serverless 환경이므로:
- WebSocket 지원 안 됨
- 함수 실행 시간 제한 (10초)
- 파일 업로드 제한적

### vercel.json 생성
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/main.py"
    }
  ]
}
```

### 배포
```bash
npm install -g vercel
cd bhinsearch
vercel
```

---

## 🐳 Docker + AWS/Azure (대안 3 - 프로덕션)

### Dockerfile 생성
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### AWS Elastic Beanstalk 배포
```bash
eb init -p python-3.10 bhinsearch-backend
eb create bhinsearch-env
```

---

## 📝 배포 후 프론트엔드 수정

프론트엔드에서 API URL 수정:

```javascript
// src/api/config.js (또는 .env)
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  'https://bhinsearch-backend.onrender.com';

export default API_BASE_URL;
```

---

## 🧪 배포된 백엔드 테스트 방법

### 1. Swagger UI 사용
```
https://bhinsearch-backend.onrender.com/docs
```
- 로컬과 동일하게 테스트 가능
- Authorize 후 모든 API 테스트

### 2. Postman/Thunder Client
```
POST https://bhinsearch-backend.onrender.com/api/v1/auth/register
{
  "email": "test@example.com",
  "password": "test1234",
  "name": "테스트"
}
```

### 3. curl 명령어
```bash
# 헬스체크
curl https://bhinsearch-backend.onrender.com/health

# 회원가입
curl -X POST https://bhinsearch-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","name":"테스트"}'

# 로그인
curl -X POST https://bhinsearch-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

### 4. 프론트엔드에서 직접 연동
```javascript
fetch('https://bhinsearch-backend.onrender.com/api/v1/positions')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ⚠️ 무료 플랜 제한사항

### Render 무료 플랜
- ✅ 750시간/월 무료
- ⚠️ 15분 비활성 시 sleep (첫 요청 느림, 30초 정도)
- ⚠️ 매월 자동 sleep 후 재시작
- ✅ 커스텀 도메인 가능

### Railway 무료 플랜
- ✅ $5 크레딧/월
- ⚠️ 크레딧 소진 시 중단
- ✅ sleep 없음

### 해결 방법
- **UptimeRobot** 사용: 5분마다 헬스체크 요청 → sleep 방지
- 또는 유료 플랜 ($7/월)

---

## 📊 배포 상태 모니터링

### Health Check 엔드포인트
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow()
    }
```

### UptimeRobot 설정
1. https://uptimerobot.com 가입
2. **Add New Monitor**
3. Monitor Type: HTTP(s)
4. URL: `https://bhinsearch-backend.onrender.com/health`
5. Monitoring Interval: 5분

---

## 🔒 프로덕션 보안 체크리스트

- [ ] `.env` 파일 Git에 커밋 안 됨 확인
- [ ] `SECRET_KEY` 강력한 랜덤 값으로 변경
- [ ] `ALLOWED_ORIGINS` 실제 도메인만 포함
- [ ] MongoDB 접속 IP 화이트리스트 설정
- [ ] HTTPS 적용 확인
- [ ] 민감한 에러 메시지 숨김
- [ ] Rate Limiting 적용 (선택)

---

## 🎯 추천 배포 워크플로우

1. **개발**: localhost:8001
2. **스테이징**: Render 무료 플랜
3. **프로덕션**: Render Pro 또는 AWS

---

## 💡 도움이 필요하면

- Render 문서: https://render.com/docs
- Railway 문서: https://docs.railway.app
- FastAPI 배포: https://fastapi.tiangolo.com/deployment/
