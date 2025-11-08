// app/employees/page.jsx
import { useState, useEffect } from "react";

import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeftRight,
  Filter,
  Home,
  LogOut,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  User,
  Users,
  Settings, // Assuming 'Info Portal' is settings
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

import activityLogs from "./data";

import axios from "axios";

const base_url = import.meta.env.VITE_API_URL || 'https://crmbackend-production-fdb8.up.railway.app';

// --- Helper for Badge Colors ---
const getBadgeColor = (level) => {
  switch (level.toLowerCase()) {
    case "call":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    case "email":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    case "meeting":
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// --- Main Page Component ---
export default function ActivityTable() {
  const [interactions, setInteractions] = useState([])
  const [current, setCurrent] = useState(0)
  const [lim, setLim] = useState(8)

  useEffect(() => {
    const fetchData = async () =>{
        try {
            const res = await axios.get(`${base_url}/activities`)
            setInteractions(res.data.data)
        } catch (error) {
            setInteractions(activityLogs)
        }
    }

    fetchData()
  },[])
  
  return (
    <div className="flex min-h-screen w-full bg-gray-50/90">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-6">
          <PageHeader num_of_interactions={interactions.length}/>
          <div className="mt-6 flex flex-col gap-4">
            <TableHeader />
            {interactions.slice(current, current + lim).map((interaction, index) => (
              <EmployeeCard 
                key={index} 
                interaction={interaction} 
              />
            ))}
          </div>
          <PaginationControls
           current={current}
           setCurrent={setCurrent}
           lim={lim}
           setLim={setLim}
           total={interactions.length}
          />
        </main>
      </div>
    </div>
  );
}

function PageHeader({ num_of_interactions = 0 }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Total Interactions ({num_of_interactions})</h1>
      <div className="flex items-center gap-2">
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Interaction
        </Button>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <Card className="hover:shadow-md transition-shadow rounded-lg">
      <CardContent className="grid grid-cols-12 items-center gap-4 p-4 font-bold bg-blue-400 rounded-lg">
        {/* Name & Email */}
        <div className="col-span-12 flex items-center gap-4 md:col-span-2">
          Customer Info
        </div>

        <div className="col-span-6 md:col-span-2">Staff Assigned</div>

        {/* Position & Level */}
        <div className="col-span-6 flex items-center gap-2 md:col-span-3">
            Action
        </div>

        {/* Birthday */}
        <div className="col-span-6 md:col-span-2">Create Date</div>
        
        {/* Full Age */}
        <div className="col-span-6 md:col-span-1">Description</div>
      </CardContent>
    </Card>
  );
}

function EmployeeCard({ interaction, current, lim }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="grid grid-cols-12 items-center gap-4 p-4">
        {/* Name & Email */}
        <div className="col-span-12 flex items-center gap-4 md:col-span-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={interaction.avatar} alt={interaction.customer} />
            <AvatarFallback className="blue">{interaction.customer.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{interaction.customer}</p>
            {/* <p className="text-sm text-gray-500">{employee.email}</p> */}
          </div>
        </div>

        <div className="col-span-6 text-sm md:col-span-2">{interaction.staff || 'admin'}</div>

        {/* Position & Level */}
        <div className="col-span-6 flex items-center gap-2 md:col-span-3">
            <Badge variant="outline" className={getBadgeColor(interaction.action)}>
              {interaction.action}
            </Badge>
        </div>

        {/* Birthday */}
        <div className="col-span-6 text-sm text-gray-600 md:col-span-2">{formatDate(interaction.created_date)}</div>
        
        {/* Full Age */}
        <div className="col-span-6 text-sm text-gray-600 md:col-span-1">{interaction.description.slice(0,10) + " ..."}</div>
        
        {/* Actions */}
        <div className="col-span-12 flex justify-end md:col-span-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function PaginationControls({ 
  current, setCurrent, 
  lim, setLim,
  total
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-4 text-sm">
      <span className="text-gray-600">{current + 1}-{current + lim} of {total}</span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8" disable={current-lim >= 0} onClick={() => setCurrent(current - lim >= 0 ? current - lim : current)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" disable={current+lim < total} onClick={() => setCurrent(current + lim < total ? current + lim : current)} >
          <ChevronRight className="h-4 w-4"  />
        </Button>
      </div>
    </div>
  );
}