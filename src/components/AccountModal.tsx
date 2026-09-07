import { useState } from 'react'
import { accountApi, accountDeviceId, saveAccount, type AccountUser } from '../lib/account'

export default function AccountModal({ open, worker, onClose, onSignedIn }: { open: boolean; worker: string; onClose: () => void; onSignedIn: (user: AccountUser) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false), [error, setError] = useState('')
  if (!open) return null
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const result = await accountApi<{ token: string; user: AccountUser }>(worker, `/auth/${mode}`, { method: 'POST', body: JSON.stringify({ email, password, deviceId: accountDeviceId(), deviceLabel: navigator.platform || 'Browser' }) })
      saveAccount(result.token); onSignedIn(result.user); onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to sign in.') } finally { setBusy(false) }
  }
  return <div className="account-backdrop" role="dialog" aria-modal="true" aria-label="VPlay account">
    <form className="account-card" onSubmit={submit}>
      <button className="account-close" type="button" onClick={onClose}>×</button>
      <span className="account-kicker">ONTO ACCOUNT</span>
      <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
      <p>Access your purchases and installers on up to two devices.</p>
      <label>Email<input autoFocus type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} value={password} onChange={e => setPassword(e.target.value)} required /></label>
      {error && <div className="account-error">{error}</div>}
      <button className="account-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      <button className="account-switch" type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button>
    </form>
  </div>
}
