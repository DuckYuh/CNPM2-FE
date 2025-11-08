import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import UserCard from '~/components/users/UserCard'
import AddUserForm from '~/components/users/AddUserForm'
import {
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  ArrowRightIcon,
  Users
} from 'lucide-react'
import { userApi } from '~/apis'
import { toast } from 'sonner'

export default function UsersPage() {
  // TODO: Replace with actual auth check when AuthContext is available
  const hasRole = (role) => true // Temporary - allows all access
  const [activeTab, setActiveTab] = useState('List')
  const [currentPage, setCurrentPage] = useState(0) // API sử dụng 0-based indexing
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [countUpdate, setCountUpdate] = useState(0)
  const [openAddModal, setOpenAddModal] = useState(false)

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const pageSize = 10

  useEffect(() => {
    setLoading(true)
    userApi
      .getAll(currentPage, pageSize)
      .then((response) => {
        setUsers(response.data || [])
        setTotalUsers(response.totalItems || 0)
        setTotalPages(response.totalPages || 0)
      })
      .catch((error) => {
        toast.error('Failed to fetch users')
        console.error('Error fetching users:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage, countUpdate])

  const handleSearch = async (event) => {
    event.preventDefault()
    setLoading(true)
    userApi
      .getAll(currentPage, pageSize, searchTerm)
      .then((response) => {
        setUsers(response.data || [])
        setTotalUsers(response.totalItems || 0)
        setTotalPages(response.totalPages || 0)
      })
      .catch((error) => {
        toast.error('Failed to search users')
        console.error('Error searching users:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDeleteUser = async (user) => {
    setLoading(true)
    const loadingToast = toast.loading('Deleting user...')

    try {
      await userApi.delete(user.id)
      toast.success('User deleted successfully')
      toast.dismiss(loadingToast)

      // Refresh user list after deletion
      const response = await userApi.getAll(currentPage, pageSize, searchTerm)
      setUsers(response.data || [])
      setTotalUsers(response.totalItems || 0)
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      toast.error('Failed to delete user')
      console.error('Error deleting user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivateUser = async (user) => {
    setLoading(true)
    const loadingToast = toast.loading('Deactivating user...')

    try {
      await userApi.deactivate(user.id)
      toast.success('User deactivated successfully')
      toast.dismiss(loadingToast)

      // Refresh user list
      const response = await userApi.getAll(currentPage, pageSize, searchTerm)
      setUsers(response.data || [])
      setTotalUsers(response.totalItems || 0)
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      toast.error('Failed to deactivate user')
      console.error('Error deactivating user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivateUser = async (user) => {
    setLoading(true)
    const loadingToast = toast.loading('Activating user...')

    try {
      await userApi.activate(user.id)
      toast.success('User activated successfully')
      toast.dismiss(loadingToast)

      // Refresh user list
      const response = await userApi.getAll(currentPage, pageSize, searchTerm)
      setUsers(response.data || [])
      setTotalUsers(response.totalItems || 0)
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      toast.error('Failed to activate user')
      console.error('Error activating user:', error)
    } finally {
      setLoading(false)
    }
  }

  // Check if user has admin privileges
  const canManageUsers = hasRole('admin') || hasRole('manager')

  if (!canManageUsers) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Users className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <h2 className='text-2xl font-semibold text-foreground mb-2'>
            Access Denied
          </h2>
          <p className='text-muted-foreground'>
            You don&apos;t have permission to manage users.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-semibold text-foreground'>
            Users ({totalUsers})
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className='grid grid-cols-2 bg-gray-200 rounded-full p-1'>
          <Button
            variant={activeTab === 'List' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('List')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'List'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            List
          </Button>
          <Button
            variant={activeTab === 'Activity' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('Activity')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'Activity'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Activity
          </Button>
        </div>

        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <Filter className='h-4 w-4' />
          </Button>

          {hasRole('admin') && (
            <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
              <DialogTrigger asChild>
                <Button
                  size='sm'
                  className='flex items-center gap-2 bg-primary hover:bg-primary/90'
                >
                  <Plus className='h-4 w-4' />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[500px]'>
                <AddUserForm
                  setCountUpdate={setCountUpdate}
                  closeModal={() => setOpenAddModal(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className='relative w-[40%] mb-2'>
        <Input
          className='peer ps-9 pe-9 w-full placeholder:text-sm placeholder:text-mainColor1-100 rounded-lg border-mainColor1-800 text-mainColor1-600 hover:border-[2px] focus:border-[2px] flex-1 bg-white'
          placeholder='Search users...'
          onChange={handleInputChange}
        />
        <div className='text-mainColor1-600/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
          <SearchIcon size={16} />
        </div>
        <button
          className='text-mainColor1-600/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          aria-label='Submit search'
          type='submit'
        >
          <ArrowRightIcon size={16} aria-hidden='true' />
        </button>
      </form>

      {/* User List */}
      <div className='bg-card rounded-lg border shadow-sm'>
        {/* Table Header */}
        <div className='grid grid-cols-7 gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground'>
          <div className='col-span-2'>User Info</div>
          <div>Role</div>
          <div>Status</div>
          <div>Last Login</div>
          <div>Created Date</div>
          <div></div>
        </div>

        {/* User Rows */}
        {loading ? (
          <div className='w-full flex items-center justify-center h-96 text-muted-foreground'>
            Loading...
          </div>
        ) : (
          <div className='divide-y'>
            {users?.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={handleDeleteUser}
                onDeactivate={handleDeactivateUser}
                onActivate={handleActivateUser}
                setCountUpdate={setCountUpdate}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {users?.length === 0 && !loading && (
          <div className='flex flex-col items-center justify-center py-12'>
            <Users className='h-12 w-12 text-muted-foreground mb-4' />
            <div className='text-muted-foreground mb-2'>No users found</div>
            <div className='text-sm text-muted-foreground'>
              Try adjusting your search terms or add a new user
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className='flex items-center justify-between p-4 border-t bg-muted/50'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage + 1} of {Math.max(totalPages, 1)} ({totalUsers}{' '}
            total)
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              className='h-8 w-8 p-0'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='text-sm text-muted-foreground px-2'>
              {currentPage + 1}
            </span>
            <Button
              variant='outline'
              size='sm'
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              className='h-8 w-8 p-0'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
