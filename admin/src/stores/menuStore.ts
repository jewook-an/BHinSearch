import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Menu } from '@/types'
import { adminApi } from '@/api/client'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<Menu[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMenus = async () => {
    loading.value = true
    try {
      const res = await adminApi.get<Menu[]>('/admin/menus')
      menus.value = res.data
    } catch (e) {
      error.value = '메뉴 목록을 불러올 수 없습니다.'
    } finally {
      loading.value = false
    }
  }

  return { menus, loading, error, fetchMenus }
})
