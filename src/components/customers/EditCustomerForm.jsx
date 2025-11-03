import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '../ui'
import { toast } from 'sonner'
import { customerApi } from '~/apis'

const formSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 30 characters'
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
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be between 10 and 15 digits'
    }),
  address: Joi.string().max(100).allow('').messages({
    'string.max': 'Address must be at most 100 characters'
  }),
  description: Joi.string().max(500).allow('').messages({
    'string.max': 'Description must be at most 500 characters'
  })
})

export default function EditCustomerForm({
  customer,
  setCountUpdate,
  closeModal
}) {
  const form = useForm({
    resolver: joiResolver(formSchema),
    defaultValues: {
      fullname: customer?.fullname || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      description: customer?.description || ''
    }
  })

  const { register, handleSubmit, formState } = form
  const { errors, isSubmitting } = formState

  const onSubmit = async (data) => {
    toast.promise(customerApi.update(customer.id, data), {
      loading: 'Saving changes...',
      success: () => {
        setCountUpdate((prev) => prev + 1)
        return 'Customer updated successfully!'
      },
      error: 'Failed to update customer.'
    })
    closeModal()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to the customer here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='name'>Full Name</Label>
          <Input
            id='fullname'
            {...register('fullname')}
            aria-invalid={errors.fullname ? 'true' : 'false'}
          />
          {errors.fullname && (
            <p className='text-sm text-red-600'>{errors.fullname.message}</p>
          )}
        </div>

        <div className='grid gap-3'>
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

        <div className='grid gap-3'>
          <Label htmlFor='phone'>Phone</Label>
          <Input
            id='phone'
            type='tel'
            {...register('phone')}
            aria-invalid={errors.phone ? 'true' : 'false'}
          />
          {errors.phone && (
            <p className='text-sm text-red-600'>{errors.phone.message}</p>
          )}
        </div>

        <div className='grid gap-3'>
          <Label htmlFor='address'>Address</Label>
          <Input
            id='address'
            {...register('address')}
            aria-invalid={errors.address ? 'true' : 'false'}
          />
          {errors.address && (
            <p className='text-sm text-red-600'>{errors.address.message}</p>
          )}
        </div>

        <div className='grid gap-3'>
          <Label htmlFor='description'>Description</Label>
          <textarea
            id='description'
            {...register('description')}
            className='min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          />
          {errors.description && (
            <p className='text-sm text-red-600'>{errors.description.message}</p>
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
