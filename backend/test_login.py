import requests
import json

def test_health():
    """Test backend health endpoint"""
    try:
        r = requests.get('http://127.0.0.1:8000/health', timeout=5)
        print('✅ Backend Health Check:')
        print(f'   Status: {r.status_code}')
        print(f'   Response: {r.text}')
        return r.status_code == 200
    except Exception as e:
        print(f'❌ Backend not available: {e}')
        return False

def test_admin_login():
    """Test admin login endpoint"""
    url = 'http://127.0.0.1:8000/api/v1/admin/login'
    payload = {'email': 'admin@local', 'password': 'Admin123!'}

    print('\n📝 Testing Admin Login:')
    print(f'   URL: {url}')
    print(f'   Payload: {json.dumps(payload)}')

    try:
        r = requests.post(url, json=payload, timeout=10)
        print(f'\n✅ Response Status: {r.status_code}')
        print(f'   Content-Type: {r.headers.get("content-type")}')
        print(f'   Body:\n{r.text}')

        if r.status_code == 200:
            data = r.json()
            if 'access_token' in data:
                print(f'\n🎉 Login Successful!')
                print(f'   Token: {data["access_token"][:50]}...')
            return True
        else:
            print(f'\n⚠️  Login failed with status {r.status_code}')
            return False
    except Exception as e:
        print(f'❌ Request Error: {e}')
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print('=' * 60)
    print('🔍 Admin Login API Test')
    print('=' * 60)

    # First check health
    if not test_health():
        print('\n⚠️  Backend is not running. Start it first:')
        print('   cd e:\\Project\\bhinsearch\\backend')
        print('   python main.py')
        exit(1)

    # Then test login
    test_admin_login()

    print('\n' + '=' * 60)
