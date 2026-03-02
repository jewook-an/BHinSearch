<template>
  <div class="login-page">
    <!-- 상단 타이틀 -->
    <div class="login-title">
      <span class="title-bh">보험인</span><span class="title-search">Search</span>
      <p class="title-sub">관리자 페이지</p>
    </div>

    <!-- 로그인 카드 -->
    <div class="login-card">
      <form @submit.prevent="handleLogin" class="login-form">

        <!-- 이메일 -->
        <div class="input-group" :class="{ focused: focusedField === 'email', filled: email }">
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="username"
            @focus="focusedField = 'email'"
            @blur="focusedField = ''"
          />
          <label for="email">관리자 이메일</label>
          <div class="input-line"></div>
        </div>

        <!-- 비밀번호 -->
        <div class="input-group" :class="{ focused: focusedField === 'password', filled: password }">
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            @focus="focusedField = 'password'"
            @blur="focusedField = ''"
          />
          <label for="password">비밀번호</label>
          <div class="input-line"></div>
        </div>

        <!-- 에러 메시지 -->
        <p v-if="error" class="error-msg">{{ error }}</p>

        <!-- 로그인 버튼 -->
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>

      </form>
    </div>

    <!-- 하단 -->
    <footer class="login-footer">
      보험인Search 관리자 시스템 &copy; {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const focusedField = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch {
    error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 전체 배경 */
.login-page {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo',
    'Noto Sans KR', sans-serif;
}

/* 타이틀 */
.login-title {
  text-align: center;
  margin-bottom: 2.5rem;
}

.title-bh {
  font-size: 2rem;
  font-weight: 700;
  color: #1e40af;
  letter-spacing: -0.5px;
}

.title-search {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a;
  letter-spacing: -0.5px;
}

.title-sub {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: #9ca3af;
  letter-spacing: 0.05em;
}

/* 카드 */
.login-card {
  width: 100%;
  max-width: 450px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 2.5rem 2.5rem 2rem;
  background: #fff;
}

/* 폼 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* 인풋 그룹 (floating label + underline) */
.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 100%;
  border: none;
  outline: none;
  border-bottom: 1px solid #d1d5db;
  background: transparent;
  padding: 1.4rem 0 0.5rem;
  font-size: 1rem;
  color: #111827;
  transition: border-color 0.2s;
}

.input-group label {
  position: absolute;
  left: 0;
  top: 1.4rem;
  font-size: 1rem;
  color: #9ca3af;
  pointer-events: none;
  transition: all 0.2s ease;
}

/* 포커스 or 값이 있을 때 라벨 이동 */
.input-group.focused label,
.input-group.filled label {
  top: 0;
  font-size: 0.75rem;
  color: #1e40af;
}

/* 언더라인 강조 */
.input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #1e40af;
  transition: width 0.25s ease;
}

.input-group.focused .input-line {
  width: 100%;
}

/* 에러 */
.error-msg {
  font-size: 0.85rem;
  color: #dc2626;
  margin-bottom: 0.5rem;
}

/* 버튼 */
.login-btn {
  width: 100%;
  background-color: #1e40af;
  color: #fff;
  border: none;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.75rem;
  letter-spacing: 0.05em;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.login-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

/* 스피너 */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 하단 푸터 */
.login-footer {
  margin-top: 2.5rem;
  font-size: 0.78rem;
  color: #9ca3af;
  text-align: center;
}
</style>
