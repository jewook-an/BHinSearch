<template>
  <div class="positions-management">
    <!-- 상단 헤더 -->
    <div class="dash-header">
      <div class="dash-header-icon">📌</div>
      <div class="header-text">
        <h1 class="dash-title">포지션 관리</h1>
        <p class="dash-subtitle">전체 채용 공고(포지션) 조회 및 상태 관리</p>
      </div>
      <div class="header-actions">
        <!-- 필터 박스 -->
        <div class="filter-box">
          <select v-model="selectedStatus" class="filter-select">
            <option value="">전체 상태</option>
            <option value="ACTIVE">모집중</option>
            <option value="CLOSED">마감됨</option>
            <option value="DRAFT">임시저장</option>
          </select>
        </div>
        <!-- 검색박스 -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="공고명, 회사명 검색..." v-model="searchQuery" />
        </div>
        <button class="primary-btn">
          <span class="btn-icon">＋</span>
          새 포지션
        </button>
      </div>
    </div>

    <!-- 메인 콘텐츠 (테이블 영역) -->
    <div class="dash-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>포지션 정보</th>
              <th>회사명</th>
              <th>마감일</th>
              <th>지원자 수</th>
              <th>상태</th>
              <th class="text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pos in displayPositions" :key="pos.id">
              <td>
                <div class="position-info-cell">
                  <div class="position-details">
                    <span class="position-title">{{ pos.title }}</span>
                    <span class="position-meta">{{ pos.location }} · {{ pos.experience }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="company-text">{{ pos.company }}</span>
              </td>
              <td>
                <span class="date-text" :class="{'text-red-500': isExpiringSoon(pos.deadline)}">
                  {{ pos.deadline || '상시채용' }}
                </span>
              </td>
              <td>
                <span class="applicant-count">
                  <strong>{{ pos.applicantCount }}</strong>명
                </span>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(pos.status)">
                  {{ formatStatus(pos.status) }}
                </span>
              </td>
              <td class="text-right actions-cell">
                <button class="action-btn view-btn" title="상세보기">👀</button>
                <button class="action-btn edit-btn" title="수정">✏️</button>
                <button class="action-btn delete-btn" title="삭제">🗑️</button>
              </td>
            </tr>

            <!-- 빈 상태 -->
            <tr v-if="displayPositions.length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-icon">📭</div>
                <p>일치하는 포지션이 없습니다.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button class="page-btn" disabled>이전</button>
        <span class="page-info">1 / 1</span>
        <button class="page-btn" disabled>다음</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Position {
  id: string
  title: string
  company: string
  location: string
  experience: string
  deadline: string
  applicantCount: number
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT'
}

const searchQuery = ref('')
const selectedStatus = ref('')

const mockPositions: Position[] = [
  { id: '1', title: '경력직 보험설계사 모집 (인센티브 업계 최고)', company: 'A생명', location: '서울 강남구', experience: '경력 (3년 이상)', deadline: '2026-12-31', applicantCount: 15, status: 'ACTIVE' },
  { id: '2', title: '언더라이터 신입/경력 채용', company: 'B화재', location: '서울 종로구', experience: '신입/경력', deadline: '2026-04-15', applicantCount: 42, status: 'ACTIVE' },
  { id: '3', title: '보험 계리사 채용', company: 'C금융', location: '서울 여의도', experience: '경력 (5년 이상)', deadline: '2026-03-01', applicantCount: 8, status: 'CLOSED' },
  { id: '4', title: '대면 영업 지점장 후보생 모집', company: 'D손해보험', location: '부산 해운대구', experience: '경력 (10년 이상)', deadline: '상시채용', applicantCount: 3, status: 'DRAFT' },
  { id: '5', title: '고객지원(CS)팀 매니저 모집', company: 'E보험대리점', location: '경기 성남시', experience: '신입', deadline: '2026-05-20', applicantCount: 120, status: 'ACTIVE' },
]

const displayPositions = computed(() => {
  let result = [...mockPositions]

  if (selectedStatus.value) {
    result = result.filter(p => p.status === selectedStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.company.toLowerCase().includes(query)
    )
  }

  return result
})

const getStatusClass = (status: string) => {
  if (status === 'ACTIVE') return 'status-active'
  if (status === 'CLOSED') return 'status-closed'
  if (status === 'DRAFT') return 'status-draft'
  return ''
}

const formatStatus = (status: string) => {
  if (status === 'ACTIVE') return '모집중'
  if (status === 'CLOSED') return '마감됨'
  if (status === 'DRAFT') return '임시저장'
  return status
}

const isExpiringSoon = (deadlineStr: string) => {
  if (!deadlineStr || deadlineStr === '상시채용') return false
  const deadline = new Date(deadlineStr)
  const now = new Date()
  const diffTime = deadline.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 && diffDays <= 7 // 7일 이내 마감
}
</script>

<style scoped>
/* 전체 레이아웃 */
.positions-management {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

/* 헤더 */
.dash-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.dash-header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.header-text {
  flex: 1;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 필터 셀렉트박스 */
.filter-box {
  position: relative;
}

.filter-select {
  padding: 0.6rem 2rem 0.6rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background: white;
  cursor: pointer;
  appearance: none;
  color: #374151;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  transition: border-color 0.2s;
}

.filter-select:focus {
  border-color: #f59e0b;
}

/* 검색박스 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 0.9rem;
  opacity: 0.5;
}

.search-box input {
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 260px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
}

.search-box input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

/* 주 버튼 */
.primary-btn {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
}

.primary-btn .btn-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

.primary-btn:hover {
  background: #d97706;
  transform: translateY(-1px);
}

.primary-btn:active {
  transform: translateY(0);
}

/* 메인 테이블 섹션 */
.dash-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background: #f9fafb;
  padding: 1.1rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 1.1rem 1.5rem;
  vertical-align: middle;
  border-bottom: 1px solid #f3f4f6;
}

.data-table tbody tr:hover td {
  background-color: #f8fafc;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* 포지션 정보 셀 */
.position-info-cell {
  display: flex;
  align-items: center;
}

.position-details {
  display: flex;
  flex-direction: column;
}

.position-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
  /* 말줄임 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 350px;
}

.position-meta {
  color: #6b7280;
  font-size: 0.8rem;
}

/* 회사 텍스트 */
.company-text {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

/* 지원자 수 */
.applicant-count {
  font-size: 0.9rem;
  color: #4b5563;
}
.applicant-count strong {
  color: #1e40af;
  font-size: 1.05rem;
}

/* 날짜 텍스트 */
.date-text {
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
}
.text-red-500 {
  color: #ef4444;
}

/* 뱃지 */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active { background: #dcfce7; color: #15803d; }
.status-closed { background: #fee2e2; color: #b91c1c; }
.status-draft { background: #f3f4f6; color: #6b7280; }

/* 액션 버튼 */
.text-right {
  text-align: right;
}

.actions-cell {
  white-space: nowrap;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: all 0.2s;
  margin-left: 0.2rem;
}

.action-btn:hover {
  background: #f3f4f6;
  transform: scale(1.05);
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem !important;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  border-top: 1px solid #f3f4f6;
  gap: 1rem;
}

.page-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:not(:disabled):hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #4b5563;
  font-weight: 500;
}

/* 반응형 */
@media (max-width: 768px) {
  .dash-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .search-box input, .filter-select {
    width: 100%;
  }
}
</style>
