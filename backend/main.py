from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routers import auth, users, profiles, positions, applications

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
