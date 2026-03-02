# 보험인Search 관리자 페이지 배포 가이드

## 📋 개요

보험인Search 관리자 페이지는 다음 구조로 배포됩니다:

```
bhinsearch/admin/          ← Vue 3 + TypeScript 프론트엔드
  ├── src/
  ├── package.json
  ├── vite.config.ts
  └── dist/                ← npm run build로 생성

bhinsearch/backend/        ← FastAPI 백엔드
  ├── app/
  ├── main.py
  ├── static/admin/        ← admin/dist 복사됨
  └── render.yaml          ← 배포 설정
```

---

## 🚀 로컬 개발 및 테스트

### 1. Admin 프론트엔드 개발

```bash
cd bhinsearch/admin

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run build  # Vite에서 백엔드로 프록시 설정됨 (/api -> localhost:8000/api)

# 또는 데브 모드
# npm run dev
```

### 2. Backend 서버 실행

```bash
cd bhinsearch/backend

# Virtual env 활성화
source .venv/bin/activate  # 또는 .venv\Scripts\Activate (Windows)

# FastAPI 서버 시작 (http://localhost:8000)
uvicorn app.main:app --reload

# 또는 main.py 직접 실행
python main.py
```

### 3. 관리자 계정 생성

```bash
cd bhinsearch/backend

# 환경 변수로
export ADMIN_EMAIL=admin@test.com
export ADMIN_PASSWORD=Test1234!
python create_admin.py

# 또는 대화형
python create_admin.py

# 기존 계정 덮어쓰기
python create_admin.py --force
```

### 4. 로컬 테스트

- Admin UI: `http://localhost:8000/admin`
- API Docs: `http://localhost:8000/docs`
- 로그인: 위에서 생성한 관리자 이메일/비밀번호 사용

---

## 🔄 자동 배포 (GitHub Actions)

### 트리거 조건

다음 중 하나라도 발생하면 자동 배포됩니다:

1. `bhinsearch/admin/**` 파일 변경
2. `bhinsearch/backend/**` 파일 변경
3. 워크플로 파일 변경
4. 수동 실행 (GitHub UI에서 "Run workflow" 클릭)

### 배포 프로세스

1. **Checkout**: 최신 코드 다운로드
2. **Build Admin**: `npm run build` 실행 → `dist/` 생성
3. **Copy Static**: `dist/*` → `backend/static/admin/`
4. **Commit & Push**: 생성된 정적 파일을 자동 커밋
5. **Deploy**: Render.yaml가 감지하여 backend 자동 배포

### 워크플로 모니터링

```
GitHub Repository
  → Actions 탭
    → "Admin Build & Deploy"
      → 최근 실행 기록 확인
```

---

## 📦 수동 배포 (로컬)

GitHub Actions를 사용하지 않는 경우:

```bash
# 1. Admin 빌드
cd bhinsearch/admin
npm run build

# 2. 정적 파일 복사
cp -r dist/* ../backend/static/admin/

# 3. Backend 커밋 & 푸시
cd ../backend
git add static/admin/
git commit -m "Update admin static files"
git push

# 4. Render에서 자동 배포 시작
#    (git push가 감지되면 자동으로 triggered)
```

---

## 🔑 관리자 권한 설정

기존 사용자를 관리자로 승격:

```bash
# MongoDB에서 직접 실행
db.users.updateOne(
  {email: "user@example.com"},
  {$set: {user_type: "admin"}}
)
```

---

## 🌐 배포된 URL

- Production: `https://YOUR_RENDER_URL/admin`
- Backend API: `https://YOUR_RENDER_URL/api/v1`

---

## 📝 주의사항

### Admin 빌드 시

- `vite.config.ts`의 `outDir`이 `../backend/static/admin`으로 설정됨
- 빌드 후 반드시 `backend/static/admin/` 폴더에 파일이 복사되는지 확인

### 정적 파일 제공

- `backend/main.py`에서 `/admin` 경로를 `StaticFiles`로  마운트
- SPA 라우팅 처리: `/admin/{full_path:path}` → `index.html`

### 환경 변수

Admin 로그인 시 백엔드 API 엔드포인트를 자동으로 인식:
- Dev: `http://localhost:8000/api/v1`
- Prod: 배포 도메인 자동 사용

---

## 🐛 문제 해결

### Admin 페이지가 로드되지 않음

```bash
# 1. 정적 파일 확인
ls -la backend/static/admin/

# 2. 파일이 없으면 빌드 및 복사
cd admin && npm run build && cp -r dist/* ../backend/static/admin/

# 3. FastAPI 로그 확인
# /admin 경로가 정상 응답하는지 확인
curl -I http://localhost:8000/admin
```

### 로그인 불가

```bash
# 1. 관리자 계정 존재 확인 (MongoDB)
# 2. 비밀번호 재설정
python create_admin.py --force

# 3. 토큰 생성 확인
curl -X POST http://localhost:8000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}'
```

---

## 📞 지원

문제 발생 시:
1. 워크플로 실행 로그 확인 (GitHub Actions)
2. Render 배포 로그 확인
3. Backend `/docs` 또는 `/redoc`에서 API 스키마 확인

---

**Last Updated**: 2026-02-28
