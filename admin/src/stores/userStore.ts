import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, PaginatedResponse } from '@/types'
import { adminApi } from '@/api/client'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async (page = 1, limit = 10) => {
    loading.value = true
    error.value = null

    try {
      const response = await adminApi.get<PaginatedResponse<User>>('/admin/users', {
        params: {
          page,
          limit
        }
      })

      users.value = response.data.items
      total.value = response.data.total
      currentPage.value = page
      pageSize.value = limit
    } catch (err) {
      error.value = '사용자 목록을 불러올 수 없습니다.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: Partial<User>) => {
    try {
      await adminApi.post('/admin/users', userData)
      await fetchUsers(currentPage.value, pageSize.value)
      return true
    } catch (err) {
      error.value = '사용자 생성에 실패했습니다.'
      console.error(err)
      return false
    }
  }

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      await adminApi.put(`/admin/users/${userId}`, userData)
      await fetchUsers(currentPage.value, pageSize.value)
      return true
    } catch (err) {
      error.value = '사용자 수정에 실패했습니다.'
      console.error(err)
      return false
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await adminApi.delete(`/admin/users/${userId}`)
      await fetchUsers(currentPage.value, pageSize.value)
      return true
    } catch (err) {
      error.value = '사용자 삭제에 실패했습니다.'
      console.error(err)
      return false
    }
  }

  return {
    users,
    total,
    currentPage,
    pageSize,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
})
