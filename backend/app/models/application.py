from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field

class Application(Document):
    """지원 모델"""

    # 관계
    user_id: str = Field(..., index=True)
    position_id: str = Field(..., index=True)

    # 지원 정보
    status: str = Field(
        default="pending",
        description="pending|reviewing|interview|accepted|rejected"
    )
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None

    # 메모 (인사담당자용)
    recruiter_notes: Optional[str] = None

    # 일정
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_at: Optional[datetime] = None
    interview_scheduled_at: Optional[datetime] = None
    final_decision_at: Optional[datetime] = None

    # 알림
    is_read_by_recruiter: bool = False
    is_read_by_user: bool = True

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "applications"
        indexes = [
            "user_id",
            "position_id",
            "status"
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "position_id": "507f1f77bcf86cd799439012",
                "status": "pending"
            }
        }
