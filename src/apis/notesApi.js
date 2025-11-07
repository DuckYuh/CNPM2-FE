import authorizedAxiosInstance from '~/utils/authorizedAxios'

// Notes APIs
export const notesApi = {
  // Get notes by customer ID with pagination
  getByCustomerId: async (customerId, page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

    const response = await authorizedAxiosInstance.get(
      `/customers/${customerId}/notes?${params}`
    )
    return response.data
  },

  // Create new note
  create: async (customerId, noteData) => {
    const response = await authorizedAxiosInstance.post(
      `/customers/${customerId}/notes`,
      noteData
    )
    return response.data
  },

  // Update note
  update: async (noteId, noteData) => {
    const response = await authorizedAxiosInstance.put(
      `/notes/${noteId}`,
      noteData
    )
    return response.data
  },

  // Delete note
  delete: async (noteId) => {
    const response = await authorizedAxiosInstance.delete(`/notes/${noteId}`)
    return response.data
  }
}

export default authorizedAxiosInstance
