import type { LegalView } from './LegalPage'
import Marquee from './Marquee'
import { useResponsive } from '../hooks/useResponsive'

export default function LegalFooter({ onNavigate, marqueeNames }: { onNavigate: (view: LegalView) => void; marqueeNames?: string[] }) {
  const { isMobile } = useResponsive()
  const links: Array<{ view: LegalView; label: string }> = [
    { view: 'terms', label: 'Terms' },
    { view: 'privacy', label: 'Privacy' },
    { view: 'refund', label: 'Refunds' },
  ]
  if (isMobile && !marqueeNames) return null
  return (
    <footer className="site-footer" style={{ position: 'relative', zIndex: 20, minHeight: 32, flexShrink: 0, display: 'flex', alignItems: 'stretch', justifyContent: marqueeNames ? 'flex-start' : 'center', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)', fontSize: 11 }}>
      {!isMobile && <nav aria-label="Legal and support" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 'clamp(8px, 1.2vw, 18px)', padding: '6px 14px', whiteSpace: 'nowrap' }}>
      {links.map(({ view, label }) => (
        <a key={view} href={`#/${view}`} onClick={() => onNavigate(view)} aria-label={label} title={isMobile ? label : undefined} style={{ color: '#111', fontWeight: 600, width: isMobile ? 27 : 'auto', height: isMobile ? 27 : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {label}
        </a>
      ))}
      <a href="mailto:balamuruganofficial3@gmail.com" aria-label="Support" title={isMobile ? 'Support' : undefined} style={{ color: '#111', fontWeight: 600, width: isMobile ? 27 : 'auto', height: isMobile ? 27 : 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        Support
      </a>
      </nav>}
      {marqueeNames && <div style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden', background: '#000' }}><Marquee names={marqueeNames} /></div>}
    </footer>
  )
}
