from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field, BaseModel

class Career(BaseModel):
    """경력 정보"""
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None

class Education(BaseModel):
    """학력 정보"""
    school: str
    major: str
    degree: str
    start_date: str
    end_date: str
    status: str = "졸업"

class Certificate(BaseModel):
    """자격증 정보"""
    name: str
    organization: str
    acquisition_date: str
    certificate_number: Optional[str] = None

class Profile(Document):
    """프로필 모델"""

    user_id: str = Field(..., index=True)
    profile_image: Optional[str] = None
    birth_date: Optional[str] = None
    address: Optional[str] = None

    # 직무 정보
    experience_years: Optional[str] = None
    current_company: Optional[str] = None
    current_position: Optional[str] = None

    # 상세 정보
    introduction: Optional[str] = None
    careers: List[Career] = []
    education: List[Education] = []
    certificates: List[Certificate] = []
    skills: List[str] = []

    # 파일 첨부
    resume_url: Optional[str] = None
    cover_letter_url: Optional[str] = None

    # 프로필 완성도
    profile_completeness: int = 0

    # 활동 통계
    applied_jobs_count: int = 0
    saved_jobs_count: int = 0
    profile_views: int = 0

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "profiles"
        indexes = ["user_id"]

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "current_company": "삼성생명",
                "current_position": "보험계리사",
                "introduction": "보험업계 전문가입니다."
            }
        }
