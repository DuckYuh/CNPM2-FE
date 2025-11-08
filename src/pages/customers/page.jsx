import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import CustomerCard from '~/components/customers/CustomerCard'
import {
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  ArrowRightIcon
} from 'lucide-react'
import { customerApi } from '~/apis/customerApi'
import { toast } from 'sonner'
import { CustomerFormDialog } from '~/pages/customers/CustomerFormDialog'

export default function CustomerListPage() {
  const [activeTab, setActiveTab] = useState('List')
  const [currentPage, setCurrentPage] = useState(0) // API sử dụng 0-based indexing
  const [searchTerm, setSearchTerm] = useState('')
  const [customers, setCustomers] = useState([])
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [countUpdate, setCountUpdate] = useState(0)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const pageSize = 10

  useEffect(() => {
    setLoading(true)
    customerApi
      .getAll(currentPage)
      .then((response) => {
        setCustomers(response.data)
        setTotalCustomers(response.totalItems)
        setTotalPages(response.totalPages)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage, countUpdate])

  const handleSearch = async (event) => {
    event.preventDefault()
    setLoading(true)
    customerApi
      .getAll(currentPage, pageSize, searchTerm)
      .then((response) => {
        setCustomers(response.data)
        setTotalCustomers(response.totalItems)
        setTotalPages(response.totalPages)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDeleteCustomer = async (customer) => {
    setLoading(true)

    const loadingToast = toast.loading('Deleting customer...')
    await customerApi.delete(customer.id)
    // Refresh customer list after deletion
    toast.success('Customer deleted successfully')
    toast.dismiss(loadingToast)

    customerApi
      .getAll(currentPage, pageSize, searchTerm)
      .then((response) => {
        setCustomers(response.data)
        setTotalCustomers(response.totalItems)
        setTotalPages(response.totalPages)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-semibold text-foreground'>
            Customers ({totalCustomers})
          </h1>
        </div>
        {/* Tab Navigation */}
        {/* <div className='grid grid-cols-2 bg-gray-200 rounded-full p-1'>
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
        </div> */}

        <div className='flex items-center gap-3'>
          
          <Button
            size='sm'
            className='flex items-center gap-2 bg-primary hover:bg-primary/90'
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className='h-4 w-4' />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className='relative w-[40%] mb-2'>
        <Input
          className='peer ps-9 pe-9 w-full placeholder:text-sm placeholder:text-mainColor1-100 rounded-lg border-mainColor1-800 text-mainColor1-600 hover:border-[2px] focus:border-[2px] flex-1 bg-white'
          placeholder='Search customers...'
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

      {/* Customer List */}
      <div className='bg-card rounded-lg border shadow-sm'>
        {/* Table Header */}
        <div className='grid grid-cols-7 gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground'>
          <div className='col-span-2'>Customer Info</div>
          <div>Phone</div>
          <div>Address</div>
          <div>Description</div>
          <div>Created Date</div>
          <div></div>
        </div>

        {/* Customer Rows */}
        {loading ? (
          <div className='w-full flex items-center justify-center h-96 text-muted-foreground'>
            Loading...
          </div>
        ) : (
          <div className='divide-y'>
            {customers?.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onViewDetails={() => {}}
                onDelete={handleDeleteCustomer}
                countUpdate={countUpdate}
                setCountUpdate={setCountUpdate}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {customers?.length === 0 && (
          <div className='flex flex-col items-center justify-center py-12'>
            <div className='text-muted-foreground mb-2'>No customers found</div>
            <div className='text-sm text-muted-foreground'>
              Try adjusting your search terms
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className='flex items-center justify-between p-4 border-t bg-muted/50'>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage + 1} of {Math.max(totalPages, 1)} (
            {totalCustomers} total)
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

      <CustomerFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          setCountUpdate((prev) => prev + 1)
        }}
      />
    </div>
  )
}
