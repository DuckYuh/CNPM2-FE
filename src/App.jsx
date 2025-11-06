import { Routes, Route } from 'react-router-dom'
import CustomerListPage from '~/pages/customers/page'
import Layout from './components/Layout'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Dashboard from './pages/Dashboard'

import ProtectedRoute from './utils/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute> <Layout /> </ProtectedRoute>}>
        <Route index path='dashboard' element={<Dashboard />} />
        <Route path='customers' element={<CustomerListPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}

export default App
