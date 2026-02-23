import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App as CapApp } from '@capacitor/app';
import './LoginPage.css';

const IS_NATIVE = Capacitor.isNativePlatform();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api/v1';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 카카오 SDK 초기화
  useEffect(() => {
    const kakaoKey = process.env.REACT_APP_KAKAO_JS_KEY;
    if (window.Kakao && !window.Kakao.isInitialized() && kakaoKey) {
      window.Kakao.init(kakaoKey);
      console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
    }
  }, []);

  // 네이티브 Google 로그인 (@codetrix-studio/capacitor-google-auth)
  const handleGoogleNative = async () => {
    setError('');
    setLoading(true);
    try {
      const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
      await GoogleAuth.initialize({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '36041664943-83vrbe08pdalj9r22b12jvr1t7fminj7.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      const googleUser = await GoogleAuth.signIn();
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: googleUser.authentication.idToken,
          email: googleUser.email,
          name: googleUser.name || googleUser.displayName,
          picture: googleUser.imageUrl,
          sub: googleUser.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Google 로그인에 실패했습니다');
      localStorage.setItem('access_token', data.access_token);
      await fetchUserInfo(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Native Google login error:', err);
      setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 로그인 성공 후 사용자 정보 가져오기
  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userInfo = await res.json();
        localStorage.setItem('user_info', JSON.stringify(userInfo));
      }
    } catch (err) {
      console.error('사용자 정보 가져오기 실패:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '로그인에 실패했습니다');
      localStorage.setItem('access_token', data.access_token);
      await fetchUserInfo(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Google 로그인에 실패했습니다');
      localStorage.setItem('access_token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
  };

  // 카카오 로그인 콜백 처리 (리다이렉트 후 ?code= 파라미터 감지)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const kakaoCode = urlParams.get('code');

    if (kakaoCode) {
      // URL에서 code 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
      handleKakaoCallback(kakaoCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 카카오 인가코드를 백엔드로 전송
  const handleKakaoCallback = async (code, redirectUri) => {
    setError('');
    setLoading(true);
    try {
      // redirectUri가 전달되지 않으면 기본값 사용
      const finalRedirectUri = redirectUri || (
        IS_NATIVE
          ? 'https://jewook-an.github.io/BHinSearch/login'
          : window.location.origin + '/BHinSearch/login'
      );
      const res = await fetch(`${API_URL}/auth/kakao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          redirect_uri: finalRedirectUri,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '카카오 로그인에 실패했습니다');
      localStorage.setItem('access_token', data.access_token);
      await fetchUserInfo(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 카카오 로그인 버튼 클릭
  const handleKakaoLogin = async () => {
    setError('');

    const kakaoAppKey = process.env.REACT_APP_KAKAO_JS_KEY;

    if (IS_NATIVE) {
      // ✅ 트램폴린 패턴: Browser(Chrome Custom Tab) → GitHub Pages 리다이렉트 → 커스텀 스킴으로 앱 복귀
      // 흐름:
      //   1. Chrome Custom Tab으로 카카오 인증 페이지 열기
      //   2. 카카오 인증 완료 → https://jewook-an.github.io/BHinSearch/login?code=xxx&state=native_app 리다이렉트
      //   3. GitHub Pages의 index.html 트램폴린 스크립트가 state=native_app 감지
      //   4. 즉시 kakaod5027a40fdd5e38b501bacc2b55557fe://oauth?code=xxx 로 리다이렉트
      //   5. Android intent-filter가 커스텀 스킴을 캐치 → 앱으로 복귀
      //   6. appUrlOpen 이벤트 발동 → code 추출 → 백엔드 로그인 처리
      const nativeRedirectUri = 'https://jewook-an.github.io/BHinSearch/login';
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoAppKey}&redirect_uri=${encodeURIComponent(nativeRedirectUri)}&response_type=code&scope=profile_nickname,profile_image,account_email&state=native_app`;

      // 1. 딥링크 리스너 등록 (트램폴린 리다이렉트로 앱에 복귀 시 발동)
      const urlListener = await CapApp.addListener('appUrlOpen', async ({ url }) => {
        console.log('appUrlOpen received:', url);
        try {
          // URL에서 code 파라미터 추출
          const codeMatch = url.match(/[?&]code=([^&]+)/);
          const code = codeMatch ? codeMatch[1] : null;

          if (code) {
            // 브라우저 탭 닫기
            try { await Browser.close(); } catch (e) { /* Chrome Custom Tab이 이미 닫혔을 수 있음 */ }
            // 리스너 정리
            urlListener.remove();
            // 인가 코드로 로그인 처리 (redirect_uri는 GitHub Pages URL로 매칭)
            handleKakaoCallback(code, nativeRedirectUri);
          }
        } catch (e) {
          console.error('Kakao callback 처리 오류:', e);
          setError('카카오 로그인 처리 중 오류가 발생했습니다.');
        }
      });

      // 2. 사용자가 브라우저를 직접 닫은 경우 (로그인 취소) 리스너 정리
      const browserListener = await Browser.addListener('browserFinished', () => {
        urlListener.remove();
        browserListener.remove();
      });

      // 3. Chrome Custom Tab으로 카카오 로그인 페이지 열기
      await Browser.open({ url: kakaoAuthUrl });

    } else {
      // 웹: 기존 Kakao SDK 방식
      const redirectUri = window.location.origin + '/BHinSearch/login';
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        setError('카카오 SDK가 초기화되지 않았습니다. 페이지를 새로고침 해주세요.');
        return;
      }
      window.Kakao.Auth.authorize({
        redirectUri,
        scope: 'profile_nickname,profile_image,account_email',
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        // Google access token으로 사용자 정보 가져오기
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        // 백엔드로 사용자 정보 전송
        const res = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: tokenResponse.access_token,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            sub: userInfo.sub
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Google 로그인에 실패했습니다');
        localStorage.setItem('access_token', data.access_token);
        await fetchUserInfo(data.access_token);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    onError: handleGoogleError,
  });

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">로그인</h2>
          <p className="login-subtitle">보험업계 ATS에 오신 것을 환영합니다</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">{error}</div>
            )}
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>로그인 상태 유지</span>
              </label>

              <Link to="/forgot-password" className="forgot-link">
                비밀번호 찾기
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="divider">
            <span>또는</span>
          </div>

          <div className="social-login">
            <button
              className="btn btn-social btn-google"
              type="button"
              onClick={() => IS_NATIVE ? handleGoogleNative() : googleLogin()}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 로그인
            </button>
            <button
              className="btn btn-social btn-kakao"
              type="button"
              onClick={handleKakaoLogin}
              disabled={loading}
            >
              <svg className="kakao-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#000000" d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.41-1 3.58 0 .05.02.1.06.13a.12.12 0 00.1.01c.16-.02 2.6-1.72 3.56-2.4.85.12 1.73.18 2.62.18 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
              </svg>
              카카오톡으로 로그인
            </button>
          </div>

          <div className="register-link">
            아직 계정이 없으신가요? <Link to="/register">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
