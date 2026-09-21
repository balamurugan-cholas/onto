import type { LegalView } from './LegalPage'
import Marquee from './Marquee'
import { useResponsive } from '../hooks/useResponsive'

export default function LegalFooter({ marqueeNames }: { onNavigate: (view: LegalView) => void; marqueeNames?: string[] }) {
  const { isMobile } = useResponsive()
  if (isMobile && !marqueeNames) return null
  return (
    <footer className="site-footer" style={{ position: 'relative', zIndex: 20, minHeight: 32, flexShrink: 0, display: 'flex', alignItems: 'stretch', justifyContent: marqueeNames ? 'flex-start' : 'center', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)', fontSize: 11 }}>
      {marqueeNames && <div style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center' }}><Marquee names={marqueeNames} /></div>}
    </footer>
  )
}
