<template>
  <div class="audit-management">
    <!-- 상단 헤더 -->
    <div class="dash-header">
      <div class="dash-header-icon">📋</div>
      <div class="header-text">
        <h1 class="dash-title">이력 관리</h1>
        <p class="dash-subtitle">시스템 및 관리자 활동 로그 조회</p>
      </div>
      <div class="header-actions">
        <!-- 필터 (옵션 예시) -->
        <div class="filter-box">
          <select v-model="selectedActionType" class="filter-select">
            <option value="">모든 활동</option>
            <option value="LOGIN">로그인</option>
            <option value="CREATE">생성</option>
            <option value="UPDATE">수정</option>
            <option value="DELETE">삭제</option>
          </select>
        </div>
        <!-- 검색박스 -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="사용자명, 내용 검색..." v-model="searchQuery" />
        </div>
        <button class="primary-btn" @click="refreshLogs">
          <span class="btn-icon">🔄</span>
          새로고침
        </button>
      </div>
    </div>

    <!-- 메인 콘텐츠 (테이블 영역) -->
    <div class="dash-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>발생 일시</th>
              <th>활동 유형</th>
              <th>사용자 정보</th>
              <th>상세 내용</th>
              <th>접속 IP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in displayLogs" :key="log.id">
              <td>
                <span class="date-text">
                  <span class="date-part">{{ formatDate(log.createdAt) }}</span>
                  <span class="time-part">{{ formatTime(log.createdAt) }}</span>
                </span>
              </td>
              <td>
                <span class="action-badge" :class="getActionClass(log.actionType)">
                  {{ formatAction(log.actionType) }}
                </span>
              </td>
              <td>
                <div class="user-info-cell">
                  <span class="user-name">{{ log.username }}</span>
                  <span class="user-role">{{ log.role }}</span>
                </div>
              </td>
              <td>
                <div class="log-description">
                  <span class="desc-text">{{ log.description }}</span>
                  <code class="target-text" v-if="log.target">{{ log.target }}</code>
                </div>
              </td>
              <td>
                <span class="ip-text">{{ log.ipAddress }}</span>
              </td>
            </tr>

            <!-- 빈 상태 -->
            <tr v-if="displayLogs.length === 0">
              <td colspan="5" class="empty-state">
                <div class="empty-icon">📂</div>
                <p>일치하는 활동 로그가 없습니다.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// API 연동 전 Mockup 데이터
interface AuditLog {
  id: string
  createdAt: string
  actionType: 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT'
  username: string
  role: string
  description: string
  target?: string
  ipAddress: string
}

const searchQuery = ref('')
const selectedActionType = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)

const mockLogs: AuditLog[] = [
  { id: 'log1', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), actionType: 'LOGIN', username: '관리자(root)', role: 'System Admin', description: '시스템 로그인 완료', ipAddress: '192.168.1.1' },
  { id: 'log2', createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), actionType: 'UPDATE', username: '김마케팅', role: '인사담당자', description: '메뉴 노출 상태 변경', target: '/community', ipAddress: '112.145.2.33' },
  { id: 'log3', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), actionType: 'CREATE', username: '이영업', role: '인사담당자', description: '신규 채용공고 등록', target: '포지션 ID: POS-102', ipAddress: '121.10.45.12' },
  { id: 'log4', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), actionType: 'DELETE', username: '박관리', role: 'System Admin', description: '비정상 접속 유저 계정 비활성화 처리', target: '유저 ID: u4_bad_actor', ipAddress: '192.168.1.5' },
  { id: 'log5', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), actionType: 'EXPORT', username: '이영업', role: '인사담당자', description: '지원자 목록 엑셀 다운로드', target: '공고 ID: POS-099', ipAddress: '121.10.45.12' },
  { id: 'log6', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), actionType: 'LOGIN', username: '박관리', role: 'System Admin', description: '시스템 로그인 시도 실패 (비밀번호 오류)', ipAddress: '192.168.1.5' },
  { id: 'log7', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48 - 5000).toISOString(), actionType: 'LOGIN', username: '박관리', role: 'System Admin', description: '시스템 로그인 완료', ipAddress: '192.168.1.5' },
]

const filteredLogs = computed(() => {
  let result = [...mockLogs]

  // 액션 타입 필터링
  if (selectedActionType.value) {
    result = result.filter(log => log.actionType === selectedActionType.value)
  }

  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(log =>
      log.username.toLowerCase().includes(query) ||
      log.description.toLowerCase().includes(query) ||
      (log.target && log.target.toLowerCase().includes(query)) ||
      log.ipAddress.includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage) || 1)

const displayLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLogs.value.slice(start, end)
})

const refreshLogs = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    // 목업이라 별도 갱신 액션 생략, 다만 로딩 이펙트만 부여
    currentPage.value = 1
  }, 500)
}

const getActionClass = (type: string) => {
  switch (type) {
    case 'LOGIN': return 'badge-login'
    case 'CREATE': return 'badge-create'
    case 'UPDATE': return 'badge-update'
    case 'DELETE': return 'badge-delete'
    case 'EXPORT': return 'badge-export'
    default: return 'badge-default'
  }
}

const formatAction = (type: string) => {
  switch (type) {
    case 'LOGIN': return '인증'
    case 'CREATE': return '생성'
    case 'UPDATE': return '수정'
    case 'DELETE': return '삭제'
    case 'EXPORT': return '다운로드'
    default: return type
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style scoped>
/* 전체 레이아웃 (공통) */
.audit-management {
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
  background: linear-gradient(135deg, #4b5563, #6b7280);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(75, 85, 99, 0.3);
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
  border-color: #6b7280;
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
  border-color: #4b5563;
  box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.1);
}

/* 버튼 */
.primary-btn {
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.primary-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.primary-btn:active {
  background: #f3f4f6;
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
  font-size: 0.9rem;
}

.data-table tbody tr:hover td {
  background-color: #f8fafc;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* 날짜 텍스트 */
.date-text {
  display: flex;
  flex-direction: column;
}

.date-part {
  color: #374151;
  font-weight: 500;
}

.time-part {
  color: #9ca3af;
  font-size: 0.8rem;
  margin-top: 0.1rem;
}

/* 발생 유형 뱃지 */
.action-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.badge-login { background: #e0e7ff; color: #4338ca; }
.badge-create { background: #dcfce7; color: #15803d; }
.badge-update { background: #fef3c7; color: #b45309; }
.badge-delete { background: #fee2e2; color: #b91c1c; }
.badge-export { background: #f3e8ff; color: #7e22ce; }
.badge-default { background: #f3f4f6; color: #4b5563; }

/* 사용자 정보 */
.user-info-cell {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.user-role {
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.1rem;
}

/* 상세 내역 */
.log-description {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 400px;
}

.desc-text {
  color: #374151;
  font-weight: 500;
}

.target-text {
  background: #f1f5f9;
  color: #475569;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8rem;
  width: fit-content;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* IP 주소 */
.ip-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #6b7280;
  font-size: 0.85rem;
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

  .search-box input {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .primary-btn {
    justify-content: center;
  }
}
</style>
