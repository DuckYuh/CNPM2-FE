/* eslint-disable no-undef */
let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://e-commerce-api-fpzd.onrender.com'
}

export const API_ROOT = apiRoot

export const PAGE_TYPE = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin'
}

export const DEFAULT_ITEMS_PER_PAGE = 40
export const DEFAULT_PAGE = 1

export const COMMENTS = [
  'Rất không hài lòng',
  'Không hài lòng',
  'Bình thường',
  'Hài lòng',
  'Cực kì hài lòng'
]

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
}

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

export const SHIPPING_METHOD = {
  GHTK: 'ghtk',
  GHN: 'ghn'
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  SHIPPING: 'shipping',
  SUCCESS: 'success',
  FAIL: 'fail',
  CANCELLED: 'cancelled'
}
