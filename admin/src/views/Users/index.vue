<template>
  <div class="user-management">
    <!-- 상단 헤더 -->
    <div class="dash-header">
      <div class="dash-header-icon">👥</div>
      <div class="header-text">
        <h1 class="dash-title">사용자 관리</h1>
        <p class="dash-subtitle">전체 사용자 목록 조회 및 접근 권한 설정</p>
      </div>
      <div class="header-actions">
        <!-- 검색박스 -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="사용자명, 이메일 검색..." v-model="searchQuery" />
        </div>
        <button class="primary-btn" @click="showCreateModal = true">
          <span class="btn-icon">＋</span>
          새 사용자
        </button>
      </div>
    </div>

    <!-- 메인 콘텐츠 (테이블 영역) -->
    <div class="dash-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>사용자 정보</th>
              <th>연락처</th>
              <th>역할</th>
              <th>가입일</th>
              <th>상태</th>
              <th class="text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in displayUsers" :key="user.id">
              <td>
                <div class="user-info-cell">
                  <div class="user-avatar">{{ user.username ? user.username[0].toUpperCase() : '?' }}</div>
                  <div class="user-details">
                    <span class="user-name">{{ user.username }}</span>
                    <span class="user-email">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="text-gray">{{ user.phone || '-' }}</span>
              </td>
              <td>
                <span class="role-badge" :class="getRoleClass(user.role)">
                  {{ formatRole(user.role) }}
                </span>
              </td>
              <td>
                <span class="date-text">{{ formatDate(user.createdAt) }}</span>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(user.status)">
                  {{ formatStatus(user.status) }}
                </span>
              </td>
              <td class="text-right actions-cell">
                <button class="action-btn edit-btn" title="수정" @click="editUser(user)">✏️</button>
                <button class="action-btn delete-btn" title="삭제" @click="deleteUser(user.id)">🗑️</button>
              </td>
            </tr>

            <!-- 빈 상태 -->
            <tr v-if="displayUsers.length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-icon">📂</div>
                <p v-if="loading">데이터를 불러오는 중입니다...</p>
                <p v-else>표시할 사용자가 없습니다.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 (예시) -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import type { User } from '@/types'

const userStore = useUserStore()
const { users, total, currentPage, pageSize, loading } = storeToRefs(userStore)

const searchQuery = ref('')
const showCreateModal = ref(false)

const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value) || 1
})

// 가상 디스플레이를 위해, API 데이터가 없으면 임시 Mock 데이터 활용
const mockUsers: User[] = [
  { id: 'u1', email: 'user1@example.com', username: '김보험', phone: '010-1234-5678', status: 'ACTIVE', role: 'USER', createdAt: '2023-01-01T10:00:00Z' },
  { id: 'u2', email: 'hr@example.com', username: '이채용', phone: '010-2345-6789', status: 'ACTIVE', role: 'RECRUITER', createdAt: '2023-05-12T14:30:00Z' },
  { id: 'u3', email: 'user2@example.com', username: '박계리', phone: '010-3456-7890', status: 'ACTIVE', role: 'USER', createdAt: '2023-08-20T09:15:00Z' },
  { id: 'u4', email: 'inactive@example.com', username: '최언더', phone: '', status: 'INACTIVE', role: 'USER', createdAt: '2023-11-05T16:45:00Z' },
]

const displayUsers = computed(() => {
  // 실제 API 데이터가 있으면 해당 데이터를 사용, 없으면 목업 데이터 표시
  let sourceUsers = users.value.length > 0 ? users.value : mockUsers

  if (!searchQuery.value) return sourceUsers

  const query = searchQuery.value.toLowerCase()
  return sourceUsers.filter(u =>
    (u.username && u.username.toLowerCase().includes(query)) ||
    (u.email && u.email.toLowerCase().includes(query))
  )
})

const getRoleClass = (role: string) => {
  // 'ADMIN' role might be added in the future
  if (role === 'ADMIN' as any) return 'role-admin'
  if (role === 'RECRUITER') return 'role-manager'
  return 'role-user'
}

const formatRole = (role: string) => {
  if (role === 'ADMIN' as any) return '관리자'
  if (role === 'RECRUITER') return '인사담당자'
  return '구직자(일반)'
}

const getStatusClass = (status: string) => {
  if (status === 'ACTIVE') return 'status-active'
  if (status === 'INACTIVE') return 'status-inactive'
  if (status === 'BANNED') return 'status-banned'
  return ''
}

const formatStatus = (status: string) => {
  if (status === 'ACTIVE') return '활성'
  if (status === 'INACTIVE') return '비활성'
  if (status === 'BANNED') return '차단됨'
  return status
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    userStore.fetchUsers(page, pageSize.value)
  }
}

const editUser = (user: User) => {
  alert(`${user.username} 사용자 정보 수정 연동 필요`)
}

const deleteUser = async (userId: string) => {
  if (confirm('정말 이 사용자를 삭제하시겠습니까?')) {
    await userStore.deleteUser(userId)
  }
}

onMounted(() => {
  userStore.fetchUsers(1, 10).catch(() => {
    // API 연결 안된 경우 에러 무시
  })
})
</script>

<style scoped>
/* 전체 레이아웃 */
.user-management {
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
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 버튼 */
.primary-btn {
  background: #1e40af;
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
  box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
}

.primary-btn .btn-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

.primary-btn:hover {
  background: #1e3a8a;
  transform: translateY(-1px);
}

.primary-btn:active {
  transform: translateY(0);
}

/* 메인 섹션 */
.dash-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04);
  overflow: hidden;
}

/* 테이블 */
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
  transition: background-color 0.15s;
}

.data-table tbody tr:hover td {
  background-color: #f8fafc;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* 유저 셀 */
.user-info-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(30, 64, 175, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
}

.user-email {
  color: #6b7280;
  font-size: 0.85rem;
  margin-top: 0.1rem;
}

.text-gray {
  color: #6b7280;
  font-size: 0.9rem;
}

/* 뱃지 */
.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-admin {
  background: #fee2e2;
  color: #b91c1c;
}

.role-manager {
  background: #fef3c7;
  color: #b45309;
}

.role-user {
  background: #e0e7ff;
  color: #4338ca;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active {
  background: #dcfce7;
  color: #15803d;
}

.status-inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.status-banned {
  background: #fef2f2;
  color: #ef4444;
}

.date-text {
  color: #4b5563;
  font-size: 0.9rem;
}

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
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: all 0.2s;
  margin-left: 0.25rem;
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

  .search-box input {
    width: 100%;
  }
}
</style>
