import React, { useState } from 'react';
import './RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const [stats] = useState({
    activePositions: 8,
    totalApplicants: 156,
    pendingReview: 34,
    scheduledInterviews: 12
  });

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <h1>인사담당자 대시보드</h1>
        <p>채용 프로세스를 효율적으로 관리하세요</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-number">{stats.activePositions}</div>
            <div className="stat-label">활성 포지션</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalApplicants}</div>
            <div className="stat-label">총 지원자</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-number">{stats.pendingReview}</div>
            <div className="stat-label">검토 대기</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🗓️</div>
          <div className="stat-info">
            <div className="stat-number">{stats.scheduledInterviews}</div>
            <div className="stat-label">면접 예정</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <section className="dashboard-section">
            <div className="section-header">
              <h2>활성 포지션</h2>
              <button className="btn btn-primary">+ 새 포지션 등록</button>
            </div>

            <div className="position-list">
              <div className="position-card">
                <div className="position-info">
                  <h3>보험계리사</h3>
                  <div className="position-meta">
                    <span>경력 3~5년</span>
                    <span>서울 강남구</span>
                    <span>등록일: 2026-02-10</span>
                  </div>
                  <div className="position-stats">
                    <span className="applicant-count">지원자: 45명</span>
                    <span className="view-count">조회: 234회</span>
                  </div>
                </div>
                <div className="position-actions">
                  <button className="btn btn-outline btn-small">수정</button>
                  <button className="btn btn-primary btn-small">지원자 보기</button>
                </div>
              </div>

              <div className="position-card">
                <div className="position-info">
                  <h3>언더라이터</h3>
                  <div className="position-meta">
                    <span>경력 5~10년</span>
                    <span>서울 여의도</span>
                    <span>등록일: 2026-02-08</span>
                  </div>
                  <div className="position-stats">
                    <span className="applicant-count">지원자: 32명</span>
                    <span className="view-count">조회: 189회</span>
                  </div>
                </div>
                <div className="position-actions">
                  <button className="btn btn-outline btn-small">수정</button>
                  <button className="btn btn-primary btn-small">지원자 보기</button>
                </div>
              </div>

              <div className="position-card">
                <div className="position-info">
                  <h3>손해사정사</h3>
                  <div className="position-meta">
                    <span>경력 1~3년</span>
                    <span>서울 종로구</span>
                    <span>등록일: 2026-02-05</span>
                  </div>
                  <div className="position-stats">
                    <span className="applicant-count">지원자: 28명</span>
                    <span className="view-count">조회: 156회</span>
                  </div>
                </div>
                <div className="position-actions">
                  <button className="btn btn-outline btn-small">수정</button>
                  <button className="btn btn-primary btn-small">지원자 보기</button>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>최근 지원자</h2>
            <div className="applicant-list">
              <div className="applicant-item">
                <div className="applicant-avatar">👤</div>
                <div className="applicant-info">
                  <h4>김지원</h4>
                  <p>보험계리사 지원 | 경력 4년</p>
                  <span className="apply-time">2시간 전 지원</span>
                </div>
                <div className="applicant-actions">
                  <button className="btn btn-outline btn-small">프로필 보기</button>
                  <button className="btn btn-success btn-small">면접 제안</button>
                </div>
              </div>

              <div className="applicant-item">
                <div className="applicant-avatar">👤</div>
                <div className="applicant-info">
                  <h4>이경력</h4>
                  <p>언더라이터 지원 | 경력 6년</p>
                  <span className="apply-time">5시간 전 지원</span>
                </div>
                <div className="applicant-actions">
                  <button className="btn btn-outline btn-small">프로필 보기</button>
                  <button className="btn btn-success btn-small">면접 제안</button>
                </div>
              </div>

              <div className="applicant-item">
                <div className="applicant-avatar">👤</div>
                <div className="applicant-info">
                  <h4>박전문</h4>
                  <p>손해사정사 지원 | 경력 2년</p>
                  <span className="apply-time">1일 전 지원</span>
                </div>
                <div className="applicant-actions">
                  <button className="btn btn-outline btn-small">프로필 보기</button>
                  <button className="btn btn-success btn-small">면접 제안</button>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>예정된 면접</h2>
            <div className="interview-list">
              <div className="interview-item">
                <div className="interview-date">
                  <div className="date-box">
                    <span className="date-day">15</span>
                    <span className="date-month">2월</span>
                  </div>
                </div>
                <div className="interview-info">
                  <h4>김지원 - 보험계리사</h4>
                  <p>2026년 2월 15일 오후 2:00</p>
                  <span>장소: 본사 3층 회의실</span>
                </div>
                <button className="btn btn-outline btn-small">일정 변경</button>
              </div>

              <div className="interview-item">
                <div className="interview-date">
                  <div className="date-box">
                    <span className="date-day">16</span>
                    <span className="date-month">2월</span>
                  </div>
                </div>
                <div className="interview-info">
                  <h4>이경력 - 언더라이터</h4>
                  <p>2026년 2월 16일 오전 10:00</p>
                  <span>장소: 화상 면접 (Zoom)</span>
                </div>
                <button className="btn btn-outline btn-small">일정 변경</button>
              </div>
            </div>
          </section>
        </div>

        <aside className="sidebar">
          <div className="sidebar-card">
            <h3>빠른 메뉴</h3>
            <ul className="quick-menu">
              <li><a href="/recruiter/positions">포지션 관리</a></li>
              <li><a href="/recruiter/applicants">지원자 관리</a></li>
              <li><a href="/recruiter/interviews">면접 일정</a></li>
              <li><a href="/recruiter/reports">채용 통계</a></li>
              <li><a href="/recruiter/settings">설정</a></li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>이번 달 채용 현황</h3>
            <div className="monthly-stats">
              <div className="monthly-stat-item">
                <span className="monthly-stat-label">신규 지원</span>
                <span className="monthly-stat-value">89건</span>
              </div>
              <div className="monthly-stat-item">
                <span className="monthly-stat-label">면접 진행</span>
                <span className="monthly-stat-value">34건</span>
              </div>
              <div className="monthly-stat-item">
                <span className="monthly-stat-label">최종 합격</span>
                <span className="monthly-stat-value">5명</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>채용 팁</h3>
            <ul className="tips-list">
              <li>📌 명확한 직무 요건 작성이 중요합니다</li>
              <li>📌 지원자에게 빠른 피드백을 제공하세요</li>
              <li>📌 면접 질문을 사전에 준비하세요</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
