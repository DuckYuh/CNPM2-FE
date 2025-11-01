import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'

import HomePage from './pages/Buyer/HomePage/HomePage'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import ProductDetailPage from './pages/Buyer/ProductDetailPage/ProductDetailPage'
import BuyerLayout from './components/Layout/BuyerLayout'
import LandingPage from './pages/LandingPage/LandingPage'
import SearchPage from './pages/Buyer/SearchPage/SearchPage'
import CartPage from '~/pages/Buyer/CartPage/CartPage'
import UserProfile from '~/pages/Buyer/User/UserProfile/UserProfile'
import UserOrder from '~/pages/Buyer/User/UserOrder/UserOrder'
import UserLayout from '~/components/Layout/UserLayout'
import Page404 from '~/pages/Page404'
import CheckoutPage from '~/pages/Buyer/CheckoutPage/CheckoutPage'
import AdminLayout from '~/components/Layout/AdminLayout'
import DashboardAdmin from '~/pages/Admin/Dashboard/Dashboard'
import DashboardSeller from '~/pages/Seller/Dashboard/Dashboard'
import SellerLayout from '~/components/Layout/SellerLayout'
import ProductsSeller from '~/pages/Seller/Products/Products'
import OrdersSeller from '~/pages/Seller/Orders/Orders'
import Promotion from '~/pages/Seller/Promotion/Promotion'
import Comments from '~/pages/Seller/Comments/Comments'
import StoreProfile from './pages/Seller/Store/Profile/Profile'
import Completion from './pages/Buyer/CheckoutPage/Completion'
import CreateForm from './pages/Seller/Products/CreateForm/CreateForm'
import { PAGE_TYPE } from './utils/constants'
import Page401 from './pages/Page401'
import StoreList from '~/pages/Seller/Store/StoreList/StoreList'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import LoginAdmin from '~/pages/Admin/Auth/LoginAdmin'
import { message } from 'antd'
import { useEffect } from 'react'
import { setMessageApi } from './utils/messageInstance'

const PrivateRoute = ({ user }) => {
  if (!user) return <Navigate to='/' replace={true} />
  return <Outlet />
}

const ProtectedRoute = ({ user, role }) => {
  if (user.role !== role) return <Page401 />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    setMessageApi(messageApi)
  }, [messageApi])

  return (
    <>
      {contextHolder}
      <Routes>
        <Route path='/' element={<LandingPage />} />

        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/verify-account' element={<AccountVerification />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Public pages */}
        <Route path='/buyer' element={<BuyerLayout />}>
          <Route index element={<HomePage />} />
          <Route path='search' element={<SearchPage />} />
          <Route path='product/:productId' element={<ProductDetailPage />} />
          <Route path='cart' element={<CartPage />} />
        </Route>

        {/* Admin pages */}
        <Route path='/admin-x7e9gqk2f3l' element={<LoginAdmin />} />

        <Route element={<PrivateRoute user={currentUser} />}>
          {/* Buyer pages */}
          <Route
            element={
              <ProtectedRoute user={currentUser} role={PAGE_TYPE.BUYER} />
            }
          >
            <Route path='/buyer' element={<BuyerLayout />}>
              <Route path='checkout' element={<CheckoutPage />} />
              <Route path='checkout/complete' element={<Completion />} />
            </Route>

            {/* User pages (Buyer Module) */}
            <Route path='/user' element={<UserLayout />}>
              <Route path='profile' element={<UserProfile />} />
              <Route path='order' element={<UserOrder />} />
            </Route>
          </Route>

          {/* Seller pages */}
          <Route
            element={
              <ProtectedRoute user={currentUser} role={PAGE_TYPE.SELLER} />
            }
          >
            <Route path='/seller' element={<SellerLayout />}>
              <Route index element={<DashboardSeller />} />
              <Route path='products' element={<ProductsSeller />} />
              <Route path='products/add' element={<CreateForm />} />
              <Route path='orders' element={<OrdersSeller />} />
              <Route path='store/profile' element={<StoreProfile />} />
              <Route path='store/list-store' element={<StoreList />} />
              <Route path='promotion' element={<Promotion />} />
              <Route path='comment' element={<Comments />} />
            </Route>
          </Route>

          {/* Admin pages */}
          <Route
            element={
              <ProtectedRoute user={currentUser} role={PAGE_TYPE.ADMIN} />
            }
          >
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<DashboardAdmin />} />
            </Route>
          </Route>
        </Route>

        {/* 404 not found page */}
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App
