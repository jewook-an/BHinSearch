from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import EmailStr, Field

class User(Document):
    """사용자 모델"""

    email: EmailStr = Field(..., unique=True, index=True)
    hashed_password: str
    name: str
    phone: Optional[str] = None
    user_type: str = Field(..., description="experienced|recruiter|admin|guest")
    is_active: bool = True
    is_verified: bool = False
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
