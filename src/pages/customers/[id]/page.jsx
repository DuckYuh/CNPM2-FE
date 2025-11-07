import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { customerApi, notesApi } from '~/apis'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
  Edit3,
  Plus,
  MoreHorizontal,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useForm } from 'react-hook-form'

// Mock fallback data
const mockNotes = [
  {
    id: '1',
    content:
      'Customer called about billing inquiry. Resolved by explaining the charges.',
    createdAt: '2025-11-05T10:30:00',
    updatedAt: '2025-11-05T10:30:00',
    staffName: 'John Smith'
  },
  {
    id: '2',
    content:
      'Follow-up meeting scheduled for next week to discuss contract renewal.',
    createdAt: '2025-11-04T14:15:00',
    updatedAt: '2025-11-04T14:15:00',
    staffName: 'Jane Doe'
  }
]

const getInitials = (name) => {
  return (
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'C'
  )
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card className='mb-4 hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <AvatarFallback className='text-xs'>
                {getInitials(note.staffName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='text-sm font-medium'>{note.staffName}</p>
              <p className='text-xs text-muted-foreground'>
                {formatDate(note.createdAt)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onEdit(note)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive'
                onClick={() => onDelete(note)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        <p className='text-sm text-foreground'>{note.content}</p>
        {note.updatedAt !== note.createdAt && (
          <p className='text-xs text-muted-foreground mt-2'>
            Edited {formatDate(note.updatedAt)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function NoteForm({ note, customerId, onSuccess, onCancel }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: note?.content || ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      if (note) {
        await notesApi.update(note.id, data)
        toast.success('Note updated successfully')
      } else {
        await notesApi.create(customerId, data)
        toast.success('Note added successfully')
      }
      reset()
      onSuccess()
    } catch (error) {
      toast.error('Failed to save note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{note ? 'Edit Note' : 'Add New Note'}</DialogTitle>
        <DialogDescription>
          {note
            ? 'Update the note content.'
            : 'Add a new note for this customer.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='content'>Note Content</Label>
          <textarea
            id='content'
            {...register('content', { required: true })}
            className='min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            placeholder='Enter your note here...'
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' type='button' onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : note ? 'Update Note' : 'Add Note'}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState(null)
  const [notes, setNotes] = useState([])
  const [notesPage, setNotesPage] = useState(0)
  const [totalNotesPages, setTotalNotesPages] = useState(0)
  const [totalNotes, setTotalNotes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notesLoading, setNotesLoading] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)

  const { id } = useParams()
  const notesPageSize = 5

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerApi.getById(id)
        setCustomer(data)
      } catch (error) {
        toast.error('Failed to fetch customer data.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [id])

  useEffect(() => {
    const fetchNotes = async () => {
      if (!id) return

      setNotesLoading(true)
      try {
        const response = await notesApi.getByCustomerId(
          id,
          notesPage,
          notesPageSize
        )
        setNotes(response.data || response.content || [])
        setTotalNotes(response.totalItems || response.totalElements || 0)
        setTotalNotesPages(response.totalPages || 1)
      } catch {
        // Fallback to mock data
        setNotes(mockNotes)
        setTotalNotes(mockNotes.length)
        setTotalNotesPages(1)
      } finally {
        setNotesLoading(false)
      }
    }

    fetchNotes()
  }, [id, notesPage])

  const handleEditNote = (note) => {
    setEditingNote(note)
    setIsNoteDialogOpen(true)
  }

  const handleDeleteNote = async (note) => {
    try {
      await notesApi.delete(note.id)
      toast.success('Note deleted successfully')
      // Refresh notes
      const response = await notesApi.getByCustomerId(
        id,
        notesPage,
        notesPageSize
      )
      setNotes(response.data)
      setTotalNotes(response.totalItems)
      setTotalNotesPages(response.totalPages)
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  const handleNoteSuccess = async () => {
    setIsNoteDialogOpen(false)
    setEditingNote(null)
    // Refresh notes
    const response = await notesApi.getByCustomerId(
      id,
      notesPage,
      notesPageSize
    )
    setNotes(response.data)
    setTotalNotes(response.totalItems)
    setTotalNotesPages(response.totalPages)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>Loading customer profile...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>Customer not found</div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-2'>
          <Button variant='ghost' size='sm' className='p-0'>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold text-foreground'>
            Customer Profile
          </h1>
        </div>
        <p className='text-muted-foreground'>
          Manage customer information and notes
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Panel - Customer Info */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader className='text-center pb-4'>
              <div className='flex justify-center mb-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage src={`/avatars/customer-${customer.id}.png`} />
                  <AvatarFallback className='text-lg font-semibold bg-primary/10 text-primary'>
                    {getInitials(customer.fullname)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className='text-xl'>{customer.fullname}</CardTitle>
              <Badge variant='secondary' className='w-fit mx-auto'>
                Customer
              </Badge>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Email</p>
                    <p className='text-sm text-muted-foreground'>
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Phone className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Phone</p>
                    <p className='text-sm text-muted-foreground'>
                      {customer.phone}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Address</p>
                    <p className='text-sm text-muted-foreground'>
                      {customer.address || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Description</p>
                    <p className='text-sm text-muted-foreground'>
                      {customer.description || 'No description'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Customer Since</p>
                    <p className='text-sm text-muted-foreground'>
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <Button className='w-full' variant='outline'>
                <Edit3 className='h-4 w-4 mr-2' />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Notes Management */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Notes</CardTitle>
                  <p className='text-sm text-muted-foreground'>
                    Staff notes for {customer.fullname} ({totalNotes} total)
                  </p>
                </div>
                <Dialog
                  open={isNoteDialogOpen}
                  onOpenChange={setIsNoteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingNote(null)}>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <NoteForm
                      note={editingNote}
                      customerId={id}
                      onSuccess={handleNoteSuccess}
                      onCancel={() => {
                        setIsNoteDialogOpen(false)
                        setEditingNote(null)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {notesLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='text-muted-foreground'>Loading notes...</div>
                </div>
              ) : notes.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-muted-foreground mb-4'>No notes yet</p>
                  <Dialog
                    open={isNoteDialogOpen}
                    onOpenChange={setIsNoteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingNote(null)}>
                        <Plus className='h-4 w-4 mr-2' />
                        Add First Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <NoteForm
                        note={editingNote}
                        customerId={id}
                        onSuccess={handleNoteSuccess}
                        onCancel={() => {
                          setIsNoteDialogOpen(false)
                          setEditingNote(null)
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <>
                  {/* Notes List */}
                  <div className='space-y-0'>
                    {notes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                      />
                    ))}
                  </div>

                  {/* Notes Pagination */}
                  {totalNotesPages > 1 && (
                    <div className='flex items-center justify-between mt-6 pt-4 border-t'>
                      <div className='text-sm text-muted-foreground'>
                        Page {notesPage + 1} of {totalNotesPages}
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          disabled={notesPage === 0}
                          onClick={() =>
                            setNotesPage((prev) => Math.max(prev - 1, 0))
                          }
                          className='h-8 w-8 p-0'
                        >
                          <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <span className='text-sm text-muted-foreground px-2'>
                          {notesPage + 1}
                        </span>
                        <Button
                          variant='outline'
                          size='sm'
                          disabled={notesPage >= totalNotesPages - 1}
                          onClick={() =>
                            setNotesPage((prev) =>
                              Math.min(prev + 1, totalNotesPages - 1)
                            )
                          }
                          className='h-8 w-8 p-0'
                        >
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Note Dialog */}
      <Dialog
        open={isNoteDialogOpen && editingNote}
        onOpenChange={setIsNoteDialogOpen}
      >
        <DialogContent>
          <NoteForm
            note={editingNote}
            customerId={id}
            onSuccess={handleNoteSuccess}
            onCancel={() => {
              setIsNoteDialogOpen(false)
              setEditingNote(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
