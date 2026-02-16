from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field

class Notification(Document):
    """알림 모델"""
    
    user_id: str = Field(..., index=True)  # 알림 받는 사용자
    
    # 알림 타입
    notification_type: str = Field(..., index=True)  # application, status_change, new_position, message 등
    
    # 알림 내용
    title: str  # 알림 제목
    message: str  # 알림 메시지
    
    # 관련 정보
    related_id: Optional[str] = None  # 관련 문서 ID (지원서 ID, 공고 ID 등)
    related_type: Optional[str] = None  # 관련 문서 타입 (application, position 등)
    
    # 링크 정보
    action_url: Optional[str] = None  # 클릭 시 이동할 URL
    
    # 상태
    is_read: bool = False
    read_at: Optional[datetime] = None
    
    # 우선순위
    priority: str = "normal"  # low, normal, high, urgent
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "notifications"
        indexes = [
            "user_id",
            "notification_type",
            "is_read",
            "created_at",
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "notification_type": "application",
                "title": "지원 완료",
                "message": "삼성생명 보험계리사 포지션에 지원이 완료되었습니다.",
                "related_id": "507f1f77bcf86cd799439012",
                "related_type": "application",
                "action_url": "/applications/507f1f77bcf86cd799439012",
                "priority": "normal"
            }
        }


# 알림 타입 상수
class NotificationType:
    """알림 타입"""
    APPLICATION_SUBMITTED = "application_submitted"  # 지원 완료
    APPLICATION_VIEWED = "application_viewed"  # 지원서 열람
    STATUS_CHANGED = "status_changed"  # 상태 변경
    INTERVIEW_SCHEDULED = "interview_scheduled"  # 면접 일정
    POSITION_RECOMMENDED = "position_recommended"  # 공고 추천
    MESSAGE_RECEIVED = "message_received"  # 메시지 수신
    PROFILE_INCOMPLETE = "profile_incomplete"  # 프로필 미완성


# 알림 우선순위
class NotificationPriority:
    """알림 우선순위"""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"
