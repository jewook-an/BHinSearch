"""
초기 데이터 생성 스크립트
커뮤니티 게시글 샘플 데이터를 생성합니다.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.models.post import Post
from datetime import datetime

# 관리자 ID (더미)
ADMIN_ID = "000000000000000000000001"

# 샘플 게시글 데이터
SAMPLE_POSTS = [
    # 공지사항
    {
        "title": "보험업계 ATS 서비스 오픈 안내",
        "content": """
안녕하세요, 보험업계 ATS 서비스를 오픈하게 되었습니다.

보험업계 전문 인재와 기업을 연결하는 플랫폼으로,
경력직 구직자와 리크루터 모두에게 최적화된 서비스를 제공합니다.

주요 기능:
- 보험업계 특화 포지션 검색
- 상세한 프로필 관리
- 실시간 지원 현황 추적
- 지원 상태별 알림 시스템

많은 이용 부탁드립니다. 감사합니다.
        """,
        "category": "notice",
        "author_id": ADMIN_ID,
        "author_name": "관리자",
        "is_pinned": True
    },
    # FAQ 1
    {
        "title": "회원가입은 어떻게 하나요?",
        "content": """
회원가입 방법을 안내드립니다.

1. 상단 우측의 "회원가입" 버튼을 클릭합니다.
2. 이메일, 비밀번호, 이름, 연락처를 입력합니다.
3. 사용자 유형을 선택합니다:
   - 경력직: 채용 포지션에 지원하려는 구직자
   - 리크루터: 인재를 채용하려는 기업 담당자
4. "회원가입" 버튼을 클릭하여 완료합니다.

회원가입 후 바로 로그인하여 서비스를 이용하실 수 있습니다.

추가 문의사항이 있으시면 support@bhinsearch.com으로 연락주세요.
        """,
        "category": "faq",
        "author_id": ADMIN_ID,
        "author_name": "관리자",
        "is_pinned": False
    },
    # FAQ 2
    {
        "title": "프로필은 어떻게 작성하나요?",
        "content": """
효과적인 프로필 작성 방법을 안내드립니다.

📝 프로필 작성 방법:

1. 로그인 후 "프로필" 메뉴를 클릭합니다.
2. "프로필 편집" 버튼을 클릭합니다.
3. 다음 정보를 입력합니다:
   - 기본 정보: 생년월일, 주소, 경력 기간
   - 현재 직장 정보: 회사명, 직책
   - 자기소개
   - 경력 사항: 회사명, 직책, 근무 기간, 업무 내용
   - 학력 사항: 학교명, 전공, 학위, 졸업 시기
   - 자격증: 자격증명, 발급기관, 취득일
   - 보유 기술

4. "저장" 버튼을 클릭하여 완료합니다.

💡 팁:
- 프로필 완성도가 높을수록 리크루터의 관심을 받을 확률이 높아집니다.
- 모든 항목을 채우면 100% 완성도를 달성할 수 있습니다.
- 이력서와 자기소개서 파일도 업로드할 수 있습니다.
        """,
        "category": "faq",
        "author_id": ADMIN_ID,
        "author_name": "관리자",
        "is_pinned": False
    },
    # FAQ 3
    {
        "title": "지원 후 진행 상황은 어디서 확인하나요?",
        "content": """
지원 현황 확인 방법을 안내드립니다.

📊 지원 현황 확인:

1. **대시보드에서 확인**
   - 로그인 후 "대시보드" 메뉴 클릭
   - "내 지원 내역" 섹션에서 전체 지원 현황 확인

2. **지원 관리 페이지**
   - "지원 관리" 메뉴 클릭
   - 지원한 모든 포지션의 상세 정보 확인

3. **지원 상태별 의미**
   - 🟡 검토 중: 리크루터가 지원서를 확인하는 단계
   - 🔵 서류 통과: 서류 전형을 통과하여 면접 대기 중
   - 🟢 면접 예정: 면접 일정이 잡힌 상태
   - ✅ 합격: 최종 합격
   - ❌ 불합격: 아쉽지만 이번에는 인연이 아니었습니다

4. **알림 기능**
   - 상태가 변경될 때마다 실시간 알림을 받습니다
   - 알림 아이콘(🔔)을 클릭하여 확인하세요

문의사항이 있으시면 언제든지 연락주세요!
        """,
        "category": "faq",
        "author_id": ADMIN_ID,
        "author_name": "관리자",
        "is_pinned": False
    },
    # 업데이트 소식
    {
        "title": "v1.0 정식 오픈",
        "content": """
보험업계 ATS v1.0이 정식으로 오픈되었습니다! 🎉

✨ 주요 기능:
- 포지션 검색 및 필터링
- 상세 프로필 관리 (완성도 계산)
- 원클릭 지원 기능
- 지원 상태 추적
- 실시간 알림 시스템
- 이력서/자기소개서 업로드
- 리크루터용 대시보드

앞으로도 사용자 여러분의 피드백을 반영하여
지속적으로 개선해 나가겠습니다.

감사합니다! 🙏
        """,
        "category": "update",
        "author_id": ADMIN_ID,
        "author_name": "관리자",
        "is_pinned": False
    },
    # 이용 가이드
    {
        "title": "서비스 이용 가이드 - 구직자편",
        "content": """
보험업계 ATS 구직자 이용 가이드입니다.

📖 Step 1: 회원가입 및 로그인
- 이메일로 간편하게 가입
- 사용자 유형: "경력직" 선택

📖 Step 2: 프로필 작성
- 기본 정보, 경력, 학력, 자격증 입력
- 이력서와 자기소개서 업로드
- 프로필 완성도 100% 달성 목표!

📖 Step 3: 포지션 검색
- "포지션 검색" 메뉴에서 관심 있는 공고 탐색
- 지역, 경력, 고용형태로 필터링
- 키워드 검색 활용

📖 Step 4: 지원하기
- 관심 있는 포지션 상세 페이지 접속
- "지원하기" 버튼 클릭
- 자동으로 프로필 정보가 전달됩니다

📖 Step 5: 지원 현황 관리
- 대시보드에서 지원 현황 확인
- 알림을 통해 상태 변경 실시간 수신
- 면접 일정 확인

💡 성공 팁:
✅ 프로필을 상세하게 작성할수록 합격률 UP!
✅ 정기적으로 프로필을 업데이트하세요
✅ 여러 포지션에 지원하여 기회를 넓히세요

화이팅입니다! 💪
        """,
        "category": "guide",
        "author_id": ADMIN_ID,
        "author_name": "관리자",
        "is_pinned": False
    },
    # 이용 가이드 2
    {
        "title": "서비스 이용 가이드 - 리크루터편",
        "content": """
보험업계 ATS 리크루터 이용 가이드입니다.

📖 Step 1: 회원가입 및 로그인
- 기업 이메일로 가입
- 사용자 유형: "리크루터" 선택

📖 Step 2: 포지션 등록
- "포지션 관리" 메뉴 접속
- "새 포지션 등록" 클릭
- 채용 공고 상세 정보 입력:
  * 직무명, 회사명, 근무지
  * 경력 요구사항, 고용형태
  * 담당 업무, 자격 요건
  * 우대 사항, 복리후생

📖 Step 3: 지원자 관리
- 대시보드에서 지원자 현황 확인
- 각 지원자의 프로필 열람
- 이력서/자기소개서 다운로드

📖 Step 4: 지원 상태 관리
- 지원자별 상태 변경:
  * 검토 중 → 서류 통과 → 면접 → 합격/불합격
- 상태 변경 시 지원자에게 자동 알림 발송
- 리크루터 메모 작성 가능

📖 Step 5: 면접 일정 관리
- 면접 일정을 등록하면 지원자에게 알림
- 효율적인 채용 프로세스 관리

💡 채용 성공 팁:
✅ 상세하고 매력적인 공고 작성
✅ 신속한 지원자 피드백
✅ 정확한 상태 업데이트

좋은 인재를 만나시길 바랍니다! 🤝
        """,
        "category": "guide",
        "author_id": ADMIN_ID,
        "author_name": "관리자",
        "is_pinned": False
    }
]

async def seed_posts():
    """게시글 샘플 데이터 생성"""
    print("🌱 초기 데이터 생성을 시작합니다...")

    # MongoDB 연결
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.DATABASE_NAME]

    try:
        # Beanie 초기화
        from beanie import init_beanie
        await init_beanie(database=database, document_models=[Post])

        # 기존 게시글 확인
        existing_count = await Post.count()
        print(f"📊 기존 게시글 수: {existing_count}개")

        if existing_count > 0:
            response = input("⚠️  기존 게시글이 있습니다. 모두 삭제하고 새로 생성하시겠습니까? (y/N): ")
            if response.lower() == 'y':
                await Post.delete_all()
                print("🗑️  기존 게시글을 모두 삭제했습니다.")
            else:
                print("❌ 작업을 취소합니다.")
                return

        # 샘플 게시글 생성
        created_count = 0
        for post_data in SAMPLE_POSTS:
            post = Post(**post_data)
            await post.insert()
            created_count += 1
            print(f"✅ 생성: [{post.category}] {post.title}")

        print(f"\n🎉 총 {created_count}개의 게시글이 생성되었습니다!")
        print("\n📋 카테고리별 게시글:")

        # 카테고리별 통계
        categories = ['notice', 'faq', 'update', 'guide']
        for category in categories:
            count = await Post.find(Post.category == category).count()
            category_names = {
                'notice': '공지사항',
                'faq': '자주 묻는 질문',
                'update': '업데이트',
                'guide': '가이드'
            }
            print(f"  - {category_names[category]}: {count}개")

    except Exception as e:
        print(f"❌ 에러 발생: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    print("=" * 60)
    print("🌱 보험업계 ATS - 초기 데이터 생성 스크립트")
    print("=" * 60)
    asyncio.run(seed_posts())
