import { useState } from 'react'
import { useBooking } from '../context/useBooking'

export function AuthPanel() {
  const { authUser, isAuthenticating, login, logout } = useBooking()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      await login({ email, password })
    } catch (requestError) {
      setError(requestError.errors?.email?.[0] || requestError.message)
    }
  }

  if (authUser) {
    return (
      <div className="auth-panel">
        <p className="eyebrow">Admin</p>
        <strong>{authUser.name}</strong>
        <small>{authUser.email}</small>
        <button className="ghost-button" onClick={logout} type="button">
          Sign out
        </button>
      </div>
    )
  }

  return (
    <form className="auth-panel" onSubmit={handleSubmit}>
      <p className="eyebrow">Admin token</p>
      <label>
        <span>Email</span>
        <input
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
      </label>
      <label>
        <span>Password</span>
        <input
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </label>
      {error ? <small className="auth-error">{error}</small> : null}
      <button className="ghost-button" disabled={isAuthenticating} type="submit">
        {isAuthenticating ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
