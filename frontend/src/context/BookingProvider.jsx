import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createBooking as createBookingRequest,
  deleteBooking as deleteBookingRequest,
  getRoomBookings,
  getRooms,
} from '../api'
import { BookingContext } from './bookingContext'

export function BookingProvider({ children }) {
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [bookings, setBookings] = useState([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId],
  )

  const loadRooms = useCallback(async () => {
    setIsLoadingRooms(true)
    setError('')

    try {
      const response = await getRooms()
      setRooms(response.data)
      setSelectedRoomId((currentRoomId) => currentRoomId ?? response.data[0]?.id ?? null)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoadingRooms(false)
    }
  }, [])

  const loadBookings = useCallback(async (roomId) => {
    if (!roomId) {
      setBookings([])
      return
    }

    setIsLoadingBookings(true)
    setError('')

    try {
      const response = await getRoomBookings(roomId)
      setBookings(response.data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoadingBookings(false)
    }
  }, [])

  const createBooking = useCallback(
    async (payload) => {
      setIsSubmitting(true)
      setError('')

      try {
        await createBookingRequest(payload)
        await loadBookings(payload.room_id)
      } finally {
        setIsSubmitting(false)
      }
    },
    [loadBookings],
  )

  const deleteBooking = useCallback(
    async (bookingId) => {
      if (!selectedRoomId) {
        return
      }

      setError('')
      await deleteBookingRequest(bookingId)
      await loadBookings(selectedRoomId)
    },
    [loadBookings, selectedRoomId],
  )

  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  useEffect(() => {
    loadBookings(selectedRoomId)
  }, [loadBookings, selectedRoomId])

  const value = useMemo(
    () => ({
      bookings,
      createBooking,
      deleteBooking,
      error,
      isLoadingBookings,
      isLoadingRooms,
      isSubmitting,
      rooms,
      selectedRoom,
      selectedRoomId,
      setSelectedRoomId,
    }),
    [
      bookings,
      createBooking,
      deleteBooking,
      error,
      isLoadingBookings,
      isLoadingRooms,
      isSubmitting,
      rooms,
      selectedRoom,
      selectedRoomId,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
