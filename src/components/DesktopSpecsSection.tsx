import React from 'react'
import { Product } from '../data/products'

interface DesktopSpecsSectionProps {
  product: Product
  onAddToCart: (productId: number) => void
}

export default function DesktopSpecsSection({
  product,
  onAddToCart,
}: DesktopSpecsSectionProps) {
  const scrollToTop = () => {
    const container =
      document.querySelector('.showcase-scroll-viewport') ||
      document.querySelector('.showcase-container')
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isVPlay = product.id === 2
  const productName = product.slug.replace('.', '')

  return (
    <section id="specs-features" className="desktop-specs-section">
      <div className="specs-section-container">
        {/* Minimal Clean Top Specs Bar */}
        <div className="specs-minimal-bar">
          <div className="specs-min-item">
            <span className="specs-min-label">HOST</span>
            <span className="specs-min-value">{product.host}</span>
          </div>
          <div className="specs-min-divider" />
          <div className="specs-min-item">
            <span className="specs-min-label">PLATFORM</span>
            <span className="specs-min-value">{product.platform}</span>
          </div>
        </div>

        {/* Feature Spotlight Showcases (Alternating Rows matching Reference Image 3) */}
        <div className="specs-spotlight-list">
          {isVPlay ? (
            <>
              {/* Row 1: Left UI Image, Right Text */}
              <div className="specs-spotlight-row">
                <div className="specs-spotlight-media">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}range-trim.png`}
                      alt="Precision Range Trimming in VPlay"
                      className="specs-spotlight-img"
                    />
                  </div>
                </div>
                <div className="specs-spotlight-content">
                  <h3 className="specs-spotlight-title">Precision Range Trimming</h3>
                  <p className="specs-spotlight-desc">
                    Pull a 5-second clip from a 12-hour video in just 15–20 seconds without downloading gigabytes of unwanted footage. Set custom in and out points with fluid scrubbing directly inside Premiere Pro before committing.
                  </p>
                </div>
              </div>

              {/* Row 2: Left Text, Right UI Image */}
              <div className="specs-spotlight-row is-reversed">
                <div className="specs-spotlight-content">
                  <h3 className="specs-spotlight-title">Direct Timeline Insertion</h3>
                  <p className="specs-spotlight-desc">
                    Forget window switching and desktop clutter. VPlay imports downloaded videos, audio streams, and thumbnails directly into your active project bins and drops them straight onto your playhead target track.
                  </p>
                </div>
                <div className="specs-spotlight-media">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}timeline-insertion.png`}
                      alt="Direct Timeline Insertion in Premiere Pro"
                      className="specs-spotlight-img"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Left UI Image, Right Text */}
              <div className="specs-spotlight-row">
                <div className="specs-spotlight-media">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}download-history.png`}
                      alt="Searchable Download History in VPlay"
                      className="specs-spotlight-img"
                    />
                  </div>
                </div>
                <div className="specs-spotlight-content">
                  <h3 className="specs-spotlight-title">Searchable History & Re-Download</h3>
                  <p className="specs-spotlight-desc">
                    Every download, source URL, thumbnail, and format variant remains cataloged in a searchable panel. Re-open file directories, re-download from original sources, or search spoken moments via transcript integration.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* TimelineKit Row 1 */}
              <div className="specs-spotlight-row">
                <div className="specs-spotlight-media">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}timelinekit.png`}
                      alt="Complete Arrangement Presets in TimelineKit"
                      className="specs-spotlight-img"
                    />
                  </div>
                </div>
                <div className="specs-spotlight-content">
                  <h3 className="specs-spotlight-title">Complete Arrangement Presets</h3>
                  <p className="specs-spotlight-desc">
                    Save complex multi-track timeline selections — including cuts, transitions, effects, and audio sync — and paste them back into any project with perfect alignment.
                  </p>
                </div>
              </div>

              {/* TimelineKit Row 2 */}
              <div className="specs-spotlight-row is-reversed">
                <div className="specs-spotlight-content">
                  <h3 className="specs-spotlight-title">Hotkey Support & Unfocused Execution</h3>
                  <p className="specs-spotlight-desc">
                    Assign shortcuts to your favorite presets and insert them instantly without even focusing the plugin panel. Choose Start, Anchor, or End playhead alignment on the fly.
                  </p>
                </div>
                <div className="specs-spotlight-media">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}timelinekit.png`}
                      alt="Hotkey Support & Unfocused Execution"
                      className="specs-spotlight-img"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Minimal Comparison View */}
        {product.comparisons && product.comparisons.length > 0 && (
          <div className="specs-compare-wrapper">
            <h3 className="specs-spotlight-title text-center">Workflow Comparison</h3>
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
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="specs-cta-banner">
          <div className="specs-cta-info">
            <h4 className="specs-cta-heading">Ready to upgrade your editing speed?</h4>
            <p className="specs-cta-sub">
              ${product.price} one-time payment · Instant download & lifetime license
            </p>
          </div>
          <div className="specs-cta-actions">
            {product.comingSoon ? (
              <button type="button" className="showcase-btn-orange is-disabled" disabled>
                <span className="showcase-btn-bar" />
                <span className="showcase-btn-text">COMING SOON</span>
              </button>
            ) : (
              <button
                type="button"
                className="showcase-btn-orange"
                onClick={() => onAddToCart(product.id)}
              >
                <span className="showcase-btn-bar" />
                <span className="showcase-btn-text">BUY NOW · ${product.price}</span>
              </button>
            )}
            <button
              type="button"
              className="specs-back-top-btn"
              onClick={scrollToTop}
              title="Back to top"
            >
              ↑ Top
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
