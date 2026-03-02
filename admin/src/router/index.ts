import { createRouter, createWebHistory, RouterView } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: RouterView,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '대시보드' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '사용자 관리' }
      },
      {
        path: 'menus',
        name: 'Menus',
        component: () => import('@/views/Menus.vue'),
        meta: { title: '메뉴 관리' }
      },
      {
        path: 'audit',
        name: 'Audit',
        component: () => import('@/views/Audit.vue'),
        meta: { title: '이력 관리' }
      },
      {
        path: 'positions',
        name: 'Positions',
        component: () => import('@/views/Positions.vue'),
        meta: { title: '포지션 관리' }
      },
      {
        path: 'applications',
        name: 'Applications',
        component: () => import('@/views/Applications.vue'),
        meta: { title: '지원 관리' }
      },
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/views/Community.vue'),
        meta: { title: '커뮤니티' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory('/admin'),
  routes
})

// 라우트 가드 - 인증 확인
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  if (requiresAuth) {
    if (authStore.isLoggedIn) {
      next()
    } else {
      next('/login')
    }
  } else {
    if (to.path === '/login' && authStore.isLoggedIn) {
      next('/dashboard')
    } else {
      next()
    }
  }
})

export default router
