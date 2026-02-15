from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models.user import User
from app.models.position import Position
from app.utils.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_positions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    location: Optional[str] = None,
    experience: Optional[str] = None,
    employment_type: Optional[str] = None,
    search: Optional[str] = None,
    is_active: bool = True
):
    """포지션 목록 조회 (필터링 및 검색)"""
    
    query = {"is_active": is_active}
    
    # 필터 적용
    if location:
        query["location"] = location
    if experience:
        query["experience_required"] = experience
    if employment_type:
        query["employment_type"] = employment_type
    
    # 검색어 적용 (제목 또는 회사명)
    if search:
        positions = await Position.find(
            query,
            {"$or": [
                {"title": {"$regex": search, "$options": "i"}},
                {"company": {"$regex": search, "$options": "i"}}
            ]}
        ).skip(skip).limit(limit).to_list()
    else:
        positions = await Position.find(query).skip(skip).limit(limit).to_list()
    
    return [
        {
            "id": str(pos.id),
            "title": pos.title,
            "company": pos.company,
            "company_logo": pos.company_logo,
            "location": pos.location,
            "employment_type": pos.employment_type,
            "experience_required": pos.experience_required,
            "salary_min": pos.salary_min,
            "salary_max": pos.salary_max,
            "tags": pos.tags,
            "view_count": pos.view_count,
            "application_count": pos.application_count,
            "created_at": pos.created_at
        }
        for pos in positions
    ]

@router.get("/{position_id}", response_model=dict)
async def get_position_detail(position_id: str):
    """포지션 상세 조회"""
    
    position = await Position.get(position_id)
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="포지션을 찾을 수 없습니다"
        )
    
    # 조회수 증가
    position.view_count += 1
    await position.save()
    
    return {
        "id": str(position.id),
        "title": position.title,
        "company": position.company,
        "company_logo": position.company_logo,
        "location": position.location,
        "employment_type": position.employment_type,
        "description": position.description,
        "requirements": position.requirements,
        "preferred": position.preferred,
        "benefits": position.benefits,
        "experience_required": position.experience_required,
        "salary_min": position.salary_min,
        "salary_max": position.salary_max,
        "salary_negotiable": position.salary_negotiable,
        "recruitment_count": position.recruitment_count,
        "deadline": position.deadline,
        "tags": position.tags,
        "view_count": position.view_count,
        "application_count": position.application_count,
        "bookmark_count": position.bookmark_count,
        "created_at": position.created_at,
        "updated_at": position.updated_at
    }

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_position(
    position_data: dict,
    current_user: User = Depends(get_current_active_user)
):
    """포지션 등록 (인사담당자 및 관리자만)"""
    
    if current_user.user_type not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="권한이 없습니다"
        )
    
    new_position = Position(
        recruiter_id=str(current_user.id),
        **position_data
    )
    
    await new_position.insert()
    
    return {
        "id": str(new_position.id),
        "message": "포지션이 등록되었습니다"
    }

@router.put("/{position_id}", response_model=dict)
async def update_position(
    position_id: str,
    position_data: dict,
    current_user: User = Depends(get_current_active_user)
):
    """포지션 수정 (작성자 또는 관리자만)"""
    
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
    
    # 업데이트
    for field, value in position_data.items():
        if hasattr(position, field):
            setattr(position, field, value)
    
    await position.save()
    
    return {
        "id": str(position.id),
        "message": "포지션이 수정되었습니다"
    }

@router.delete("/{position_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_position(
    position_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """포지션 삭제 (작성자 또는 관리자만)"""
    
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
    
    await position.delete()
