import { useBooking } from '../context/useBooking'

export function RoomList() {
  const { isLoadingRooms, rooms, selectedRoomId, setSelectedRoomId } = useBooking()

  return (
    <aside className="sidebar" aria-label="Rooms">
      <div className="panel-heading">
        <p className="eyebrow">Rooms</p>
        <h1>Bookings</h1>
      </div>

      {isLoadingRooms ? (
        <p className="muted">Loading rooms...</p>
      ) : (
        <div className="room-list">
          {rooms.map((room) => (
            <button
              className={`room-item ${room.id === selectedRoomId ? 'active' : ''}`}
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              type="button"
            >
              <span>{room.name}</span>
              <small>{room.capacity} seats</small>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
