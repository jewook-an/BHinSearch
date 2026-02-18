import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">보험업계 전문 채용관리 솔루션</h1>
          <p className="hero-subtitle">
            보험업계 경력자와 기업을 연결하는 스마트한 ATS 플랫폼
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              지금 시작하기
            </Link>
            <Link to="/positions" className="btn btn-outline btn-lg">
              포지션 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">주요 기능</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>경력별 맞춤 검색</h3>
              <p>1년 미만부터 10년 이상까지, 경력에 맞는 포지션을 쉽게 찾으세요</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>프로필 관리</h3>
              <p>이력서, 자기소개서를 한곳에서 관리하고 원클릭으로 지원하세요</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>실시간 알림</h3>
              <p>새로운 포지션과 지원 현황을 실시간으로 알림 받으세요</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>커뮤니티</h3>
              <p>보험업계 종사자들과 정보를 공유하고 네트워킹 하세요</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>즐겨찾기</h3>
              <p>관심있는 기업과 포지션을 즐겨찾기하고 추적하세요</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>통계 및 분석</h3>
              <p>지원 현황과 시장 트렌드를 한눈에 파악하세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="user-types-section">
        <div className="container">
          <h2 className="section-title">누구를 위한 서비스인가요?</h2>

          <div className="user-types-grid">
            <div className="user-type-card">
              <h3>보험업계 경력자</h3>
              <ul>
                <li>경력에 맞는 포지션 검색</li>
                <li>프로필 및 이력서 관리</li>
                <li>지원 현황 추적</li>
                <li>업계 커뮤니티 참여</li>
              </ul>
              <Link to="/register?type=experienced" className="btn btn-primary">
                시작하기
              </Link>
            </div>

            <div className="user-type-card">
              <h3>일반 구직자</h3>
              <ul>
                <li>보험업계 포지션 검색</li>
                <li>지원서 작성 및 제출</li>
                <li>기업 정보 열람</li>
                <li>경력 개발 정보</li>
              </ul>
              <Link to="/register?type=jobseeker" className="btn btn-primary">
                시작하기
              </Link>
            </div>

            <div className="user-type-card">
              <h3>인사 담당자</h3>
              <ul>
                <li>포지션 등록 및 관리</li>
                <li>지원자 관리 시스템</li>
                <li>채용 통계 및 리포트</li>
                <li>지원자 검색 및 필터링</li>
              </ul>
              <Link to="/register?type=recruiter" className="btn btn-primary">
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1,000+</div>
              <div className="stat-label">등록 기업</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">활성 포지션</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">등록 사용자</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">만족도</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>지금 바로 시작하세요</h2>
          <p>보험업계 최고의 기회를 찾아보세요</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
