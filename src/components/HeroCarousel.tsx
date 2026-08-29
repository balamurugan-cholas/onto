import { useState, useCallback } from 'react'
import { products } from '../data/products'
import { ACCENT } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'
import ProductSlide from './ProductSlide'
import Marquee from './Marquee'

interface HeroCarouselProps {
  onAddToCart: (productId: number) => void
  showRetryDownload: boolean
  downloadInProgress: boolean
  onRetryDownload: () => void
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

const arrowBtn: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '2px',
  border: '1px solid rgba(0,0,0,0.14)',
  background: 'rgba(0,0,0,0.03)',
  color: 'rgba(0,0,0,0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  flexShrink: 0,
}

export default function HeroCarousel({
  onAddToCart,
  showRetryDownload,
  downloadInProgress,
  onRetryDownload,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const { isMobile } = useResponsive()

  const go = useCallback(
    (dir: 'prev' | 'next') => {
      if (transitioning) return
      setSlideDir(dir === 'next' ? 'left' : 'right')
      setTransitioning(true)
      setTimeout(() => {
        setCurrent((c) => (dir === 'next' ? (c + 1) % products.length : (c - 1 + products.length) % products.length))
        setTransitioning(false)
      }, 380)
    },
    [transitioning],
  )

  const goTo = useCallback(
    (i: number) => {
      if (transitioning || i === current) return
      setSlideDir(i > current ? 'left' : 'right')
      setTransitioning(true)
      setTimeout(() => {
        setCurrent(i)
        setTransitioning(false)
      }, 380)
    },
    [transitioning, current],
  )

  const p = products[current]

  return (
    <>
      <main style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <ProductSlide
          product={p}
          visible={!transitioning}
          slideDir={slideDir}
          onAddToCart={() => onAddToCart(p.id)}
          showRetryDownload={showRetryDownload}
          downloadInProgress={downloadInProgress}
          onRetryDownload={onRetryDownload}
        />
      </main>

      {/* Bottom bar: (dots on desktop / CTA + Price on mobile) + arrows */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '8px 16px' : '10px 64px',
          flexShrink: 0,
          borderTop: isMobile ? '1px solid rgba(0,0,0,0.06)' : 'none',
          background: isMobile ? 'rgba(237,237,237,0.95)' : 'transparent',
        }}
      >
        {/* Left side: Add to Cart + Price on mobile, Dot indicators on desktop */}
        {isMobile ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? `translateX(${slideDir === 'left' ? '16px' : '-16px'})` : 'translateX(0)',
              transition: 'opacity 0.38s ease, transform 0.38s ease',
            }}
          >
            <button
              onClick={() => onAddToCart(p.id)}
              disabled={p.comingSoon}
              style={{
                padding: '8px 16px',
                border: '1.5px solid #000000',
                background: '#000000',
                color: '#FFFFFF',
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: p.comingSoon ? 'default' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'opacity 0.2s',
                opacity: p.comingSoon ? 0.6 : 1,
                borderRadius: '2px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { if (!p.comingSoon) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={(e) => { if (!p.comingSoon) e.currentTarget.style.opacity = '1' }}
            >
              {p.comingSoon ? 'Coming Soon' : 'Add to Cart'}
            </button>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '1.5rem', color: '#111111', lineHeight: 1 }}>
              {p.comingSoon ? '' : `$${p.price}`}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? '26px' : '7px',
                  height: '7px',
                  borderRadius: '4px',
                  background: i === current ? '#000000' : 'rgba(0,0,0,0.18)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* Right side: Chevron arrows */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => go('prev')}
            style={arrowBtn}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.45)'; e.currentTarget.style.color = '#000000'; e.currentTarget.style.background = 'rgba(0,0,0,0.07)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.14)'; e.currentTarget.style.color = 'rgba(0,0,0,0.65)'; e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => go('next')}
            style={arrowBtn}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.45)'; e.currentTarget.style.color = '#000000'; e.currentTarget.style.background = 'rgba(0,0,0,0.07)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.14)'; e.currentTarget.style.color = 'rgba(0,0,0,0.65)'; e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <Marquee names={products.map((prod) => prod.slug)} />
    </>
  )
}
