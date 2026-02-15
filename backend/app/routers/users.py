from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.schemas.user import UserResponse
from app.utils.auth import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """현재 로그인한 사용자 정보 조회"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        user_type=current_user.user_type,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """특정 사용자 정보 조회 (관리자 또는 본인만)"""

    # 본인이거나 관리자인 경우만 허용
    if str(current_user.id) != user_id and current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )

    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다"
        )

    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        phone=user.phone,
        user_type=user.user_type,
        is_active=user.is_active,
        created_at=user.created_at
    )
