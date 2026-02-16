"""
API 응답 테스트
"""
import requests

print("🧪 API 테스트 시작...\n")

try:
    # Health check
    response = requests.get("http://localhost:8001/health")
    print(f"✅ Health Check: {response.status_code}")
    print(f"   Response: {response.json()}\n")

    # Posts API
    response = requests.get("http://localhost:8001/api/v1/posts/?page=1&page_size=10")
    print(f"✅ Posts API: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"   Total: {data.get('total')}")
        print(f"   Posts: {len(data.get('posts', []))}")
        print(f"   Response Keys: {list(data.keys())}")

        if data.get('posts'):
            print(f"\n📋 첫 번째 게시글:")
            post = data['posts'][0]
            for key, value in post.items():
                if key == 'content':
                    print(f"   {key}: {str(value)[:50]}...")
                else:
                    print(f"   {key}: {value}")
    else:
        print(f"   ❌ Error: {response.text}")

except Exception as e:
    print(f"❌ 에러 발생: {e}")
