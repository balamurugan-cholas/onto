import type { LegalView } from './LegalPage'
import Marquee from './Marquee'
import { useResponsive } from '../hooks/useResponsive'

function FooterIcon({ type }: { type: LegalView | 'support' }) {
  if (type === 'terms') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7V3Zm7 1.5V8h3.5M10 12h5M10 16h5" /></svg>
  if (type === 'privacy') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 19 6v5c0 4.7-2.8 8-7 10-4.2-2-7-5.3-7-10V6l7-3Zm-3 9 2 2 4-4" /></svg>
  if (type === 'refund') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8V4m0 0h4M5 4l3 3a7 7 0 1 1-2 7M14.5 9.5c-.5-.4-1.2-.6-2-.6-1.2 0-2 .6-2 1.5 0 2.4 4.5 1.1 4.5 3.6 0 1-.9 1.7-2.2 1.7-.9 0-1.8-.3-2.4-.8M12.7 7.5v10" /></svg>
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 13v-2a8 8 0 0 1 16 0v2M4 13h3v6H5a1 1 0 0 1-1-1v-5Zm16 0h-3v6h2a1 1 0 0 0 1-1v-5Zm-3 6c0 1.1-.9 2-2 2h-3" /></svg>
}

export default function LegalFooter({ onNavigate, marqueeNames }: { onNavigate: (view: LegalView) => void; marqueeNames?: string[] }) {
  const { isMobile } = useResponsive()
  const links: Array<{ view: LegalView; label: string }> = [
    { view: 'terms', label: 'Terms' },
    { view: 'privacy', label: 'Privacy' },
    { view: 'refund', label: 'Refunds' },
  ]
  return (
    <footer className="site-footer" style={{ position: 'relative', zIndex: 20, minHeight: 32, flexShrink: 0, display: 'flex', alignItems: 'stretch', justifyContent: marqueeNames ? 'flex-start' : 'center', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)', fontSize: 11 }}>
      <nav aria-label="Legal and support" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: isMobile ? 2 : 'clamp(8px, 1.2vw, 18px)', padding: isMobile ? '3px 6px' : '6px 14px', whiteSpace: 'nowrap' }}>
      {links.map(({ view, label }) => (
        <a key={view} href={`#/${view}`} onClick={() => onNavigate(view)} aria-label={label} title={isMobile ? label : undefined} style={{ color: '#111', fontWeight: 600, width: isMobile ? 27 : 'auto', height: isMobile ? 27 : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {isMobile ? <span style={{ width: 16, height: 16, display: 'block' }}><FooterIcon type={view} /></span> : label}
        </a>
      ))}
      <a href="mailto:balamuruganofficial3@gmail.com" aria-label="Support" title={isMobile ? 'Support' : undefined} style={{ color: '#111', fontWeight: 600, width: isMobile ? 27 : 'auto', height: isMobile ? 27 : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {isMobile ? <span style={{ width: 16, height: 16, display: 'block' }}><FooterIcon type="support" /></span> : 'Support'}
      </a>
      </nav>
      {marqueeNames && <div style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden', background: '#000' }}><Marquee names={marqueeNames} /></div>}
    </footer>
  )
}
