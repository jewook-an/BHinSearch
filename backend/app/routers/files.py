import os
import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from app.models.user import User
from app.models.profile import Profile
from app.utils.auth import get_current_user
from app.config import settings

router = APIRouter()

# 업로드 디렉토리 생성
UPLOAD_DIR = "uploads"
RESUME_DIR = os.path.join(UPLOAD_DIR, "resumes")
COVER_LETTER_DIR = os.path.join(UPLOAD_DIR, "cover_letters")

for directory in [UPLOAD_DIR, RESUME_DIR, COVER_LETTER_DIR]:
    os.makedirs(directory, exist_ok=True)

# 허용된 파일 확장자
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".hwp", ".txt"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_file(file: UploadFile) -> None:
    """파일 유효성 검사"""
    # 파일 확장자 확인
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"지원하지 않는 파일 형식입니다. 허용된 형식: {', '.join(ALLOWED_EXTENSIONS)}"
        )


def save_upload_file(file: UploadFile, directory: str) -> str:
    """파일을 저장하고 파일 경로 반환"""
    # 고유한 파일명 생성 (UUID + 원본 확장자)
    file_ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(directory, unique_filename)

    # 파일 저장
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return file_path


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(..., description="이력서 파일 (PDF, DOC, DOCX, HWP, TXT)"),
    current_user: User = Depends(get_current_user)
):
    """이력서 파일 업로드"""

    # 파일 유효성 검사
    validate_file(file)

    # 파일 저장
    try:
        file_path = save_upload_file(file, RESUME_DIR)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}"
        )

    # 프로필에 파일 경로 저장 (없으면 자동 생성)
    profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if not profile:
        # 프로필이 없으면 자동으로 생성
        profile = Profile(user_id=str(current_user.id))
        await profile.insert()

    # 기존 파일이 있으면 삭제
    if profile.resume_url and os.path.exists(profile.resume_url):
        try:
            os.remove(profile.resume_url)
        except:
            pass

    # 새 파일 경로 저장
    profile.resume_url = file_path
    profile.updated_at = datetime.utcnow()
    await profile.save()

    return {
        "success": True,
        "message": "이력서가 업로드되었습니다",
        "filename": file.filename,
        "file_path": file_path
    }


@router.post("/upload-cover-letter")
async def upload_cover_letter(
    file: UploadFile = File(..., description="자기소개서 파일 (PDF, DOC, DOCX, HWP, TXT)"),
    current_user: User = Depends(get_current_user)
):
    """자기소개서 파일 업로드"""

    # 파일 유효성 검사
    validate_file(file)

    # 파일 저장
    try:
        file_path = save_upload_file(file, COVER_LETTER_DIR)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}"
        )

    # 프로필에 파일 경로 저장 (없으면 자동 생성)
    profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if not profile:
        # 프로필이 없으면 자동으로 생성
        profile = Profile(user_id=str(current_user.id))
        await profile.insert()

    # 기존 파일이 있으면 삭제
    if profile.cover_letter_url and os.path.exists(profile.cover_letter_url):
        try:
            os.remove(profile.cover_letter_url)
        except:
            pass

    # 새 파일 경로 저장
    profile.cover_letter_url = file_path
    profile.updated_at = datetime.utcnow()
    await profile.save()

    return {
        "success": True,
        "message": "자기소개서가 업로드되었습니다",
        "filename": file.filename,
        "file_path": file_path
    }


@router.get("/download-resume")
async def download_resume(
    current_user: User = Depends(get_current_user)
):
    """내 이력서 다운로드"""

    profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if not profile or not profile.resume_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="업로드된 이력서가 없습니다"
        )

    if not os.path.exists(profile.resume_url):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다"
        )

    # 원본 파일명 추출 (선택사항: 실제로는 UUID 파일명을 사용)
    filename = os.path.basename(profile.resume_url)

    return FileResponse(
        path=profile.resume_url,
        filename=filename,
        media_type="application/octet-stream"
    )


@router.get("/download-cover-letter")
async def download_cover_letter(
    current_user: User = Depends(get_current_user)
):
    """내 자기소개서 다운로드"""

    profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if not profile or not profile.cover_letter_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="업로드된 자기소개서가 없습니다"
        )

    if not os.path.exists(profile.cover_letter_url):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다"
        )

    filename = os.path.basename(profile.cover_letter_url)

    return FileResponse(
        path=profile.cover_letter_url,
        filename=filename,
        media_type="application/octet-stream"
    )


@router.get("/download-resume/{user_id}")
async def download_user_resume(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """다른 사용자의 이력서 다운로드 (리크루터/관리자 전용)"""

    # 권한 확인
    if current_user.user_type not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이력서를 다운로드할 권한이 없습니다"
        )

    profile = await Profile.find_one(Profile.user_id == user_id)
    if not profile or not profile.resume_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="업로드된 이력서가 없습니다"
        )

    if not os.path.exists(profile.resume_url):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다"
        )

    filename = os.path.basename(profile.resume_url)

    return FileResponse(
        path=profile.resume_url,
        filename=filename,
        media_type="application/octet-stream"
    )


@router.get("/download-cover-letter/{user_id}")
async def download_user_cover_letter(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """다른 사용자의 자기소개서 다운로드 (리크루터/관리자 전용)"""

    # 권한 확인
    if current_user.user_type not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="자기소개서를 다운로드할 권한이 없습니다"
        )

    profile = await Profile.find_one(Profile.user_id == user_id)
    if not profile or not profile.cover_letter_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="업로드된 자기소개서가 없습니다"
        )

    if not os.path.exists(profile.cover_letter_url):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일을 찾을 수 없습니다"
        )

    filename = os.path.basename(profile.cover_letter_url)

    return FileResponse(
        path=profile.cover_letter_url,
        filename=filename,
        media_type="application/octet-stream"
    )


@router.delete("/delete-resume")
async def delete_resume(
    current_user: User = Depends(get_current_user)
):
    """내 이력서 삭제"""

    profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if not profile or not profile.resume_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="업로드된 이력서가 없습니다"
        )

    # 파일 삭제
    if os.path.exists(profile.resume_url):
        try:
            os.remove(profile.resume_url)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"파일 삭제 중 오류가 발생했습니다: {str(e)}"
            )

    # DB에서 경로 제거
    profile.resume_url = None
    profile.updated_at = datetime.utcnow()
    await profile.save()

    return {
        "success": True,
        "message": "이력서가 삭제되었습니다"
    }


@router.delete("/delete-cover-letter")
async def delete_cover_letter(
    current_user: User = Depends(get_current_user)
):
    """내 자기소개서 삭제"""

    profile = await Profile.find_one(Profile.user_id == str(current_user.id))
    if not profile or not profile.cover_letter_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="업로드된 자기소개서가 없습니다"
        )

    # 파일 삭제
    if os.path.exists(profile.cover_letter_url):
        try:
            os.remove(profile.cover_letter_url)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"파일 삭제 중 오류가 발생했습니다: {str(e)}"
            )

    # DB에서 경로 제거
    profile.cover_letter_url = None
    profile.updated_at = datetime.utcnow()
    await profile.save()

    return {
        "success": True,
        "message": "자기소개서가 삭제되었습니다"
    }
