import authorizedAxiosInstance from '~/utils/authorizedAxios'

// Auth API
export const authApi = {
  // Get current user info
  getMe: async (userId) => {
    const response = await authorizedAxiosInstance.get(
      `/auth/getDetail/${userId}`
    )
    return response.data.data
  },

  // Login
  login: async (credentials) => {
    const response = await authorizedAxiosInstance.post(
      '/auth/login',
      credentials
    )
    return response.data.data
  },

  // Logout
  logout: async () => {
    const response = await authorizedAxiosInstance.post('/auth/logout')
    return response.data
  },

  // Refresh token
  refreshToken: async () => {
    const response = await authorizedAxiosInstance.post('/auth/refresh')
    return response.data
  },

  // Register
  register: async (userData) => {
    const response = await authorizedAxiosInstance.post(
      '/auth/register',
      userData
    )
    return response.data
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await authorizedAxiosInstance.post(
      '/auth/forgot-password',
      { email }
    )
    return response.data
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await authorizedAxiosInstance.post(
      '/auth/reset-password',
      {
        token,
        newPassword
      }
    )
    return response.data
  }
}
