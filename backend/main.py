from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.database import init_db
from app.routers import auth, users, profiles, positions, applications, files, notifications, posts
from app.routers import admin_auth, admin_users, admin_audit

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="보험업계 ATS 백엔드 API"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["인증"])
app.include_router(users.router, prefix=f"{settings.API_V1_PREFIX}/users", tags=["사용자"])
app.include_router(profiles.router, prefix=f"{settings.API_V1_PREFIX}/profiles", tags=["프로필"])
app.include_router(positions.router, prefix=f"{settings.API_V1_PREFIX}/positions", tags=["포지션"])
app.include_router(applications.router, prefix=f"{settings.API_V1_PREFIX}/applications", tags=["지원관리"])
app.include_router(files.router, prefix=f"{settings.API_V1_PREFIX}/files", tags=["파일업로드"])
app.include_router(notifications.router, prefix=f"{settings.API_V1_PREFIX}/notifications", tags=["알림"])
app.include_router(posts.router, prefix=f"{settings.API_V1_PREFIX}/posts", tags=["게시판"])

# 관리자 라우터 등록 - /api/v1/admin/auth, /api/v1/admin/users 등
app.include_router(admin_auth.router, prefix=f"{settings.API_V1_PREFIX}/admin/auth", tags=["관리자-인증"])
app.include_router(admin_users.router, prefix=f"{settings.API_V1_PREFIX}/admin/users", tags=["관리자-사용자"])
app.include_router(admin_audit.router, prefix=f"{settings.API_V1_PREFIX}/admin/audit", tags=["관리자-감시"])

@app.on_event("startup")
async def startup_event():
    """앱 시작 시 실행"""
    await init_db()
    print("✅ 데이터베이스 연결 완료")

@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "보험업계 ATS API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy"}


# 관리자 프론트엔드 정적 파일 제공 (SPA routing)
app.mount("/admin", StaticFiles(directory="static/admin", html=True), name="admin")

if __name__ == "__main__":
    import uvicorn
    import os
    # 배포 환경에서는 PORT 환경변수 사용, 로컬에서는 8001 사용
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
