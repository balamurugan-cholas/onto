import type { Product } from '../data/products'
import { ACCENT } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'
import { useEffect, useRef } from 'react'

interface ProductSlideProps {
  product: Product
  visible: boolean
  slideDir: 'left' | 'right'
  onAddToCart: () => void
  showRetryDownload: boolean
  downloadInProgress: boolean
  onRetryDownload: () => void
}

function FeatureGroupVisual({ index }: { index: number }) {
  if (index === 0) return <div className="feature-group-visual feature-download-visual" aria-hidden="true"><div className="mini-url"><span /><b>PASTE LINK</b><i>↵</i></div><div className="mini-download"><b>MP4</b><span>1080P</span><i>↓</i></div><div className="mini-progress"><span /></div></div>
  if (index === 1) return <div className="feature-group-visual feature-timeline-visual" aria-hidden="true"><div className="mini-track-labels"><span>V3</span><span>V2</span><span>V1</span></div><div className="mini-tracks"><i /><i /><i /><b /><span /></div></div>
  if (index === 2) return <div className="feature-group-visual feature-clip-visual" aria-hidden="true"><div className="mini-preview"><i /></div><div className="mini-clip-tools"><div className="mini-transcript"><span /><span /><span /></div><div className="mini-range"><b /><i /><i /></div></div></div>
  return <div className="feature-group-visual feature-history-visual" aria-hidden="true"><div className="mini-history-rows"><span><i /><b /></span><span><i /><b /></span><span><i /><b /></span></div><div className="mini-update"><b>UPDATE</b><span><i /></span></div></div>
}

function ProductDeepDive({ product }: { product: Product }) {
  if (!product.tour && !product.featureGroups?.length && !product.comparisons?.length) return null
  return (
    <div className="product-deep-dive">
      {product.tour && <figure className="product-tour">
        <video src={product.tour.video} aria-label="VPlay Premiere Pro panel workflow demonstration" autoPlay muted loop playsInline preload="metadata" />
        <figcaption>
          <span>PRODUCT TOUR</span><h3>{product.tour.title}</h3><p>{product.tour.description}</p>
          <div className="product-tour-flow" aria-label="VPlay workflow: paste a link, VPlay processes it, then sends it to the Premiere timeline">
            <div className="product-tour-flow-line" aria-hidden="true"><i /></div>
            <div className="product-tour-flow-steps">
              <span><b>Paste link</b></span>
              <span><b>VPlay</b></span>
              <span><b>Timeline</b></span>
            </div>
          </div>
        </figcaption>
      </figure>}
      {!!product.featureGroups?.length && <section className="product-detail-section" aria-labelledby="vplay-capabilities-title">
        <div className="product-section-heading"><span>CAPABILITIES</span><h3 id="vplay-capabilities-title">Everything inside VPlay</h3></div>
        <div className="product-feature-groups">{product.featureGroups.map((group, index) => <article key={group.title}><h4>{group.title}</h4><FeatureGroupVisual index={index} /><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
      </section>}
      {!!product.comparisons?.length && <section className="product-detail-section" aria-labelledby="vplay-difference-title">
        <div className="product-section-heading"><span>THE DIFFERENCE</span><h3 id="vplay-difference-title">Download websites vs. VPlay</h3></div>
        <div className="product-comparison"><div className="product-comparison-head"><span>Typical workflow</span><span>With VPlay</span></div>{product.comparisons.map(row => <div className="product-comparison-row" key={row.standard}><p>{row.standard}</p><p>{row.vplay}</p></div>)}</div>
      </section>}
    </div>
  )
}

export default function ProductSlide({
  product: p,
  visible,
  slideDir,
  onAddToCart,
  showRetryDownload,
  downloadInProgress,
}: ProductSlideProps) {
  const { isMobile, isTablet } = useResponsive()
  const desktopDetailsRef = useRef<HTMLDivElement>(null)
  const desktopScrollTargetRef = useRef(0)
  const desktopScrollFrameRef = useRef<number | null>(null)
  const actionLabel = showRetryDownload ? (downloadInProgress ? 'Preparing download…' : 'Download Again') : p.comingSoon ? 'Coming Soon' : 'Add to Cart'
  const actionDisabled = p.comingSoon || (showRetryDownload && downloadInProgress)

  useEffect(() => {
    if (isMobile || isTablet) return
    const forwardPageScroll = (event: WheelEvent) => {
      const panel = desktopDetailsRef.current
      if (!panel || panel.scrollHeight <= panel.clientHeight) return
      if ((event.target as HTMLElement | null)?.closest('input, textarea, select, [role="dialog"]')) return
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * panel.clientHeight : event.deltaY
      if (desktopScrollFrameRef.current === null) desktopScrollTargetRef.current = panel.scrollTop
      const next = Math.max(0, Math.min(panel.scrollHeight - panel.clientHeight, desktopScrollTargetRef.current + delta))
      if (next === desktopScrollTargetRef.current) return
      event.preventDefault()
      desktopScrollTargetRef.current = next
      if (desktopScrollFrameRef.current !== null) return
      const glide = () => {
        const activePanel = desktopDetailsRef.current
        if (!activePanel) { desktopScrollFrameRef.current = null; return }
        const distance = desktopScrollTargetRef.current - activePanel.scrollTop
        if (Math.abs(distance) < 0.5) {
          activePanel.scrollTop = desktopScrollTargetRef.current
          desktopScrollFrameRef.current = null
          return
        }
        activePanel.scrollTop += distance * 0.16
        desktopScrollFrameRef.current = window.requestAnimationFrame(glide)
      }
      desktopScrollFrameRef.current = window.requestAnimationFrame(glide)
    }
    window.addEventListener('wheel', forwardPageScroll, { passive: false })
    return () => {
      window.removeEventListener('wheel', forwardPageScroll)
      if (desktopScrollFrameRef.current !== null) window.cancelAnimationFrame(desktopScrollFrameRef.current)
      desktopScrollFrameRef.current = null
    }
  }, [isMobile, isTablet])

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
          </div>
          <span style={{ background: '#000000', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', display: 'inline-block', alignSelf: 'flex-start' }}>
            {p.version}
          </span>
        </div>

        {/* Content — scrollable */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'none', padding: '12px 20px 8px', display: 'flex', flexDirection: 'column', gap: '12px', ...slideStyle }}>
          <p className="product-description" style={{ color: 'rgba(0,0,0,0.84)', fontSize: '0.82rem', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>{p.description}</p>

          {/* Metadata 2×2 */}
          <div className="product-metadata" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {[{ label: 'PLATFORM', value: p.platform }, { label: 'HOST', value: p.host }].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'rgba(0,0,0,0.52)', fontSize: '0.56rem', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</span>
                <span style={{ color: '#000000', fontSize: '0.8rem', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="product-primary-features" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
          <ProductDeepDive product={p} />
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
        <div style={{ flex: 1, height: '60vh', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingRight: '10px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.28) transparent', display: 'flex', flexDirection: 'column', gap: '12px', ...slideStyle }}>
          <div style={{ background: '#000000', display: 'inline-block', padding: '8px 14px', alignSelf: 'flex-start' }}>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: '2rem', lineHeight: 1, color: '#FFFFFF', margin: 0 }}>{p.slug}</h1>
          </div>
          <span style={{ background: '#000000', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', display: 'inline-block', alignSelf: 'flex-start' }}>{p.version}</span>
          <p className="product-description" style={{ color: 'rgba(0,0,0,0.84)', fontSize: '0.84rem', fontWeight: 500, lineHeight: 1.65, maxWidth: '50ch', margin: 0 }}>{p.description}</p>
          <div className="product-metadata" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {[{ label: 'PLATFORM', value: p.platform }, { label: 'HOST', value: p.host }].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: 'rgba(0,0,0,0.52)', fontSize: '0.58rem', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</span>
                <span style={{ color: '#000000', fontSize: '0.82rem', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="product-primary-features" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ color: '#000000', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', color: 'rgba(0,0,0,0.82)', fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5 }}>
                  <span style={{ color: '#000000', flexShrink: 0, fontSize: '0.5rem', marginTop: '3px' }}>●</span>{f}
                </div>
              ))}
            </div>
          </div>
          <ProductDeepDive product={p} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '2.2rem', color: '#111111' }}>{p.comingSoon ? '' : `$${p.price}`}</span>
            <button onClick={onAddToCart} disabled={actionDisabled} style={{ padding: '9px 24px', border: '1.5px solid #000000', background: 'transparent', color: '#000000', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', cursor: actionDisabled ? 'default' : 'pointer', fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.2s', opacity: actionDisabled ? 0.6 : 1 }}>
              {actionLabel}
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
        <img src={p.img} alt={p.slug} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* Details */}
      <div style={{ flex: 1, height: '68vh', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '14px', ...slideStyle }}>
        <div style={{ background: '#000000', display: 'inline-block', padding: '10px 18px', alignSelf: 'flex-start' }}>
          <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(1.8rem, 3.4vw, 3rem)', lineHeight: 1, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>{p.slug}</h1>
        </div>
        <span style={{ background: '#000000', color: '#FFFFFF', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', display: 'inline-block', alignSelf: 'flex-start' }}>{p.version}</span>
        <div ref={desktopDetailsRef} className="desktop-product-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', paddingRight: '12px', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p className="product-description" style={{ color: 'rgba(0,0,0,0.84)', fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.7, maxWidth: '52ch', margin: 0 }}>{p.description}</p>
        <div className="product-metadata" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', paddingTop: '14px' }}>
          {[{ label: 'PLATFORM', value: p.platform }, { label: 'HOST', value: p.host }].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ color: 'rgba(0,0,0,0.52)', fontSize: '0.6rem', letterSpacing: '0.14em', fontWeight: 600 }}>{label}</span>
                <span style={{ color: '#000000', fontSize: '0.85rem', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="product-primary-features" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ color: '#000000', fontWeight: 700, fontSize: '0.85rem', margin: 0, letterSpacing: '0.02em' }}>Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px' }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'rgba(0,0,0,0.82)', fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.5 }}>
                  <span style={{ color: '#000000', flexShrink: 0, marginTop: '2px', fontSize: '0.55rem' }}>●</span>{f}
                </div>
              ))}
            </div>
          </div>
          <ProductDeepDive product={p} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px' }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '2.6rem', color: '#111111' }}>{p.comingSoon ? '' : `$${p.price}`}</span>
          <button onClick={onAddToCart} disabled={actionDisabled} style={{ padding: '10px 28px', border: '1.5px solid #000000', background: 'transparent', color: '#000000', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.06em', cursor: actionDisabled ? 'default' : 'pointer', transition: 'all 0.2s', fontFamily: "'Space Grotesk', sans-serif", opacity: actionDisabled ? 0.6 : 1 }}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
