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
  fullname: Joi.string().min(2).max(50).required().messages({
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
  password: Joi.string().min(6).max(50).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must be at most 50 characters'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.empty': 'Confirm password is required',
    'any.only': 'Passwords do not match'
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
  })
})

const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' }
]

export default function AddUserForm({ setCountUpdate, closeModal }) {
  const [selectedRole, setSelectedRole] = useState('user')

  const form = useForm({
    resolver: joiResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'user'
    }
  })

  const { register, handleSubmit, formState, setValue } = form
  const { errors, isSubmitting } = formState

  useEffect(() => {
    setValue('role', selectedRole)
  }, [selectedRole, setValue])

  const onSubmit = async (data) => {
    const toastId = toast.loading('Creating user...')
    try {
      const userData = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role
      }

      const res = await userApi.create(userData)

      // If backend indicates failure in body, throw to go to catch
      if (
        res &&
        (res.success === false || res.status === 'error' || res.error)
      ) {
        throw new Error(res.message || res.error || 'Failed to create user.')
      }

      if (setCountUpdate) {
        setCountUpdate((count) => count + 1)
      }

      toast.success('User created successfully!', { id: toastId })
      closeModal()
    } catch (err) {
      toast.error(err?.message || 'Failed to create user.', { id: toastId })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
        <DialogDescription>
          Create a new user account. They will be able to log in with these
          credentials.
        </DialogDescription>
      </DialogHeader>

      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='fullname'>Full Name</Label>
          <Input
            id='fullname'
            {...register('fullname')}
            aria-invalid={errors.fullname ? 'true' : 'false'}
            placeholder='Enter full name'
          />
          {errors.fullname && (
            <p className='text-sm text-red-600'>{errors.fullname.message}</p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            placeholder='Enter email address'
          />
          {errors.email && (
            <p className='text-sm text-red-600'>{errors.email.message}</p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
            placeholder='Enter password'
          />
          {errors.password && (
            <p className='text-sm text-red-600'>{errors.password.message}</p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            id='confirmPassword'
            type='password'
            {...register('confirmPassword')}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            placeholder='Confirm password'
          />
          {errors.confirmPassword && (
            <p className='text-sm text-red-600'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='phone'>Phone</Label>
          <Input
            id='phone'
            type='tel'
            {...register('phone')}
            aria-invalid={errors.phone ? 'true' : 'false'}
            placeholder='Enter phone number (optional)'
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
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant='outline' type='button'>
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </DialogFooter>
    </form>
  )
}
