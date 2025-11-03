import axios from 'axios'
import authorizedAxiosInstance from '~/utils/authorizedAxios'

// Customer APIs
export const customerApi = {
  // Get all customers with pagination and search
  getAll: async (page = 0, size = 10, keyword = '') => {
    try {
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
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  },

  // Get customer by ID
  getById: async (id) => {
    try {
      const response = await authorizedAxiosInstance.get(`/customers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer:', error)
      throw error
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const response = await authorizedAxiosInstance.post(
        '/customers',
        customerData
      )
      return response.data
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const response = await authorizedAxiosInstance.put(
        `/customers/${id}`,
        customerData
      )
      return response.data
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await authorizedAxiosInstance.delete(`/customers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  }
}

export default authorizedAxiosInstance
