from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PostCreate(BaseModel):
    """게시글 생성 스키마"""
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    category: str = Field(..., description="카테고리: notice, faq, update, guide")
    is_pinned: bool = False
    is_published: bool = True


class PostUpdate(BaseModel):
    """게시글 수정 스키마"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_published: Optional[bool] = None


class PostResponse(BaseModel):
    """게시글 응답 스키마"""
    id: str
    title: str
    content: str
    author_id: str
    author_name: str
    category: str
    view_count: int
    is_pinned: bool
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PostListItem(BaseModel):
    """게시글 목록 아이템 (요약)"""
    id: str
    title: str
    author_name: str
    category: str
    view_count: int
    is_pinned: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    """게시글 목록 응답"""
    posts: list[PostListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
