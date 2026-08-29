import { products, ACCENT } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'

interface CartItem {
  productId: number
  qty: number
}

interface CartPageProps {
  cartItems: CartItem[]
  onUpdateQty: (productId: number, qty: number) => void
  onRemove: (productId: number) => void
  onCheckout: () => void
}

function EmptyState() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative', zIndex: 10 }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.72L23 6H6" />
      </svg>
      <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.88rem', margin: 0 }}>Your cart is empty.</p>
    </div>
  )
}

export default function CartPage({ cartItems, onUpdateQty, onRemove, onCheckout }: CartPageProps) {
  const { isMobile } = useResponsive()

  const lineItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { product, qty: item.qty } : null
    })
    .filter(Boolean) as { product: (typeof products)[0]; qty: number }[]

  const total = lineItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0)

  if (lineItems.length === 0) return <EmptyState />

  // Shared item row renderer
  const ItemRow = ({ product: p, qty }: { product: (typeof products)[0]; qty: number }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : '1fr 80px 80px 36px',
        gap: '12px',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {/* Product info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: isMobile ? '44px' : '50px', height: isMobile ? '44px' : '50px', borderRadius: '2px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(0,0,0,0.06)' }}>
          <img src={p.img} alt={p.slug} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: isMobile ? '0.95rem' : '1.05rem', color: '#111111', letterSpacing: '-0.01em' }}>{p.slug}</span>
          <span style={{ fontSize: '0.67rem', color: 'rgba(0,0,0,0.55)', fontWeight: 500, letterSpacing: '0.04em' }}>{p.host} · {p.license}</span>
        </div>
      </div>

      {isMobile ? (
        // Mobile: price + qty + remove stacked on right
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '1.1rem', color: '#111111' }}>${p.price * qty}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => qty > 1 ? onUpdateQty(p.id, qty - 1) : onRemove(p.id)} style={{ width: '22px', height: '22px', border: '1px solid rgba(0,0,0,0.18)', background: 'none', color: 'rgba(0,0,0,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', borderRadius: '2px' }}>−</button>
            <span style={{ color: '#111111', fontSize: '0.82rem', fontWeight: 600, minWidth: '14px', textAlign: 'center' }}>{qty}</span>
            <button onClick={() => onUpdateQty(p.id, qty + 1)} style={{ width: '22px', height: '22px', border: '1px solid rgba(0,0,0,0.18)', background: 'none', color: 'rgba(0,0,0,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', borderRadius: '2px' }}>+</button>
            <button onClick={() => onRemove(p.id)} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.3)', cursor: 'pointer', padding: '2px', marginLeft: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4444' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Qty stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => qty > 1 ? onUpdateQty(p.id, qty - 1) : onRemove(p.id)} style={{ width: '22px', height: '22px', border: '1px solid rgba(0,0,0,0.18)', background: 'none', color: 'rgba(0,0,0,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', borderRadius: '2px', transition: 'all 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = '#000000' }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'; e.currentTarget.style.color = 'rgba(0,0,0,0.7)' }}>−</button>
            <span style={{ color: '#111111', fontSize: '0.85rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{qty}</span>
            <button onClick={() => onUpdateQty(p.id, qty + 1)} style={{ width: '22px', height: '22px', border: '1px solid rgba(0,0,0,0.18)', background: 'none', color: 'rgba(0,0,0,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', borderRadius: '2px', transition: 'all 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = '#000000' }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'; e.currentTarget.style.color = 'rgba(0,0,0,0.7)' }}>+</button>
          </div>
          {/* Price */}
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '1.1rem', color: '#111111' }}>${p.price * qty}</span>
          {/* Remove */}
          <button onClick={() => onRemove(p.id)} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.3)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4444' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </>
      )}
    </div>
  )

  // Order summary panel (shared between mobile/desktop)
  const Summary = () => (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <span style={{ color: 'rgba(0,0,0,0.52)', fontSize: '0.58rem', letterSpacing: '0.12em', fontWeight: 600 }}>ORDER SUMMARY</span>
      </div>
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {lineItems.map(({ product: p, qty }) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: 'rgba(0,0,0,0.75)', fontSize: '0.76rem', fontWeight: 500 }}>{p.slug.replace('.', '')} ×{qty}</span>
            <span style={{ color: '#111111', fontSize: '0.8rem', fontWeight: 600 }}>${p.price * qty}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.68rem', letterSpacing: '0.08em', fontWeight: 600 }}>TOTAL</span>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '1.6rem', color: '#111111' }}>${total}</span>
      </div>
      <button
        onClick={onCheckout}
        style={{ display: 'block', width: 'calc(100% - 36px)', margin: '0 18px 18px', padding: '11px', background: '#000000', border: 'none', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.2s' }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
      >
        CHECKOUT
      </button>
    </div>
  )

  if (isMobile) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', zIndex: 10, padding: '0 20px', overflowY: 'auto', scrollbarWidth: 'none' }}>
        {/* Column header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.58rem', letterSpacing: '0.12em', fontWeight: 600 }}>PRODUCT</span>
          <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.58rem', letterSpacing: '0.12em', textAlign: 'right', fontWeight: 600 }}>QTY / PRICE</span>
        </div>
        {lineItems.map(({ product, qty }) => <ItemRow key={product.id} product={product} qty={qty} />)}
        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}><Summary /></div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', gap: '0', padding: '0 48px', minHeight: 0, position: 'relative', zIndex: 10, alignItems: 'flex-start', overflowY: 'auto', scrollbarWidth: 'none' }}>
      {/* Left: items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '40px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 36px', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          {['PRODUCT', 'QTY', 'PRICE', ''].map((h) => (
            <span key={h} style={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.58rem', letterSpacing: '0.12em', fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {lineItems.map(({ product, qty }) => <ItemRow key={product.id} product={product} qty={qty} />)}
      </div>

      {/* Right: summary */}
      <div style={{ width: '268px', flexShrink: 0, alignSelf: 'flex-start', marginTop: '42px' }}>
        <Summary />
      </div>
    </div>
  )
}
