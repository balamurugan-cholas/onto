import { useEffect, useRef, useState } from 'react'
import Navbar, { type View } from './components/Navbar'
import HomePage from './components/HomePage'
import ProductPage from './components/ProductPage'
import VideoTourModal from './components/VideoTourModal'
import ProductDetailsModal from './components/ProductDetailsModal'
import CartPage from './components/CartPage'
import ContactPage from './components/ContactPage'
import TestimonialsPage from './components/TestimonialsPage'
import LegalPage, { type LegalView } from './components/LegalPage'
import AccountModal from './components/AccountModal'
import LibraryPage from './components/LibraryPage'
import { Product, products } from './data/products'
import { loadPurchase, savePurchase, validTransactionId } from './lib/purchaseStorage'
import { getPaddleConfig } from './lib/paddleConfig'
import { waitForDownload } from './lib/downloadClaim'
import { accountApi, accountToken, clearAccount, type AccountUser } from './lib/account'

const paymentConfig = getPaddleConfig(import.meta.env.MODE, import.meta.env.VITE_SANDBOX_WORKER_URL || '')
const VPLAY_DOWNLOAD_WORKER = paymentConfig.workerUrl

interface CartItem {
  productId: number
  qty: number
}

const LEGAL_VIEWS: LegalView[] = ['terms', 'privacy', 'refund']

export default function App() {
  const [view, setView] = useState<View>('store')
  const [activeProductId, setActiveProductId] = useState<number>(2) // Default to VPlay or 1 for TimelineKit
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paddleReady, setPaddleReady] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState('')
  const [completedTransactionId, setCompletedTransactionId] = useState(() => loadPurchase(undefined, paymentConfig.environment))
  const downloadBusy = useRef(false)
  const checkoutProductId = useRef<number>(2)
  const [downloadInProgress, setDownloadInProgress] = useState(false)
  const downloadPlatform = 'windows' as const
  const [account, setAccount] = useState<AccountUser | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const [videoTourProduct, setVideoTourProduct] = useState<Product | null>(null)
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!accountToken() || !VPLAY_DOWNLOAD_WORKER) return
    accountApi<{ user: AccountUser }>(VPLAY_DOWNLOAD_WORKER, '/auth/me')
      .then((r) => setAccount(r.user))
      .catch(() => clearAccount())
  }, [])

  const activateLocalAgent = async (licenseKey: string) => {
    const deadline = Date.now() + 10 * 60 * 1000
    const attempt = async (): Promise<void> => {
      try {
        const response = await fetch('http://127.0.0.1:43115/license/activate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ licenseKey }),
        })
        if (response.ok) {
          return
        }
      } catch {
        // The freshly downloaded agent may not be installed or running yet.
      }
      if (Date.now() < deadline) window.setTimeout(attempt, 3000)
    }
    await attempt()
  }

  const navigate = (nextView: View) => {
    setView(nextView)
    if (nextView === 'vplay') setActiveProductId(2)
    if (nextView === 'timelinekit') setActiveProductId(1)
    const nextHash =
      LEGAL_VIEWS.includes(nextView as LegalView) ||
      nextView === 'vplay' ||
      nextView === 'timelinekit' ||
      nextView === 'cart' ||
      nextView === 'contact' ||
      nextView === 'testimonials'
        ? `#/${nextView}`
        : ''
    window.history.pushState(null, '', nextHash || window.location.pathname)
  }

  useEffect(() => {
    const syncHash = () => {
      const requested = window.location.hash.replace(/^#\//, '') as View
      if (LEGAL_VIEWS.includes(requested as LegalView) || requested === 'vplay' || requested === 'timelinekit' || requested === 'cart' || requested === 'contact' || requested === 'testimonials') {
        setView(requested)
        if (requested === 'vplay') setActiveProductId(2)
        if (requested === 'timelinekit') setActiveProductId(1)
      } else if (!requested) {
        setView('store')
      }
    }
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  const prepareDownload = async (transactionId: string, newPurchase = false) => {
    if (!VPLAY_DOWNLOAD_WORKER) {
      setDownloadStatus('Sandbox download Worker is not configured yet. No live download request was made.')
      return
    }
    if (downloadBusy.current || !validTransactionId(transactionId)) return
    downloadBusy.current = true
    setDownloadInProgress(true)
    setDownloadStatus('Checking your purchase and preparing a fresh download link…')

    try {
      const result = await waitForDownload(VPLAY_DOWNLOAD_WORKER, transactionId, newPurchase, {
        onProgress: setDownloadStatus,
        token: accountToken(),
      })
      if (result.downloadUrl) {
        savePurchase(transactionId, undefined, paymentConfig.environment)
        setCompletedTransactionId(transactionId)
        if (result.licenseKey) {
          if (!paymentConfig.sandbox) void activateLocalAgent(result.licenseKey)
        }
        setDownloadStatus('Your download is starting…')
        window.location.assign(result.downloadUrl)
        window.setTimeout(() => setDownloadStatus(''), 1200)
        setDownloadInProgress(false)
        downloadBusy.current = false
        return
      }
    } catch (error) {
      setDownloadStatus(error instanceof Error ? error.message : 'Download interrupted. Please use Download Again; no new payment is needed.')
    } finally {
      setDownloadInProgress(false)
      downloadBusy.current = false
    }
  }

  useEffect(() => {
    const handleCompleted = (event: Event) => {
      setCartItems([])
      setView('store')

      const transactionId = (event as CustomEvent<{ transactionId?: string }>).detail?.transactionId
      if (!validTransactionId(transactionId)) {
        setDownloadStatus('Payment succeeded. Please contact support for your download link.')
        return
      }
      setCompletedTransactionId(transactionId)
      savePurchase(transactionId, undefined, paymentConfig.environment)
      if (checkoutProductId.current === 2) void prepareDownload(transactionId, true)
      else {
        setDownloadStatus('Payment succeeded. TimelineKit is being added to your Library…')
        window.setTimeout(() => navigate('library'), 2200)
      }
    }
    window.addEventListener('onto:paddle-checkout-completed', handleCompleted)

    let attempts = 0
    const initialize = () => {
      const paddle = (window as any).Paddle
      if (!paddle) {
        attempts += 1
        if (attempts < 100) window.setTimeout(initialize, 100)
        return
      }
      if (!(window as any).__ontoPaddleInitialized) {
        if (paymentConfig.sandbox) paddle.Environment.set('sandbox')
        paddle.Initialize({
          token: paymentConfig.token,
          eventCallback: (event: { name?: string; data?: { transaction_id?: string } }) => {
            if (event?.name === 'checkout.completed') {
              window.dispatchEvent(
                new CustomEvent('onto:paddle-checkout-completed', {
                  detail: { transactionId: event.data?.transaction_id },
                })
              )
              window.setTimeout(() => paddle.Checkout.close(), 800)
            }
          },
        })
        ;(window as any).__ontoPaddleInitialized = true
        ;(window as any).__ontoPaddleEnvironment = paymentConfig.environment
      }
      if ((window as any).__ontoPaddleEnvironment !== paymentConfig.environment) return
      setPaddleReady(true)
    }
    initialize()

    return () => window.removeEventListener('onto:paddle-checkout-completed', handleCompleted)
  }, [])

  useEffect(() => {
    if (!account || !completedTransactionId) return
    accountApi(VPLAY_DOWNLOAD_WORKER, '/library/link-purchase', {
      method: 'POST',
      body: JSON.stringify({ transactionId: completedTransactionId }),
    }).catch(() => {})
  }, [account, completedTransactionId])

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  const commitToCart = (productId: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      return existing
        ? prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { productId, qty: 1 }]
    })
    navigate('cart')
  }

  const addToCart = (productId: number) => {
    commitToCart(productId)
  }

  const updateQty = (productId: number, qty: number) => {
    setCartItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)))
  }

  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const openPaddleCheckout = async () => {
    if (!account) {
      setAccountOpen(true)
      return
    }
    if (paymentConfig.sandbox && !VPLAY_DOWNLOAD_WORKER) {
      window.alert('Sandbox checkout is not ready: configure the separate sandbox download Worker first.')
      return
    }
    const paddle = (window as any).Paddle
    if (!paddleReady || !paddle) {
      window.alert('Secure checkout is still loading. Please try again in a moment.')
      return
    }
    if (cartItems.length !== 1) {
      window.alert('Please purchase one plugin at a time so it can be linked and downloaded automatically.')
      return
    }
    const checkoutItem = cartItems[0]
    checkoutProductId.current = checkoutItem.productId
    let ownership: { accountId: string; expires: number; proof: string }
    try {
      ownership = await accountApi(VPLAY_DOWNLOAD_WORKER, '/checkout/account-proof', { method: 'POST' })
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Please sign in again.')
      return
    }
    paddle.Checkout.open({
      items: [{ priceId: checkoutItem.productId === 1 ? paymentConfig.timelineKitPriceId : paymentConfig.priceId, quantity: checkoutItem.qty }],
      customData: {
        product: checkoutItem.productId === 1 ? 'timelinekit' : 'vplay',
        source: 'onto-website',
        platform: downloadPlatform,
        accountId: ownership.accountId,
        accountExpires: String(ownership.expires),
        accountProof: ownership.proof,
      },
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        variant: 'one-page',
        showAddDiscounts: true,
      },
    })
  }

  return (
    <div className="app-shell">
      {/* Background radial vignette */}
      <div className="app-vignette" aria-hidden="true" />

      {paymentConfig.sandbox && (
        <div
          style={{
            position: 'relative',
            zIndex: 110,
            flexShrink: 0,
            padding: '6px 14px',
            background: 'rgba(255, 91, 34, 0.15)',
            borderBottom: '1px solid rgba(255, 91, 34, 0.3)',
            color: '#FF723D',
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          SANDBOX MODE — Test purchases stay separate from live.
        </div>
      )}

      {/* Minimalist Top Navigation Header matching reference */}
      <Navbar
        view={view}
        cartCount={cartCount}
        activeProductId={activeProductId}
        onCartClick={() => navigate('cart')}
        onContactClick={() => navigate('contact')}
        onTestimonialsClick={() => navigate('testimonials')}
        onBackClick={() => navigate('store')}
        onAccountClick={() => setAccountOpen(true)}
        onLibraryClick={() => navigate('library')}
        signedIn={Boolean(account)}
        onHomeClick={() => {
          navigate('store')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onVPlayClick={() => {
          if (view !== 'store') navigate('store')
          setTimeout(() => {
            document.getElementById('hero-vplay')?.scrollIntoView({ behavior: 'smooth' })
          }, 50)
        }}
        onTimelineKitClick={() => {
          if (view !== 'store') navigate('store')
          setTimeout(() => {
            document.getElementById('other-plugins')?.scrollIntoView({ behavior: 'smooth' })
          }, 50)
        }}
        onTestimonialsClick={() => {
          if (view !== 'store') navigate('store')
          setTimeout(() => {
            document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })
          }, 50)
        }}
        onContactClick={() => {
          if (view !== 'store') navigate('store')
          setTimeout(() => {
            document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
          }, 50)
        }}
        onLegalClick={(legalView) => navigate(legalView)}
      />

      {/* Primary Dedicated Home Page */}
      {view === 'store' && (
        <HomePage
          onLearnMore={(slug) => navigate(slug)}
          onLegalClick={(legalView) => navigate(legalView)}
        />
      )}

      {/* Dedicated VPlay Plugin Page */}
      {view === 'vplay' && (
        <ProductPage
          productId={2}
          onBack={() => navigate('store')}
          onAddToCart={addToCart}
          onOpenVideoTour={(product) => setVideoTourProduct(product)}
          onLegalClick={(legalView) => navigate(legalView)}
          onContactClick={() => navigate('contact')}
        />
      )}

      {/* Dedicated TimelineKit Plugin Page */}
      {view === 'timelinekit' && (
        <ProductPage
          productId={1}
          onBack={() => navigate('store')}
          onAddToCart={addToCart}
          onOpenVideoTour={(product) => setVideoTourProduct(product)}
          onLegalClick={(legalView) => navigate(legalView)}
          onContactClick={() => navigate('contact')}
        />
      )}

      {/* Overlays / Views */}
      {view === 'cart' && (
        <CartPage
          cartItems={cartItems}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onCheckout={openPaddleCheckout}
        />
      )}

      {view === 'contact' && <ContactPage />}

      {view === 'testimonials' && <TestimonialsPage onBack={() => navigate('store')} />}

      {view === 'library' && account && (
        <LibraryPage
          worker={VPLAY_DOWNLOAD_WORKER}
          email={account.email}
          onSignOut={async () => {
            try {
              await accountApi(VPLAY_DOWNLOAD_WORKER, '/auth/logout', { method: 'POST' })
            } catch {}
            clearAccount()
            setAccount(null)
            navigate('store')
          }}
          onDownload={async (productId, platform) => {
            const result = await accountApi<{ downloadUrl: string; licenseKey?: string }>(
              VPLAY_DOWNLOAD_WORKER,
              '/library/download',
              { method: 'POST', body: JSON.stringify({ productId, platform }) }
            )
            if (result.licenseKey && !paymentConfig.sandbox) void activateLocalAgent(result.licenseKey)
            window.location.assign(result.downloadUrl)
          }}
        />
      )}

      {LEGAL_VIEWS.includes(view as LegalView) && <LegalPage type={view as LegalView} />}

      {/* Video Tour Lightbox Modal */}
      <VideoTourModal
        product={videoTourProduct}
        onClose={() => setVideoTourProduct(null)}
      />

      {/* Product Deep Dive & Specs Drawer */}
      <ProductDetailsModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onAddToCart={addToCart}
      />

      {/* Account Modal */}
      <AccountModal
        open={accountOpen}
        worker={VPLAY_DOWNLOAD_WORKER}
        onClose={() => setAccountOpen(false)}
        onSignedIn={(user) => setAccount(user)}
      />

      {/* Download Status Toast / Dialog */}
      {downloadStatus && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Download status"
          className="download-status-backdrop"
        >
          <div role="status" aria-live="polite" className="download-status-card">
            <div className={`download-status-mark${downloadInProgress ? ' is-loading' : ''}`} aria-hidden="true">
              {downloadInProgress ? <span /> : '!'}
            </div>
            <div className="download-status-content">
              <span className="download-status-kicker">VPLAY INSTALLER</span>
              <h2>{downloadInProgress ? 'Preparing your download' : 'Download needs attention'}</h2>
              <p>{downloadStatus}</p>
            </div>
            {downloadInProgress ? (
              <div className="download-status-progress" aria-hidden="true">
                <span />
              </div>
            ) : (
              <button type="button" className="download-status-close" onClick={() => setDownloadStatus('')}>
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
