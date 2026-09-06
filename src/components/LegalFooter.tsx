import type { LegalView } from './LegalPage'
import Marquee from './Marquee'

export default function LegalFooter({ onNavigate, marqueeNames }: { onNavigate: (view: LegalView) => void; marqueeNames?: string[] }) {
  const links: Array<{ view: LegalView; label: string }> = [
    { view: 'terms', label: 'Terms' },
    { view: 'privacy', label: 'Privacy' },
    { view: 'refund', label: 'Refunds' },
  ]
  return (
    <footer style={{ position: 'relative', zIndex: 20, minHeight: 32, flexShrink: 0, display: 'flex', alignItems: 'stretch', justifyContent: marqueeNames ? 'flex-start' : 'center', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)', fontSize: 11 }}>
      <nav aria-label="Legal and support" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 'clamp(8px, 1.2vw, 18px)', padding: '6px 14px', whiteSpace: 'nowrap' }}>
      {links.map(({ view, label }) => (
        <a key={view} href={`#/${view}`} onClick={() => onNavigate(view)} style={{ color: '#111', fontWeight: 600 }}>{label}</a>
      ))}
      <a href="mailto:balamuruganofficial3@gmail.com" style={{ color: '#111', fontWeight: 600 }}>Support</a>
      </nav>
      {marqueeNames && <div style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden', background: '#000' }}><Marquee names={marqueeNames} /></div>}
    </footer>
  )
}
