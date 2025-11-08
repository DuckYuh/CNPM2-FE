import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { jwtDecode } from 'jwt-decode'

// Notes APIs
export const notesApi = {
  // Get notes by customer ID with pagination
  getByCustomerId: async (customerId, page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      customerId: customerId.toString()
    })

    const response = await authorizedAxiosInstance.get(
      `/customer-notes?${params}`
    )
    return response.data.data
  },

  // Create new note
  create: async (noteData) => {
    const token = localStorage.getItem('token')
    const payload = jwtDecode(token)
    const userId = payload.sub
    const response = await authorizedAxiosInstance.post(
      '/customer-notes/create',
      { ...noteData, userId }
    )
    return response.data
  },

  // Update note
  update: async (noteId, noteData) => {
    const response = await authorizedAxiosInstance.put(
      `/customer-notes/update/${noteId}`,
      noteData
    )
    return response.data.data
  },

  // Delete note
  delete: async (noteId) => {
    const response = await authorizedAxiosInstance.put(
      `/customer-notes/delete/${noteId}`
    )
    return response.data.data
  }
}

export default authorizedAxiosInstance
