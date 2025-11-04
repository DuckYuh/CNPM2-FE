import React from 'react'
import Header from './Header'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='w-screen pl-80 bg-mainBg-500 relative p-6'>
      <SideBar />
      <main className='col-span-5 bg-transparent'>
        <Header />
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
