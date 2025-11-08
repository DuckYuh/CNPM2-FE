import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import {
  LayoutDashboard,
  Plane,
  Users,
  UserCog,
  MessageSquare,
  Info,
  LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SideBar({ activeNav, setActiveNav }) {
  const navigate = useNavigate()
  // TODO: Replace with actual auth check when AuthContext is available
  const hasRole = (role) => true // Temporary - shows all menu items

  const navItems = [
    { id: 'dashboard', href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'customers', href: '/customers', icon: Users, label: 'Customers' },
    {
      id: 'users',
      href: '/users',
      icon: UserCog,
      label: 'User Management',
      requiresRole: ['admin', 'manager'] // Only show to admins/managers
    },
    { id: 'logs', href: '/logs', icon: Plane, label: 'Audit logs' },
    { id: 'info', href: '/info', icon: Info, label: 'Info Portal' }
  ]

  const Logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className='min-h-screen fixed top-0 left-0 p-6 pr-0 w-72'>
      <div className='w-full bg-white border-r border-gray-200 flex flex-col rounded-lg min-h-[94vh]'>
        {/* Logo */}
        <div className='p-6'>
          <img src='/assets/logo.png' alt='' className='w-12 h-12' />
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-3'>
          {navItems.map((item) => {
            // Check if item requires specific role and user has that role
            if (
              item.requiresRole &&
              !item.requiresRole.some((role) => hasRole(role))
            ) {
              return null
            }

            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id)
                  navigate(item.href)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className='space-y-24 px-3 mb-6'>
          {/* Support Card */}
          <div className='flex justify-center'>
            <div className='p-4 m-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white w-full h-[13rem] self-center'>
              <div className='text-8xl -mt-16 items-center justify-center flex flex-col'>
                <img
                  src='/assets/spter.png'
                  alt='Support Agent'
                  className='w-[11rem] h-[11rem] mb-4'
                />
                <Button className='bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm w-28 h-10 flex items-center justify-center'>
                  <MessageSquare className='w-4 h-4 mr-2' />
                  Support
                </Button>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={Logout}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all text-gray-600 hover:bg-gray-50'
          >
            <LogOut className='w-5 h-5' />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
