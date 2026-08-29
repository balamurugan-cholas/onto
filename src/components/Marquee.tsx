import { ACCENT } from '../data/products'

interface MarqueeProps {
  names: string[]
}

export default function Marquee({ names }: MarqueeProps) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#000000',
        height: '32px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', width: 'max-content', flexShrink: 0 }}>
        {[0, 1].map((half) => (
          <div key={half} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: '0.75rem',
                  color: '#FFFFFF',
                  letterSpacing: '0.12em',
                  whiteSpace: 'nowrap',
                  padding: '0 18px',
                }}
              >
                {names[i % names.length].replace(/\.$/, '')}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
