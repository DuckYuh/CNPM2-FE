import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Plane, 
  Users, 
  MessageSquare, 
  Info,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import api from '~/apis/axios';

export default function AnalyticsDashboard() {
  const [customers, setCustomers] = useState([]);
  const [numActiveUsers, setNumActiveUsers] = useState(0);
  const [numNewCustomers, setNumNewCustomers] = useState(0);
  const [customersByMonth, setCustomersByMonth] = useState([]);
  const [customersThisWeek, setCustomersThisWeek] = useState([]);

  const [activities, setActivities] = useState([])
  const [allAction, setAllAction] = useState([])
  const [statAction, setStatAction] = useState([])

  const base_url = import.meta.env.VITE_API_URL || 'https://crmbackend-production-fdb8.up.railway.app';

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${base_url}/api/customers/all`);
      console.log(response.data);
      setCustomers(response.data);
      setNumActiveUsers(response.data.data.filter(item => item?.deletedAt !== null).length);
      console.log("Today is:", new Date().getDate());
      setNumNewCustomers(response.data.data.filter((item) => {
        const today = new Date();
        const createdAt = new Date(item.createdAt);
        return createdAt.getDate() === today.getDate() && createdAt.getMonth() === today.getMonth() && createdAt.getFullYear() === today.getFullYear();
      }).length);

      const customersPerMonth = Array(12).fill(0);

      response.data.data.forEach((item) => {
        const createdAt = new Date(item.createdAt);
        const month = createdAt.getMonth();
        customersPerMonth[month]++;
      });
      console.log("Customers per month:", customersPerMonth.map((item, index) => ({
        month: new Date(1970, index).toLocaleString('default', { month: 'long' }),
        count: item
      })));
      setCustomersByMonth(customersPerMonth.map((item, index) => ({
        month: new Date(1970, index).toLocaleString('default', { month: 'short' }),
        count: item
      })));
    };

    const fetchLog = async () => {
      try {
        const response = await api.get(`/api/audit/logs?type=INTERACTION`)
        const dataset = response.data.content
        setActivities(response.data.content)
        console.log("Activities Assigned: ", response.data.content)

        const actionsPerMonth = Array(12).fill(0);

        dataset.forEach((item) => {
          const createAt = new Date(item.createdAt)
          const month = createAt.getMonth()
          actionsPerMonth[month]++
        })
        setAllAction(actionsPerMonth.map((item, index) => ({
          month: new Date(1970, index).toLocaleString('default', { month: 'short' }),
          count: item
        })))

        const statsAction = Object.groupBy(dataset, item => item.action)
        const rollStats = Object.entries(statsAction).map(([action, items]) => ({
          name: action,
          value: items.length
        }));
        console.log(rollStats)
        setStatAction(rollStats)
      } catch (error) {
        console.warn('There is something wrong')
      }
    }
    fetchLog()
    fetchData();
  }, []);

  const revenueData = [
    { month: 'Jan', revenue: 4200, expenses: 2400 },
    { month: 'Feb', revenue: 5100, expenses: 2800 },
    { month: 'Mar', revenue: 4800, expenses: 2600 },
    { month: 'Apr', revenue: 6200, expenses: 3200 },
    { month: 'May', revenue: 7100, expenses: 3500 },
    { month: 'Jun', revenue: 6800, expenses: 3300 },
    { month: 'Jul', revenue: 8200, expenses: 3800 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#8B5CF6' },
    { name: 'Food', value: 20, color: '#EC4899' },
    { name: 'Books', value: 12, color: '#10B981' },
    { name: 'Other', value: 8, color: '#F59E0B' },
  ];

  const trafficData = [
    { hour: '00:00', visitors: 120 },
    { hour: '04:00', visitors: 80 },
    { hour: '08:00', visitors: 320 },
    { hour: '12:00', visitors: 580 },
    { hour: '16:00', visitors: 640 },
    { hour: '20:00', visitors: 420 },
  ];

  const performanceData = [
    { day: 'Mon', sales: 420 },
    { day: 'Tue', sales: 680 },
    { day: 'Wed', sales: 550 },
    { day: 'Thu', sales: 780 },
    { day: 'Fri', sales: 920 },
    { day: 'Sat', sales: 1100 },
    { day: 'Sun', sales: 850 },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 1234, change: 12.5, trend: 'up' },
    { name: 'Smart Watch Pro', sales: 1089, change: 8.3, trend: 'up' },
    { name: 'Laptop Stand', sales: 967, change: -3.2, trend: 'down' },
    { name: 'Mechanical Keyboard', sales: 856, change: 15.7, trend: 'up' },
  ];

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'vacations', icon: Plane, label: 'Vacations' },
    { id: 'employees', icon: Users, label: 'Employees' },
    { id: 'messenger', icon: MessageSquare, label: 'Messenger' },
    { id: 'info', icon: Info, label: 'Info Portal' },
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${trend === 'up' ? 'bg-green-100' : 'bg-blue-100'}`}>
              <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
          {trend !== 'none' && (<>
            <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(change)}%
            </div>
            </>
          )}

        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen bg-blue-200">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-500">Welcome back, here's what's happening today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Customers" 
              value={customers.totalItems} 
              change={numNewCustomers / (customers.totalItems - numNewCustomers) * 100 || 0} 
              icon={Users}
              trend={numNewCustomers >= 0 ? "up" : "down"}
            />

            <StatCard 
              title="Active Users" 
              value={numActiveUsers}
              change={-3.2} 
              icon={Users}
              trend="none"
            />

            <StatCard 
              title="New Customers" 
              value={numNewCustomers} 
              change={numNewCustomers / (customers.totalItems - numNewCustomers) * 100 || 0} 
              icon={ArrowUpRight}
              trend="up"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={allAction}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Activity Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statAction}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statAction.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryData[index].color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Second Charts Row */}
          <div className="">
            {/* Traffic Chart */}
            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Monthly Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customersByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}