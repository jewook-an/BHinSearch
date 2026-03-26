<template>
  <div class="menu-management">
    <!-- 상단 헤더 -->
    <div class="dash-header">
      <div class="dash-header-icon">📂</div>
      <div class="header-text">
        <h1 class="dash-title">메뉴 관리</h1>
        <p class="dash-subtitle">프론트 사이트 네비게이션 및 메뉴 디스플레이 설정</p>
      </div>
      <div class="header-actions">
        <!-- 검색박스 -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="메뉴명, 경로 부분 검색..." v-model="searchQuery" />
        </div>
        <button class="primary-btn" @click="showCreateModal = true">
          <span class="btn-icon">＋</span>
          새 메뉴 추가
        </button>
      </div>
    </div>

    <!-- 메인 콘텐츠 (테이블 영역) -->
    <div class="dash-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="w-16">순서</th>
              <th>메뉴 정보</th>
              <th>경로 (URL)</th>
              <th>활성 상태</th>
              <th>생성일</th>
              <th class="text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="menu in displayMenus" :key="menu.id">
              <td>
                <div class="order-badge">{{ menu.order }}</div>
              </td>
              <td>
                <div class="menu-info-cell">
                  <!-- 아이콘이 없을 경우 기본 텍스트 이모지 사용 -->
                  <div class="menu-icon">{{ menu.icon || '🔗' }}</div>
                  <div class="menu-details">
                    <span class="menu-name">{{ menu.name }}</span>
                  </div>
                </div>
              </td>
              <td>
                <code class="path-text">{{ menu.path }}</code>
              </td>
              <td>
                <button
                  class="toggle-btn"
                  :class="menu.visible ? 'on' : 'off'"
                  @click="toggleVisible(menu)"
                  :title="menu.visible ? '상태: 노출 중 (클릭하여 숨김)' : '상태: 숨김 (클릭하여 노출)'"
                >
                  <div class="toggle-knob"></div>
                  <span class="toggle-label">{{ menu.visible ? '노출' : '숨김' }}</span>
                </button>
              </td>
              <td>
                <span class="date-text">{{ formatDate(menu.createdAt) }}</span>
              </td>
              <td class="text-right actions-cell">
                <button class="action-btn edit-btn" title="수정" @click="editMenu(menu)">✏️</button>
                <button class="action-btn delete-btn" title="삭제" @click="deleteMenu(menu.id)">🗑️</button>
              </td>
            </tr>

            <!-- 빈 상태 -->
            <tr v-if="displayMenus.length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-icon">📭</div>
                <p v-if="loading">데이터를 불러오는 중입니다...</p>
                <p v-else>검색된 메뉴가 없거나 등록된 메뉴가 없습니다.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMenuStore } from '@/stores/menuStore'
import { storeToRefs } from 'pinia'
import type { Menu } from '@/types'

const menuStore = useMenuStore()
const { menus, loading } = storeToRefs(menuStore)

const searchQuery = ref('')
const showCreateModal = ref(false)

// 가상 디스플레이를 위해, API 데이터가 없으면 임시 Mock 데이터 활용
const mockMenus: Menu[] = [
  { id: 'm1', name: '홈 (Dashboard)', path: '/', icon: '🏠', order: 1, visible: true, createdAt: '2023-01-01T10:00:00Z' },
  { id: 'm2', name: '채용공고', path: '/jobs', icon: '📋', order: 2, visible: true, createdAt: '2023-01-02T11:30:00Z' },
  { id: 'm3', name: '인재검색', path: '/talents', icon: '🔎', order: 3, visible: true, createdAt: '2023-01-03T09:15:00Z' },
  { id: 'm4', name: '커뮤니티', path: '/community', icon: '💬', order: 4, visible: false, createdAt: '2023-02-15T16:45:00Z' },
  { id: 'm5', name: '고객센터', path: '/support', icon: '🎧', order: 5, visible: true, createdAt: '2023-03-10T14:20:00Z' },
]

const displayMenus = computed(() => {
  // 실제 API 데이터가 있으면 해당 데이터를 사용, 없으면 목업 데이터 표시
  let sourceMenus = menus.value && menus.value.length > 0 ? menus.value : mockMenus

  // order 순서대로 정렬
  sourceMenus = [...sourceMenus].sort((a, b) => a.order - b.order)

  if (!searchQuery.value) return sourceMenus

  const query = searchQuery.value.toLowerCase()
  return sourceMenus.filter(m =>
    (m.name && m.name.toLowerCase().includes(query)) ||
    (m.path && m.path.toLowerCase().includes(query))
  )
})

const toggleVisible = (menu: Menu) => {
  // 실제로는 API 호출을 통해 업데이트 진행 (예: menuStore.updateMenu(...))
  menu.visible = !menu.visible
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const editMenu = (menu: Menu) => {
  alert(`"${menu.name}" 메뉴 정보 수정 연동 필요`)
}

const deleteMenu = (menuId: string) => {
  if (confirm('정말 이 메뉴를 삭제하시겠습니까? 관련 하위 메뉴가 있다면 함께 삭제될 수 있습니다.')) {
    // 실제로는 API 호출을 통해 삭제 진행 (예: menuStore.deleteMenu(menuId))
    alert('삭제 요청 연동 필요');
  }
}

onMounted(() => {
  menuStore.fetchMenus().catch(() => {
    // API 연결 안된 경우 에러 무시 (Mock Data로 처리)
  })
})
</script>

<style scoped>
/* 전체 레이아웃 (사용자 관리와 동일한 규칙 유지) */
.menu-management {
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
  background: linear-gradient(135deg, #059669, #10b981);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
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
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* 주 버튼 */
.primary-btn {
  background: #059669;
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
  box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
}

.primary-btn .btn-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

.primary-btn:hover {
  background: #047857;
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

/* 테이블 컨테이너 및 테이블 */
.table-container {
  overflow-x: auto;
}

.w-16 {
  width: 4rem;
  text-align: center;
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
  padding: 1rem 1.5rem;
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

/* 순서 뱃지 */
.order-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 0.85rem;
  font-weight: 700;
}

/* 메뉴 셀 */
.menu-info-cell {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.menu-icon {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.menu-details {
  display: flex;
  flex-direction: column;
}

.menu-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
}

/* 경로 텍스트 */
.path-text {
  background: #f1f5f9;
  color: #334155;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
}

/* 토글 스위치 디자인 */
.toggle-btn {
  display: inline-flex;
  align-items: center;
  padding: 0;
  padding-right: 0.5rem;
  border: 1px solid transparent;
  background: #f3f4f6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.toggle-knob {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  margin: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toggle-label {
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.3rem;
  margin-right: 0.4rem;
  transition: color 0.3s;
  color: #6b7280;
}

.toggle-btn.on {
  background: #10b981;
}

.toggle-btn.on .toggle-knob {
  transform: translateX(0); /* knob is float left by margin, so 0 is initial */
}

/* 토글 On/Off 로직 보정 구조 */
.toggle-btn.off .toggle-knob {
  transform: translateX(0);
}
.toggle-btn.on .toggle-knob {
  transform: translateX(calc(100% + 14px)); /* Adjust depending on label */
  /* 간단하게 flex 방향 조정도 가능하므로 구조 약간 수정 */
}

/* 좀 더 깔끔한 스위치 처리 */
.toggle-btn {
  width: 72px;
  height: 30px;
  display: flex;
  align-items: center;
  position: relative;
}
.toggle-btn .toggle-knob {
  position: absolute;
  left: 3px;
}
.toggle-btn .toggle-label {
  width: 100%;
  text-align: right;
  padding-right: 8px;
}

.toggle-btn.on .toggle-knob {
  left: calc(100% - 27px);
}
.toggle-btn.on .toggle-label {
  text-align: left;
  padding-left: 8px;
  padding-right: 0;
  color: white;
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
