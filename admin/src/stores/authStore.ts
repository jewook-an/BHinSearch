import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/api/client'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'ADMIN_USER' | 'ADMIN_MENU' | 'ADMIN_AUDIT'
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token') || null)
  const user = ref<AdminUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await adminApi.post('/admin/auth/login', { email, password })

      const data = response.data
      token.value = data.access_token
      user.value = data.user
      localStorage.setItem('admin_token', data.access_token)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '알 수 없는 오류'
      // propagate failure so callers can handle it
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('admin_token')
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('admin_token', newToken)
  }

  return {
    token,
    user,
    isLoading,
    error,
    isLoggedIn,
    login,
    logout,
    setToken,
  }
})
