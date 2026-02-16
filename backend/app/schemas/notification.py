from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):
    """알림 생성 스키마"""
    user_id: str
    notification_type: str
    title: str
    message: str
    related_id: Optional[str] = None
    related_type: Optional[str] = None
    action_url: Optional[str] = None
    priority: str = "normal"


class NotificationResponse(BaseModel):
    """알림 응답 스키마"""
    id: str
    user_id: str
    notification_type: str
    title: str
    message: str
    related_id: Optional[str] = None
    related_type: Optional[str] = None
    action_url: Optional[str] = None
    priority: str
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    """알림 목록 응답"""
    notifications: list[NotificationResponse]
    total: int
    unread_count: int
    page: int
    page_size: int
    total_pages: int


class NotificationStats(BaseModel):
    """알림 통계"""
    total_count: int
    unread_count: int
    read_count: int
    by_type: dict[str, int]
