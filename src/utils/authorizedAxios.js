import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

let authorizedAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000 * 60 * 10,
  headers: {
    'Content-Type': 'application/json'
  }
})

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
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
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
