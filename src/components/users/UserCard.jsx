import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { MoreHorizontal, User, UserCheck, UserX } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import EditUserForm from './EditUserForm'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog'

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

const getRoleBadgeVariant = (role) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'destructive'
    case 'STAFF':
      return 'secondary'
    default:
      return 'outline'
  }
}

const getStatusBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'default'
    case 'inactive':
    case 'deactivated':
      return 'secondary'
    case 'suspended':
      return 'destructive'
    default:
      return 'outline'
  }
}

export default function UserCard({
  user,
  onDelete,
  onDeactivate,
  onActivate,
  onViewDetails,
  setCountUpdate
}) {
  const [openEditModal, setOpenEditModal] = useState(false)
  const navigate = useNavigate()

  const isActive = user.status === 'active' || !user.deletedAt
  const userStatus = user.status || (isActive ? 'active' : 'inactive')

  return (
    <div className='grid grid-cols-7 gap-4 p-4 items-center hover:bg-muted/50 transition-colors'>
      {/* User Info */}
      <div className='col-span-2 flex items-center gap-3'>
        <Avatar className='h-10 w-10'>
          <AvatarImage
            src={`/avatars/user-${user.id}.png`}
            alt={user.fullname || user.name}
          />
          <AvatarFallback className='bg-primary/10 text-primary font-medium'>
            {getInitials(user.fullname || user.name || user.email)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div
            className='font-medium text-foreground hover:text-primary cursor-pointer'
            onClick={() => navigate(`/users/${user.id}`)}
          >
            {user.fullname || user.name}
          </div>
          <div className='text-sm text-muted-foreground'>{user.email}</div>
        </div>
      </div>

      {/* Role */}
      <div className='flex'>
        <Badge variant={getRoleBadgeVariant(user.roles)} className='text-xs'>
          {user?.roles || 'N/A'}
        </Badge>
      </div>

      {/* Status */}
      <div className='flex'>
        <Badge variant={getStatusBadgeVariant(userStatus)} className='text-xs'>
          {userStatus}
        </Badge>
      </div>

      {/* Last Login */}
      <div className='text-sm text-foreground'>
        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
      </div>

      {/* Created Date */}
      <div className='text-sm text-foreground'>
        {formatDate(user.createdAt)}
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
            <DropdownMenuItem
              onClick={() => navigate(`/users/${user.id}`)}
              className='flex items-center gap-2'
            >
              <User className='h-4 w-4' />
              View Details
            </DropdownMenuItem>

            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <EditUserForm
                  user={user}
                  setCountUpdate={setCountUpdate}
                  closeModal={() => setOpenEditModal(false)}
                />
              </DialogContent>
            </Dialog>

            <DropdownMenuSeparator />

            {/* Activation/Deactivation */}
            {isActive ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className='flex items-center gap-2 text-orange-600'
                  >
                    <UserX className='h-4 w-4' />
                    Deactivate
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to deactivate this user? They will
                      no longer be able to access the system, but their data
                      will be preserved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className='bg-orange-600 hover:bg-orange-700'
                      onClick={() => onDeactivate?.(user)}
                    >
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <DropdownMenuItem
                onClick={() => onActivate?.(user)}
                className='flex items-center gap-2 text-green-600'
              >
                <UserCheck className='h-4 w-4' />
                Activate
              </DropdownMenuItem>
            )}

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className='text-destructive flex items-center gap-2'
                  onSelect={(e) => e.preventDefault()}
                >
                  <UserX className='h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this user account and remove all associated data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-destructive hover:bg-destructive/80'
                    onClick={() => onDelete?.(user)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
