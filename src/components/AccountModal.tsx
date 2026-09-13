import { useState } from 'react'
import { accountApi, accountDeviceId, saveAccount, type AccountUser } from '../lib/account'

type Mode = 'login' | 'signup' | 'forgot' | 'reset'

export default function AccountModal({ open, worker, onClose, onSignedIn }: { open: boolean; worker: string; onClose: () => void; onSignedIn: (user: AccountUser) => void }) {
  const resetToken = new URLSearchParams(window.location.search).get('resetToken') || ''
  const [mode, setMode] = useState<Mode>(resetToken ? 'reset' : 'login')
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('')
  if (!open && !resetToken) return null

  const close = () => {
    if (resetToken) {
      const url = new URL(window.location.href)
      url.searchParams.delete('resetToken')
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
    }
    setMode('login'); setError(''); setMessage(''); onClose()
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try {
      if (mode === 'forgot') {
        const result = await accountApi<{ message: string }>(worker, '/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
        setMessage(result.message)
        return
      }
      if (mode === 'reset') {
        if (password !== confirmPassword) throw new Error('Passwords do not match.')
        const result = await accountApi<{ message: string }>(worker, '/auth/reset-password', { method: 'POST', body: JSON.stringify({ token: resetToken, password }) })
        const url = new URL(window.location.href)
        url.searchParams.delete('resetToken')
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
        setPassword(''); setConfirmPassword(''); setMode('login'); setMessage(result.message)
        return
      }
      const result = await accountApi<{ token: string; user: AccountUser }>(worker, `/auth/${mode}`, { method: 'POST', body: JSON.stringify({ email, password, deviceId: accountDeviceId(), deviceLabel: navigator.platform || 'Browser' }) })
      saveAccount(result.token); onSignedIn(result.user); close()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to continue.') } finally { setBusy(false) }
  }

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Reset your password' : 'Choose a new password'
  return <div className="account-backdrop" role="dialog" aria-modal="true" aria-label="Pluginverse account">
    <form className="account-card" onSubmit={submit}>
      <button className="account-close" type="button" onClick={close}>×</button>
      <span className="account-kicker">PLUGINVERSE ACCOUNT</span>
      <h2>{title}</h2>
      <p>{mode === 'forgot' ? 'Enter your account email and we’ll send a secure reset link.' : mode === 'reset' ? 'After this change, every signed-in device will be logged out.' : 'Access your purchases and installers on up to two devices.'}</p>
      {mode !== 'reset' && <label>Email<input autoFocus type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>}
      {mode !== 'forgot' && <label>{mode === 'reset' ? 'New password' : 'Password'}<input autoFocus={mode === 'reset'} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} value={password} onChange={e => setPassword(e.target.value)} required /></label>}
      {mode === 'reset' && <label>Confirm new password<input type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></label>}
      {error && <div className="account-error">{error}</div>}
      {message && <div className="account-success">{message}</div>}
      <button className="account-submit" disabled={busy || Boolean(message && mode === 'forgot')}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Change password'}</button>
      {mode === 'login' && <button className="account-switch" type="button" onClick={() => { setMode('forgot'); setError(''); setMessage('') }}>Forgot password?</button>}
      {mode !== 'reset' && <button className="account-switch" type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}>{mode === 'login' ? 'New here? Create an account' : 'Back to sign in'}</button>}
    </form>
  </div>
}
