from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field

class Post(Document):
    """게시글 모델 (공지사항, FAQ 등)"""
    
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    
    # 작성자 정보
    author_id: str = Field(..., index=True)
    author_name: str
    
    # 카테고리
    category: str = Field(..., index=True)  # notice(공지사항), faq(FAQ), update(업데이트), guide(가이드)
    
    # 통계
    view_count: int = 0
    
    # 고정 여부 (상단 고정)
    is_pinned: bool = False
    
    # 게시 상태
    is_published: bool = True
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "posts"
        indexes = [
            "author_id",
            "category",
            "is_published",
            "is_pinned",
            "created_at",
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "서비스 오픈 공지",
                "content": "보험업계 ATS 서비스를 오픈합니다...",
                "author_id": "507f1f77bcf86cd799439011",
                "author_name": "관리자",
                "category": "notice",
                "is_pinned": True,
                "is_published": True
            }
        }


# 카테고리 상수
class PostCategory:
    """게시글 카테고리"""
    NOTICE = "notice"          # 공지사항
    FAQ = "faq"                # 자주 묻는 질문
    UPDATE = "update"          # 업데이트 소식
    GUIDE = "guide"            # 이용 가이드
