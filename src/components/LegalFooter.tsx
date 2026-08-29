import type { LegalView } from './LegalPage'

export default function LegalFooter({ onNavigate }: { onNavigate: (view: LegalView) => void }) {
  const links: Array<{ view: LegalView; label: string }> = [
    { view: 'terms', label: 'Terms' },
    { view: 'privacy', label: 'Privacy' },
    { view: 'refund', label: 'Refunds' },
  ]
  return (
    <footer style={{ position: 'relative', zIndex: 20, minHeight: 30, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '6px 16px', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)', fontSize: 11 }}>
      {links.map(({ view, label }) => (
        <a key={view} href={`#/${view}`} onClick={() => onNavigate(view)} style={{ color: '#111', fontWeight: 600 }}>{label}</a>
      ))}
      <a href="mailto:balamuruganofficial3@gmail.com" style={{ color: '#111', fontWeight: 600 }}>Support</a>
    </footer>
  )
}
