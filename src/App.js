import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
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

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
    <Router basename={process.env.PUBLIC_URL}>
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
