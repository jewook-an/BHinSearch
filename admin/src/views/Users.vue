<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">사용자 관리</h1>
        <p class="text-gray-600 mt-2">전체 사용자 관리 및 권한 설정</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + 새 사용자
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">이메일</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">사용자명</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">역할</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">상태</th>
            <th class="px-6 py-3 text-right text-sm font-medium text-gray-700">작업</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ user.email }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ user.username }}</td>
            <td class="px-6 py-4 text-sm">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                활성
              </span>
            </td>
            <td class="px-6 py-4 text-right text-sm">
              <button class="text-blue-600 hover:underline mr-3">수정</button>
              <button class="text-red-600 hover:underline">삭제</button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
              사용자가 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const users = ref(userStore.users)
const showCreateModal = ref(false)

onMounted(() => {
  userStore.fetchUsers()
})
</script>
