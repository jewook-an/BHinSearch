from datetime import timedelta, datetime
from typing import Optional
import httpx
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, Token, UserResponse
from app.utils.auth import (
    verify_password,
    get_password_hash,
    create_access_token
)
from app.config import settings

router = APIRouter()

# Google 로그인 요청 스키마
class GoogleLoginRequest(BaseModel):
    credential: str  # Google access token 또는 ID 토큰
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    sub: Optional[str] = None  # Google 사용자 고유 ID

# 카카오 로그인 요청 스키마
class KakaoLoginRequest(BaseModel):
    code: str  # 카카오 인가 코드
    redirect_uri: str  # 프론트엔드 redirect URI

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """회원가입"""

    # 이메일 중복 확인
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다"
        )

    # 사용자 생성
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name,
        phone=user_data.phone,
        user_type=user_data.user_type
    )

    await new_user.insert()

    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        name=new_user.name,
        phone=new_user.phone,
        user_type=new_user.user_type,
        is_active=new_user.is_active,
        created_at=new_user.created_at
    )

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """로그인"""

    # 사용자 찾기
    user = await User.find_one(User.email == user_credentials.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 비밀번호 확인
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 토큰 생성
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")

@router.post("/token", response_model=Token)
async def login_with_form(form_data: OAuth2PasswordRequestForm = Depends()):
    """폼 데이터로 로그인 (Swagger UI용)"""

    user = await User.find_one(User.email == form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


@router.post("/google", response_model=Token)
async def google_login(request: GoogleLoginRequest):
    """Google 소셜 로그인 (useGoogleLogin 방식)"""

    # 프론트엔드에서 전달한 사용자 정보 사용
    email = request.email
    name = request.name
    picture = request.picture
    google_user_id = request.sub

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google 계정에서 이메일을 가져올 수 없습니다"
        )

    # 기존 사용자 조회 (이메일로)
    user = await User.find_one(User.email == email)

    if user:
        # 기존 사용자: 소셜 정보 업데이트
        user.social_provider = "google"
        user.social_id = google_user_id
        if picture:
            user.profile_image = picture
        user.updated_at = datetime.utcnow()
        await user.save()
    else:
        # 신규 사용자: 자동 회원가입
        user = User(
            email=email,
            hashed_password=None,
            name=name,
            social_provider="google",
            social_id=google_user_id,
            profile_image=picture,
            user_type="experienced",
            is_verified=True,
        )
        await user.insert()

    # JWT 발급
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


@router.post("/kakao", response_model=Token)
async def kakao_login(request: KakaoLoginRequest):
    """카카오 소셜 로그인 (인가코드 방식)"""

    # 1) 인가 코드 → 액세스 토큰 교환
    token_url = "https://kauth.kakao.com/oauth/token"
    token_data = {
        "grant_type": "authorization_code",
        "client_id": settings.KAKAO_REST_API_KEY,
        "redirect_uri": request.redirect_uri,
        "code": request.code,
    }

    async with httpx.AsyncClient() as client:
        token_res = await client.post(token_url, data=token_data)
        token_json = token_res.json()

    if "access_token" not in token_json:
        error_desc = token_json.get("error_description", "카카오 토큰 교환 실패")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"카카오 인증 실패: {error_desc}"
        )

    kakao_access_token = token_json["access_token"]

    # 2) 액세스 토큰 → 사용자 정보 조회
    user_info_url = "https://kapi.kakao.com/v2/user/me"
    async with httpx.AsyncClient() as client:
        user_res = await client.get(
            user_info_url,
            headers={"Authorization": f"Bearer {kakao_access_token}"}
        )
        user_info = user_res.json()

    kakao_id = str(user_info.get("id", ""))
    kakao_account = user_info.get("kakao_account", {})
    profile = kakao_account.get("profile", {})
    email = kakao_account.get("email")
    name = profile.get("nickname")
    picture = profile.get("profile_image_url")

    if not kakao_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="카카오 사용자 ID를 가져올 수 없습니다"
        )

    # 3) 소셜 ID로 기존 사용자 조회
    user = await User.find_one(
        User.social_provider == "kakao",
        User.social_id == kakao_id
    )

    if not user and email:
        # 4) 같은 이메일 사용자가 있으면 연동
        user = await User.find_one(User.email == email)

    if user:
        # 기존 사용자: 소셜 정보 업데이트
        user.social_provider = "kakao"
        user.social_id = kakao_id
        if name and not user.name:
            user.name = name
        if picture:
            user.profile_image = picture
        user.updated_at = datetime.utcnow()
        await user.save()
    else:
        # 신규 사용자: 자동 회원가입
        # 카카오는 이메일이 없을 수 있으므로 대체 이메일 생성
        user_email = email if email else f"kakao_{kakao_id}@kakao.user"
        user = User(
            email=user_email,
            hashed_password=None,
            name=name or f"카카오사용자_{kakao_id[:6]}",
            social_provider="kakao",
            social_id=kakao_id,
            profile_image=picture,
            user_type="experienced",
            is_verified=True,
        )
        await user.insert()

    # JWT 발급
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")