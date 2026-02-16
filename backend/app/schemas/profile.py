from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CareerSchema(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None

class EducationSchema(BaseModel):
    school: str
    major: str
    degree: str
    start_date: str
    end_date: str
    status: str = "졸업"

class CertificateSchema(BaseModel):
    name: str
    organization: str
    acquisition_date: str
    certificate_number: Optional[str] = None

# 프로필 생성/수정 요청
class ProfileCreate(BaseModel):
    profile_image: Optional[str] = None
    birth_date: Optional[str] = None
    address: Optional[str] = None
    experience_years: Optional[str] = None
    current_company: Optional[str] = None
    current_position: Optional[str] = None
    introduction: Optional[str] = None
    careers: List[CareerSchema] = []
    education: List[EducationSchema] = []
    certificates: List[CertificateSchema] = []
    skills: List[str] = []
    resume_url: Optional[str] = None
    cover_letter_url: Optional[str] = None

class ProfileUpdate(BaseModel):
    profile_image: Optional[str] = None
    birth_date: Optional[str] = None
    address: Optional[str] = None
    experience_years: Optional[str] = None
    current_company: Optional[str] = None
    current_position: Optional[str] = None
    introduction: Optional[str] = None
    careers: Optional[List[CareerSchema]] = None
    education: Optional[List[EducationSchema]] = None
    certificates: Optional[List[CertificateSchema]] = None
    skills: Optional[List[str]] = None
    resume_url: Optional[str] = None
    cover_letter_url: Optional[str] = None

# 프로필 응답
class ProfileResponse(BaseModel):
    id: str
    user_id: str
    profile_image: Optional[str] = None
    birth_date: Optional[str] = None
    address: Optional[str] = None
    experience_years: Optional[str] = None
    current_company: Optional[str] = None
    current_position: Optional[str] = None
    introduction: Optional[str] = None
    careers: List[CareerSchema] = []
    education: List[EducationSchema] = []
    certificates: List[CertificateSchema] = []
    skills: List[str] = []
    resume_url: Optional[str] = None
    cover_letter_url: Optional[str] = None
    profile_completeness: int
    applied_jobs_count: int
    saved_jobs_count: int
    profile_views: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
