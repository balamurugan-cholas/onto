export default function OntoLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '1.6rem',
          color: '#fff',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        ON
      </span>

      <svg width="22" height="22" viewBox="0 0 22 22" style={{ margin: '0 2px' }}>
        <circle cx="11" cy="11" r="10" fill="#1D4ED8" />
        <ellipse cx="11" cy="11" rx="10" ry="4" fill="none" stroke="#60A5FA" strokeWidth="0.8" />
        <ellipse cx="11" cy="11" rx="4" ry="10" fill="none" stroke="#60A5FA" strokeWidth="0.8" />
        <line x1="1" y1="11" x2="21" y2="11" stroke="#93C5FD" strokeWidth="0.6" />
        <line x1="11" y1="1" x2="11" y2="21" stroke="#93C5FD" strokeWidth="0.6" />
        <circle cx="11" cy="11" r="1.5" fill="#BFDBFE" />
      </svg>

      <span
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '1.6rem',
          color: '#3B82F6',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        TO
      </span>
    </div>
  )
}
