from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# 회원가입 요청
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None
    user_type: str = "experienced"

# 로그인 요청
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# 토큰 응답
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# 토큰 데이터
class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None

# 사용자 응답
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    phone: Optional[str] = None
    user_type: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
