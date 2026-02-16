from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from beanie.operators import In
from app.models.user import User
from app.models.notification import Notification, NotificationType, NotificationPriority
from app.schemas.notification import (
    NotificationResponse,
    NotificationListResponse,
    NotificationStats
)
from app.utils.auth import get_current_user
import math

router = APIRouter()


@router.get("/", response_model=NotificationListResponse)
async def get_notifications(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    is_read: Optional[bool] = Query(None, description="읽음 상태 필터 (true/false)"),
    notification_type: Optional[str] = Query(None, description="알림 타입 필터")
):
    """알림 목록 조회"""

    # 필터 조건 생성
    query_filters = {"user_id": str(current_user.id)}

    if is_read is not None:
        query_filters["is_read"] = is_read

    if notification_type:
        query_filters["notification_type"] = notification_type

    # 전체 개수 조회
    total = await Notification.find(query_filters).count()

    # 안 읽은 알림 개수
    unread_count = await Notification.find(
        {"user_id": str(current_user.id), "is_read": False}
    ).count()

    # 페이지네이션
    skip = (page - 1) * page_size
    notifications = await Notification.find(query_filters)\
        .sort(-Notification.created_at)\
        .skip(skip)\
        .limit(page_size)\
        .to_list()

    # 응답 생성
    notification_responses = [
        NotificationResponse(
            id=str(n.id),
            user_id=n.user_id,
            notification_type=n.notification_type,
            title=n.title,
            message=n.message,
            related_id=n.related_id,
            related_type=n.related_type,
            action_url=n.action_url,
            priority=n.priority,
            is_read=n.is_read,
            read_at=n.read_at,
            created_at=n.created_at
        )
        for n in notifications
    ]

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return NotificationListResponse(
        notifications=notification_responses,
        total=total,
        unread_count=unread_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/unread-count")
async def get_unread_count(current_user: User = Depends(get_current_user)):
    """안 읽은 알림 개수"""

    count = await Notification.find(
        {"user_id": str(current_user.id), "is_read": False}
    ).count()

    return {"unread_count": count}


@router.get("/stats", response_model=NotificationStats)
async def get_notification_stats(current_user: User = Depends(get_current_user)):
    """알림 통계"""

    # 전체 알림 조회
    all_notifications = await Notification.find(
        {"user_id": str(current_user.id)}
    ).to_list()

    total_count = len(all_notifications)
    unread_count = sum(1 for n in all_notifications if not n.is_read)
    read_count = total_count - unread_count

    # 타입별 통계
    by_type = {}
    for notification in all_notifications:
        ntype = notification.notification_type
        by_type[ntype] = by_type.get(ntype, 0) + 1

    return NotificationStats(
        total_count=total_count,
        unread_count=unread_count,
        read_count=read_count,
        by_type=by_type
    )


@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """알림 상세 조회"""

    notification = await Notification.get(notification_id)

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="알림을 찾을 수 없습니다"
        )

    # 권한 확인
    if notification.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 알림에 접근할 권한이 없습니다"
        )

    return NotificationResponse(
        id=str(notification.id),
        user_id=notification.user_id,
        notification_type=notification.notification_type,
        title=notification.title,
        message=notification.message,
        related_id=notification.related_id,
        related_type=notification.related_type,
        action_url=notification.action_url,
        priority=notification.priority,
        is_read=notification.is_read,
        read_at=notification.read_at,
        created_at=notification.created_at
    )


@router.patch("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """알림을 읽음으로 표시"""

    notification = await Notification.get(notification_id)

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="알림을 찾을 수 없습니다"
        )

    # 권한 확인
    if notification.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 알림에 접근할 권한이 없습니다"
        )

    # 읽음 처리
    if not notification.is_read:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        await notification.save()

    return {
        "success": True,
        "message": "알림을 읽음으로 표시했습니다"
    }


@router.patch("/read-all")
async def mark_all_as_read(current_user: User = Depends(get_current_user)):
    """모든 알림을 읽음으로 표시"""

    # 안 읽은 알림들 조회
    unread_notifications = await Notification.find(
        {"user_id": str(current_user.id), "is_read": False}
    ).to_list()

    # 읽음 처리
    for notification in unread_notifications:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        await notification.save()

    return {
        "success": True,
        "message": f"{len(unread_notifications)}개의 알림을 읽음으로 표시했습니다",
        "count": len(unread_notifications)
    }


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """알림 삭제"""

    notification = await Notification.get(notification_id)

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="알림을 찾을 수 없습니다"
        )

    # 권한 확인
    if notification.user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 알림을 삭제할 권한이 없습니다"
        )

    await notification.delete()

    return {
        "success": True,
        "message": "알림이 삭제되었습니다"
    }


@router.delete("/")
async def delete_all_notifications(
    current_user: User = Depends(get_current_user),
    read_only: bool = Query(False, description="읽은 알림만 삭제")
):
    """알림 전체 삭제"""

    query = {"user_id": str(current_user.id)}

    if read_only:
        query["is_read"] = True

    notifications = await Notification.find(query).to_list()

    for notification in notifications:
        await notification.delete()

    return {
        "success": True,
        "message": f"{len(notifications)}개의 알림이 삭제되었습니다",
        "count": len(notifications)
    }


# 알림 생성 헬퍼 함수 (다른 라우터에서 사용)
async def create_notification(
    user_id: str,
    notification_type: str,
    title: str,
    message: str,
    related_id: Optional[str] = None,
    related_type: Optional[str] = None,
    action_url: Optional[str] = None,
    priority: str = "normal"
) -> Notification:
    """알림 생성 헬퍼 함수"""

    notification = Notification(
        user_id=user_id,
        notification_type=notification_type,
        title=title,
        message=message,
        related_id=related_id,
        related_type=related_type,
        action_url=action_url,
        priority=priority
    )

    await notification.insert()
    return notification
