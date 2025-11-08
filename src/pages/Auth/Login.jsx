import { useState } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Card } from '~/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'
import authorizedAxiosInstance from '~/utils/authorizedAxios'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await authorizedAxiosInstance.post('/auth/login', formData)
      console.log('Login success:', res.data)

      const { accessToken, refreshToken } = res.data?.data || {}

      if (accessToken) {
        localStorage.setItem('token', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        navigate('/')
      } else {
        alert('Login failed: No token received.')
      }
    } catch (err) {
      console.error(err)
      alert('Login failed! Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left Instructions Side */}
      <div className='hidden lg:flex w-1/4 bg-mainColor1-500 p-12 text-primary-foreground flex-col justify-between'>
        <div className='space-y-6'>
            
          <div className='flex items-center'>
            <img 
                src="/assets/logo.png" 
                alt="Company Logo" 
                className="max-w-[200px] h-auto"
            />
          </div>

          <h1 className='text-4xl font-bold'>Welcome Back!</h1>
          <p className='text-lg'>
            Log in to access your account and manage your services.
          </p>

          <div className='space-y-4 mt-8'>
            <h2 className='text-2xl font-semibold'>Quick Instructions:</h2>
            <ul className='space-y-2 list-disc list-inside'>
              <li>Enter your registered email address</li>
              <li>Use your secure password</li>
              <li>Contact support if you need help</li>
            </ul>
          </div>
        </div>

        <div className='mt-auto'>
          <p className='text-sm opacity-80'>
            © 2024 Master Data. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Login Form Side */}
      <div className='w-full lg:w-3/4 flex items-center justify-center p-8 bg-mainBg-500'>
        <Card className='w-full max-w-md p-8 space-y-6'>
          <div className='space-y-2 text-center'>
            <h2 className='text-3xl font-bold'>Login</h2>
            <p className='text-muted-foreground'>
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className='flex items-center justify-between text-sm'>
              <label className='flex items-center gap-2'>
                <input type='checkbox' className='rounded border-gray-300' />
                <span>Remember me</span>
              </label>
              <Link
                to='/forgot-password'
                className='text-primary hover:underline'
              >
                Forgot password?
              </Link>
            </div>

            <Button type='submit' className='w-full bg-mainColor1-500'>
              Sign in
            </Button>

            <p className='text-center text-sm text-muted-foreground'>
              Don&apos;t have an account?{' '}
              <Link to='/register' className='text-primary hover:underline'>
                Sign up
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Login
