from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """애플리케이션 설정"""

    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "bhinsearch_db"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3000/BHinSearch",
        "https://jewook-an.github.io"
    ]

    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "보험업계 ATS API"

    # 파일 업로드
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
