import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '~/apis'
import { jwtDecode } from 'jwt-decode'

// Create Auth Context
const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  updateUser: () => {},
  checkAuth: async () => {}
})

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  // Check if user is authenticated and get user info
  const checkAuth = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      setIsAuthenticated(false)
      return false
    }

    try {
      const payload = jwtDecode(token)
      const userId = payload.sub
      const userData = await authApi.getMe(userId)
      setUser(userData.data || userData)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authApi.login(credentials)

      console.log(response)

      if (response.token || response.accessToken) {
        const token = response.token || response.accessToken
        localStorage.setItem('token', token)
        const payload = jwtDecode(token)
        const userId = payload.sub

        // Get user info after login
        const userData = await authApi.getMe(userId)
        setUser(userData.data || userData)
        setIsAuthenticated(true)

        toast.success('Login successful!')
        navigate('/')
        return { success: true, data: userData }
      } else {
        throw new Error('No token received')
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Even if logout API fails, we still clear local data
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
      navigate('/login')
    }
  }

  // Update user info (for profile updates)
  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }))
  }

  // Check auth on mount and when token changes
  useEffect(() => {
    checkAuth()
  }, [])

  // Listen for storage changes (for logout from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token was removed in another tab
        setUser(null)
        setIsAuthenticated(false)
        navigate('/login')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [navigate])

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate('/login')
      }
    }, [isAuthenticated, loading, navigate])

    if (loading) {
      return (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-muted-foreground'>Loading...</div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}

export default AuthContext
