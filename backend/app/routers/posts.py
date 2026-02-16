from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models.user import User
from app.models.post import Post, PostCategory
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListItem,
    PostListResponse
)
from app.utils.auth import get_current_user
import math

router = APIRouter()


@router.get("/", response_model=PostListResponse)
async def get_posts(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(10, ge=1, le=50, description="페이지 크기"),
    category: Optional[str] = Query(None, description="카테고리 필터")
):
    """게시글 목록 조회 (인증 불필요)"""

    # 필터 조건
    query_filters = {"is_published": True}

    if category:
        query_filters["category"] = category

    # 전체 개수
    total = await Post.find(query_filters).count()

    # 페이지네이션
    skip = (page - 1) * page_size

    # 고정 게시글 먼저, 그 다음 최신순
    posts = await Post.find(query_filters)\
        .sort(-Post.is_pinned, -Post.created_at)\
        .skip(skip)\
        .limit(page_size)\
        .to_list()

    # 응답 생성
    post_items = [
        PostListItem(
            id=str(p.id),
            title=p.title,
            author_name=p.author_name,
            category=p.category,
            view_count=p.view_count,
            is_pinned=p.is_pinned,
            created_at=p.created_at
        )
        for p in posts
    ]

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return PostListResponse(
        posts=post_items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str):
    """게시글 상세 조회 (인증 불필요)"""

    post = await Post.get(post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글을 찾을 수 없습니다"
        )

    if not post.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글을 찾을 수 없습니다"
        )

    # 조회수 증가
    post.view_count += 1
    await post.save()

    return PostResponse(
        id=str(post.id),
        title=post.title,
        content=post.content,
        author_id=post.author_id,
        author_name=post.author_name,
        category=post.category,
        view_count=post.view_count,
        is_pinned=post.is_pinned,
        is_published=post.is_published,
        created_at=post.created_at,
        updated_at=post.updated_at
    )


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user)
):
    """게시글 생성 (관리자만)"""

    # 관리자 권한 확인
    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자만 게시글을 작성할 수 있습니다"
        )

    # 카테고리 검증
    valid_categories = [PostCategory.NOTICE, PostCategory.FAQ, PostCategory.UPDATE, PostCategory.GUIDE]
    if post_data.category not in valid_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"유효한 카테고리: {', '.join(valid_categories)}"
        )

    # 게시글 생성
    new_post = Post(
        title=post_data.title,
        content=post_data.content,
        author_id=str(current_user.id),
        author_name=current_user.name,
        category=post_data.category,
        is_pinned=post_data.is_pinned,
        is_published=post_data.is_published
    )

    await new_post.insert()

    return PostResponse(
        id=str(new_post.id),
        title=new_post.title,
        content=new_post.content,
        author_id=new_post.author_id,
        author_name=new_post.author_name,
        category=new_post.category,
        view_count=new_post.view_count,
        is_pinned=new_post.is_pinned,
        is_published=new_post.is_published,
        created_at=new_post.created_at,
        updated_at=new_post.updated_at
    )


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user)
):
    """게시글 수정 (관리자만)"""

    # 관리자 권한 확인
    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자만 게시글을 수정할 수 있습니다"
        )

    post = await Post.get(post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글을 찾을 수 없습니다"
        )

    # 수정
    update_data = post_data.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(post, field, value)

    post.updated_at = datetime.utcnow()
    await post.save()

    return PostResponse(
        id=str(post.id),
        title=post.title,
        content=post.content,
        author_id=post.author_id,
        author_name=post.author_name,
        category=post.category,
        view_count=post.view_count,
        is_pinned=post.is_pinned,
        is_published=post.is_published,
        created_at=post.created_at,
        updated_at=post.updated_at
    )


@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user)
):
    """게시글 삭제 (관리자만)"""

    # 관리자 권한 확인
    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자만 게시글을 삭제할 수 있습니다"
        )

    post = await Post.get(post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="게시글을 찾을 수 없습니다"
        )

    await post.delete()

    return {
        "success": True,
        "message": "게시글이 삭제되었습니다"
    }


@router.get("/categories/list")
async def get_categories():
    """카테고리 목록 조회"""

    return {
        "categories": [
            {"value": PostCategory.NOTICE, "label": "공지사항"},
            {"value": PostCategory.FAQ, "label": "자주 묻는 질문"},
            {"value": PostCategory.UPDATE, "label": "업데이트 소식"},
            {"value": PostCategory.GUIDE, "label": "이용 가이드"}
        ]
    }
