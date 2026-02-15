import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats] = useState({
    totalUsers: 10523,
    activePositions: 1245,
    totalCompanies: 342,
    pendingApprovals: 23
  });

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>관리자 대시보드</h1>
        <p>시스템 전체 현황을 관리합니다</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalUsers.toLocaleString()}</div>
            <div className="stat-label">전체 사용자</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <div className="stat-number">{stats.activePositions.toLocaleString()}</div>
            <div className="stat-label">활성 포지션</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <div className="stat-number">{stats.totalCompanies.toLocaleString()}</div>
            <div className="stat-label">등록 기업</div>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-number">{stats.pendingApprovals}</div>
            <div className="stat-label">승인 대기</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <section className="dashboard-section">
            <div className="section-header">
              <h2>승인 대기 목록</h2>
              <span className="badge">{stats.pendingApprovals}건</span>
            </div>
            <div className="pending-list">
              <div className="pending-item">
                <div className="pending-info">
                  <div className="pending-type">포지션</div>
                  <h3>보험계리사 - 삼성생명</h3>
                  <p>등록자: hr@samsung.com | 등록일: 2026-02-13</p>
                </div>
                <div className="pending-actions">
                  <button className="btn btn-success btn-small">승인</button>
                  <button className="btn btn-danger btn-small">거절</button>
                </div>
              </div>

              <div className="pending-item">
                <div className="pending-info">
                  <div className="pending-type">기업</div>
                  <h3>한화생명 인사팀</h3>
                  <p>담당자: 김인사 | 등록일: 2026-02-12</p>
                </div>
                <div className="pending-actions">
                  <button className="btn btn-success btn-small">승인</button>
                  <button className="btn btn-danger btn-small">거절</button>
                </div>
              </div>

              <div className="pending-item">
                <div className="pending-info">
                  <div className="pending-type">피드백</div>
                  <h3>시스템 개선 요청</h3>
                  <p>사용자: user@example.com | 등록일: 2026-02-11</p>
                </div>
                <div className="pending-actions">
                  <button className="btn btn-primary btn-small">확인</button>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>사용자 활동 통계</h2>
            <div className="chart-placeholder">
              <p>📊 사용자 활동 차트 (실제 차트 라이브러리 연동 필요)</p>
              <div className="chart-mockup">
                <div className="bar" style={{height: '60%'}}><span>월</span></div>
                <div className="bar" style={{height: '75%'}}><span>화</span></div>
                <div className="bar" style={{height: '85%'}}><span>수</span></div>
                <div className="bar" style={{height: '70%'}}><span>목</span></div>
                <div className="bar" style={{height: '90%'}}><span>금</span></div>
                <div className="bar" style={{height: '40%'}}><span>토</span></div>
                <div className="bar" style={{height: '35%'}}><span>일</span></div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>최근 신고 및 이슈</h2>
            <div className="issue-list">
              <div className="issue-item">
                <span className="issue-badge high">높음</span>
                <div className="issue-content">
                  <h4>부적절한 게시글 신고</h4>
                  <p>커뮤니티 &gt; 자유게시판 | 신고자: 3명</p>
                </div>
                <button className="btn btn-outline btn-small">처리</button>
              </div>

              <div className="issue-item">
                <span className="issue-badge medium">중간</span>
                <div className="issue-content">
                  <h4>스팸 계정 의심</h4>
                  <p>사용자 ID: spam_user_123</p>
                </div>
                <button className="btn btn-outline btn-small">처리</button>
              </div>
            </div>
          </section>
        </div>

        <aside className="sidebar">
          <div className="sidebar-card">
            <h3>빠른 관리 메뉴</h3>
            <ul className="admin-menu">
              <li><a href="/admin/users">👥 사용자 관리</a></li>
              <li><a href="/admin/positions">💼 포지션 관리</a></li>
              <li><a href="/admin/companies">🏢 기업 관리</a></li>
              <li><a href="/admin/reports">📊 리포트</a></li>
              <li><a href="/admin/community">💬 커뮤니티 관리</a></li>
              <li><a href="/admin/settings">⚙️ 시스템 설정</a></li>
              <li><a href="/admin/security">🔒 보안 관리</a></li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>시스템 상태</h3>
            <div className="system-status">
              <div className="status-item">
                <span className="status-label">서버 상태</span>
                <span className="status-value status-ok">정상</span>
              </div>
              <div className="status-item">
                <span className="status-label">데이터베이스</span>
                <span className="status-value status-ok">정상</span>
              </div>
              <div className="status-item">
                <span className="status-label">스토리지 사용률</span>
                <span className="status-value">67%</span>
              </div>
              <div className="status-item">
                <span className="status-label">최근 백업</span>
                <span className="status-value">2시간 전</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>최근 활동 로그</h3>
            <ul className="activity-log">
              <li>
                <span className="log-time">10:30</span>
                <span>새 기업 등록</span>
              </li>
              <li>
                <span className="log-time">09:15</span>
                <span>포지션 승인 처리</span>
              </li>
              <li>
                <span className="log-time">08:45</span>
                <span>사용자 계정 정지</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
