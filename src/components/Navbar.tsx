// OntoLogo import removed — using store-logo.png image instead
import { ACCENT } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'

export type View = 'store' | 'cart' | 'contact' | 'testimonials' | 'checkout'

interface NavbarProps {
  view: View
  cartCount: number
  onCartClick: () => void
  onContactClick: () => void
  onTestimonialsClick: () => void
  onBackClick: () => void
}

function NavIconButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        color: active ? '#000000' : 'rgba(0,0,0,0.55)',
        transition: 'color 0.2s',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#000000' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'rgba(0,0,0,0.55)' }}
    >
      {children}
      {active && (
        <span
          style={{
            position: 'absolute',
            bottom: '-2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#000000',
          }}
        />
      )}
    </button>
  )
}

function CartIcon({ count }: { count: number }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.72L23 6H6" />
      </svg>
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#000000',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 700,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {count}
        </span>
      )}
    </div>
  )
}

function TestimonialsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ContactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

const DIVIDER = null

export default function Navbar({ view, cartCount, onCartClick, onContactClick, onTestimonialsClick, onBackClick }: NavbarProps) {
  const { isMobile } = useResponsive()
  const isSubView = view !== 'store'

  return (
    <nav
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '14px 20px' : '18px 48px',
        flexShrink: 0,
      }}
    >
      <img src={`${import.meta.env.BASE_URL}store-logo.png`} alt="ONTO" style={{ height: isMobile ? '28px' : '36px', width: 'auto' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {isSubView ? (
          <button
            onClick={onBackClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: 'none',
              border: '1px solid rgba(0,0,0,0.18)',
              color: 'rgba(0,0,0,0.7)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              padding: isMobile ? '6px 12px' : '7px 16px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.5)'
              e.currentTarget.style.color = '#000000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'
              e.currentTarget.style.color = 'rgba(0,0,0,0.7)'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {isMobile ? 'Back' : 'Back to Store'}
          </button>
        ) : (
          <>
            <NavIconButton onClick={onTestimonialsClick} active={view === 'testimonials'} title="Testimonials">
              <TestimonialsIcon />
            </NavIconButton>
            {DIVIDER}
            <NavIconButton onClick={onContactClick} active={view === 'contact'} title="Contact">
              <ContactIcon />
            </NavIconButton>
            {DIVIDER}
            <NavIconButton onClick={onCartClick} active={view === 'cart'} title="Cart">
              <CartIcon count={cartCount} />
            </NavIconButton>
          </>
        )}
      </div>
    </nav>
  )
}
