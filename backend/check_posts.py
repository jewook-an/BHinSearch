"""
커뮤니티 게시글 데이터 확인 스크립트
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.models.post import Post

async def check_posts():
    """게시글 데이터 확인"""
    print("📊 게시글 데이터 확인 중...")

    # MongoDB 연결
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.DATABASE_NAME]

    try:
        # Beanie 초기화
        from beanie import init_beanie
        await init_beanie(database=database, document_models=[Post])

        # 전체 게시글 수
        total_count = await Post.count()
        print(f"\n✅ 전체 게시글 수: {total_count}개")

        # is_published=True인 게시글 수
        published_count = await Post.find(Post.is_published == True).count()
        print(f"✅ 게시됨(is_published=True): {published_count}개")

        # is_published=False인 게시글 수
        unpublished_count = await Post.find(Post.is_published == False).count()
        print(f"⚠️  미게시(is_published=False): {unpublished_count}개")

        # 모든 게시글 목록
        print("\n📋 게시글 목록:")
        posts = await Post.find_all().to_list()
        for post in posts:
            print(f"  - [{post.category}] {post.title[:30]}... (is_published={post.is_published})")

    except Exception as e:
        print(f"❌ 에러 발생: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_posts())
