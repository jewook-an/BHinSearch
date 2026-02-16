from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models.user import User
from app.models.profile import Profile
from app.models.position import Position
from app.models.application import Application
from app.models.notification import Notification

# MongoDB 클라이언트
client = None
database = None

async def init_db():
    """데이터베이스 초기화"""
    global client, database

    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.DATABASE_NAME]

    # Beanie 초기화 (모든 모델 등록)
    await init_beanie(
        database=database,
        document_models=[
            User,
            Profile,
            Position,
            Application,
            Notification
        ]
    )

async def close_db():
    """데이터베이스 연결 종료"""
    if client:
        client.close()

def get_database():
    """데이터베이스 인스턴스 반환"""
    return database
