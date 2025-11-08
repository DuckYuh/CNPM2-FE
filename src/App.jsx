import { Routes, Route } from 'react-router-dom'
import CustomerListPage from '~/pages/customers/page'
import CustomerProfilePage from '~/pages/customers/[id]/page'
import UsersPage from '~/pages/users/page'
import Layout from './components/Layout'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import AuditLog from './pages/Log/AuditLog'

import ProtectedRoute from './utils/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              {' '}
              <Layout />{' '}
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='customers' element={<CustomerListPage />} />
          <Route path='customers/:id' element={<CustomerProfilePage />} />
          <Route path='users' element={<UsersPage />} />
          <Route path='logs' element={<AuditLog />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
