import { useBooking } from '../context/useBooking'

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatDateTime(value) {
  return dateTimeFormatter.format(new Date(value))
}

export function BookingList() {
  const { bookings, deleteBooking, isLoadingBookings, selectedRoom } = useBooking()

  return (
    <section className="bookings-panel" aria-labelledby="bookings-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Current schedule</p>
          <h2 id="bookings-title">{selectedRoom?.name ?? 'Select a room'}</h2>
        </div>
        {selectedRoom ? <span className="capacity">{selectedRoom.capacity} seats</span> : null}
      </div>

      {isLoadingBookings ? (
        <p className="muted">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="empty-state">No bookings for this room yet.</div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article className="booking-item" key={booking.id}>
              <div>
                <h3>{booking.user_name}</h3>
                <p>
                  {formatDateTime(booking.start_time)} to {formatDateTime(booking.end_time)}
                </p>
              </div>
              <button
                className="danger-button"
                onClick={() => deleteBooking(booking.id)}
                type="button"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
