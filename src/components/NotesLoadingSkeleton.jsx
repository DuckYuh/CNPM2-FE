import { Card, CardContent, CardHeader } from '~/components/ui/card'

export function NotesLoadingSkeleton() {
  return (
    <div className='space-y-4'>
      {[1, 2, 3].map((i) => (
        <Card key={i} className='animate-pulse'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 bg-muted rounded-full' />
                <div className='space-y-1'>
                  <div className='h-4 w-20 bg-muted rounded' />
                  <div className='h-3 w-16 bg-muted rounded' />
                </div>
              </div>
              <div className='h-8 w-8 bg-muted rounded' />
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='space-y-2'>
              <div className='h-4 w-full bg-muted rounded' />
              <div className='h-4 w-3/4 bg-muted rounded' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}