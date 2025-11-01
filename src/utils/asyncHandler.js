import { toast } from 'sonner'

export const asyncHandler = async (promise, toastCaption = '') => {
  let toastId = ''
  if (toastCaption) toastId = toast.loading(toastCaption)

  try {
    const res = await promise
    if (res?.error) return [null, res.error]
    return [res, null]
  } catch (err) {
    return [null, err]
  } finally {
    if (toastCaption) toast.dismiss(toastId)
  }
}
