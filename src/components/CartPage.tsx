import React from 'react'
import { products } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'

interface CartItem {
  productId: number
  qty: number
}

interface CartPageProps {
  cartItems: CartItem[]
  onUpdateQty: (productId: number, qty: number) => void
  onRemove: (productId: number) => void
  onCheckout: () => void | Promise<void>
}

function EmptyState() {
  return (
    <div className="cart-empty-state">
      <div className="cart-empty-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.72L23 6H6" />
        </svg>
      </div>
      <h3 className="cart-empty-title">Your cart is empty</h3>
      <p className="cart-empty-desc">Explore our Premiere Pro plugins to add them to your cart.</p>
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

  const ItemRow = ({ product: p, qty }: { product: (typeof products)[0]; qty: number }) => (
    <div className="cart-item-row">
      {/* Product info */}
      <div className="cart-item-info">
        <div className="cart-item-thumb">
          <img src={p.img} alt={p.slug} />
        </div>
        <div className="cart-item-meta">
          <span className="cart-item-title">{p.slug.replace('.', '')}</span>
          <span className="cart-item-sub">{p.host} · {p.platform} · {p.license} License</span>
        </div>
      </div>

      <div className="cart-item-controls">
        <div className="cart-qty-stepper">
          <button type="button" onClick={() => qty > 1 ? onUpdateQty(p.id, qty - 1) : onRemove(p.id)}>−</button>
          <span>{qty}</span>
          <button type="button" onClick={() => onUpdateQty(p.id, qty + 1)}>+</button>
        </div>
        <span className="cart-item-price">${p.price * qty}</span>
        <button type="button" className="cart-item-remove" onClick={() => onRemove(p.id)} aria-label="Remove item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )

  return (
    <div className="editorial-subpage-container">
      <div className="editorial-subpage-header">
        <span className="editorial-subpage-kicker">SHOPPING CART</span>
        <h1 className="editorial-subpage-title">Review Order.</h1>
      </div>

      <div className="cart-layout-grid">
        <div className="cart-items-column">
          <div className="cart-header-row">
            <span>PRODUCT</span>
            <span>QTY & PRICE</span>
          </div>
          {lineItems.map(({ product, qty }) => (
            <ItemRow key={product.id} product={product} qty={qty} />
          ))}
        </div>

        <div className="cart-summary-card">
          <div className="cart-summary-head">
            <span>ORDER SUMMARY</span>
          </div>
          <div className="cart-summary-body">
            {lineItems.map(({ product: p, qty }) => (
              <div key={p.id} className="cart-summary-line">
                <span>{p.slug.replace('.', '')} × {qty}</span>
                <span>${p.price * qty}</span>
              </div>
            ))}
          </div>
          <div className="cart-summary-total">
            <span>TOTAL</span>
            <span>${total}</span>
          </div>
          <button type="button" className="cart-checkout-btn" onClick={onCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  )
}
