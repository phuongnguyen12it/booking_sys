import { BookingForm } from './components/BookingForm'
import { BookingList } from './components/BookingList'
import { RoomList } from './components/RoomList'
import { BookingProvider } from './context/BookingProvider'
import { useBooking } from './context/useBooking'
import './App.css'

function App() {
  return (
    <BookingProvider>
      <BookingWorkspace />
    </BookingProvider>
  )
}

function BookingWorkspace() {
  const { error } = useBooking()

  return (
    <main className="app-shell">
      <RoomList />
      <div className="workspace">
        {error ? <div className="alert">{error}</div> : null}
        <BookingList />
        <BookingForm />
      </div>
    </main>
  )
}

export default App
