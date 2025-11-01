import { useEffect, useState } from 'react'

export function useTimeCount() {
  const date = new Date(Date.now())
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  const [time, setTime] = useState(new Date().toLocaleTimeString('vi-VN'))
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('vi-VN')
      setTime(timeString)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return { date: formatter.format(date), time }
}