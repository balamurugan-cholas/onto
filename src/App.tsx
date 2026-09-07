import { useEffect, useRef, useState } from 'react'
import Navbar, { type View } from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import CartPage from './components/CartPage'
import ContactPage from './components/ContactPage'
import TestimonialsPage from './components/TestimonialsPage'
import { useResponsive } from './hooks/useResponsive'
import LegalPage, { type LegalView } from './components/LegalPage'
import LegalFooter from './components/LegalFooter'
import { products } from './data/products'
import { loadPurchase, savePurchase, validTransactionId } from './lib/purchaseStorage'
import { getPaddleConfig } from './lib/paddleConfig'
import { waitForDownload } from './lib/downloadClaim'
import PlatformModal, { type DownloadPlatform } from './components/PlatformModal'
import { detectDownloadPlatform } from './lib/platformDetection'
import AccountModal from './components/AccountModal'
import LibraryPage from './components/LibraryPage'
import { accountApi, accountToken, clearAccount, type AccountUser } from './lib/account'

const paymentConfig = getPaddleConfig(import.meta.env.MODE, import.meta.env.VITE_SANDBOX_WORKER_URL || '')
const VPLAY_DOWNLOAD_WORKER = paymentConfig.workerUrl

interface CartItem {
  productId: number
  qty: number
}

const LEGAL_VIEWS: LegalView[] = ['terms', 'privacy', 'refund']

export default function App() {
  const { isMobile } = useResponsive()
  const [view, setView] = useState<View>('store')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paddleReady, setPaddleReady] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState('')
  const [completedTransactionId, setCompletedTransactionId] = useState(() => loadPurchase(undefined, paymentConfig.environment))
  const downloadBusy = useRef(false)
  const [downloadInProgress, setDownloadInProgress] = useState(false)
  const [platformModalOpen, setPlatformModalOpen] = useState(false)
  const [pendingProductId, setPendingProductId] = useState<number | null>(null)
  const [downloadPlatform, setDownloadPlatform] = useState<DownloadPlatform>(() => detectDownloadPlatform() || 'windows')
  const [account, setAccount] = useState<AccountUser | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    if (!accountToken() || !VPLAY_DOWNLOAD_WORKER) return
    accountApi<{ user: AccountUser }>(VPLAY_DOWNLOAD_WORKER, '/auth/me').then(r => setAccount(r.user)).catch(() => clearAccount())
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
    const nextHash = LEGAL_VIEWS.includes(nextView as LegalView) ? `#/${nextView}` : ''
    window.history.pushState(null, '', nextHash || window.location.pathname)
  }

  useEffect(() => {
    const syncHash = () => {
      const requested = window.location.hash.replace(/^#\//, '') as LegalView
      if (LEGAL_VIEWS.includes(requested)) setView(requested)
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
    setDownloadStatus(
      'Checking your purchase and preparing a fresh download link…',
    )

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
      // Save before the automatic download, so cancelling/reloading is recoverable.
      savePurchase(transactionId, undefined, paymentConfig.environment)
      void prepareDownload(transactionId, true)
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
              window.dispatchEvent(new CustomEvent('onto:paddle-checkout-completed', {
                detail: { transactionId: event.data?.transaction_id },
              }))
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
    accountApi(VPLAY_DOWNLOAD_WORKER, '/library/link-purchase', { method: 'POST', body: JSON.stringify({ transactionId: completedTransactionId }) }).catch(() => {})
  }, [account, completedTransactionId])

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  const commitToCart = (productId: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      return existing
        ? prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { productId, qty: 1 }]
    })
  }

  const addToCart = (productId: number) => {
    const detectedPlatform = detectDownloadPlatform()
    if (detectedPlatform) {
      setDownloadPlatform(detectedPlatform)
      commitToCart(productId)
      return
    }
    setPendingProductId(productId)
    setPlatformModalOpen(true)
  }

  const choosePlatform = (platform: DownloadPlatform) => {
    if (pendingProductId === null) return
    setDownloadPlatform(platform)
    commitToCart(pendingProductId)
    setPendingProductId(null)
    setPlatformModalOpen(false)
  }

  const updateQty = (productId: number, qty: number) => {
    setCartItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)))
  }

  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const openPaddleCheckout = async () => {
    if (!account) { setAccountOpen(true); return }
    if (paymentConfig.sandbox && !VPLAY_DOWNLOAD_WORKER) {
      window.alert('Sandbox checkout is not ready: configure the separate sandbox download Worker first.')
      return
    }
    const paddle = (window as any).Paddle
    const hasVPlay = cartItems.some((item) => item.productId === 2)
    if (!paddleReady || !paddle) {
      window.alert('Secure checkout is still loading. Please try again in a moment.')
      return
    }
    if (!hasVPlay) {
      window.alert('VPlay is not in your cart.')
      return
    }
    let ownership: { accountId: string; expires: number; proof: string }
    try { ownership = await accountApi(VPLAY_DOWNLOAD_WORKER, '/checkout/account-proof', { method: 'POST' }) }
    catch (error) { window.alert(error instanceof Error ? error.message : 'Please sign in again.'); return }
    paddle.Checkout.open({
      items: [{ priceId: paymentConfig.priceId, quantity: 1 }],
      customData: { product: 'vplay', source: 'onto-website', platform: downloadPlatform, accountId: ownership.accountId, accountExpires: String(ownership.expires), accountProof: ownership.proof },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        variant: 'one-page',
        showAddDiscounts: true,
      },
    })
  }

  return (
    <div
      className="app-shell"
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        background: '#EDEDED',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Subtle luxury ambient lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 65% 55% at 70% 45%, rgba(0,0,0,0.015) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Top subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,0,0,0.02) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {paymentConfig.sandbox && <div style={{ position: 'relative', zIndex: 30, flexShrink: 0, padding: '7px 12px', background: '#ffe4a3', color: '#382800', textAlign: 'center', fontSize: 12 }}>SANDBOX — no real payments. {VPLAY_DOWNLOAD_WORKER ? 'Test purchases stay separate from live.' : 'Waiting for sandbox Worker setup.'}</div>}
      <Navbar
        view={view}
        cartCount={cartCount}
        onCartClick={() => navigate('cart')}
        onContactClick={() => navigate('contact')}
        onTestimonialsClick={() => navigate('testimonials')}
        onBackClick={() => navigate('store')}
        onAccountClick={() => setAccountOpen(true)}
        onLibraryClick={() => navigate('library')}
        signedIn={Boolean(account)}
      />

      {view === 'store' && (
        <HeroCarousel
          onAddToCart={addToCart}
          showRetryDownload={Boolean(completedTransactionId)}
          downloadInProgress={downloadInProgress}
          onRetryDownload={() => void prepareDownload(completedTransactionId)}
        />
      )}
      {view === 'cart' && (
        <CartPage
          cartItems={cartItems}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onCheckout={openPaddleCheckout}
          downloadPlatform={downloadPlatform}
        />
      )}
      {view === 'contact' && <ContactPage />}
      {view === 'testimonials' && <TestimonialsPage />}
      {view === 'library' && account && <LibraryPage worker={VPLAY_DOWNLOAD_WORKER} email={account.email} onSignOut={async () => {
        try { await accountApi(VPLAY_DOWNLOAD_WORKER, '/auth/logout', { method: 'POST' }) } catch {}
        clearAccount(); setAccount(null); navigate('store')
      }} onDownload={async platform => {
        const result = await accountApi<{ downloadUrl: string; licenseKey?: string }>(VPLAY_DOWNLOAD_WORKER, '/library/download', { method: 'POST', body: JSON.stringify({ platform }) })
        if (result.licenseKey && !paymentConfig.sandbox) void activateLocalAgent(result.licenseKey)
        window.location.assign(result.downloadUrl)
      }} />}
      {LEGAL_VIEWS.includes(view as LegalView) && <LegalPage type={view as LegalView} />}

      <LegalFooter onNavigate={navigate} marqueeNames={view === 'store' ? products.map((product) => product.slug) : undefined} />

      <PlatformModal
        open={platformModalOpen}
        onClose={() => { setPlatformModalOpen(false); setPendingProductId(null) }}
        onSelect={choosePlatform}
      />
      <AccountModal open={accountOpen} worker={VPLAY_DOWNLOAD_WORKER} onClose={() => setAccountOpen(false)} onSignedIn={user => setAccount(user)} />

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
              <div className="download-status-progress" aria-hidden="true"><span /></div>
            ) : (
              <button type="button" className="download-status-close" onClick={() => setDownloadStatus('')}>Close</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
