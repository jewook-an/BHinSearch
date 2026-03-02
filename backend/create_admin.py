import asyncio
import os
import sys
from getpass import getpass
from datetime import datetime

from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from app.config import settings

# bcrypt 직접 import (passlib 우회)
try:
    import bcrypt
except ImportError:
    print("❌ bcrypt를 사용할 수 없습니다. pip install bcrypt 를 실행하세요.")
    sys.exit(1)


async def create_admin(email: str, password: str, name: str = "관리자", force: bool = False):
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]

    try:
        # 기존 사용자 확인
        existing = await users_collection.find_one({"email": email})

        if existing:
            if not force:
                print(f"⚠️  사용자 '{email}' 가 이미 존재합니다.")
                print(f"   기존 계정을 덮어쓰려면 --force 옵션을 사용하세요.")
                return

            # --force 플래그 사용 시 기존 계정 삭제
            print(f"🔄 기존 사용자 '{email}'을(를) 삭제 후 재생성합니다...")
            await users_collection.delete_one({"email": email})
            print(f"✅ 기존 계정 삭제 완료")

        # bcrypt로 비밀번호 해싱
        password_bytes = password.encode('utf-8')
        hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')

        # 새 관리자 문서 생성
        admin_doc = {
            "_id": ObjectId(),
            "email": email,
            "hashed_password": hashed_password,
            "name": name,
            "user_type": "admin",
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        result = await users_collection.insert_one(admin_doc)
        print(f"✅ 관리자 계정 생성 완료: {email}")
        print(f"   이름: {name}")
        print(f"   타입: admin")
        print(f"   ID: {result.inserted_id}")

    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()


def main():
    # 명령줄 인자 처리
    force = "--force" in sys.argv

    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")
    name = os.getenv("ADMIN_NAME", "관리자")

    if not email:
        email = input("관리자 이메일을 입력하세요 (e.g. admin@example.com): ").strip()

    if not password:
        password = getpass("관리자 비밀번호를 입력하세요: ")
        confirm = getpass("비밀번호 확인: ")
        if password != confirm:
            print("❌ 비밀번호가 일치하지 않습니다. 종료합니다.")
            return

    asyncio.run(create_admin(email=email, password=password, name=name, force=force))


if __name__ == "__main__":
    main()
