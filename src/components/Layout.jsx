import React, { useState, useEffect } from 'react'
import Header from './Header'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  console.log('Current location:', location.pathname)
  const [activeNav, setActiveNav] = useState(
    location.pathname.split('/')[1] || 'dashboard'
  )
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('Token in Layout:', token)
    if (!token) {
      navigate('/login')
    } else {
      // Fetch user data logic here if needed
      const decoded = jwtDecode(token)
      console.log('decoded:', decoded)
      setUserData(decoded) // Placeholder
    }
  }, [])

  return (
    <div className='w-full pl-80 bg-blue-200 relative p-6 m-0 '>
      <SideBar activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className='col-span-5 bg-blue-200'>
        <Header userData={userData} />
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
