import React, { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'

export type View =
  | 'store'
  | 'vplay'
  | 'timelinekit'
  | 'cart'
  | 'contact'
  | 'testimonials'
  | 'checkout'
  | 'terms'
  | 'privacy'
  | 'refund'
  | 'library'

interface NavbarProps {
  view: View
  cartCount: number
  activeProductId?: number
  onCartClick: () => void
  onContactClick: () => void
  onTestimonialsClick: () => void
  onBackClick: () => void
  onAccountClick: () => void
  onLibraryClick: () => void
  signedIn: boolean
  onHomeClick: () => void
  onVPlayClick: () => void
  onTimelineKitClick: () => void
  onLegalClick?: (type: 'terms' | 'privacy' | 'refund') => void
}

export default function Navbar({
  view,
  cartCount,
  onCartClick,
  onContactClick,
  onTestimonialsClick,
  onAccountClick,
  onLibraryClick,
  signedIn,
  onHomeClick,
  onVPlayClick,
  onTimelineKitClick,
  onLegalClick,
}: NavbarProps) {
  const { isMobile } = useResponsive()
  const [menuOpen, setMenuOpen] = useState(false)

  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const go = (action: () => void) => {
    setMenuOpen(false)
    action()
  }

  return (
    <>
      <nav className="minimal-navbar">
        {/* Left Side: Only Website Icon */}
        <div className="navbar-left-brand">
          <button
            type="button"
            className="navbar-logo-btn"
            onClick={onHomeClick}
            aria-label="Home"
            title="Pluginverse Home"
          >
            <img
              src={`${import.meta.env.BASE_URL}pluginverse-logo.png`}
              alt="Pluginverse"
              className="navbar-logo-img"
            />
          </button>
        </div>

        {/* Right Side: Account, Cart (both desktop & mobile) + Modern Hamburger (mobile only) */}
        <div className="navbar-right-actions">
          {/* Cart Icon with Count Badge */}
          <button
            type="button"
            className={`navbar-icon-btn ${view === 'cart' ? 'is-active' : ''}`}
            onClick={onCartClick}
            aria-label={`Cart with ${cartCount} items`}
            title="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.72L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="navbar-badge">{cartCount}</span>
            )}
          </button>

          {/* Profile / Account Icon */}
          <button
            type="button"
            className={`navbar-icon-btn ${view === 'library' ? 'is-active' : ''}`}
            onClick={signedIn ? onLibraryClick : onAccountClick}
            aria-label={signedIn ? 'Purchased Library' : 'Sign in / Account'}
            title={signedIn ? 'Library' : 'Account'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </button>

          {/* Modern Stepped Hamburger Menu (Mobile Only, animates to X) */}
          <button
            type="button"
            className={`navbar-mobile-hamburger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            title="Menu"
          >
            <span className="stepped-line line-1" />
            <span className="stepped-line line-2" />
            <span className="stepped-line line-3" />
          </button>
        </div>
      </nav>

      {/* Offcanvas Menu (Opens from right side, positioned UNDER/BEFORE the navbar) */}
      <div
        className={`mobile-offcanvas-backdrop ${menuOpen ? 'is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      >
        <div
          className="mobile-offcanvas-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-offcanvas-links">
            <button type="button" className="offcanvas-nav-btn" onClick={() => go(onVPlayClick)}>
              VPlay Extension
            </button>
            <button type="button" className="offcanvas-nav-btn" onClick={() => go(onTimelineKitClick)}>
              TimelineKit
            </button>
            <button type="button" className="offcanvas-nav-btn" onClick={() => go(onTestimonialsClick)}>
              Reviews
            </button>
            <button type="button" className="offcanvas-nav-btn" onClick={() => go(onContactClick)}>
              Contact
            </button>
            {signedIn ? (
              <button type="button" className="offcanvas-nav-btn" onClick={() => go(onLibraryClick)}>
                Purchased Library
              </button>
            ) : (
              <button type="button" className="offcanvas-nav-btn" onClick={() => go(onAccountClick)}>
                Sign In / Account
              </button>
            )}
          </div>

          <div className="mobile-offcanvas-footer">
            <div className="offcanvas-legal-links">
              <button type="button" onClick={() => go(() => onLegalClick?.('terms'))}>Terms</button>
              <span>/</span>
              <button type="button" onClick={() => go(() => onLegalClick?.('privacy'))}>Privacy</button>
              <span>/</span>
              <button type="button" onClick={() => go(() => onLegalClick?.('refund'))}>Refunds</button>
            </div>
            <p className="offcanvas-copyright">© {new Date().getFullYear()} PLUGINVERSE</p>
          </div>
        </div>
      </div>
    </>
  )
}
