import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 로그인 로직 구현
    console.log('Login attempt:', formData);
    // 임시로 대시보드로 리다이렉트
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">로그인</h2>
          <p className="login-subtitle">보험업계 ATS에 오신 것을 환영합니다</p>

          <form onSubmit={handleSubmit} className="login-form">
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

            <button type="submit" className="btn btn-primary btn-full">
              로그인
            </button>
          </form>

          <div className="divider">
            <span>또는</span>
          </div>

          <div className="social-login">
            <button className="btn btn-social btn-google">
              Google로 로그인
            </button>
            <button className="btn btn-social btn-kakao">
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
