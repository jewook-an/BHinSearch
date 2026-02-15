import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
        </nav>

        <div className="auth-buttons">
          <Link to="/login" className="btn btn-outline">로그인</Link>
          <Link to="/register" className="btn btn-primary">회원가입</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
