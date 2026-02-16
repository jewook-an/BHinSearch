import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">보험업계 특화 ATS 플랫폼</h1>
          <p className="hero-subtitle">
            보험 업계 전문가와 기업을 연결하는 가장 효율적인 채용 솔루션
          </p>
          <div className="hero-buttons">
            <Link to="/positions" className="btn btn-primary btn-large">
              포지션 검색
            </Link>
            <Link to="/register" className="btn btn-outline btn-large">
              시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">핵심 기능</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>맞춤형 포지션 검색</h3>
              <p>
                보험 업계에 특화된 필터링과 검색으로
                나에게 딱 맞는 포지션을 찾아보세요.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>스마트 프로필 관리</h3>
              <p>
                경력, 학력, 자격증을 한 곳에 정리하고
                프로필 완성도를 실시간으로 확인하세요.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>빠른 지원 프로세스</h3>
              <p>
                이력서와 자기소개서를 업로드하고
                클릭 한 번으로 간편하게 지원하세요.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>실시간 알림</h3>
              <p>
                지원 상태 변경, 면접 일정 등
                중요한 소식을 놓치지 마세요.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>채용 관리 대시보드</h3>
              <p>
                리크루터를 위한 효율적인 지원자 관리와
                상태 추적 시스템을 제공합니다.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>안전한 정보 관리</h3>
              <p>
                JWT 기반 인증과 MongoDB 클라우드로
                안전하게 데이터를 보호합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">이용 방법</h2>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>회원가입</h3>
              <p>
                지원자 또는 리크루터로 간편하게 가입하고
                서비스를 시작하세요.
              </p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>프로필 작성</h3>
              <p>
                경력, 학력, 자격증 정보를 입력하고
                이력서를 업로드하세요.
              </p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>포지션 검색</h3>
              <p>
                지역, 경력, 고용형태 등 다양한 필터로
                원하는 포지션을 찾아보세요.
              </p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>간편 지원</h3>
              <p>
                관심있는 포지션에 클릭 한 번으로
                빠르게 지원하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="target-section">
        <div className="container">
          <h2 className="section-title">누가 사용하나요?</h2>

          <div className="target-grid">
            <div className="target-card">
              <h3>🎓 경력직 지원자</h3>
              <ul>
                <li>보험업계 경험이 있는 전문가</li>
                <li>더 좋은 기회를 찾는 이직 희망자</li>
                <li>경력 관리가 필요한 전문가</li>
              </ul>
              <Link to="/register?type=experienced" className="btn btn-outline">
                지원자로 시작하기
              </Link>
            </div>

            <div className="target-card">
              <h3>🏢 채용 담당자</h3>
              <ul>
                <li>보험사 인사팀 및 채용 담당자</li>
                <li>효율적인 채용 프로세스가 필요한 기업</li>
                <li>우수한 인재를 찾는 리크루터</li>
              </ul>
              <Link to="/register?type=recruiter" className="btn btn-outline">
                리크루터로 시작하기
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
              <div className="stat-label">등록된 포지션</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">활성 사용자</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">파트너 기업</div>
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
          <p>보험업계의 새로운 기회를 만나보세요</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              무료로 시작하기
            </Link>
            <Link to="/positions" className="btn btn-outline btn-large">
              포지션 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
