import React, { useEffect, useState } from 'react'
import { accountApi } from '../lib/account'

type Product = { id: string; name: string; purchasedAt: number }

interface LibraryPageProps {
  worker: string
  email: string
  initialProducts?: Product[]
  onDownload: (productId: string, platform: 'windows') => Promise<void>
  onSignOut: () => Promise<void>
  onExplore?: () => void
}

export default function LibraryPage({
  worker,
  email,
  initialProducts = [],
  onDownload,
  onSignOut,
  onExplore,
}: LibraryPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  const [loading, setLoading] = useState(initialProducts.length === 0)

  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (initialProducts.length === 0) return
    setProducts(initialProducts)
    setLoading(false)
  }, [initialProducts])

  useEffect(() => {
    let cancelled = false
    let attempts = 0
    let timer = 0

    const load = () => {
      accountApi<{ products: Product[] }>(worker, '/library')
        .then((r) => {
          if (cancelled) return
          setProducts(r.products)
          setError('')
          setLoading(false)
          attempts += 1
          if (r.products.length === 0 && attempts < 16) {
            timer = window.setTimeout(load, 2000)
          }
        })
        .catch((e) => {
          if (!cancelled) {
            setError(e.message)
            setLoading(false)
          }
        })
    }

    void load()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [worker])

  const download = async (productId: string) => {
    setBusy(productId)
    setError('')
    try {
      await onDownload(productId, 'windows')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed.')
    } finally {
      setBusy('')
    }
  }

  const getProductImg = (name: string, id: string) => {
    const lower = (name + ' ' + id).toLowerCase()
    if (lower.includes('vplay')) {
      return `${import.meta.env.BASE_URL}vplay-hero-pluginverse.png`
    }
    if (lower.includes('timeline') || lower.includes('bind') || lower.includes('kit')) {
      return `${import.meta.env.BASE_URL}timelinekit.png`
    }
    return `${import.meta.env.BASE_URL}timelinekit.png`
  }

  return (
    <div className="library-page-container">
      {/* Header */}
      <div className="library-header">
        <div className="library-header-info">
          <span className="editorial-section-tag">ACCOUNT & LICENSES</span>
          <h1 className="library-title">Purchased Library</h1>
          <p className="library-subtitle">
            <span className="library-email-badge">{email}</span>
          </p>
        </div>

        <div className="library-header-actions">
          <button
            type="button"
            className="library-signout-btn"
            onClick={() => void onSignOut()}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="library-error-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Product List */}
      <div className="library-content">
        {!error && loading && (
          <div className="library-loading-state" role="status" aria-label="Loading your library">
            <span className="purchase-loading-dots" aria-hidden="true"><i /><i /><i /></span>
          </div>
        )}

        {!error && products.length === 0 && !loading && (
          <div className="library-empty-state">
            <div className="library-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="library-empty-title">No plugins in your library yet</h3>
            <p className="library-empty-desc">
              Purchases linked to <strong>{email}</strong> will appear here automatically with instant installer downloads.
            </p>
            {onExplore && (
              <button
                type="button"
                className="editorial-outline-btn is-primary"
                style={{ marginTop: '20px' }}
                onClick={onExplore}
              >
                Browse Plugins →
              </button>
            )}
          </div>
        )}

        {products.length > 0 && (
          <div className="library-products-grid">
            {products.map((product) => {
              const imgUrl = getProductImg(product.name, product.id)
              return (
                <article className="library-product-card" key={product.id}>
                  <div className="library-card-left">
                    <div className="library-product-thumb">
                      {imgUrl && !imgErrorMap[product.id] ? (
                        <img
                          src={imgUrl}
                          alt={product.name}
                          className="library-thumb-img"
                          onError={() => setImgErrorMap((prev) => ({ ...prev, [product.id]: true }))}
                        />
                      ) : (
                        <span className="library-product-mark">{product.name.charAt(0)}</span>
                      )}
                    </div>

                    <div className="library-product-meta">
                      <div className="library-product-title-row">
                        <h2 className="library-product-name">{product.name}</h2>
                      </div>
                      <p className="library-product-specs">
                        Adobe Premiere Pro · Windows
                      </p>
                    </div>
                  </div>

                  <div className="library-card-right">
                    <button
                      type="button"
                      className="library-download-btn"
                      disabled={Boolean(busy)}
                      onClick={() => void download(product.id)}
                    >
                      {busy === product.id ? (
                        <>
                          <span className="library-spinner" />
                          Preparing…
                        </>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Download for Windows
                        </>
                      )}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
