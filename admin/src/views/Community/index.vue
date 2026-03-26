<template>
  <div class="community-management">
    <!-- 상단 헤더 -->
    <div class="dash-header">
      <div class="dash-header-icon">💬</div>
      <div class="header-text">
        <h1 class="dash-title">커뮤니티 관리</h1>
        <p class="dash-subtitle">사용자 게시글, 댓글 등 소통 게시판 관리</p>
      </div>
      <div class="header-actions">
        <!-- 필터 카테고리 -->
        <div class="filter-box">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">전체 게시판</option>
            <option value="NOTICE">공지사항</option>
            <option value="FREE">자유게시판</option>
            <option value="QNA">Q&A</option>
          </select>
        </div>
        <!-- 검색박스 -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="제목, 작성자 검색..." v-model="searchQuery" />
        </div>
        <button class="primary-btn">
          <span class="btn-icon">＋</span>
          공지 작성
        </button>
      </div>
    </div>

    <!-- 메인 콘텐츠 (테이블 영역) -->
    <div class="dash-section">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="w-20">게시판</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회/댓글</th>
              <th class="text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in displayPosts" :key="post.id" :class="{'notice-row': post.category === 'NOTICE'}">
              <td>
                <span class="category-badge" :class="getCategoryClass(post.category)">
                  {{ formatCategory(post.category) }}
                </span>
              </td>
              <td>
                <div class="post-title-cell">
                  <span class="pin-icon" v-if="post.category === 'NOTICE'">📢</span>
                  <span class="post-title">{{ post.title }}</span>
                </div>
              </td>
              <td>
                <span class="author-text">{{ post.author }}</span>
              </td>
              <td>
                <span class="date-text">{{ formatDate(post.createdAt) }}</span>
              </td>
              <td>
                <div class="stats-cell">
                  <span class="stat-item" title="조회수">👁 {{ post.views }}</span>
                  <span class="stat-item" title="댓글수">💬 {{ post.comments }}</span>
                </div>
              </td>
              <td class="text-right actions-cell">
                <button class="action-btn view-btn" title="게시글 보기">👀</button>
                <button class="action-btn delete-btn" title="삭제 (블라인드)">🗑️</button>
              </td>
            </tr>

            <!-- 빈 상태 -->
            <tr v-if="displayPosts.length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-icon">📭</div>
                <p>등록된 게시글이 없습니다.</p>
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

interface Post {
  id: string
  category: 'NOTICE' | 'FREE' | 'QNA'
  title: string
  author: string
  createdAt: string
  views: number
  comments: number
}

const searchQuery = ref('')
const selectedCategory = ref('')

const mockPosts: Post[] = [
  { id: '1', category: 'NOTICE', title: '[필독] 시스템 정기 점검 안내 (3월 10일)', author: '시스템 관리자', createdAt: '2026-03-01T10:00:00Z', views: 1250, comments: 0 },
  { id: '2', category: 'NOTICE', title: '개인정보 처리방침 변경 안내', author: '운영팀', createdAt: '2026-02-15T10:00:00Z', views: 890, comments: 2 },
  { id: '3', category: 'FREE', title: '설계사 자격증 인강 추천해주세요', author: '초보러너', createdAt: '2026-03-07T08:20:00Z', views: 45, comments: 5 },
  { id: '4', category: 'QNA', title: '이력서 올렸는데 자꾸 오류가 납니다', author: '김보험', createdAt: '2026-03-06T19:30:00Z', views: 12, comments: 1 },
  { id: '5', category: 'FREE', title: '요즘 B생명 성과급 어느 정도인가요?', author: '익명1', createdAt: '2026-03-05T22:10:00Z', views: 340, comments: 14 },
]

const displayPosts = computed(() => {
  let result = [...mockPosts]

  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.author.toLowerCase().includes(query)
    )
  }

  return result
})

const getCategoryClass = (category: string) => {
  if (category === 'NOTICE') return 'cat-notice'
  if (category === 'FREE') return 'cat-free'
  if (category === 'QNA') return 'cat-qna'
  return ''
}

const formatCategory = (category: string) => {
  switch (category) {
    case 'NOTICE': return '공지'
    case 'FREE': return '자유'
    case 'QNA': return '질문'
    default: return category
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
/* 전체 레이아웃 */
.community-management {
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
  background: linear-gradient(135deg, #a855f7, #7e22ce);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
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
  border-color: #a855f7;
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
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

/* 주 버튼 */
.primary-btn {
  background: #a855f7;
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
  box-shadow: 0 2px 4px rgba(168, 85, 247, 0.2);
}

.primary-btn .btn-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

.primary-btn:hover {
  background: #9333ea;
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

.w-20 {
  width: 5rem;
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
  padding: 1.1rem 1.5rem;
  vertical-align: middle;
  border-bottom: 1px solid #f3f4f6;
}

.data-table tbody tr:hover td {
  background-color: #f8fafc;
}

.data-table tbody tr.notice-row td {
  background-color: #faf5ff; /* 공지사항 배경 연보라색 하이라이트 */
}
.data-table tbody tr.notice-row:hover td {
  background-color: #f3e8ff;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* 뱃지 */
.category-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

.cat-notice { background: #e9d5ff; color: #7e22ce; }
.cat-free { background: #e0e7ff; color: #4338ca; }
.cat-qna { background: #dcfce7; color: #15803d; }

/* 게시글 제목 */
.post-title-cell {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.pin-icon {
  font-size: 0.9rem;
}

.post-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-title:hover {
  text-decoration: underline;
  color: #a855f7;
}

/* 기타 텍스트 */
.author-text {
  font-size: 0.9rem;
  color: #4b5563;
  font-weight: 500;
}

.date-text {
  color: #6b7280;
  font-size: 0.85rem;
}

/* 조회수 댓글수 */
.stats-cell {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #6b7280;
  font-size: 0.85rem;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 0.2rem;
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
