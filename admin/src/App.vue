<template>
  <div id="admin-app">
    <header v-if="!isLoginRoute" class="header">
      <div class="container">
        <h1>보험인Search 관리자 페이지</h1>
        <button @click="logout" class="logout-btn">로그아웃</button>
      </div>
    </header>

    <nav v-if="!isLoginRoute" class="sidebar">
      <ul class="nav-list">
        <li>
          <RouterLink to="/dashboard" class="nav-link">
            대시보드
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/users" class="nav-link">
            사용자 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/menus" class="nav-link">
            메뉴 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/audit" class="nav-link">
            이력 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/positions" class="nav-link">
            포지션 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/applications" class="nav-link">
            지원 관리
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/community" class="nav-link">
            커뮤니티
          </RouterLink>
        </li>
      </ul>
    </nav>

    <main :class="['content', { 'full': isLoginRoute } ]">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const route = useRoute()
// hide layout elements when requiresAuth is false (login page)
const isLoginRoute = computed(() => route.meta.requiresAuth === false)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
#admin-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #1e40af;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.logout-btn {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

.sidebar {
  width: 200px;
  background-color: white;
  position: fixed;
  left: 0;
  top: 60px;
  height: calc(100vh - 60px);
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: block;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #374151;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #1e40af;
}

.nav-link.router-link-active {
  background-color: #eff6ff;
  color: #1e40af;
  border-left-color: #1e40af;
}

.content {
  margin-left: 200px;
  padding: 2rem;
  flex: 1;
}

.content.full {
  margin-left: 0;
  padding: 0;
  min-height: 100vh;
}

</style>
