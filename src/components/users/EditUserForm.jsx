import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { toast } from 'sonner'
import { userApi } from '~/apis'
import { useState, useEffect } from 'react'

const formSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must be at most 50 characters'
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address'
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Phone number must be between 10 and 15 digits'
    }),
  role: Joi.string().valid('admin', 'manager', 'user').required().messages({
    'string.empty': 'Role is required',
    'any.only': 'Role must be admin, manager, or user'
  }),
  status: Joi.string().valid('active', 'inactive').required().messages({
    'string.empty': 'Status is required',
    'any.only': 'Status must be active or inactive'
  })
})

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'user', label: 'User' }
]

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

export default function EditUserForm({
  user,
  setCountUpdate,
  closeModal,
  setUser
}) {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'user')
  const [selectedStatus, setSelectedStatus] = useState(
    user?.status || (user?.deletedAt ? 'inactive' : 'active')
  )

  const form = useForm({
    resolver: joiResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'user',
      status: user?.status || (user?.deletedAt ? 'inactive' : 'active')
    }
  })

  const { register, handleSubmit, formState, setValue } = form
  const { errors, isSubmitting } = formState

  useEffect(() => {
    setValue('role', selectedRole)
    setValue('status', selectedStatus)
  }, [selectedRole, selectedStatus, setValue])

  const onSubmit = async (data) => {
    const toastId = toast.loading('Saving changes...')
    try {
      // Update user
      const res = await userApi.update(user.id, {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role
      })

      // Handle status change separately if needed
      if (
        data.status !==
        (user?.status || (user?.deletedAt ? 'inactive' : 'active'))
      ) {
        if (data.status === 'active') {
          await userApi.activate(user.id)
        } else {
          await userApi.deactivate(user.id)
        }
      }

      // If backend indicates failure in body, throw to go to catch
      if (
        res &&
        (res.success === false || res.status === 'error' || res.error)
      ) {
        throw new Error(res.message || res.error || 'Failed to update user.')
      }

      if (setUser) {
        setUser({ ...user, ...data })
      }
      if (setCountUpdate) {
        setCountUpdate((count) => count + 1)
      }

      toast.success('User updated successfully!', { id: toastId })
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Failed to update user.', { id: toastId })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>
          Make changes to the user account here. Click save when you&apos;re
          done.
        </DialogDescription>
      </DialogHeader>

      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='fullName'>Full Name</Label>
          <Input
            id='fullName'
            {...register('fullName')}
            aria-invalid={errors.fullName ? 'true' : 'false'}
          />
          {errors.fullName && (
            <p className='text-sm text-red-600'>{errors.fullName.message}</p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className='text-sm text-red-600'>{errors.email.message}</p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='phone'>Phone</Label>
          <Input
            id='phone'
            type='tel'
            {...register('phone')}
            aria-invalid={errors.phone ? 'true' : 'false'}
            placeholder='Optional'
          />
          {errors.phone && (
            <p className='text-sm text-red-600'>{errors.phone.message}</p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='role'>Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className='text-sm text-red-600'>{errors.role.message}</p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='status'>Status</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className='text-sm text-red-600'>{errors.status.message}</p>
          )}
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant='outline' type='button'>
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogFooter>
    </form>
  )
}
