const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

async function request(path, options = {}) {
  const { token, ...fetchOptions } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
    ...fetchOptions,
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
  const { token, ...bookingPayload } = payload

  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingPayload),
    token,
  })
}

export function deleteBooking(bookingId, token) {
  return request(`/bookings/${bookingId}`, {
    method: 'DELETE',
    token,
  })
}

export function createToken(payload) {
  return request('/auth/token', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function revokeToken(token) {
  return request('/auth/token', {
    method: 'DELETE',
    token,
  })
}
