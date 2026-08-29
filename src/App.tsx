import { useEffect, useState } from 'react'
import Navbar, { type View } from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import CartPage from './components/CartPage'
import ContactPage from './components/ContactPage'
import TestimonialsPage from './components/TestimonialsPage'
import { useResponsive } from './hooks/useResponsive'

const PADDLE_LIVE_TOKEN = 'live_54ff1764490ca5baad198bbae59'
const VPLAY_LIVE_PRICE_ID = 'pri_01m15mhh168qw8gxjs6fcb6mxw'
const VPLAY_DOWNLOAD_WORKER = 'https://vplay-download.balamuruganofficial3.workers.dev'

interface CartItem {
  productId: number
  qty: number
}

export default function App() {
  const { isMobile } = useResponsive()
  const [view, setView] = useState<View>('store')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paddleReady, setPaddleReady] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState('')
  const [completedTransactionId, setCompletedTransactionId] = useState('')
  const [downloadInProgress, setDownloadInProgress] = useState(false)

  const prepareDownload = async (transactionId: string) => {
    setDownloadInProgress(true)
    setDownloadStatus(
      'Payment successful — verifying your order and preparing the download…',
    )

    for (let attempt = 0; attempt < 120; attempt += 1) {
      try {
        const response = await fetch(`${VPLAY_DOWNLOAD_WORKER}/claim`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ transactionId }),
        })
        const result = await response.json() as {
          ok?: boolean
          pending?: boolean
          downloadUrl?: string
        }

        if (response.ok && result.ok && result.downloadUrl) {
          setDownloadStatus('Your download is starting…')
          window.location.assign(result.downloadUrl)
          window.setTimeout(() => setDownloadStatus(''), 1200)
          setDownloadInProgress(false)
          return
        }
        if (response.status === 400 || response.status === 403) break
      } catch {
        // Retry briefly while Paddle's verified webhook reaches the Worker.
      }

      await new Promise((resolve) => window.setTimeout(resolve, 1500))
    }

    setDownloadInProgress(false)
    setDownloadStatus(
      'Payment succeeded, but the download could not start automatically. Use Retry download below.',
    )
  }

  useEffect(() => {
    const handleCompleted = (event: Event) => {
      setCartItems([])
      setView('store')

      const transactionId = (event as CustomEvent<{ transactionId?: string }>).detail?.transactionId
      if (!transactionId) {
        setDownloadStatus('Payment succeeded. Please contact support for your download link.')
        return
      }
      setCompletedTransactionId(transactionId)
      void prepareDownload(transactionId)
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
        paddle.Initialize({
          token: PADDLE_LIVE_TOKEN,
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
      }
      setPaddleReady(true)
    }
    initialize()

    return () => window.removeEventListener('onto:paddle-checkout-completed', handleCompleted)
  }, [])

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  const addToCart = (productId: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      return existing
        ? prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { productId, qty: 1 }]
    })
  }

  const updateQty = (productId: number, qty: number) => {
    setCartItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)))
  }

  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const openPaddleCheckout = () => {
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
    paddle.Checkout.open({
      items: [{ priceId: VPLAY_LIVE_PRICE_ID, quantity: 1 }],
      customData: { product: 'vplay', source: 'onto-website' },
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
      style={{
        width: '100vw',
        height: '100vh',
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

      <Navbar
        view={view}
        cartCount={cartCount}
        onCartClick={() => setView('cart')}
        onContactClick={() => setView('contact')}
        onTestimonialsClick={() => setView('testimonials')}
        onBackClick={() => setView('store')}
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
        />
      )}
      {view === 'contact' && <ContactPage />}
      {view === 'testimonials' && <TestimonialsPage />}

      {completedTransactionId && !isMobile && (
        <button
          type="button"
          disabled={downloadInProgress}
          onClick={() => void prepareDownload(completedTransactionId)}
          style={{
            position: 'fixed',
            left: 64,
            bottom: 48,
            zIndex: 9999,
            height: 34,
            padding: '0 16px',
            border: 0,
            borderRadius: 0,
            color: '#fff',
            background: downloadInProgress ? '#666' : '#111',
            fontWeight: 700,
            cursor: downloadInProgress ? 'wait' : 'pointer',
          }}
        >
          {downloadInProgress ? 'Preparing download…' : 'Retry download'}
        </button>
      )}

      {downloadStatus && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Download status"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: 'rgba(0,0,0,0.38)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            role="status"
            style={{
              maxWidth: 520,
              width: '100%',
              padding: '26px 28px',
              borderRadius: 14,
              color: '#fff',
              background: '#111',
              boxShadow: '0 22px 70px rgba(0,0,0,0.35)',
              textAlign: 'center',
              fontSize: 15,
              lineHeight: 1.55,
            }}
          >
            {downloadStatus}
          </div>
        </div>
      )}
    </div>
  )
}
