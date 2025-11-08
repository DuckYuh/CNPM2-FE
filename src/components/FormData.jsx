import React, { useState, useEffect } from 'react';
import { AwardIcon, X } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const base_url = import.meta.env.VITE_API_URL || 'https://crmbackend-production-fdb8.up.railway.app';

export default function FormData({open, setOpen}) {
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    customerInfo: '',
    staffAssigned: userData?.fullName,
    action: '',
    createDate: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async() => {
        const token = localStorage.getItem('token')
        console.log('Token in Layout:', token)
        if (!token) {
            return
        } else {
            const decoded = jwtDecode(token)
            console.log('decoded:', decoded)
            const res = await axios.get(`${base_url}/api/auth/getDetail/${decoded.email}`)
            console.log("User data: ",res.data)
            setUserData(res.data.data)
            setFormData({...FormData, staffAssigned: res.data.data.email})
        }
    }

    fetchData()
  }, [])
  const handleSubmit = async() => {
    try{
        const res = await axios.post(`${base_url}/api/audit/activity`,{
            customerEmail: formData.customerInfo,
            userEmail: formData.staffAssigned,
            action: formData.action,
            description: formData.description
        })

        alert('Create Log Successfully')
    }catch(err){
        console.warn("End with Failure")
    }
    finally{
        console.log('Form submitted:', formData);
        setOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="">
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-900">Customer Action Form</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="customerInfo" className="block text-sm font-medium text-gray-700">
                  Customer Info
                </label>
                <input
                  id="customerInfo"
                  name="customerInfo"
                  type="text"
                  value={formData.customerInfo}
                  onChange={handleChange}
                  placeholder="Enter customer information"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="staffAssigned" className="block text-sm font-medium text-gray-700">
                  Staff Assigned
                </label>
                <input
                  id="staffAssigned"
                  name="staffAssigned"
                  type="text"
                  value={formData.staffAssigned}
                  onChange={handleChange}
                  placeholder="Enter staff name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                  Action
                </label>
                <select
                  id="action"
                  name="action"
                  value={formData.action}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select an action</option>
                  <option value="follow-up">email</option>
                  <option value="contact">call</option>
                  <option value="meeting">meeting</option>
                  <option value="resolve">other</option>
                </select>
              </div>


              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit()}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}