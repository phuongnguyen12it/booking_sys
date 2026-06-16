const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed')
    error.errors = data.errors || {}
    error.status = response.status
    throw error
  }

  return data
}

export function getRooms() {
  return request('/rooms')
}

export function getRoomBookings(roomId) {
  return request(`/rooms/${roomId}/bookings`)
}

export function createBooking(payload) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function deleteBooking(bookingId) {
  return request(`/bookings/${bookingId}`, {
    method: 'DELETE',
  })
}
