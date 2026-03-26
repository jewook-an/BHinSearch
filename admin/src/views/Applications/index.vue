<template>
  <div class="applications-management">
    <!-- 상단 헤더 -->
    <div class="dash-header">
      <div class="dash-header-icon">📝</div>
      <div class="header-text">
        <h1 class="dash-title">지원 관리</h1>
        <p class="dash-subtitle">구직자의 포지션 지원 내역 및 합격 여부 처리</p>
      </div>
      <div class="header-actions">
        <!-- 필터 박스 -->
        <div class="filter-box">
          <select v-model="selectedStatus" class="filter-select">
            <option value="">전체 상태</option>
            <option value="PENDING">검토중</option>
            <option value="REVIEWING">면접진행</option>
            <option value="ACCEPTED">최종합격</option>
            <option value="REJECTED">불합격</option>
          </select>
        </div>
        <!-- 검색박스 -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="지원자명, 공고명 검색..." v-model="searchQuery" />
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 (테이블 영역) -->
    <div class="dash-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>지원자 정보</th>
              <th>지원 포지션</th>
              <th>지원일시</th>
              <th>진행 상태</th>
              <th class="text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in displayApplications" :key="app.id">
              <td>
                <div class="applicant-cell">
                  <div class="applicant-avatar">{{ app.applicantName[0] }}</div>
                  <div class="applicant-details">
                    <span class="applicant-name">{{ app.applicantName }}</span>
                    <span class="applicant-meta">{{ app.applicantPhone }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="position-info">
                  <span class="position-title">{{ app.positionTitle }}</span>
                  <span class="company-name">{{ app.companyName }}</span>
                </div>
              </td>
              <td>
                <span class="date-text">{{ formatDate(app.appliedAt) }}</span>
              </td>
              <td>
                <select
                  class="status-select"
                  v-model="app.status"
                  :class="getStatusSelectClass(app.status)"
                >
                  <option value="PENDING">검토중</option>
                  <option value="REVIEWING">면접진행</option>
                  <option value="ACCEPTED">합격</option>
                  <option value="REJECTED">불합격</option>
                </select>
              </td>
              <td class="text-right actions-cell">
                <button class="action-btn file-btn" title="이력서 보기">📄</button>
                <button class="action-btn chat-btn" title="메시지 전송">💬</button>
              </td>
            </tr>

            <!-- 빈 상태 -->
            <tr v-if="displayApplications.length === 0">
              <td colspan="5" class="empty-state">
                <div class="empty-icon">📂</div>
                <p>표시할 지원 내역이 없습니다.</p>
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

interface Application {
  id: string
  applicantName: string
  applicantPhone: string
  positionTitle: string
  companyName: string
  appliedAt: string
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'
}

const searchQuery = ref('')
const selectedStatus = ref('')

const mockApps: Application[] = [
  { id: 'app1', applicantName: '김보험', applicantPhone: '010-1234-5678', positionTitle: '경력직 보험설계사 모집 (인센티브 업계 최고)', companyName: 'A생명', appliedAt: '2026-03-07T09:30:00Z', status: 'PENDING' },
  { id: 'app2', applicantName: '이채용', applicantPhone: '010-9876-5432', positionTitle: '언더라이터 신입/경력 채용', companyName: 'B화재', appliedAt: '2026-03-06T14:15:00Z', status: 'REVIEWING' },
  { id: 'app3', applicantName: '박계리', applicantPhone: '010-5555-5555', positionTitle: '보험 계리사 채용', companyName: 'C금융', appliedAt: '2026-02-28T10:00:00Z', status: 'ACCEPTED' },
  { id: 'app4', applicantName: '최지원', applicantPhone: '010-1111-2222', positionTitle: '언더라이터 신입/경력 채용', companyName: 'B화재', appliedAt: '2026-02-25T16:20:00Z', status: 'REJECTED' },
]

// reactive로 전환 (V-model 양방향 바인딩을 위함)
const reactiveApps = ref(mockApps)

const displayApplications = computed(() => {
  let result = [...reactiveApps.value]

  if (selectedStatus.value) {
    result = result.filter(a => a.status === selectedStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.applicantName.toLowerCase().includes(query) ||
      a.positionTitle.toLowerCase().includes(query) ||
      a.companyName.toLowerCase().includes(query)
    )
  }

  return result
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const getStatusSelectClass = (status: string) => {
  if (status === 'PENDING') return 'select-pending'
  if (status === 'REVIEWING') return 'select-reviewing'
  if (status === 'ACCEPTED') return 'select-accepted'
  if (status === 'REJECTED') return 'select-rejected'
  return ''
}

</script>

<style scoped>
/* 전체 레이아웃 */
.applications-management {
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
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
  color: white;
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
  border-color: #14b8a6;
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
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
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

/* 지원자 셀 */
.applicant-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.applicant-avatar {
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
}

.applicant-details {
  display: flex;
  flex-direction: column;
}

.applicant-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
}

.applicant-meta {
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.1rem;
}

/* 공고 정보 셀 */
.position-info {
  display: flex;
  flex-direction: column;
}

.position-title {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 300px;
}

.company-name {
  color: #6366f1;
  font-size: 0.8rem;
  font-weight: 600;
}

/* 텍스트/뱃지 */
.date-text {
  color: #4b5563;
  font-size: 0.85rem;
}

/* 상태 변경 Select */
.status-select {
  padding: 0.35rem 1.5rem 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid transparent;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.4rem center;
  background-size: 0.8rem;
}

.select-pending { background-color: #f3f4f6; color: #4b5563; border-color: #e5e7eb; }
.select-reviewing { background-color: #e0e7ff; color: #4338ca; border-color: #c7d2fe; }
.select-accepted { background-color: #dcfce7; color: #15803d; border-color: #bbf7d0; }
.select-rejected { background-color: #fee2e2; color: #b91c1c; border-color: #fecaca; }

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
