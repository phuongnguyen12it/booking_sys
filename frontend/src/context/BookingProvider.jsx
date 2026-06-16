import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createBooking as createBookingRequest,
  createToken,
  deleteBooking as deleteBookingRequest,
  getRoomBookings,
  getRooms,
  revokeToken,
} from '../api'
import { BookingContext } from './bookingContext'

const AUTH_STORAGE_KEY = 'booking_admin_auth'

export function BookingProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return storedAuth ? JSON.parse(storedAuth) : null
  })
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [bookings, setBookings] = useState([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState('')

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId],
  )
  const authToken = auth?.token ?? ''
  const authUser = auth?.user ?? null

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
      if (!authToken) {
        throw new Error('Please sign in before creating a booking.')
      }

      setIsSubmitting(true)
      setError('')

      try {
        await createBookingRequest({
          ...payload,
          token: authToken,
        })
        await loadBookings(payload.room_id)
      } finally {
        setIsSubmitting(false)
      }
    },
    [authToken, loadBookings],
  )

  const deleteBooking = useCallback(
    async (bookingId) => {
      if (!selectedRoomId) {
        return
      }

      if (!authToken) {
        setError('Please sign in before deleting a booking.')
        return
      }

      setError('')
      await deleteBookingRequest(bookingId, authToken)
      await loadBookings(selectedRoomId)
    },
    [authToken, loadBookings, selectedRoomId],
  )

  const login = useCallback(async (credentials) => {
    setIsAuthenticating(true)
    setError('')

    try {
      const response = await createToken(credentials)
      const nextAuth = {
        token: response.data.token,
        user: response.data.user,
      }
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth))
      setAuth(nextAuth)
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const logout = useCallback(async () => {
    const token = authToken
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuth(null)

    if (token) {
      try {
        await revokeToken(token)
      } catch {
        // The local session is already cleared; token revocation is best-effort.
      }
    }
  }, [authToken])

  useEffect(() => {
    if (!auth) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
  }, [auth])

  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  useEffect(() => {
    loadBookings(selectedRoomId)
  }, [loadBookings, selectedRoomId])

  const value = useMemo(
    () => ({
      bookings,
      authUser,
      createBooking,
      deleteBooking,
      error,
      isAuthenticating,
      isLoadingBookings,
      isLoadingRooms,
      isSubmitting,
      login,
      logout,
      rooms,
      selectedRoom,
      selectedRoomId,
      setSelectedRoomId,
    }),
    [
      bookings,
      authUser,
      createBooking,
      deleteBooking,
      error,
      isAuthenticating,
      isLoadingBookings,
      isLoadingRooms,
      isSubmitting,
      login,
      logout,
      rooms,
      selectedRoom,
      selectedRoomId,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
