<template>
  <div class="dashboard">

    <!-- 상단 헤더 -->
    <div class="dash-header">
      <div class="dash-header-icon">⚙️</div>
      <div>
        <h1 class="dash-title">대시보드</h1>
        <p class="dash-subtitle">보험인Search 시스템 통계 및 주요 정보</p>
      </div>
    </div>

    <!-- 통계 카드 4개 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-number">1,234</div>
          <div class="stat-label">활성 사용자</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <div class="stat-number">56</div>
          <div class="stat-label">공고 수</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <div class="stat-number">892</div>
          <div class="stat-label">총 지원자</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💬</div>
        <div class="stat-info">
          <div class="stat-number">342</div>
          <div class="stat-label">커뮤니티 게시글</div>
        </div>
      </div>
    </div>

    <!-- 메인 + 사이드바 2컬럼 -->
    <div class="dash-content">

      <!-- 메인 콘텐츠 -->
      <div class="main-content">

        <!-- 최근 활동 -->
        <section class="dash-section">
          <div class="section-header">
            <h2>최근 활동</h2>
            <span class="section-badge">오늘</span>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-badge badge-blue">신규</span>
              <div class="activity-info">
                <span class="activity-text">새로운 사용자 가입</span>
                <span class="activity-time">2시간 전</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-badge badge-green">수정</span>
              <div class="activity-info">
                <span class="activity-text">메뉴 설정 변경</span>
                <span class="activity-time">5시간 전</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-badge badge-orange">삭제</span>
              <div class="activity-info">
                <span class="activity-text">비활성 공고 제거</span>
                <span class="activity-time">1일 전</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-badge badge-blue">신규</span>
              <div class="activity-info">
                <span class="activity-text">커뮤니티 게시글 등록</span>
                <span class="activity-time">1일 전</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-badge badge-green">수정</span>
              <div class="activity-info">
                <span class="activity-text">포지션 정보 업데이트</span>
                <span class="activity-time">2일 전</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 최근 가입 사용자 -->
        <section class="dash-section">
          <div class="section-header">
            <h2>최근 가입 사용자</h2>
            <RouterLink to="/users" class="section-link">전체보기 →</RouterLink>
          </div>
          <div class="user-list">
            <div class="user-item" v-for="user in recentUsers" :key="user.id">
              <div class="user-avatar">{{ user.name[0] }}</div>
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-meta">{{ user.role }} · {{ user.joinDate }}</span>
              </div>
              <span :class="['user-status', user.active ? 'status-active' : 'status-inactive']">
                {{ user.active ? '활성' : '비활성' }}
              </span>
            </div>
          </div>
        </section>

      </div>

      <!-- 사이드바 -->
      <aside class="dash-sidebar">

        <!-- 이번 달 현황 -->
        <div class="sidebar-card">
          <h3>이번 달 현황</h3>
          <div class="monthly-stats">
            <div class="monthly-item">
              <span class="monthly-label">신규 가입</span>
              <span class="monthly-value">89명</span>
            </div>
            <div class="monthly-item">
              <span class="monthly-label">신규 공고</span>
              <span class="monthly-value">12건</span>
            </div>
            <div class="monthly-item">
              <span class="monthly-label">신규 지원</span>
              <span class="monthly-value">234건</span>
            </div>
            <div class="monthly-item">
              <span class="monthly-label">신규 게시글</span>
              <span class="monthly-value">67건</span>
            </div>
          </div>
        </div>

        <!-- 빠른 메뉴 -->
        <div class="sidebar-card">
          <h3>빠른 메뉴</h3>
          <ul class="quick-menu">
            <li><RouterLink to="/users">👥 사용자 관리</RouterLink></li>
            <li><RouterLink to="/positions">📌 포지션 관리</RouterLink></li>
            <li><RouterLink to="/applications">📝 지원 관리</RouterLink></li>
            <li><RouterLink to="/menus">📂 메뉴 관리</RouterLink></li>
            <li><RouterLink to="/community">💬 커뮤니티</RouterLink></li>
            <li><RouterLink to="/audit">📋 이력 관리</RouterLink></li>
          </ul>
        </div>

        <!-- 시스템 상태 -->
        <div class="sidebar-card">
          <h3>시스템 상태</h3>
          <div class="system-status">
            <div class="status-item">
              <span class="status-dot dot-green"></span>
              <span class="status-label">API 서버</span>
              <span class="status-val">정상</span>
            </div>
            <div class="status-item">
              <span class="status-dot dot-green"></span>
              <span class="status-label">데이터베이스</span>
              <span class="status-val">정상</span>
            </div>
            <div class="status-item">
              <span class="status-dot dot-yellow"></span>
              <span class="status-label">이메일 서비스</span>
              <span class="status-val">점검중</span>
            </div>
          </div>
        </div>

      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const recentUsers = [
  { id: 1, name: '김보험', role: '구직자', joinDate: '2시간 전', active: true },
  { id: 2, name: '이채용', role: '인사담당자', joinDate: '5시간 전', active: true },
  { id: 3, name: '박계리', role: '구직자', joinDate: '1일 전', active: true },
  { id: 4, name: '최언더', role: '구직자', joinDate: '2일 전', active: false },
  { id: 5, name: '정설계', role: '인사담당자', joinDate: '3일 전', active: true },
]
</script>

<style scoped>
/* 전체 레이아웃 */
.dashboard {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

/* 헤더 */
.dash-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.dash-header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

.dash-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
}

.dash-subtitle {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

/* 통계 카드 그리드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2.25rem;
  line-height: 1;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e40af;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.82rem;
  color: #6b7280;
  margin-top: 0.2rem;
}

/* 2컬럼 레이아웃 */
.dash-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 섹션 카드 */
.dash-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.section-badge {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.section-link {
  font-size: 0.82rem;
  color: #1e40af;
  text-decoration: none;
  font-weight: 500;
}

.section-link:hover {
  text-decoration: underline;
}

/* 활동 리스트 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  white-space: nowrap;
  min-width: 44px;
  text-align: center;
}

.badge-blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge-green {
  background: #dcfce7;
  color: #15803d;
}

.badge-orange {
  background: #ffedd5;
  color: #c2410c;
}

.activity-info {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.activity-text {
  color: #111827;
  font-size: 0.9rem;
}

.activity-time {
  color: #9ca3af;
  font-size: 0.8rem;
}

/* 사용자 리스트 */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.user-item:last-child {
  border-bottom: none;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.user-meta {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-top: 0.15rem;
}

.user-status {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.status-active {
  background: #dcfce7;
  color: #15803d;
}

.status-inactive {
  background: #f3f4f6;
  color: #9ca3af;
}

/* 사이드바 */
.dash-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04);
}

.sidebar-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

/* 이번달 현황 */
.monthly-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.monthly-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.monthly-label {
  font-size: 0.85rem;
  color: #6b7280;
}

.monthly-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e40af;
}

/* 빠른 메뉴 */
.quick-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.quick-menu li a {
  display: block;
  padding: 0.6rem 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.15s;
}

.quick-menu li a:hover {
  background: #eff6ff;
  color: #1e40af;
  padding-left: 0.875rem;
}

/* 시스템 상태 */
.system-status {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-green { background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
.dot-yellow { background: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.2); }
.dot-red { background: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.2); }

.status-label {
  font-size: 0.85rem;
  color: #6b7280;
  flex: 1;
}

.status-val {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

/* 반응형 */
@media (max-width: 1280px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .dash-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard {
    padding: 1rem;
  }
}
</style>
