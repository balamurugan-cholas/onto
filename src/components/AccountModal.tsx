import { useState } from 'react'
import { accountApi, accountDeviceId, saveAccount, type AccountUser } from '../lib/account'

type Mode = 'login' | 'signup' | 'forgot' | 'reset'

interface FieldErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

export default function AccountModal({ open, worker, onClose, onSignedIn }: { open: boolean; worker: string; onClose: () => void; onSignedIn: (user: AccountUser) => void }) {
  const resetToken = new URLSearchParams(window.location.search).get('resetToken') || ''
  const [mode, setMode] = useState<Mode>(resetToken ? 'reset' : 'login')
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('')
  if (!open && !resetToken) return null

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setError('')
    setMessage('')
    setFieldErrors({})
  }

  const close = () => {
    if (resetToken) {
      const url = new URL(window.location.href)
      url.searchParams.delete('resetToken')
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
    }
    setMode('login')
    setError('')
    setMessage('')
    setFieldErrors({})
    onClose()
  }

  const validate = () => {
    const errors: FieldErrors = {}
    if (mode !== 'reset') {
      if (!email.trim()) {
        errors.email = 'Please enter your email.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.email = 'Please enter a valid email address.'
      }
    }
    if (mode !== 'forgot') {
      if (!password) {
        errors.password = 'Please enter your password.'
      } else if ((mode === 'signup' || mode === 'reset') && password.length < 8) {
        errors.password = 'Password must be at least 8 characters.'
      }
    }
    if (mode === 'reset') {
      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your new password.'
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.'
      }
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    setBusy(true)
    setError('')
    setMessage('')
    try {
      if (mode === 'forgot') {
        const result = await accountApi<{ message: string }>(worker, '/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: email.trim() }) })
        setMessage(result.message)
        return
      }
      if (mode === 'reset') {
        if (password !== confirmPassword) throw new Error('Passwords do not match.')
        const result = await accountApi<{ message: string }>(worker, '/auth/reset-password', { method: 'POST', body: JSON.stringify({ token: resetToken, password }) })
        const url = new URL(window.location.href)
        url.searchParams.delete('resetToken')
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
        setPassword('')
        setConfirmPassword('')
        setMode('login')
        setMessage(result.message)
        return
      }
      const result = await accountApi<{ token: string; user: AccountUser }>(worker, `/auth/${mode}`, { method: 'POST', body: JSON.stringify({ email: email.trim(), password, deviceId: accountDeviceId(), deviceLabel: navigator.platform || 'Browser' }) })
      saveAccount(result.token)
      onSignedIn(result.user)
      close()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to continue.')
    } finally {
      setBusy(false)
    }
  }

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Reset your password' : 'Choose a new password'
  return <div className="account-backdrop" role="dialog" aria-modal="true" aria-label="Pluginverse account">
    <form className="account-card" noValidate onSubmit={submit}>
      <button className="account-close" type="button" onClick={close}>×</button>
      <h2>{title}</h2>
      {(mode === 'forgot' || mode === 'reset') && (
        <p>
          {mode === 'forgot'
            ? 'Enter your account email and we’ll send a secure reset link.'
            : 'After this change, every signed-in device will be logged out.'}
        </p>
      )}

      {mode !== 'reset' && (
        <div className="account-field">
          <label htmlFor="account-email">Email</label>
          <input
            id="account-email"
            autoFocus
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }))
            }}
            className={fieldErrors.email ? 'has-error' : ''}
          />
          {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
        </div>
      )}

      {mode !== 'forgot' && (
        <div className="account-field">
          <label htmlFor="account-password">{mode === 'reset' ? 'New password' : 'Password'}</label>
          <input
            id="account-password"
            autoFocus={mode === 'reset'}
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }))
            }}
            className={fieldErrors.password ? 'has-error' : ''}
          />
          {fieldErrors.password && <span className="field-error-text">{fieldErrors.password}</span>}
        </div>
      )}

      {mode === 'reset' && (
        <div className="account-field">
          <label htmlFor="account-confirm-password">Confirm new password</label>
          <input
            id="account-confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value)
              if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }))
            }}
            className={fieldErrors.confirmPassword ? 'has-error' : ''}
          />
          {fieldErrors.confirmPassword && <span className="field-error-text">{fieldErrors.confirmPassword}</span>}
        </div>
      )}

      {error && <div className="account-error-banner">{error}</div>}
      {message && <div className="account-success">{message}</div>}

      <button className="account-submit" disabled={busy || Boolean(message && mode === 'forgot')}>
        {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Change password'}
      </button>

      {mode === 'login' && (
        <div className="account-switch-row">
          <button className="account-switch" type="button" onClick={() => switchMode('forgot')}>
            Forgot password?
          </button>
          <button className="account-switch" type="button" onClick={() => switchMode('signup')}>
            Create an account
          </button>
        </div>
      )}

      {mode === 'signup' && (
        <div className="account-switch-row is-center">
          <button className="account-switch" type="button" onClick={() => switchMode('login')}>
            Already have an account? Sign in
          </button>
        </div>
      )}

      {mode === 'forgot' && (
        <div className="account-switch-row is-center">
          <button className="account-switch" type="button" onClick={() => switchMode('login')}>
            Back to sign in
          </button>
        </div>
      )}
    </form>
  </div>
}
