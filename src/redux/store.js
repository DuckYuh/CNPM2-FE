import { configureStore } from '@reduxjs/toolkit'

import { cartReducer } from './cart/cartSlice'
import { userReducer } from './user/userSlice'

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whiteList: ['user', 'cart']
}

const reducers = combineReducers({
  cart: cartReducer,
  user: userReducer
})

const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})
