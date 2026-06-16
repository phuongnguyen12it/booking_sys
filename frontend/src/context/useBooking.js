import { useContext } from 'react'
import { BookingContext } from './bookingContext'

export function useBooking() {
  const context = useContext(BookingContext)

  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }

  return context
}
