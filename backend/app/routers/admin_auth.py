from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
from app.models.user import User
from app.utils.auth import verify_password, get_password_hash, create_access_token
from app.database import get_db

router = APIRouter()

class AdminUser(BaseModel):
    id: str
    email: str
    name: str
    user_type: str

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: AdminUser

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(credentials: AdminLoginRequest, db = Depends(get_db)):
    """관리자 로그인"""
    # MongoDB에서 사용자 조회
    user_doc = await db.users.find_one({"email": credentials.email})

    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # 관리자 권한 확인
    if user_doc.get("user_type") not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not an admin user"
        )

    # 비밀번호 검증
    if not verify_password(credentials.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # 토큰 생성
    access_token = create_access_token(
        data={"sub": str(user_doc["_id"])},
        expires_delta=timedelta(hours=8)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user_doc.get("_id", "")),
            "email": user_doc.get("email", ""),
            "name": user_doc.get("name", ""),
            "user_type": user_doc.get("user_type", "admin")
        }
    }

@router.get("/me")
async def get_current_admin(token: str = Depends(get_db)):
    """현재 관리자 정보 조회"""
    # 토큰 검증 로직
    pass
