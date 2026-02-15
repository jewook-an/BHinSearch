from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.models.user import User
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.utils.auth import get_current_active_user

router = APIRouter()

def calculate_profile_completeness(profile: Profile) -> int:
    """프로필 완성도 계산"""
    score = 0
    max_score = 100

    # 기본 정보 (30점)
    if profile.profile_image:
        score += 10
    if profile.birth_date:
        score += 5
    if profile.address:
        score += 5
    if profile.introduction:
        score += 10

    # 경력 정보 (30점)
    if profile.current_company:
        score += 10
    if profile.current_position:
        score += 10
    if profile.careers:
        score += 10

    # 학력 및 자격증 (20점)
    if profile.education:
        score += 10
    if profile.certificates:
        score += 10

    # 기술 (20점)
    if len(profile.skills) >= 5:
        score += 20
    elif len(profile.skills) >= 3:
        score += 15
    elif len(profile.skills) >= 1:
        score += 10

    return min(score, max_score)

@router.post("/", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_active_user)
):
    """프로필 생성"""

    # 이미 프로필이 있는지 확인
    existing_profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 프로필이 존재합니다"
        )

    # 프로필 생성
    new_profile = Profile(
        user_id=str(current_user.id),
        **profile_data.dict()
    )

    # 완성도 계산
    new_profile.profile_completeness = calculate_profile_completeness(new_profile)

    await new_profile.insert()

    return ProfileResponse(
        id=str(new_profile.id),
        user_id=new_profile.user_id,
        **profile_data.dict(),
        profile_completeness=new_profile.profile_completeness,
        applied_jobs_count=0,
        saved_jobs_count=0,
        profile_views=0,
        created_at=new_profile.created_at,
        updated_at=new_profile.updated_at
    )

@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(current_user: User = Depends(get_current_active_user)):
    """내 프로필 조회"""

    profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로필을 찾을 수 없습니다"
        )

    return ProfileResponse(
        id=str(profile.id),
        user_id=profile.user_id,
        profile_image=profile.profile_image,
        birth_date=profile.birth_date,
        address=profile.address,
        experience_years=profile.experience_years,
        current_company=profile.current_company,
        current_position=profile.current_position,
        introduction=profile.introduction,
        careers=profile.careers,
        education=profile.education,
        certificates=profile.certificates,
        skills=profile.skills,
        profile_completeness=profile.profile_completeness,
        applied_jobs_count=profile.applied_jobs_count,
        saved_jobs_count=profile.saved_jobs_count,
        profile_views=profile.profile_views,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.put("/me", response_model=ProfileResponse)
async def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """내 프로필 수정"""

    profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로필을 찾을 수 없습니다"
        )

    # 업데이트 (None이 아닌 필드만)
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    # 완성도 재계산
    profile.profile_completeness = calculate_profile_completeness(profile)
    profile.updated_at = datetime.utcnow()

    await profile.save()

    return ProfileResponse(
        id=str(profile.id),
        user_id=profile.user_id,
        profile_image=profile.profile_image,
        birth_date=profile.birth_date,
        address=profile.address,
        experience_years=profile.experience_years,
        current_company=profile.current_company,
        current_position=profile.current_position,
        introduction=profile.introduction,
        careers=profile.careers,
        education=profile.education,
        certificates=profile.certificates,
        skills=profile.skills,
        profile_completeness=profile.profile_completeness,
        applied_jobs_count=profile.applied_jobs_count,
        saved_jobs_count=profile.saved_jobs_count,
        profile_views=profile.profile_views,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.get("/{user_id}", response_model=ProfileResponse)
async def get_profile_by_user_id(
    user_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """특정 사용자의 프로필 조회"""

    profile = await Profile.find_one(Profile.user_id == user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로필을 찾을 수 없습니다"
        )

    # 조회수 증가 (본인이 아닌 경우)
    if str(current_user.id) != user_id:
        profile.profile_views += 1
        await profile.save()

    return ProfileResponse(
        id=str(profile.id),
        user_id=profile.user_id,
        profile_image=profile.profile_image,
        birth_date=profile.birth_date,
        address=profile.address,
        experience_years=profile.experience_years,
        current_company=profile.current_company,
        current_position=profile.current_position,
        introduction=profile.introduction,
        careers=profile.careers,
        education=profile.education,
        certificates=profile.certificates,
        skills=profile.skills,
        profile_completeness=profile.profile_completeness,
        applied_jobs_count=profile.applied_jobs_count,
        saved_jobs_count=profile.saved_jobs_count,
        profile_views=profile.profile_views,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )
