from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field

class Position(Document):
    """포지션 모델"""

    # 기본 정보
    title: str
    company: str
    company_logo: Optional[str] = None
    location: str
    employment_type: str = "정규직"

    # 상세 정보
    description: str
    requirements: List[str] = []
    preferred: List[str] = []
    benefits: List[str] = []

    # 조건
    experience_required: str = "신입"
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_negotiable: bool = False

    # 모집 정보
    recruitment_count: int = 1
    deadline: Optional[datetime] = None
    is_active: bool = True
    is_featured: bool = False

    # 통계
    view_count: int = 0
    application_count: int = 0
    bookmark_count: int = 0

    # 작성자 (인사담당자)
    recruiter_id: str = Field(..., index=True)

    # 태그
    tags: List[str] = []

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "positions"
        indexes = [
            "company",
            "location",
            "employment_type",
            "is_active",
            "recruiter_id"
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "title": "보험계리사",
                "company": "삼성생명",
                "location": "서울",
                "description": "생명보험 상품 개발 및 리스크 관리",
                "experience_required": "5-10년"
            }
        }
