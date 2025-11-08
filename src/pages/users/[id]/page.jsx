import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userApi } from '~/apis'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import {
  Edit3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronLeft,
  Shield,
  Building
} from 'lucide-react'
import EditUserForm from '~/components/users/EditUserForm'

const getInitials = (name) => {
  return (
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'
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

const getRoleBadgeColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-700 hover:bg-red-100'
    case 'manager':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
    case 'staff':
      return 'bg-green-100 text-green-700 hover:bg-green-100'
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100'
  }
}

export default function UserProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openEditModal, setOpenEditModal] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userApi.getById(id)
        setUser(data)
      } catch {
        toast.error('Failed to fetch user data.')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>Loading user profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>User not found</div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-6 min-w-7xl'>
        <div className='flex items-center gap-2 mb-2'>
          <Button variant='ghost' size='sm' className='p-0'>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold text-foreground'>User Profile</h1>
        </div>
        <p className='text-muted-foreground'>
          Manage user information and notes
        </p>
      </div>

      <div className='h-2'></div>

      <div className='flex justify-center'>
        {/* User Info Card */}
        <div className='w-full max-w-md'>
          <Card>
            <CardHeader className='text-center pb-4'>
              <div className='flex justify-center mb-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage src={`/avatars/user-${user.id}.png`} />
                  <AvatarFallback className='text-lg font-semibold bg-primary/10 text-primary'>
                    {getInitials(user.fullname || user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className='text-xl'>
                {user.fullname || user.name}
              </CardTitle>
              <div className='flex gap-2 justify-center'>
                <Badge
                  variant='secondary'
                  className={`w-fit ${getRoleBadgeColor(user.role)}`}
                >
                  {user.role || 'Staff'}
                </Badge>
                {user.isActive === false && (
                  <Badge variant='destructive' className='w-fit'>
                    Inactive
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Email</p>
                    <p className='text-sm text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.phone && (
                  <div className='flex items-center gap-3'>
                    <Phone className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>Phone</p>
                      <p className='text-sm text-muted-foreground'>
                        {user.phone}
                      </p>
                    </div>
                  </div>
                )}

                {user.address && (
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>Address</p>
                      <p className='text-sm text-muted-foreground'>
                        {user.address}
                      </p>
                    </div>
                  </div>
                )}

                {user.department && (
                  <div className='flex items-center gap-3'>
                    <Building className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>Department</p>
                      <p className='text-sm text-muted-foreground'>
                        {user.department}
                      </p>
                    </div>
                  </div>
                )}

                <div className='flex items-center gap-3'>
                  <Shield className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Role</p>
                    <p className='text-sm text-muted-foreground'>
                      {user.role || 'Staff'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Member Since</p>
                    <p className='text-sm text-muted-foreground'>
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                {user.lastLoginAt && (
                  <div className='flex items-center gap-3'>
                    <User className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>Last Login</p>
                      <p className='text-sm text-muted-foreground'>
                        {formatDate(user.lastLoginAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                <DialogTrigger asChild>
                  <Button className='w-full' variant='outline'>
                    <Edit3 className='h-4 w-4 mr-2' />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <EditUserForm
                    user={user}
                    closeModal={() => setOpenEditModal(false)}
                    setUser={setUser}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
