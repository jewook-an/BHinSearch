import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Capacitor } from '@capacitor/core';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PositionsPage from './pages/PositionsPage';
import PositionDetailPage from './pages/PositionDetailPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import ExperiencedUserDashboard from './pages/dashboard/ExperiencedUserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import ScrollToTop from './components/common/ScrollToTop';
import './App.css';

// Capacitor 네이티브 앱에서 Android 뒤로가기 버튼 처리
const AndroidBackButtonHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let appPlugin;
    let cleanup;

    const setupBackButton = async () => {
      try {
        const { App } = await import('@capacitor/app');
        appPlugin = App;
        const listener = await App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            navigate(-1);
          } else {
            App.exitApp();
          }
        });
        cleanup = () => listener.remove();
      } catch (e) {
        console.warn('Capacitor App plugin not available:', e);
      }
    };

    setupBackButton();
    return () => {
      if (cleanup) cleanup();
    };
  }, [navigate]);

  return null;
};

// 앱 초기화 (SplashScreen 숨기기, StatusBar 설정)
const AppInitializer = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const initApp = async () => {
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        const { StatusBar, Style } = await import('@capacitor/status-bar');

        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#1a365d' });
        await SplashScreen.hide();
      } catch (e) {
        console.warn('Capacitor plugin init error:', e);
      }
    };

    // 앱 로드 후 약간의 딜레이를 주고 스플래시 숨김
    const timer = setTimeout(initApp, 300);
    return () => clearTimeout(timer);
  }, []);

  return null;
};

function App() {
  // Capacitor 네이티브 앱이면 basename 없이, 웹이면 PUBLIC_URL 사용
  const basename = Capacitor.isNativePlatform() ? '' : (process.env.PUBLIC_URL || '');

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <Router basename={basename}>
        <AppInitializer />
        <AndroidBackButtonHandler />
        <ScrollToTop />
        <Routes>
          {/* 레이아웃이 있는 페이지들 */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />

          {/* 레이아웃이 없는 페이지들 (로그인, 회원가입) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 대시보드 페이지들 (레이아웃 포함) */}
          <Route path="/dashboard" element={<Layout><ExperiencedUserDashboard /></Layout>} />
          <Route path="/dashboard/experienced" element={<Layout><ExperiencedUserDashboard /></Layout>} />
          <Route path="/dashboard/admin" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/dashboard/recruiter" element={<Layout><RecruiterDashboard /></Layout>} />

          {/* 포지션 관련 페이지들 */}
          <Route path="/positions" element={<Layout><PositionsPage /></Layout>} />
          <Route path="/positions/:id" element={<Layout><PositionDetailPage /></Layout>} />

          {/* 프로필 페이지들 */}
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/profile/edit" element={<Layout><ProfileEditPage /></Layout>} />

          {/* 서비스 소개 & 커뮤니티 */}
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
