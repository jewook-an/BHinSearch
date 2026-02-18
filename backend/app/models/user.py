from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import EmailStr, Field

class User(Document):
    """사용자 모델"""

    email: EmailStr = Field(..., unique=True, index=True)
    hashed_password: Optional[str] = None  # 소셜 로그인은 비밀번호 없음
    name: str
    phone: Optional[str] = None
    user_type: str = Field(..., description="experienced|recruiter|admin|guest")
    is_active: bool = True
    is_verified: bool = False
    # 소셜 로그인 필드
    social_provider: Optional[str] = None  # google | kakao | None
    social_id: Optional[str] = None        # 소셜 서비스의 고유 ID
    profile_image: Optional[str] = None    # 소셜 프로필 이미지 URL
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        indexes = [
            "email",
            "user_type"
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "email": "hong@example.com",
                "name": "홍길동",
                "phone": "010-1234-5678",
                "user_type": "experienced"
            }
        }
