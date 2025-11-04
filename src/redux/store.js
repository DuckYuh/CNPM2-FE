import { configureStore } from '@reduxjs/toolkit'

import { userReducer } from './user/userSlice'

import { combineReducers } from 'redux'

const reducers = combineReducers({
  user: userReducer
})

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})
