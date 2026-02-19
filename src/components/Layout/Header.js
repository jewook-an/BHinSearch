import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    // storage 이벤트로 다른 탭에서의 로그인/로그아웃 감지
    const handleStorageChange = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>보험업계 ATS</h1>
        </Link>

        <nav className="nav">
          <Link to="/positions" className="nav-link">포지션 검색</Link>
          <Link to="/about" className="nav-link">서비스 소개</Link>
          <Link to="/community" className="nav-link">커뮤니티</Link>
          <Link to="/profile" className="nav-link">프로필</Link>
        </nav>

        <div className="auth-buttons">
          <Link to="/dashboard" className="btn btn-outline">대시보드</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-outline">로그아웃</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">로그인</Link>
              <Link to="/register" className="btn btn-primary">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
