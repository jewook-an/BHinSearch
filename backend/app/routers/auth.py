from datetime import timedelta, datetime
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
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter()

# Google 로그인 요청 스키마
class GoogleLoginRequest(BaseModel):
    credential: str  # Google이 발급한 ID 토큰 (JWT)

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
    """Google 소셜 로그인"""

    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth가 설정되지 않았습니다 (GOOGLE_CLIENT_ID 누락)"
        )

    try:
        # Google ID 토큰 검증
        idinfo = id_token.verify_oauth2_token(
            request.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"유효하지 않은 Google 토큰입니다: {str(e)}"
        )

    google_user_id = idinfo.get("sub")
    email = idinfo.get("email")
    name = idinfo.get("name", email.split("@")[0])
    picture = idinfo.get("picture")

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
