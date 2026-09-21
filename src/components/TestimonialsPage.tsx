import React, { useState } from 'react'
import { products } from '../data/products'
import { testimonials, type Testimonial } from '../data/testimonials'
import { useResponsive } from '../hooks/useResponsive'

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="testimonial-editorial-card">
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
  )
}

export default function TestimonialsPage({ onBack }: { onBack?: () => void }) {
  const [activeProductId, setActiveProductId] = useState(products[0].id)
  const { isMobile, isTablet } = useResponsive()

  const filtered = testimonials.filter((t) => t.productId === activeProductId)

  return (
    <div className="editorial-subpage-container">
      <div className="editorial-subpage-header">
        <div>
          <span className="editorial-subpage-kicker">COMMUNITY REVIEWS</span>
          <h1 className="editorial-subpage-title">Trusted by Editors.</h1>
        </div>

        <div className="editorial-tab-pills">
          {products.filter((p) => !p.comingSoon).map((p) => {
            const active = p.id === activeProductId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveProductId(p.id)}
                className={`editorial-tab-pill ${active ? 'is-active' : ''}`}
              >
                {p.slug.replace('.', '')}
              </button>
            )
          })}
        </div>
      </div>

      <div className="testimonials-editorial-grid">
        {filtered.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>

      <div className="testimonials-summary-row">
        <div className="testimonials-avg">
          <span className="testimonials-star-badge">★★★★★</span>
          <span>{(filtered.reduce((s, t) => s + t.rating, 0) / (filtered.length || 1)).toFixed(1)} average rating across {filtered.length} verified reviews</span>
        </div>
        <span className="testimonials-verified-label">Verified Premiere Pro Editors</span>
      </div>
    </div>
  )
}
