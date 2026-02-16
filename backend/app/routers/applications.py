from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.models.user import User
from app.models.application import Application
from app.models.position import Position
from app.models.notification import Notification, NotificationType
from app.utils.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_application(
    application_data: dict,
    current_user: User = Depends(get_current_active_user)
):
    """포지션 지원"""

    position_id = application_data.get("position_id")

    # 포지션 존재 확인
    position = await Position.get(position_id)
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="포지션을 찾을 수 없습니다"
        )

    # 중복 지원 확인
    existing = await Application.find_one(
        Application.user_id == str(current_user.id),
        Application.position_id == position_id
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 지원한 포지션입니다"
        )

    # 지원 생성
    new_application = Application(
        user_id=str(current_user.id),
        position_id=position_id,
        resume_url=application_data.get("resume_url"),
        cover_letter=application_data.get("cover_letter")
    )

    await new_application.insert()

    # 포지션 지원 수 증가
    position.application_count += 1
    await position.save()

    # 지원자에게 알림 생성
    await Notification(
        user_id=str(current_user.id),
        notification_type=NotificationType.APPLICATION_SUBMITTED,
        title="지원 완료",
        message=f"{position.company} - {position.title} 포지션에 지원이 완료되었습니다.",
        related_id=str(new_application.id),
        related_type="application",
        action_url=f"/applications/{str(new_application.id)}",
        priority="normal"
    ).insert()

    # 리크루터에게 알림 생성
    if position.recruiter_id:
        await Notification(
            user_id=position.recruiter_id,
            notification_type=NotificationType.APPLICATION_SUBMITTED,
            title="새로운 지원자",
            message=f"{position.title} 포지션에 새로운 지원자가 있습니다.",
            related_id=str(new_application.id),
            related_type="application",
            action_url=f"/applications/{str(new_application.id)}",
            priority="high"
        ).insert()

    return {
        "id": str(new_application.id),
        "message": "지원이 완료되었습니다"
    }

@router.get("/my-applications", response_model=List[dict])
async def get_my_applications(
    current_user: User = Depends(get_current_active_user)
):
    """내 지원 내역 조회"""

    applications = await Application.find(
        Application.user_id == str(current_user.id)
    ).sort("-applied_at").to_list()

    result = []
    for app in applications:
        position = await Position.get(app.position_id)
        result.append({
            "id": str(app.id),
            "position": {
                "id": str(position.id),
                "title": position.title,
                "company": position.company,
                "location": position.location
            } if position else None,
            "status": app.status,
            "applied_at": app.applied_at,
            "interview_scheduled_at": app.interview_scheduled_at
        })

    return result

@router.get("/{application_id}", response_model=dict)
async def get_application_detail(
    application_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """지원 상세 조회"""

    application = await Application.get(application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 내역을 찾을 수 없습니다"
        )

    # 권한 확인 (본인 또는 해당 포지션의 리크루터 또는 관리자)
    position = await Position.get(application.position_id)
    is_authorized = (
        application.user_id == str(current_user.id) or
        (position and position.recruiter_id == str(current_user.id)) or
        current_user.user_type == "admin"
    )

    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )

    return {
        "id": str(application.id),
        "user_id": application.user_id,
        "position_id": application.position_id,
        "status": application.status,
        "resume_url": application.resume_url,
        "cover_letter": application.cover_letter,
        "recruiter_notes": application.recruiter_notes,
        "applied_at": application.applied_at,
        "reviewed_at": application.reviewed_at,
        "interview_scheduled_at": application.interview_scheduled_at,
        "final_decision_at": application.final_decision_at
    }

@router.put("/{application_id}/status", response_model=dict)
async def update_application_status(
    application_id: str,
    status_data: dict,
    current_user: User = Depends(get_current_active_user)
):
    """지원 상태 변경 (리크루터 또는 관리자만)"""

    application = await Application.get(application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 내역을 찾을 수 없습니다"
        )

    # 권한 확인
    position = await Position.get(application.position_id)
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="포지션을 찾을 수 없습니다"
        )

    if position.recruiter_id != str(current_user.id) and current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )

    # 상태 업데이트
    new_status = status_data.get("status")
    old_status = application.status
    application.status = new_status
    application.updated_at = datetime.utcnow()

    # 상태별 타임스탬프 업데이트
    if new_status == "reviewing":
        application.reviewed_at = datetime.utcnow()
    elif new_status == "interview":
        application.interview_scheduled_at = status_data.get("interview_scheduled_at")
    elif new_status in ["accepted", "rejected"]:
        application.final_decision_at = datetime.utcnow()

    # 리크루터 메모
    if "recruiter_notes" in status_data:
        application.recruiter_notes = status_data["recruiter_notes"]

    await application.save()

    # 지원자에게 상태 변경 알림 생성
    status_messages = {
        "reviewing": "서류 검토 중",
        "interview": "면접 일정 확정",
        "accepted": "축하합니다! 합격하셨습니다",
        "rejected": "불합격 통보"
    }

    notification_priorities = {
        "reviewing": "normal",
        "interview": "high",
        "accepted": "urgent",
        "rejected": "high"
    }

    if new_status in status_messages:
        await Notification(
            user_id=application.user_id,
            notification_type=NotificationType.STATUS_CHANGED,
            title=f"지원 상태 변경: {status_messages[new_status]}",
            message=f"{position.company} - {position.title} 포지션의 지원 상태가 '{status_messages[new_status]}'로 변경되었습니다.",
            related_id=str(application.id),
            related_type="application",
            action_url=f"/applications/{str(application.id)}",
            priority=notification_priorities.get(new_status, "normal")
        ).insert()

    return {
        "id": str(application.id),
        "status": application.status,
        "message": "상태가 업데이트되었습니다"
    }

@router.get("/position/{position_id}/applicants", response_model=List[dict])
async def get_position_applicants(
    position_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """포지션 지원자 목록 조회 (리크루터 또는 관리자만)"""

    position = await Position.get(position_id)
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="포지션을 찾을 수 없습니다"
        )

    # 권한 확인
    if position.recruiter_id != str(current_user.id) and current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )

    applications = await Application.find(
        Application.position_id == position_id
    ).sort("-applied_at").to_list()

    return [
        {
            "id": str(app.id),
            "user_id": app.user_id,
            "status": app.status,
            "applied_at": app.applied_at,
            "is_read_by_recruiter": app.is_read_by_recruiter
        }
        for app in applications
    ]
