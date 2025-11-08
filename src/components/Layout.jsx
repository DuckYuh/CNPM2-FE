import React, { useState } from 'react'
import Header from './Header'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '~/context/AuthContext'

function Layout() {
  const location = useLocation()
  const [activeNav, setActiveNav] = useState(
    location.pathname.split('/')[1] || 'dashboard'
  )
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-muted-foreground'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Sidebar - Fixed width */}
      <SideBar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main content - Flexible width */}
      <main className='pl-80 flex-1 flex flex-col overflow-hidden'>
        <Header userData={user} />
        <div className='flex-1 overflow-auto p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
