import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

let authorizedAxiosInstance = axios.create({
  baseURL: `${API_ROOT}/v1`,
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
