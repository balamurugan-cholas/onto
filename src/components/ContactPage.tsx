import { useState } from 'react'
import { ACCENT } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'

type Status = 'idle' | 'sending' | 'sent' | 'error'
const CONTACT_ENDPOINT = 'https://vplay-download.balamuruganofficial3.workers.dev/contact'
const SUPPORT_EMAIL = 'balamuruganofficial3@gmail.com'

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%',
    background: '#FFFFFF',
    border: `1px solid ${focused ? '#000000' : 'rgba(0,0,0,0.14)'}`,
    borderRadius: '2px',
    color: '#111111',
    fontSize: '0.84rem',
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    padding: '11px 14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }
}

const LABEL: React.CSSProperties = {
  color: 'rgba(0,0,0,0.55)',
  fontSize: '0.58rem',
  letterSpacing: '0.14em',
  fontWeight: 600,
}

function SentState() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: '2rem', color: '#111111', margin: 0 }}>MESSAGE SENT.</h2>
      <p style={{ color: 'rgba(0,0,0,0.65)', fontSize: '0.88rem', fontWeight: 500, margin: 0 }}>We'll get back to you within 24 hours.</p>
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const { isMobile, isTablet } = useResponsive()

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, website: '' }),
      })
      if (!response.ok) throw new Error('Message delivery failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') return <SentState />

  const px = isMobile ? '20px' : '48px'

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '0',
        padding: `0 ${px}`,
        minHeight: 0,
        position: 'relative',
        zIndex: 10,
        overflowY: isMobile ? 'auto' : 'hidden',
        scrollbarWidth: 'none',
      }}
    >
      {/* Info panel */}
      <div
        style={{
          width: isMobile ? '100%' : isTablet ? '260px' : '300px',
          flexShrink: 0,
          paddingRight: isMobile ? '0' : '48px',
          paddingTop: isMobile ? '16px' : '28px',
          paddingBottom: isMobile ? '20px' : '0',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '20px' : '28px',
        }}
      >
        {/* Title */}
        <div>
          <div style={{ background: '#000000', display: 'inline-block', padding: '7px 12px', marginBottom: '10px' }}>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: isMobile ? '1.6rem' : '1.9rem', lineHeight: 1, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              GET IN TOUCH.
            </h1>
          </div>
          <p style={{ color: 'rgba(0,0,0,0.72)', fontSize: '0.82rem', fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
            Questions about a plugin, licensing, or a feature request? We read every message.
          </p>
        </div>

        {/* Contact details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
              label: 'EMAIL', value: SUPPORT_EMAIL,
            },
            {
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
              label: 'RESPONSE TIME', value: 'Within 24 hours',
            },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ marginTop: '1px', flexShrink: 0 }}>{icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ color: 'rgba(0,0,0,0.52)', fontSize: '0.56rem', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</span>
                {label === 'EMAIL' ? (
                  <a href={`mailto:${value}`} style={{ color: '#000000', fontSize: '0.8rem', fontWeight: 600 }}>{value}</a>
                ) : (
                  <span style={{ color: '#000000', fontSize: '0.8rem', fontWeight: 600 }}>{value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isMobile && <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} />}

        {/* Tags */}
        {!isMobile && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Plugin Support', 'Licensing', 'Feature Request', 'Bug Report', 'Partnership'].map((tag) => (
              <span key={tag} style={{ padding: '4px 9px', border: '1px solid rgba(0,0,0,0.14)', color: 'rgba(0,0,0,0.72)', fontSize: '0.66rem', fontWeight: 500, borderRadius: '2px', letterSpacing: '0.03em', background: '#FFFFFF' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        style={{
          flex: 1,
          paddingTop: isMobile ? '0' : '28px',
          paddingBottom: isMobile ? '24px' : '15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          borderLeft: isMobile ? 'none' : '1px solid rgba(0,0,0,0.08)',
          paddingLeft: isMobile ? '0' : '48px',
          overflowY: isMobile ? 'visible' : 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {/* Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
          {(['name', 'email'] as const).map((field) => (
            <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={LABEL}>{field.toUpperCase()}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                required
                value={form[field]}
                onChange={set(field)}
                placeholder={field === 'name' ? 'Your name' : 'you@example.com'}
                style={inputStyle(focused === field)}
                onFocus={() => setFocused(field)}
                onBlur={() => setFocused(null)}
              />
            </div>
          ))}
        </div>

        {/* Subject */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={LABEL}>SUBJECT</label>
          <select
            required
            value={form.subject}
            onChange={set('subject')}
            style={{
              ...inputStyle(focused === 'subject'),
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(0,0,0,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              cursor: 'pointer',
            }}
            onFocus={() => setFocused('subject')}
            onBlur={() => setFocused(null)}
          >
            <option value="" disabled style={{ background: '#FFFFFF', color: 'rgba(0,0,0,0.4)' }}>Select a topic…</option>
            {['Plugin Support', 'Licensing Question', 'Feature Request', 'Bug Report', 'Partnership', 'Other'].map((opt) => (
              <option key={opt} value={opt.toLowerCase().replace(' ', '_')} style={{ background: '#FFFFFF', color: '#111111' }}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: isMobile ? 'none' : 1 }}>
          <label style={LABEL}>MESSAGE</label>
          <textarea
            required
            value={form.message}
            onChange={set('message')}
            placeholder="Describe your question or issue in detail…"
            style={{
              ...inputStyle(focused === 'message'),
              resize: 'none',
              flex: isMobile ? 'none' : 1,
              minHeight: isMobile ? '120px' : '100px',
            }}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'sending'}
          style={{
            alignSelf: 'flex-end',
            padding: '11px 30px',
            background: '#000000',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            opacity: status === 'sending' ? 0.7 : 1,
            transition: 'opacity 0.2s',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={(e) => { if (status !== 'sending') e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={(e) => { if (status !== 'sending') e.currentTarget.style.opacity = '1' }}
        >
          {status === 'sending' ? 'SENDING…' : 'SEND MESSAGE'}
        </button>
        {status === 'error' && (
          <p role="alert" style={{ margin: 0, color: '#a40000', fontSize: '0.75rem', textAlign: 'right' }}>
            Message could not be delivered. Email us directly at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
        )}
      </form>
    </div>
  )
}
