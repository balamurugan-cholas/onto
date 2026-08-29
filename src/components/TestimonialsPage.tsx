import { useState } from 'react'
import { products, ACCENT } from '../data/products'
import { testimonials, type Testimonial } from '../data/testimonials'
import { useResponsive } from '../hooks/useResponsive'

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i < rating ? '#000000' : 'none'}
          stroke={i < rating ? '#000000' : 'rgba(0,0,0,0.2)'}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.02) 100%)',
        border: '1.5px solid rgba(0,0,0,0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontWeight: 700,
        fontSize: '0.72rem',
        color: '#000000',
        letterSpacing: '0.04em',
      }}
    >
      {initials}
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '2px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(0,0,0,0.25)'
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(0,0,0,0.08)'
        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)'
      }}
    >
      <Stars rating={t.rating} />
      <p
        style={{
          color: 'rgba(0,0,0,0.84)',
          fontSize: '0.82rem',
          fontWeight: 500,
          lineHeight: 1.7,
          margin: 0,
          flex: 1,
        }}
      >
        "{t.text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Avatar initials={t.initials} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          <span style={{ color: '#111111', fontSize: '0.78rem', fontWeight: 600 }}>{t.author}</span>
          <span style={{ color: 'rgba(0,0,0,0.58)', fontSize: '0.68rem', fontWeight: 500 }}>
            {t.role} · {t.company}
          </span>
        </div>
        <span style={{ color: 'rgba(0,0,0,0.35)', fontSize: '0.62rem', flexShrink: 0 }}>{t.date}</span>
      </div>
    </div>
  )
}

export default function TestimonialsPage() {
  const [activeProductId, setActiveProductId] = useState(products[0].id)
  const { isMobile, isTablet } = useResponsive()

  const filtered = testimonials.filter((t) => t.productId === activeProductId)
  const activeProduct = products.find((p) => p.id === activeProductId)!

  const cols = isMobile ? 1 : isTablet ? 2 : 3

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        position: 'relative',
        zIndex: 10,
        padding: isMobile ? '0 20px' : '0 48px',
      }}
    >
      {/* Header */}
      <div style={{ paddingTop: isMobile ? '12px' : '20px', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
          <div>
            <div style={{ background: '#000000', display: 'inline-block', padding: '6px 12px', marginBottom: '8px' }}>
              <h1
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: isMobile ? '1.6rem' : '2rem',
                  lineHeight: 1,
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                Trusted by Editors
              </h1>
            </div>
            </div>

          {/* Product tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
            }}
          >
            {products.filter((p) => !p.comingSoon).map((p) => {
              const active = p.id === activeProductId
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProductId(p.id)}
                  style={{
                    padding: '6px 14px',
                    border: `1px solid ${active ? '#000000' : 'rgba(0,0,0,0.14)'}`,
                    background: active ? '#000000' : '#FFFFFF',
                    color: active ? '#FFFFFF' : 'rgba(0,0,0,0.6)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    borderRadius: '2px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.4)'
                      e.currentTarget.style.color = '#000000'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.14)'
                      e.currentTarget.style.color = 'rgba(0,0,0,0.6)'
                    }
                  }}
                >
                  {p.slug.replace('.', '')}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Cards grid — scrollable within the view */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '16px',
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '12px',
          }}
        >
          {filtered.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Stars rating={5} />
          <span style={{ color: 'rgba(0,0,0,0.55)', fontSize: '0.72rem' }}>
            {(filtered.reduce((s, t) => s + t.rating, 0) / filtered.length).toFixed(1)} average · {filtered.length} reviews
          </span>
        </div>
        <span style={{ color: 'rgba(0,0,0,0.35)', fontSize: '0.68rem' }}>
          Verified purchasers only
        </span>
      </div>
    </div>
  )
}
