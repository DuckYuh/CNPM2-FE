import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { 
  LayoutDashboard, 
  Plane, 
  Users, 
  MessageSquare, 
  Info,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SideBar({activeNav, setActiveNav}){
    const navigate = useNavigate();
    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'customers', icon: Users, label: 'Customers' },
        { id: 'events', icon: Plane, label: 'Events' },
        { id: 'info', icon: Info, label: 'Info Portal' },
    ];
    return (
      <div className="w-64 ml-2 mb-2 mt-2 mr-2 bg-white border-r border-gray-200 flex flex-col rounded-lg">
        {/* Logo */}
        <div className="p-6">
          <img src="assets/logo.png" alt="" className="w-12 h-12" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {setActiveNav(item.id); navigate(`/${item.id}`);}}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Support Card */}
        <div className="p-4 m-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white w-[13rem] h-[13rem] self-center">
        </div>
        <div className="text-8xl -mt-72 mb-24 items-center justify-center flex flex-col">
            <img src="assets/spter.png" alt="Support Agent" className="w-[11rem] h-[11rem] mb-4"/>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm w-28 h-10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Support
            </Button>
        </div>
        {/* Logout */}
        <button className="flex items-center gap-3 px-7 py-4 text-gray-600 hover:bg-gray-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    )
}