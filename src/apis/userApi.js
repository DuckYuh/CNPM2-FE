import authorizedAxiosInstance from '~/utils/authorizedAxios'

// User APIs for admin panel
export const userApi = {
  // Get all users with pagination and search
  getAll: async (page = 0, size = 10, keyword = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

    if (keyword) {
      params.append('keyword', keyword)
    }

    const response = await authorizedAxiosInstance.get(`/users/all?${params}`)
    return response.data
  },

  // Get user by ID
  getById: async (id) => {
    const response = await authorizedAxiosInstance.get(`/users/${id}`)
    return response.data.data
  },

  // Create new user
  create: async (userData) => {
    const response = await authorizedAxiosInstance.post('/users', userData)
    return response.data
  },

  // Update user
  update: async (id, userData) => {
    const response = await authorizedAxiosInstance.put(`/users/${id}`, userData)
    return response.data
  },

  // Deactivate user (soft delete)
  deactivate: async (id) => {
    const response = await authorizedAxiosInstance.patch(
      `/users/${id}/deactivate`
    )
    return response.data
  },

  // Activate user
  activate: async (id) => {
    const response = await authorizedAxiosInstance.patch(
      `/users/${id}/activate`
    )
    return response.data
  },

  // Delete user (hard delete)
  delete: async (id) => {
    const response = await authorizedAxiosInstance.delete(`/users/${id}`)
    return response.data
  },

  // Get user roles
  getRoles: async () => {
    const response = await authorizedAxiosInstance.get('/users/roles')
    return response.data
  },

  // Update user role
  updateRole: async (id, role) => {
    const response = await authorizedAxiosInstance.patch(`/users/${id}/role`, {
      role
    })
    return response.data
  }
}
