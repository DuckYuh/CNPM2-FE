import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import EditCustomerForm from './EditCustomerForm'
import { useState } from 'react'

const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function CustomerCard({
  customer,
  onDelete,
  onViewDetails,
  setCountUpdate
}) {
  const [openEditModal, setOpenEditModal] = useState(false)
  return (
    <div className='grid grid-cols-7 gap-4 p-4 items-center hover:bg-muted/50 transition-colors'>
      {/* Contact Info */}
      <div className='col-span-2 flex items-center gap-3'>
        <Avatar className='h-10 w-10'>
          <AvatarImage
            src={`/avatars/customer-${customer.id}.png`}
            alt={customer.fullname}
          />
          <AvatarFallback className='bg-primary/10 text-primary font-medium'>
            {getInitials(customer.fullname)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className='font-medium text-foreground'>{customer.fullname}</div>
          <div className='text-sm text-muted-foreground'>{customer.email}</div>
        </div>
      </div>

      {/* Phone */}
      <div className='text-sm text-foreground'>{customer.phone}</div>

      {/* Address */}
      <div
        className='text-sm text-foreground truncate'
        title={customer.address}
      >
        {customer.address}
      </div>

      {/* Description */}
      <div
        className='text-sm text-foreground truncate'
        title={customer.description}
      >
        {customer.description}
      </div>

      {/* Created Date */}
      <div className='text-sm text-foreground'>
        {formatDate(customer.createdAt)}
      </div>

      {/* Actions */}
      <div className='flex justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onViewDetails?.(customer)}>
              View Details
            </DropdownMenuItem>
            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <EditCustomerForm
                  customer={customer}
                  setCountUpdate={setCountUpdate}
                  closeModal={() => setOpenEditModal(false)}
                />
              </DialogContent>
            </Dialog>

            <DropdownMenuItem
              className='text-destructive'
              onClick={() => onDelete?.(customer)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
