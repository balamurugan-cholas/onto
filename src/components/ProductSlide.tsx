import type { Product } from '../data/products'
import { ACCENT } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'

interface ProductSlideProps {
  product: Product
  visible: boolean
  slideDir: 'left' | 'right'
  onAddToCart: () => void
  showRetryDownload: boolean
  downloadInProgress: boolean
  onRetryDownload: () => void
}

export default function ProductSlide({
  product: p,
  visible,
  slideDir,
  onAddToCart,
  showRetryDownload,
  downloadInProgress,
  onRetryDownload,
}: ProductSlideProps) {
  const { isMobile, isTablet } = useResponsive()

  const fade: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.38s ease, transform 0.38s ease',
  }

  const slideStyle: React.CSSProperties = {
    ...fade,
    transform: visible ? 'translateX(0)' : `translateX(${slideDir === 'left' ? '24px' : '-24px'})`,
  }

  const imgStyle: React.CSSProperties = {
    ...fade,
    transform: visible ? 'scale(1)' : `scale(${slideDir === 'left' ? '0.97' : '1.03'})`,
  }

  // ── Mobile: vertical stack ──
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Image banner — fixed, not scrollable */}
        <div style={{ position: 'relative', width: '100%', height: '180px', flexShrink: 0, ...imgStyle }}>
          <img
            src={p.img}
            alt={p.slug}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(237,237,237,0.95) 100%)' }} />
        </div>

        {/* Title + version — fixed, not scrollable */}
        <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0, ...slideStyle }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ background: '#000000', display: 'inline-block', padding: '7px 12px', alignSelf: 'flex-start' }}>
              <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: '1.7rem', lineHeight: 1, color: '#FFFFFF', margin: 0 }}>
                {p.slug}
              </h1>
            </div>
            {showRetryDownload && (
              <button
                type="button"
                disabled={downloadInProgress}
                onClick={onRetryDownload}
                style={{
                  height: 41,
                  padding: '0 14px',
                  border: '1.5px solid #000000',
                  borderRadius: 0,
                  background: downloadInProgress ? '#666' : '#000000',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: 'nowrap',
                  cursor: downloadInProgress ? 'wait' : 'pointer',
                  flexShrink: 0,
                }}
              >
                {downloadInProgress ? 'Preparing…' : 'Retry download'}
              </button>
            )}
          </div>
          <span style={{ background: '#000000', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', display: 'inline-block', alignSelf: 'flex-start' }}>
            {p.version}
          </span>
        </div>

        {/* Content — scrollable */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'none', padding: '12px 20px 8px', display: 'flex', flexDirection: 'column', gap: '12px', ...slideStyle }}>
          <p style={{ color: 'rgba(0,0,0,0.84)', fontSize: '0.82rem', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>{p.description}</p>

          {/* Metadata 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {[{ label: 'PLATFORM', value: p.platform }, { label: 'HOST', value: p.host }, { label: 'LICENSE', value: p.license }, { label: 'UPDATES', value: p.updates }].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'rgba(0,0,0,0.52)', fontSize: '0.56rem', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</span>
                <span style={{ color: '#000000', fontSize: '0.8rem', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ color: '#000000', fontWeight: 700, fontSize: '0.8rem', margin: 0 }}>Features</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'rgba(0,0,0,0.82)', fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5 }}>
                  <span style={{ color: '#000000', flexShrink: 0, fontSize: '0.5rem', marginTop: '3px' }}>●</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Tablet: image hidden, single column content ──
  if (isTablet) {
    return (
      <div style={{ display: 'flex', gap: '32px', flex: 1, minHeight: 0, padding: '0 32px', alignItems: 'center' }}>
        {/* Smaller image */}
        <div style={{ flexShrink: 0, width: '36%', height: '60vh', position: 'relative', borderRadius: '3px', overflow: 'hidden', ...imgStyle }}>
          <img src={p.img} alt={p.slug} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(237,237,237,0.5) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 50%, rgba(237,237,237,0.8) 100%)' }} />
        </div>

        {/* Details */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', ...slideStyle }}>
          <div style={{ background: '#000000', display: 'inline-block', padding: '8px 14px', alignSelf: 'flex-start' }}>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: '2rem', lineHeight: 1, color: '#FFFFFF', margin: 0 }}>{p.slug}</h1>
          </div>
          <span style={{ background: '#000000', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', display: 'inline-block', alignSelf: 'flex-start' }}>{p.version}</span>
          <p style={{ color: 'rgba(0,0,0,0.84)', fontSize: '0.84rem', fontWeight: 500, lineHeight: 1.65, maxWidth: '50ch', margin: 0 }}>{p.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {[{ label: 'PLATFORM', value: p.platform }, { label: 'HOST', value: p.host }, { label: 'LICENSE', value: p.license }, { label: 'UPDATES', value: p.updates }].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'rgba(0,0,0,0.52)', fontSize: '0.58rem', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</span>
                <span style={{ color: '#000000', fontSize: '0.82rem', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ color: '#000000', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', color: 'rgba(0,0,0,0.82)', fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5 }}>
                  <span style={{ color: '#000000', flexShrink: 0, fontSize: '0.5rem', marginTop: '3px' }}>●</span>{f}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '2.2rem', color: '#111111' }}>{p.comingSoon ? '' : `$${p.price}`}</span>
            <button onClick={onAddToCart} disabled={p.comingSoon} style={{ padding: '9px 24px', border: '1.5px solid #000000', background: 'transparent', color: '#000000', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', cursor: p.comingSoon ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', opacity: p.comingSoon ? 0.6 : 1 }} onMouseEnter={(e) => { if (!p.comingSoon) { e.currentTarget.style.background = '#000000'; e.currentTarget.style.color = '#FFFFFF' } }} onMouseLeave={(e) => { if (!p.comingSoon) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000000' } }}>
              {p.comingSoon ? 'Coming Soon' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Desktop: full two-column layout ──
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flex: 1, minHeight: 0, padding: '0 64px' }}>
      {/* Product image */}
      <div style={{ flexShrink: 0, width: '40%', height: '68vh', position: 'relative', borderRadius: '4px', overflow: 'hidden', ...imgStyle }}>
        <img src={p.img} alt={p.slug} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.18))' }} />
      </div>

      {/* Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', ...slideStyle }}>
        <div style={{ background: '#000000', display: 'inline-block', padding: '10px 18px', alignSelf: 'flex-start' }}>
          <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(1.8rem, 3.4vw, 3rem)', lineHeight: 1, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>{p.slug}</h1>
        </div>
        <span style={{ background: '#000000', color: '#FFFFFF', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', display: 'inline-block', alignSelf: 'flex-start' }}>{p.version}</span>
        <p style={{ color: 'rgba(0,0,0,0.84)', fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.7, maxWidth: '52ch', margin: 0 }}>{p.description}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {[{ label: 'PLATFORM', value: p.platform }, { label: 'HOST', value: p.host }, { label: 'LICENSE', value: p.license }, { label: 'UPDATES', value: p.updates }].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ color: 'rgba(0,0,0,0.52)', fontSize: '0.6rem', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</span>
              <span style={{ color: '#000000', fontSize: '0.85rem', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ color: '#000000', fontWeight: 700, fontSize: '0.85rem', margin: 0, letterSpacing: '0.02em' }}>Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px' }}>
            {p.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'rgba(0,0,0,0.82)', fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.5 }}>
                <span style={{ color: '#000000', flexShrink: 0, marginTop: '2px', fontSize: '0.55rem' }}>●</span>{f}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '2.6rem', color: '#111111' }}>{p.comingSoon ? '' : `$${p.price}`}</span>
          <button onClick={onAddToCart} disabled={p.comingSoon} style={{ padding: '10px 28px', border: '1.5px solid #000000', background: 'transparent', color: '#000000', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.06em', cursor: p.comingSoon ? 'default' : 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif", opacity: p.comingSoon ? 0.6 : 1 }} onMouseEnter={(e) => { if (!p.comingSoon) { e.currentTarget.style.background = '#000000'; e.currentTarget.style.color = '#FFFFFF' } }} onMouseLeave={(e) => { if (!p.comingSoon) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000000' } }}>
            {p.comingSoon ? 'Coming Soon' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
