import axios from 'axios'

const api = axios.create({
  baseURL: 'https://crmbackend-production-fdb8.up.railway.app/',  // 🔹 baseURL từ swagger
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Nếu token hết hạn hoặc lỗi 401
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ Token expired or unauthorized')
      localStorage.removeItem('token')
      window.location.href = '/login' // chuyển về trang login
    }
    return Promise.reject(error)
  }
)


export default api