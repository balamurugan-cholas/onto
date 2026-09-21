import React, { useState } from 'react'
import { Product, products, showcaseGridItems, GridItem } from '../data/products'
import { testimonials, type Testimonial } from '../data/testimonials'
import { useResponsive } from '../hooks/useResponsive'

interface ShowcaseHeroProps {
  activeProductId: number
  onSelectProduct: (productId: number) => void
  onAddToCart: (productId: number) => void
  onOpenVideoTour: (product: Product) => void
  onOpenDetails: (product: Product) => void
  showRetryDownload?: boolean
  downloadInProgress?: boolean
  onRetryDownload?: () => void
  onContactClick?: () => void
  onTestimonialsClick?: () => void
  onLegalClick?: (type: 'terms' | 'privacy' | 'refund') => void
}

type FilterCategory = 'all' | 'workflow' | 'downloader' | 'presets'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const CONTACT_ENDPOINT = 'https://vplay-download.balamuruganofficial3.workers.dev/contact'
const SUPPORT_EMAIL = 'balamuruganofficial3@gmail.com'

export default function ShowcaseHero({
  onSelectProduct,
  onAddToCart,
  onOpenVideoTour,
  onOpenDetails,
  onLegalClick,
}: ShowcaseHeroProps) {
  const { isMobile } = useResponsive()
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')
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

  const filteredGridItems = showcaseGridItems.filter((item) => {
    if (activeCategory === 'all') return true
    return item.category === activeCategory
  })

  const filteredTestimonials = testimonials.filter((t) => {
    if (activeReviewProduct === 'all') return true
    return t.productId === activeReviewProduct
  })

  return (
    <div className="showcase-page-container">
      {/* ===================================================================
          1. HERO SECTION: VPLAY
          =================================================================== */}
      <section id="hero-vplay" className="editorial-hero-section">
        <div className="editorial-hero-card">
          {/* Left Column: Title, Description, Buttons, Details link */}
          <div className="editorial-hero-left">
            <span className="editorial-section-tag">FEATURED EXTENSION</span>
            <h1 className="editorial-hero-title">/ VPlay</h1>

            <p className="editorial-hero-description">
              {vplayProduct.description}
            </p>

            <div className="editorial-hero-actions">
              <button
                type="button"
                className="editorial-outline-btn"
                onClick={() => onAddToCart(vplayProduct.id)}
              >
                BUY ${vplayProduct.price}
              </button>

              {vplayProduct.tour && (
                <button
                  type="button"
                  className="editorial-text-btn"
                  onClick={() => onOpenVideoTour(vplayProduct)}
                >
                  Watch Demo ▶
                </button>
              )}
            </div>

            <button
              type="button"
              className="editorial-details-link"
              onClick={() => onOpenDetails(vplayProduct)}
            >
              <span>▾</span> Product details
            </button>
          </div>

          {/* Right Column: Floating VPlay Mockup */}
          <div className="editorial-hero-right">
            <div className="editorial-hero-img-wrapper">
              <img
                src={vplayProduct.img}
                alt="VPlay Premiere Pro Panel"
                className="editorial-hero-img"
              />
              <div className="editorial-hero-shadow" aria-hidden="true" />
            </div>

            <div className="editorial-hero-spec-pill">
              <span>{vplayProduct.host.toUpperCase()}</span>
              <span>·</span>
              <span>{vplayProduct.platform.toUpperCase()}</span>
              <span>·</span>
              <span>LIFETIME LICENSE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. BELOW HERO: OTHER PLUGINS (TIMELINEKIT & MODULE CATALOG)
          =================================================================== */}
      <section id="other-plugins" className="homepage-section">
        <div className="homepage-section-header">
          <span className="editorial-subpage-kicker">EXTENSIONS & TOOLS</span>
          <h2 className="homepage-section-title">Other Plugins.</h2>
        </div>

        {/* TimelineKit Featured Card */}
        <div className="editorial-hero-card timelinekit-hero-card">
          <div className="editorial-hero-left">
            <span className="editorial-section-tag">TIMELINE WORKFLOW</span>
            <h3 className="editorial-hero-title">/ TimelineKit</h3>

            <p className="editorial-hero-description">
              {timelineKitProduct.description}
            </p>

            <div className="editorial-hero-actions">
              <button
                type="button"
                className="editorial-outline-btn is-disabled"
                disabled
              >
                COMING SOON
              </button>
            </div>

            <button
              type="button"
              className="editorial-details-link"
              onClick={() => onOpenDetails(timelineKitProduct)}
            >
              <span>▾</span> Product details
            </button>
          </div>

          <div className="editorial-hero-right">
            <div className="editorial-hero-img-wrapper">
              <img
                src={timelineKitProduct.img}
                alt="TimelineKit Timeline Tool"
                className="editorial-hero-img"
              />
              <div className="editorial-hero-shadow" aria-hidden="true" />
            </div>

            <div className="editorial-hero-spec-pill">
              <span>{timelineKitProduct.host.toUpperCase()}</span>
              <span>·</span>
              <span>{timelineKitProduct.platform.toUpperCase()}</span>
              <span>·</span>
              <span>HOTKEY PRESETS</span>
            </div>
          </div>
        </div>

        {/* Category Tabs for Feature Grid */}
        <nav className="editorial-category-bar" aria-label="Plugin feature categories">
          <div className="editorial-category-list">
            <button
              type="button"
              className={`editorial-category-item ${activeCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {activeCategory === 'all' && <span className="category-cross">✕</span>}
              <span>ALL FEATURES</span>
            </button>

            <button
              type="button"
              className={`editorial-category-item ${activeCategory === 'downloader' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('downloader')}
            >
              {activeCategory === 'downloader' && <span className="category-cross">✕</span>}
              <span>DOWNLOADER</span>
            </button>

            <button
              type="button"
              className={`editorial-category-item ${activeCategory === 'workflow' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('workflow')}
            >
              {activeCategory === 'workflow' && <span className="category-cross">✕</span>}
              <span>WORKFLOW</span>
            </button>

            <button
              type="button"
              className={`editorial-category-item ${activeCategory === 'presets' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('presets')}
            >
              {activeCategory === 'presets' && <span className="category-cross">✕</span>}
              <span>PRESETS</span>
            </button>
          </div>
        </nav>

        {/* 3x3 Feature & Module Tiles */}
        <div className="editorial-grid">
          {filteredGridItems.map((item: GridItem) => {
            const associatedProduct = products.find((p) => p.id === item.productId)

            return (
              <div
                key={item.id}
                className="editorial-card"
                onClick={() => {
                  if (associatedProduct) {
                    onSelectProduct(associatedProduct.id)
                    onOpenDetails(associatedProduct)
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && associatedProduct) {
                    onSelectProduct(associatedProduct.id)
                    onOpenDetails(associatedProduct)
                  }
                }}
              >
                <div className="editorial-card-media">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="editorial-card-img"
                    loading="lazy"
                  />
                </div>

                <div className="editorial-card-caption">
                  <div className="editorial-card-row">
                    <h4 className="editorial-card-title">{item.title}</h4>
                    <span className="editorial-card-tag">{item.tag}</span>
                  </div>
                  <span className="editorial-card-subtitle">{item.subtitle}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===================================================================
          3. REVIEWS SECTION
          =================================================================== */}
      <section id="reviews-section" className="homepage-section">
        <div className="homepage-section-header">
          <div>
            <span className="editorial-subpage-kicker">COMMUNITY REVIEWS</span>
            <h2 className="homepage-section-title">Trusted by Editors.</h2>
          </div>

          <div className="editorial-tab-pills">
            <button
              type="button"
              onClick={() => setActiveReviewProduct('all')}
              className={`editorial-tab-pill ${activeReviewProduct === 'all' ? 'is-active' : ''}`}
            >
              All Reviews
            </button>
            <button
              type="button"
              onClick={() => setActiveReviewProduct(2)}
              className={`editorial-tab-pill ${activeReviewProduct === 2 ? 'is-active' : ''}`}
            >
              VPlay
            </button>
            <button
              type="button"
              onClick={() => setActiveReviewProduct(1)}
              className={`editorial-tab-pill ${activeReviewProduct === 1 ? 'is-active' : ''}`}
            >
              TimelineKit
            </button>
          </div>
        </div>

        <div className="testimonials-editorial-grid">
          {filteredTestimonials.map((t: Testimonial) => (
            <div key={t.id} className="testimonial-editorial-card">
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

        <div className="testimonials-summary-row">
          <div className="testimonials-avg">
            <span className="testimonials-star-badge">★★★★★</span>
            <span>
              {(filteredTestimonials.reduce((s, t) => s + t.rating, 0) / (filteredTestimonials.length || 1)).toFixed(1)} average rating across {filteredTestimonials.length} verified reviews
            </span>
          </div>
          <span className="testimonials-verified-label">Verified Premiere Pro Editors</span>
        </div>
      </section>

      {/* ===================================================================
          4. CONTACT FORM SECTION
          =================================================================== */}
      <section id="contact-section" className="homepage-section">
        <div className="homepage-section-header">
          <div>
            <span className="editorial-subpage-kicker">SUPPORT & INQUIRIES</span>
            <h2 className="homepage-section-title">Get in Touch.</h2>
          </div>
        </div>

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
      </section>

      {/* ===================================================================
          5. MINIMAL EDITORIAL FOOTER
          =================================================================== */}
      <footer className="editorial-footer">
        <div className="editorial-footer-left">
          <span className="editorial-lang-item">En ▾</span>
        </div>

        <div className="editorial-footer-center">
          <button type="button" onClick={() => scrollToSection('contact-section')} className="editorial-footer-link">
            CONTACT
          </button>
          <span className="editorial-footer-slash">/</span>
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

        <div className="editorial-footer-right">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="editorial-social-link">
            Tw
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="editorial-social-link">
            Yt
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="editorial-social-link">
            In
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="editorial-social-link">
            Gh
          </a>
        </div>
      </footer>
    </div>
  )
}
