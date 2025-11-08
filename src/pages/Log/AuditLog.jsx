import { useState, useEffect } from 'react'
import { Filter, SearchIcon, ArrowRightIcon, Download } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { format } from 'date-fns'
import logApi from '~/apis/logApi'

const AuditLog = () => {
  const [logs, setLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const [total, setTotal] = useState(null)

  const buildQueryParams = () => {
    const params = {}
    // Search is client-side only — do NOT send userId to API
    if (filterAction && filterAction !== 'all') params.action = filterAction
    if (dateRange.start) params.from = `${dateRange.start}T00:00:00`
    if (dateRange.end) params.to = `${dateRange.end}T23:59:59`
    params.page = page
    params.size = size
    return params
  }

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = buildQueryParams()
      const res = await logApi.getAuditLogs(params)
      if (res?.data) {
        const { content, totalElements, number, size } = res.data
        setLogs(content || [])
        setTotal(totalElements)
        setPage(number)
        setSize(size)
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err)
      setLogs([])
      setTotal(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAction, dateRange.start, dateRange.end, page, size])

  const handleSearch = (event) => {
    event.preventDefault()
    // client-side search only — no API call
    setPage(0)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleExportCSV = () => {
    if (!logs || logs.length === 0) {
      alert('No logs to export')
      return
    }

    const header = ['id', 'userId', 'username', 'action', 'description', 'createdAt']
    const csvRows = logs.map(log => {
      const id = (log.id || '').toString().replace(/"/g, '""')
      const userId = (log.userId || '').toString().replace(/"/g, '""')
      const username = (log.username || '').toString().replace(/"/g, '""')
      const action = (log.action || '').toString().replace(/"/g, '""')
      const description = (log.description || '').toString().replace(/"/g, '""')
      const createdAt = (log.createdAt || '').toString().replace(/"/g, '""')
      return `"${id}","${userId}","${username}","${action}","${description}","${createdAt}"`
    })
    const csvContent = [`"${header.join('","')}"`, ...csvRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'audit-logs.csv'
    a.click()
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  const getActionLabel = (action) => {
    switch (action) {
      case 'CREATE': return 'Create'
      case 'UPDATE': return 'Update'
      case 'DELETE': return 'Delete'
      case 'EDIT': return 'Delete' // show Delete for EDIT values
      case 'LOGIN': return 'Login'
      default: return action || '-'
    }
  }

  // Helper to clean descriptions:
  // - remove "(id=...)" parens
  // - convert "customerId=xxxx" -> "customer"
  // - remove standalone " id=GUID" and anything after it (e.g. "Updated note id=...") 
  const cleanDescription = (desc = '') => {
    if (!desc) return '-'
    let s = String(desc)

    // remove parentheses id blocks: " (id=...)" or "(id=...)"
    s = s.replace(/\s*\(id=[^)]+\)/gi, '')

    // convert XyzId=GUID -> Xyz (keeps label, removes id value)
    s = s.replace(/\b([A-Za-z]+)Id=[^\s)]+/g, '$1')

    // remove trailing " id=GUID" and everything after (case-insensitive)
    s = s.replace(/\s+id=[^\s)]+.*$/i, '')

    return s.trim()
  }

  // client-side filtered list (searchTerm matches username, userId, action, description)
  const filteredLogs = logs.filter(log => {
    const kw = (searchTerm || '').trim().toLowerCase()
    if (!kw) return true
    return (
      String(log.username || '').toLowerCase().includes(kw) ||
      String(log.userId || '').toLowerCase().includes(kw) ||
      String(log.action || '').toLowerCase().includes(kw) ||
      String(log.description || '').toLowerCase().includes(kw)
    )
  })

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-semibold text-foreground'>
            Activity Logs
          </h1>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className='h-4 w-4' />
            Filters
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={handleExportCSV}
          >
            <Download className='h-4 w-4' />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className='mb-4 p-4 border rounded-lg bg-muted/20'>
          <div className='flex gap-4'>
            <div className='w-[200px]'>
              <Select value={filterAction} onValueChange={(value) => { setFilterAction(value); setPage(0); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="EDIT">Delete</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              type="date"
              className='w-[200px]'
              value={dateRange.start}
              onChange={(e) => { setDateRange({ ...dateRange, start: e.target.value }); setPage(0); }}
            />
            <Input
              type="date"
              className='w-[200px]'
              value={dateRange.end}
              onChange={(e) => { setDateRange({ ...dateRange, end: e.target.value }); setPage(0); }}
            />
          </div>
        </div>
      )}


      {/* Logs Table */}
      <div className='bg-card rounded-lg border shadow-sm'>
        <div className='grid grid-cols-4 gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground'>
          <div>Username</div>
          <div>Action</div>
          <div>Time</div>
          <div>Description</div>
        </div>

        {loading ? (
          <div className='p-4'>Loading...</div>
        ) : filteredLogs.length === 0 ? (
          <div className='p-4'>No logs found.</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id || `${log.userId}-${log.createdAt}`} className='grid grid-cols-4 gap-4 p-4 border-b text-sm'>
              <div>{log.username || log.userId || '-'}</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs
                  ${log.action === 'CREATE' ? 'bg-green-100 text-green-800' : ''}
                  ${log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' : ''}
                  ${log.action === 'DELETE' ? 'bg-red-100 text-red-800' : ''}
                  ${log.action === 'LOGIN' ? 'bg-gray-100 text-gray-800' : ''}
                  ${log.action === 'EDIT' ? 'bg-red-100 text-pink-800' : ''}
                `}>
                  {getActionLabel(log.action)}
                </span>
              </div>
              <div>{formatDate(log.createdAt)}</div>
              <div className='break-words whitespace-pre-wrap'>{cleanDescription(log.description)}</div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className='flex items-center justify-between mt-4'>
        <div className='text-sm text-muted-foreground'>
          {total != null ? `Total: ${total}` : ''}
        </div>
        <div className='flex items-center gap-2'>
          <Button size='sm' onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page <= 0 || loading}>
            Prev
          </Button>
          <div className='px-3'>{`Page ${page + 1}`}</div>
          <Button size='sm' onClick={() => setPage(p => p + 1)} disabled={loading || (total != null && (page + 1) * size >= total)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AuditLog
