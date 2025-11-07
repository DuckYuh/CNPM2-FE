import authorizedAxiosInstance from '~/utils/authorizedAxios'

// Customer APIs
export const customerApi = {
  // Get all customers with pagination and search
  getAll: async (page = 0, size = 10, keyword = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

    if (keyword) {
      params.append('keyword', keyword)
    }

    const response = await authorizedAxiosInstance.get(
      `/customers/all?${params}`
    )
    return response.data
  },

  // Get customer by ID
  getById: async (id) => {
    const response = await authorizedAxiosInstance.get(`/customers/${id}`)
    return response.data.data
  },

  // Create new customer
  create: async (customerData) => {
    const response = await authorizedAxiosInstance.post(
      '/customers',
      customerData
    )
    return response.data
  },

  // Update customer
  update: async (id, customerData) => {
    const response = await authorizedAxiosInstance.put(
      `/customers/${id}`,
      customerData
    )
    return response.data
  },

  // Delete customer
  delete: async (id) => {
    const response = await authorizedAxiosInstance.delete(`/customers/${id}`)
    return response.data
  }
}

export default authorizedAxiosInstance
