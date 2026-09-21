import React from 'react'
import { Product } from '../data/products'

interface ProductDetailsModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (productId: number) => void
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  if (!product) return null

  const isVPlay = product.id === 2
  const productName = product.slug.replace('.', '')

  return (
    <div
      className="details-drawer-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="details-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="details-drawer-header">
          <div>
            <span className="details-drawer-kicker">
              {product.version} · {product.platform}
            </span>
            <h2 className="details-drawer-title">{productName}</h2>
          </div>
          <button
            type="button"
            className="details-drawer-close"
            onClick={onClose}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        <div className="details-drawer-content">
          <p className="details-drawer-desc">{product.description}</p>

          {/* Minimal Specs Bar */}
          <div className="specs-minimal-bar" style={{ maxWidth: '100%', marginBottom: '10px' }}>
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

          {/* Spotlight Feature Cards with Real Images */}
          <div className="drawer-spotlight-list">
            {isVPlay ? (
              <>
                <div className="drawer-spotlight-card">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}range-trim.png`}
                      alt="Precision Range Trimming"
                      className="specs-spotlight-img"
                    />
                  </div>
                  <div className="drawer-spotlight-text">
                    <h3 className="drawer-spotlight-title">Precision Range Trimming</h3>
                    <p className="drawer-spotlight-desc">
                      Pull a 5-second clip from a 12-hour video in just 15–20 seconds without downloading gigabytes of unwanted footage. Set custom in and out points directly inside Premiere Pro.
                    </p>
                  </div>
                </div>

                <div className="drawer-spotlight-card">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}timeline-insertion.png`}
                      alt="Direct Timeline Insertion"
                      className="specs-spotlight-img"
                    />
                  </div>
                  <div className="drawer-spotlight-text">
                    <h3 className="drawer-spotlight-title">Direct Timeline Insertion</h3>
                    <p className="drawer-spotlight-desc">
                      Imports downloaded media directly into your active project bins and drops them straight onto your playhead target track without leaving Premiere Pro.
                    </p>
                  </div>
                </div>

                <div className="drawer-spotlight-card">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}download-history.png`}
                      alt="Searchable Download History"
                      className="specs-spotlight-img"
                    />
                  </div>
                  <div className="drawer-spotlight-text">
                    <h3 className="drawer-spotlight-title">Searchable History & Re-Download</h3>
                    <p className="drawer-spotlight-desc">
                      Every download, source link, thumbnail, and format variant remains cataloged in a searchable panel with one-click re-download and transcript navigation.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="drawer-spotlight-card">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}timelinekit.png`}
                      alt="Complete Arrangement Presets"
                      className="specs-spotlight-img"
                    />
                  </div>
                  <div className="drawer-spotlight-text">
                    <h3 className="drawer-spotlight-title">Complete Arrangement Presets</h3>
                    <p className="drawer-spotlight-desc">
                      Save complex multi-track timeline selections — including cuts, transitions, effects, and audio sync — and paste them back into any project with perfect alignment.
                    </p>
                  </div>
                </div>

                <div className="drawer-spotlight-card">
                  <div className="specs-ui-frame">
                    <img
                      src={`${import.meta.env.BASE_URL}timelinekit.png`}
                      alt="Hotkey Support & Unfocused Execution"
                      className="specs-spotlight-img"
                    />
                  </div>
                  <div className="drawer-spotlight-text">
                    <h3 className="drawer-spotlight-title">Hotkey Support & Unfocused Execution</h3>
                    <p className="drawer-spotlight-desc">
                      Assign shortcuts to your favorite presets and insert them instantly without even focusing the plugin panel. Choose Start, Anchor, or End playhead alignment on the fly.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Workflow Comparison */}
          {product.comparisons && product.comparisons.length > 0 && (
            <div className="drawer-compare-section">
              <h3 className="drawer-spotlight-title">Workflow Comparison</h3>
              <div className="specs-compare-grid" style={{ gridTemplateColumns: '1fr' }}>
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
        </div>

        <div className="details-drawer-footer">
          <div className="details-footer-price">
            <span>Price:</span>
            <strong>${product.price}</strong>
            <small>One-time payment</small>
          </div>
          {product.comingSoon ? (
            <button type="button" className="details-action-btn is-disabled" disabled>
              Coming Soon
            </button>
          ) : (
            <button
              type="button"
              className="details-action-btn"
              onClick={() => {
                onAddToCart(product.id)
                onClose()
              }}
            >
              BUY NOW · ${product.price}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
