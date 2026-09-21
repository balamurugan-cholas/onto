import React, { useState } from 'react'
import { Product, products } from '../data/products'
import { testimonials, type Testimonial } from '../data/testimonials'
import { useResponsive } from '../hooks/useResponsive'

interface HomePageProps {
  onLearnMore: (productSlug: 'vplay' | 'timelinekit') => void
  onLegalClick?: (type: 'terms' | 'privacy' | 'refund') => void
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

const CONTACT_ENDPOINT = 'https://vplay-download.balamuruganofficial3.workers.dev/contact'
const SUPPORT_EMAIL = 'balamuruganofficial3@gmail.com'

export default function HomePage({
  onLearnMore,
  onLegalClick,
}: HomePageProps) {
  const { isMobile } = useResponsive()
  const [activeReviewProduct, setActiveReviewProduct] = useState<number | 'all'>('all')

  // Contact form state
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState<Status>('idle')

  const vplayProduct = products.find((p) => p.id === 2) || products[0]
  const timelineKitProduct = products.find((p) => p.id === 1) || products[1]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactStatus('sending')
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('Failed to send')
      setContactStatus('sent')
    } catch {
      setContactStatus('error')
    }
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const filteredTestimonials = testimonials.filter((t) => {
    if (activeReviewProduct === 'all') return true
    return t.productId === activeReviewProduct
  })

  return (
    <div className="showcase-page-container">
      {/* ===================================================================
          1. BIG FULL-WIDTH HERO SECTION: FULL BACKGROUND IMAGE
          =================================================================== */}
      <section
        id="hero-vplay"
        className="editorial-hero-section is-fullwidth-hero"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}vplay-hero-banner.jpg)`,
        }}
      >
        <div className="editorial-hero-card is-fullwidth-card">
          <div className="editorial-hero-left">
            <h1 className="editorial-hero-title">VPlay</h1>

            <p className="editorial-hero-description">
              {vplayProduct.description}
            </p>

            <div className="editorial-hero-actions">
              <button
                type="button"
                className="editorial-outline-btn is-learn-more"
                onClick={() => onLearnMore('vplay')}
              >
                Learn More →
              </button>
            </div>

            <div className="editorial-hero-spec-pill">
              <span>PREMIERE PRO</span>
              <span>·</span>
              <span>WINDOWS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. BELOW HERO: OTHER PLUGINS (TIMELINEKIT AS A CARD)
          =================================================================== */}
      <section id="other-plugins" className="homepage-section">
        <div className="homepage-section-header">
          <h2 className="homepage-section-title">OTHER PLUGINS</h2>
        </div>

        {/* TimelineKit Product Card */}
        <div className="other-plugin-card">
          <div className="other-plugin-media">
            <img
              src={timelineKitProduct.img}
              alt="TimelineKit"
              className="other-plugin-img"
            />
          </div>

          <div className="other-plugin-content">
            <h3 className="other-plugin-title">TimelineKit</h3>

            <p className="other-plugin-desc">
              Save complete multi-track timeline arrangements — including cuts, transitions, keyframes, timing, and audio effects — and insert them into any project with one global shortcut. Organize presets into custom folders, bind hotkeys without focusing the panel, and speed up repetitive edits.
            </p>

            <div className="other-plugin-bottom">
              <div className="other-plugin-badges">
                <span className="other-plugin-host">{timelineKitProduct.host} · {timelineKitProduct.platform}</span>
              </div>

              <button type="button" className="editorial-outline-btn is-learn-more" onClick={() => onLearnMore('timelinekit')}>
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. REVIEWS SECTION (INFINITE CAROUSEL)
          =================================================================== */}
      <section id="reviews-section" className="homepage-section is-reviews-section">
        <div className="homepage-section-header">
          <h2 className="homepage-section-title">Trusted by Editors.</h2>
        </div>

        <div className="reviews-carousel-viewport">
          <div className="reviews-carousel-track">
            {[...testimonials, ...testimonials].map((t: Testimonial, idx) => (
              <div key={`${t.id}-${idx}`} className="testimonial-editorial-card is-carousel-card">
                <div className="testimonial-rating-stars">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="testimonial-editorial-text">"{t.text}"</p>
                <div className="testimonial-editorial-footer">
                  <div className="testimonial-avatar-circle">{t.initials}</div>
                  <div className="testimonial-author-col">
                    <span className="testimonial-author-name">{t.author}</span>
                    <span className="testimonial-author-role">{t.role} · {t.company}</span>
                  </div>
                  <span className="testimonial-date">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials-summary-row">
          <div className="testimonials-avg">
            <span className="testimonials-star-badge">★★★★★</span>
            <span>
              {(testimonials.reduce((s, t) => s + t.rating, 0) / (testimonials.length || 1)).toFixed(1)} average rating
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. UNIFIED CONTACT & FOOTER SECTION
          =================================================================== */}
      <footer id="contact-section" className="homepage-section is-contact-footer-section">
        <div className="contact-footer-grid">
          {/* Left Column: Brand, Info, Footer Links, Socials */}
          <div className="contact-footer-left">
            <div className="contact-footer-header">
              <h2 className="homepage-section-title">Get in Touch.</h2>
              <p className="contact-footer-desc">
                Have questions about our Premiere Pro extensions, custom workflow requests, or need technical assistance? Send us a message or reach out directly.
              </p>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="contact-footer-email">
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="contact-footer-nav-block">
              <div className="contact-footer-links-row">
                <button type="button" onClick={() => scrollToSection('reviews-section')} className="editorial-footer-link">
                  REVIEWS
                </button>
                <span className="editorial-footer-slash">/</span>
                <button type="button" onClick={() => onLegalClick?.('terms')} className="editorial-footer-link">
                  TERMS
                </button>
                <span className="editorial-footer-slash">/</span>
                <button type="button" onClick={() => onLegalClick?.('privacy')} className="editorial-footer-link">
                  PRIVACY
                </button>
                <span className="editorial-footer-slash">/</span>
                <button type="button" onClick={() => onLegalClick?.('refund')} className="editorial-footer-link">
                  REFUND
                </button>
              </div>

              <div className="contact-footer-bottom-row">
                <span className="contact-footer-copy">© 2026 Pluginverse. All rights reserved.</span>

                <div className="editorial-footer-socials">
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="editorial-social-icon-btn" aria-label="Twitter / X">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="editorial-social-icon-btn" aria-label="YouTube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="editorial-social-icon-btn" aria-label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-footer-right-col">
            <div className="editorial-form-card">
              {contactStatus === 'sent' ? (
                <div className="contact-sent-state">
                  <div className="contact-sent-icon">✓</div>
                  <h3 className="contact-sent-title">MESSAGE SENT</h3>
                  <p className="contact-sent-desc">We'll get back to you within 24 hours.</p>
                  <button
                    type="button"
                    className="editorial-outline-btn"
                    style={{ marginTop: '16px' }}
                    onClick={() => {
                      setContactStatus('idle')
                      setForm({ name: '', email: '', subject: '', message: '' })
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="editorial-contact-form">
                  <div className="form-two-col">
                    <div className="form-field-group">
                      <label className="form-label">YOUR NAME</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Alex Miller"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">SUBJECT</label>
                    <input
                      required
                      type="text"
                      placeholder="License inquiry, feature question, feedback..."
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
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
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="form-input form-textarea"
                    />
                  </div>

                  {contactStatus === 'error' && (
                    <div className="form-error-box">
                      Failed to send message directly. Please email us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={contactStatus === 'sending'}
                    className="form-submit-btn"
                  >
                    {contactStatus === 'sending' ? 'SENDING MESSAGE...' : 'SUBMIT MESSAGE'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
