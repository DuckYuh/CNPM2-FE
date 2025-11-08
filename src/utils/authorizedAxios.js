import axios from 'axios'
import { toast } from 'sonner'
import { jwtDecode } from 'jwt-decode'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://crmbackend-production-fdb8.up.railway.app/api'

let authorizedAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000 * 60 * 10,
  headers: {
    'Content-Type': 'application/json'
  }
})

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = jwtDecode(token)
      if (payload) {
        config.headers['userId'] = payload.sub
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Nếu token hết hạn hoặc lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login' // chuyển về trang login
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
