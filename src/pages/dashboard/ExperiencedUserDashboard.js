import React, { useState } from 'react';
import './ExperiencedUserDashboard.css';

const ExperiencedUserDashboard = () => {
  const [stats] = useState({
    appliedJobs: 5,
    savedJobs: 12,
    profileViews: 45,
    interviews: 2
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>대시보드</h1>
        <p>안녕하세요, 홍길동님!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-number">{stats.appliedJobs}</div>
            <div className="stat-label">지원한 포지션</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-number">{stats.savedJobs}</div>
            <div className="stat-label">관심 포지션</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <div className="stat-number">{stats.profileViews}</div>
            <div className="stat-label">프로필 조회수</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <div className="stat-number">{stats.interviews}</div>
            <div className="stat-label">면접 예정</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <section className="dashboard-section">
            <h2>최근 지원 현황</h2>
            <div className="application-list">
              <div className="application-item">
                <div className="company-logo">🏢</div>
                <div className="application-info">
                  <h3>손해사정사 - 삼성화재</h3>
                  <p>서류 검토 중</p>
                  <span className="application-date">지원일: 2026-02-10</span>
                </div>
                <div className="application-status status-reviewing">검토중</div>
              </div>

              <div className="application-item">
                <div className="company-logo">🏢</div>
                <div className="application-info">
                  <h3>보험 설계사 - 현대해상</h3>
                  <p>1차 면접 합격</p>
                  <span className="application-date">지원일: 2026-02-08</span>
                </div>
                <div className="application-status status-interview">면접예정</div>
              </div>

              <div className="application-item">
                <div className="company-logo">🏢</div>
                <div className="application-info">
                  <h3>언더라이터 - KB손해보험</h3>
                  <p>지원 완료</p>
                  <span className="application-date">지원일: 2026-02-05</span>
                </div>
                <div className="application-status status-submitted">지원완료</div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>추천 포지션</h2>
            <div className="job-list">
              <div className="job-card">
                <div className="job-header">
                  <div className="company-info">
                    <h3>보험계리사</h3>
                    <p>메리츠화재</p>
                  </div>
                  <span className="job-tag">신입·경력</span>
                </div>
                <div className="job-details">
                  <span>서울 강남구</span>
                  <span>경력 3~5년</span>
                  <span>연봉 협의</span>
                </div>
                <button className="btn btn-outline btn-small">자세히 보기</button>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <div className="company-info">
                    <h3>리스크관리 전문가</h3>
                    <p>한화손해보험</p>
                  </div>
                  <span className="job-tag">경력</span>
                </div>
                <div className="job-details">
                  <span>서울 여의도</span>
                  <span>경력 5~10년</span>
                  <span>5천만원~7천만원</span>
                </div>
                <button className="btn btn-outline btn-small">자세히 보기</button>
              </div>
            </div>
          </section>
        </div>

        <aside className="sidebar">
          <div className="sidebar-card">
            <h3>프로필 완성도</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '75%'}}></div>
            </div>
            <p className="progress-text">75% 완성</p>
            <button className="btn btn-primary btn-small">프로필 완성하기</button>
          </div>

          <div className="sidebar-card">
            <h3>빠른 메뉴</h3>
            <ul className="quick-menu">
              <li><a href="/profile">내 프로필</a></li>
              <li><a href="/resume">이력서 관리</a></li>
              <li><a href="/positions">포지션 검색</a></li>
              <li><a href="/community">커뮤니티</a></li>
              <li><a href="/settings">설정</a></li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>커뮤니티 인기글</h3>
            <ul className="popular-posts">
              <li><a href="/community">2026년 보험업계 채용 트렌드</a></li>
              <li><a href="/community">손해사정사 자격증 공부법</a></li>
              <li><a href="/community">외국계 보험사 면접 후기</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExperiencedUserDashboard;
