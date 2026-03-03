import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1`

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - 토큰 추가
client.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Response interceptor - 에러 처리
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()

    // 401 Unauthorized - 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      authStore.logout()
      window.location.href = '/admin/login'
    }

    return Promise.reject(error)
  }
)

export const adminApi = client

export default client
