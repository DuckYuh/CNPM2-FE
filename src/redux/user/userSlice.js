import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { PAGE_TYPE } from '~/utils/constants'

export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (userData) => {
    let response = {}
    if (userData.access_token) {
      response = await authorizedAxiosInstance.post(
        '/auth/login/google/callback',
        userData
      )
    } else {
      response = await authorizedAxiosInstance.post('/auth/login', userData)
    }
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async () => {
    const response = await authorizedAxiosInstance.delete('/auth/logout')
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const role = data.role || data.get('role')
    let response = null
    if (role === PAGE_TYPE.BUYER) {
      delete data['role']
      data.delete('role')
      response = await authorizedAxiosInstance.put(
        '/buyer/profile/update',
        data
      )
    } else if (role === PAGE_TYPE.SELLER) {
      delete data['role']
      data.delete('role')
      response = await authorizedAxiosInstance.put(
        '/seller/profile/update',
        data
      )
    }
    return response.data
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
  }
})

// export const { } = userSlice.actions

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
