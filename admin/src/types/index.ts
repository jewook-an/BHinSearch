// 공통 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 사용자 관련
export interface User {
  id: string
  email: string
  username: string
  phone?: string
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  role: 'USER' | 'RECRUITER'
  createdAt: string
}

// 메뉴 관련
export interface Menu {
  id: string
  name: string
  path: string
  icon?: string
  order: number
  visible: boolean
  createdAt: string
}
