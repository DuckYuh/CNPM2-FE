import { Search, Bell, ChevronRight } from 'lucide-react'

export default function Header({ userData }) {
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
                {userData?.fullName || userData?.email || 'User'}
              </div>
            </div>
            <ChevronRight className='w-4 h-4 text-gray-400' />
          </div>
        </div>
      </div>
    </header>
  )
}
