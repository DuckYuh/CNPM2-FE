import React, { useState } from 'react'
import { Search, Bell, ChevronRight } from 'lucide-react'

export default function Header({ userData }) {
  return (
    <header className='py-4 rounded-lg max-h-full mb-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4 flex-1 max-w-md'>
          <div className='relative flex-1'>
            <Search className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search'
              className='w-full pl-10 pr-4 py-2 bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <button className='relative p-2 hover:bg-gray-50 rounded-lg transition-colors'>
            <Bell className='w-5 h-5 text-gray-600' />
          </button>
          <div className='flex items-center gap-3 pl-4 border-l border-gray-200'>
            <div className='w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium'>
              <img src={userData?.avatar || 'assets/ava.png'} alt='EY' />
            </div>
            <div className='text-sm'>
              <div className='font-medium text-gray-900'>
                {userData?.fullname || 'Unknown User'}
              </div>
            </div>
            <ChevronRight className='w-4 h-4 text-gray-400' />
          </div>
        </div>
      </div>
    </header>
  )
}
