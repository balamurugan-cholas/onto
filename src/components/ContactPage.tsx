import React, { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'

type Status = 'idle' | 'sending' | 'sent' | 'error'
const CONTACT_ENDPOINT = 'https://vplay-download.balamuruganofficial3.workers.dev/contact'
const SUPPORT_EMAIL = 'balamuruganofficial3@gmail.com'

function SentState() {
  return (
    <div className="contact-sent-state">
      <div className="contact-sent-icon">✓</div>
      <h2 className="contact-sent-title">MESSAGE SENT</h2>
      <p className="contact-sent-desc">We'll get back to you within 24 hours.</p>
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const { isMobile } = useResponsive()

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('Failed to send')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="editorial-subpage-container">
      <div className="editorial-subpage-header">
        <span className="editorial-subpage-kicker">SUPPORT & INQUIRIES</span>
        <h1 className="editorial-subpage-title">Get in Touch.</h1>
      </div>

      <div className="editorial-form-card">
        {status === 'sent' ? (
          <SentState />
        ) : (
          <form onSubmit={submit} className="editorial-contact-form">
            <div className="form-two-col">
              <div className="form-field-group">
                <label className="form-label">YOUR NAME</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alex Miller"
                  value={form.name}
                  onChange={set('name')}
                  className="form-input"
                />
              </div>
              <div className="form-field-group">
                <label className="form-label">YOUR EMAIL</label>
                <input
                  required
                  type="email"
                  placeholder="alex@example.com"
                  value={form.email}
                  onChange={set('email')}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-label">SUBJECT</label>
              <input
                required
                type="text"
                placeholder="License inquiry, bug report, feedback..."
                value={form.subject}
                onChange={set('subject')}
                className="form-input"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">MESSAGE</label>
              <textarea
                required
                rows={5}
                placeholder="Describe what we can help you with..."
                value={form.message}
                onChange={set('message')}
                className="form-input form-textarea"
              />
            </div>

            {status === 'error' && (
              <div className="form-error-box">
                Failed to send message directly. Please email us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="form-submit-btn"
            >
              {status === 'sending' ? 'SENDING MESSAGE...' : 'SUBMIT MESSAGE'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
