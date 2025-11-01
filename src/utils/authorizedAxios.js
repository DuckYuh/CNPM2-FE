import axios from 'axios'
import { toast } from 'sonner'
import { refreshTokenAPI } from '~/apis/authApis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { API_ROOT, PAGE_TYPE } from '~/utils/constants'
import { getMessageApi } from './messageInstance'
import { clearCart } from '~/redux/cart/cartSlice'

let authorizedAxiosInstance = axios.create({
  baseURL: `${API_ROOT}/v1`,
  timeout: 1000 * 60 * 10,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

let axiosReduxStore
export const injectStore = (mainStore) => (axiosReduxStore = mainStore)

let fromAdmin = false

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    if (config.data?.role === PAGE_TYPE.ADMIN) fromAdmin = true
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let refreshTokenPromise = null
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(clearCart())
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    const originalRequests = error.config
    if (error?.response?.status === 410 && originalRequests) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            return data?.accessToken
          })
          .catch((_error) => {
            axiosReduxStore.dispatch(clearCart())
            axiosReduxStore.dispatch(logoutUserAPI())
            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequests)
      })
    }

    if (error.response?.status !== 410) {
      if (!fromAdmin)
        toast.error(error.response?.data?.message || error?.message)
      else
        getMessageApi().error(error.response?.data?.message || error?.message)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
