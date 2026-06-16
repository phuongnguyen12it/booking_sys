import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useBooking } from '../context/useBooking'

function toDateTimeLocalValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

export function BookingForm() {
  const { authUser, createBooking, isSubmitting, selectedRoom, selectedRoomId } = useBooking()
  const [serverErrors, setServerErrors] = useState({})
  const [minimumStartTime, setMinimumStartTime] = useState(() => toDateTimeLocalValue())
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      user_name: '',
      start_time: '',
      end_time: '',
    },
  })

  const startTime = watch('start_time')

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMinimumStartTime(toDateTimeLocalValue())
    }, 30000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    setServerErrors({})
    reset({
      user_name: '',
      start_time: '',
      end_time: '',
    })
  }, [reset, selectedRoomId])

  async function onSubmit(values) {
    setServerErrors({})

    try {
      await createBooking({
        room_id: selectedRoomId,
        user_name: values.user_name.trim(),
        start_time: values.start_time,
        end_time: values.end_time,
      })
      reset()
    } catch (requestError) {
      setServerErrors(requestError.errors || { form: [requestError.message] })
    }
  }

  return (
    <section className="form-panel" aria-labelledby="booking-form-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">New booking</p>
          <h2 id="booking-form-title">Reserve time</h2>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>User name</span>
          <input
            disabled={!selectedRoom || !authUser || isSubmitting}
            placeholder="Jane Doe"
            type="text"
            {...register('user_name', {
              required: 'User name is required.',
              maxLength: {
                value: 255,
                message: 'User name must be 255 characters or fewer.',
              },
              validate: (value) => value.trim().length > 0 || 'User name is required.',
            })}
          />
          <FieldError message={errors.user_name?.message || serverErrors.user_name?.[0]} />
        </label>

        <label>
          <span>Start time</span>
          <input
            disabled={!selectedRoom || !authUser || isSubmitting}
            min={minimumStartTime}
            type="datetime-local"
            {...register('start_time', {
              required: 'Start time is required.',
              validate: (value) =>
                value > toDateTimeLocalValue() || 'Start time must be in the future.',
            })}
          />
          <FieldError message={errors.start_time?.message || serverErrors.start_time?.[0]} />
        </label>

        <label>
          <span>End time</span>
          <input
            disabled={!selectedRoom || !authUser || isSubmitting}
            min={startTime || minimumStartTime}
            type="datetime-local"
            {...register('end_time', {
              required: 'End time is required.',
              validate: (value) =>
                !startTime || value > startTime || 'End time must be after start time.',
            })}
          />
          <FieldError message={errors.end_time?.message || serverErrors.end_time?.[0]} />
        </label>

        <FieldError message={serverErrors.form?.[0]} />

        <button className="primary-button" disabled={!selectedRoom || !authUser || isSubmitting} type="submit">
          {isSubmitting ? 'Creating...' : 'Create booking'}
        </button>
      </form>
    </section>
  )
}

function FieldError({ message }) {
  if (!message) {
    return null
  }

  return <small className="field-error">{message}</small>
}
