import { Search, Bell, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const base_url = import.meta.env.VITE_API_URL || 'https://crmbackend-production-fdb8.up.railway.app';

export default function Header({ userData }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${base_url}/api/auth/getDetail/${userData.email}`)
        console.log("User data: ",res.data)
        setUser(res.data.data)
      } catch (error) {
        alert('There is something wrong')
      }
    }
    fetchData()
  },[])

  return (
    <header className='py-4 rounded-lg max-h-full mb-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4 flex-1 max-w-md'>
          <div className='relative flex-1'></div>
        </div>

        <div className='flex items-center gap-4'>
          <button className='relative p-2 hover:bg-gray-50 rounded-lg transition-colors'>
            <Bell className='w-5 h-5 text-gray-600' />
          </button>
          <div className='flex items-center gap-3 pl-4 border-l border-gray-200'>
            <div className='w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium'>
              <img src={userData?.avatar || '/assets/ava.png'} alt='EY' />
            </div>
            <div className='text-sm'>
              <div className='font-medium text-gray-900'>
                {user?.fullName || 'User'}
              </div>
            </div>
            <ChevronRight className='w-4 h-4 text-gray-400' />
          </div>
        </div>
      </div>
    </header>
  )
}
