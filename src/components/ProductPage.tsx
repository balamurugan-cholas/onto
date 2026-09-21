import React from 'react'
import { Product, products } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'

interface ProductPageProps {
  productId: number
  onBack: () => void
  onAddToCart: (productId: number) => void
  onOpenVideoTour: (product: Product) => void
  onLegalClick?: (type: 'terms' | 'privacy' | 'refund') => void
  onContactClick?: () => void
}

export default function ProductPage({
  productId,
  onBack,
  onAddToCart,
  onOpenVideoTour,
  onLegalClick,
  onContactClick,
}: ProductPageProps) {
  const { isMobile } = useResponsive()
  const product = products.find((p) => p.id === productId) || products[0]
  const isVPlay = product.id === 2
  const productName = product.slug.replace('.', '')

  return (
    <div className="product-page-container">
      {/* 1. PRODUCT HERO */}
      <section className="product-hero-section">
        <div className="product-hero-inner">
          <div className="product-hero-left">
            <span className="editorial-section-tag">
              {product.version} · {product.platform.toUpperCase()}
            </span>

            <h1 className="product-hero-title">{productName}</h1>

            <p className="product-hero-description">
              {product.description}
            </p>

            <div className="product-hero-actions">
              {product.comingSoon ? (
                <button
                  type="button"
                  className="editorial-outline-btn is-disabled"
                  disabled
                >
                  COMING SOON
                </button>
              ) : (
                <button
                  type="button"
                  className="editorial-outline-btn is-primary"
                  onClick={() => onAddToCart(product.id)}
                >
                  BUY NOW · ${product.price}
                </button>
              )}

              {product.tour && (
                <button
                  type="button"
                  className="product-hero-tour-btn"
                  onClick={() => onOpenVideoTour(product)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Watch Demo
                </button>
              )}
            </div>

            <div className="product-hero-spec-pill">
              <span>{product.host.toUpperCase()}</span>
              <span>·</span>
              <span>{product.platform.toUpperCase()}</span>
              <span>·</span>
              <span>{product.license.toUpperCase()}</span>
            </div>
          </div>

          <div className="product-hero-right">
            <div className="product-hero-media">
              <img
                src={product.img}
                alt={product.slug}
                className="product-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEEP DIVE FEATURE SHOWCASES */}
      <section className="product-features-section">
        <div className="product-section-header">
          <h2 className="product-section-title">Built for Speed & Precision.</h2>
          <p className="product-section-subtitle">
            Engineered specifically for high-velocity video editors working in Adobe Premiere Pro.
          </p>
        </div>

        <div className="product-feature-rows">
          {isVPlay ? (
            <>
              {/* Row 1: Range Trimming */}
              <div className="product-feature-row">
                <div className="product-feature-media">
                  <img
                    src={`${import.meta.env.BASE_URL}range-trim.png`}
                    alt="Precision Range Trimming"
                    className="product-feature-img"
                  />
                </div>
                <div className="product-feature-copy">
                  <span className="editorial-section-tag">RANGE EXTRACTION</span>
                  <h3 className="product-feature-heading">Precision Range Trimming</h3>
                  <p className="product-feature-body">
                    Pull a 5-second clip from a 12-hour video in just 15–20 seconds without downloading gigabytes of unwanted footage. Set custom in and out points with fluid scrubbing directly inside Premiere Pro before committing.
                  </p>
                </div>
              </div>

              {/* Row 2: Timeline Insertion */}
              <div className="product-feature-row is-reversed">
                <div className="product-feature-copy">
                  <span className="editorial-section-tag">SEAMLESS IMPORT</span>
                  <h3 className="product-feature-heading">Direct Timeline Insertion</h3>
                  <p className="product-feature-body">
                    Forget window switching and desktop clutter. VPlay imports downloaded videos, audio streams, and thumbnails directly into your active project bins and drops them straight onto your playhead target track.
                  </p>
                </div>
                <div className="product-feature-media">
                  <img
                    src={`${import.meta.env.BASE_URL}timeline-insertion.png`}
                    alt="Direct Timeline Insertion"
                    className="product-feature-img"
                  />
                </div>
              </div>

              {/* Row 3: Searchable History */}
              <div className="product-feature-row">
                <div className="product-feature-media">
                  <img
                    src={`${import.meta.env.BASE_URL}download-history.png`}
                    alt="Searchable History"
                    className="product-feature-img"
                  />
                </div>
                <div className="product-feature-copy">
                  <span className="editorial-section-tag">ASSET MANAGEMENT</span>
                  <h3 className="product-feature-heading">Searchable History & Re-Download</h3>
                  <p className="product-feature-body">
                    Every download, source URL, thumbnail, and format variant remains cataloged in a searchable panel. Re-open file directories, re-download from original sources, or search spoken moments via transcript integration.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* TimelineKit Row 1 */}
              <div className="product-feature-row">
                <div className="product-feature-media">
                  <img
                    src={`${import.meta.env.BASE_URL}timelinekit.png`}
                    alt="Arrangement Presets"
                    className="product-feature-img"
                  />
                </div>
                <div className="product-feature-copy">
                  <span className="editorial-section-tag">TIMELINE PRESETS</span>
                  <h3 className="product-feature-heading">Complete Multi-Track Presets</h3>
                  <p className="product-feature-body">
                    Save complex multi-track timeline selections — including cuts, transitions, effects, and audio sync — and paste them back into any project with perfect alignment.
                  </p>
                </div>
              </div>

              {/* TimelineKit Row 2 */}
              <div className="product-feature-row is-reversed">
                <div className="product-feature-copy">
                  <span className="editorial-section-tag">GLOBAL SHORTCUTS</span>
                  <h3 className="product-feature-heading">Hotkey Support & Unfocused Trigger</h3>
                  <p className="product-feature-body">
                    Assign shortcuts to your favorite presets and insert them instantly without even focusing the plugin panel. Choose Start, Anchor, or End playhead alignment on the fly.
                  </p>
                </div>
                <div className="product-feature-media">
                  <img
                    src={`${import.meta.env.BASE_URL}timelinekit.png`}
                    alt="Hotkey Support"
                    className="product-feature-img"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 3. COMPARISON SECTION */}
      {product.comparisons && product.comparisons.length > 0 && (
        <section className="product-compare-section">
          <div className="product-section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="product-section-title">Workflow Comparison.</h2>
          </div>

          <div className="specs-compare-grid">
            <div className="specs-compare-card is-old">
              <h4 className="specs-compare-card-title">Traditional Workflow</h4>
              <div className="specs-compare-items">
                {product.comparisons.map((c, idx) => (
                  <div key={idx} className="specs-compare-item">
                    <span className="specs-compare-cross">✕</span>
                    <p>{c.standard}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="specs-compare-card is-new">
              <h4 className="specs-compare-card-title">With {productName}</h4>
              <div className="specs-compare-items">
                {product.comparisons.map((c, idx) => (
                  <div key={idx} className="specs-compare-item">
                    <span className="specs-compare-check">✓</span>
                    <p>{c.vplay}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. BOTTOM CTA BANNER */}
      <section className="product-bottom-cta">
        <div className="product-cta-box">
          <span className="editorial-section-tag">GET STARTED TODAY</span>
          <h2 className="product-cta-title">Upgrade your Premiere Pro workflow.</h2>
          <p className="product-cta-desc">
            Instant delivery, lifetime license, and seamless integration into Adobe Premiere Pro on Windows.
          </p>
          <div className="product-cta-actions">
            {product.comingSoon ? (
              <button type="button" className="editorial-outline-btn is-disabled" disabled>
                COMING SOON
              </button>
            ) : (
              <button
                type="button"
                className="editorial-outline-btn is-primary"
                onClick={() => onAddToCart(product.id)}
              >
                BUY NOW · ${product.price}
              </button>
            )}
            <button type="button" className="product-hero-back-link" style={{ marginBottom: 0, marginLeft: '8px' }} onClick={onBack}>
              ← Return to Store
            </button>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="editorial-footer">
        <div className="editorial-footer-center">
          <button type="button" onClick={onContactClick} className="editorial-footer-link">
            CONTACT
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
      </footer>
    </div>
  )
}
