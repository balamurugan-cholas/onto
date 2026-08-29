import { useState, useRef, useEffect } from 'react'
import { products, ACCENT } from '../data/products'
import { useResponsive } from '../hooks/useResponsive'

interface CartItem {
  productId: number
  qty: number
}

interface CheckoutPageProps {
  cartItems: CartItem[]
  onOrderComplete: () => void
}

type Step = 'info' | 'payment' | 'confirmed'

const LABEL: React.CSSProperties = {
  color: 'rgba(0,0,0,0.55)',
  fontSize: '0.58rem',
  letterSpacing: '0.14em',
  fontWeight: 600,
}

function fieldStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%',
    background: '#FFFFFF',
    border: `1px solid ${focused ? '#000000' : 'rgba(0,0,0,0.14)'}`,
    borderRadius: '2px',
    color: '#111111',
    fontSize: '0.84rem',
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    padding: '10px 13px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  }
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'info', label: 'Information' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmed', label: 'Confirmed' },
  ]
  const activeIdx = steps.findIndex((s) => s.id === step)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
      {steps.map((s, i) => {
        const done = i < activeIdx
        const active = i === activeIdx
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: done || active ? '#000000' : 'rgba(0,0,0,0.05)',
                  border: `1.5px solid ${done || active ? '#000000' : 'rgba(0,0,0,0.14)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                }}
              >
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: active ? '#FFFFFF' : 'rgba(0,0,0,0.4)' }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: active ? 600 : 400, color: active ? '#000000' : done ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap', transition: 'color 0.3s' }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: '32px', height: '1px', background: done ? '#000000' : 'rgba(0,0,0,0.12)', margin: '0 10px', transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OrderSummary({ cartItems }: { cartItems: CartItem[] }) {
  const lineItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { product, qty: item.qty } : null
    })
    .filter(Boolean) as { product: (typeof products)[0]; qty: number }[]

  const total = lineItems.reduce((s, { product, qty }) => s + product.price * qty, 0)

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '2px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.58rem', letterSpacing: '0.12em', fontWeight: 600 }}>ORDER SUMMARY</span>
      </div>

      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lineItems.map(({ product: p, qty }) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '2px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(0,0,0,0.06)' }}>
              <img src={p.img} alt={p.slug} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '0.9rem', color: '#111111', letterSpacing: '-0.01em' }}>{p.slug}</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.45)' }}>Qty {qty}</span>
            </div>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '1rem', color: '#111111' }}>${p.price * qty}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.75rem' }}>Subtotal</span>
          <span style={{ color: '#111111', fontSize: '0.75rem', fontWeight: 600 }}>${total}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.75rem' }}>Tax</span>
          <span style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.75rem' }}>$0.00</span>
        </div>
      </div>

      <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 600 }}>TOTAL</span>
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '1.6rem', color: '#111111' }}>${total}</span>
      </div>
    </div>
  )
}

const COUNTRY_OPTIONS = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo (DRC)',
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Other',
]

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (t.includes(q)) return true
  let qi = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++
  }
  return qi === q.length
}

function CountryDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery('') }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 10)
  }, [open])

  const filtered = query ? COUNTRY_OPTIONS.filter((c) => fuzzyMatch(query, c)) : COUNTRY_OPTIONS

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          ...fieldStyle(open),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
          color: value ? '#111111' : 'rgba(0,0,0,0.35)',
        }}
      >
        {value || 'Select country…'}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: '2px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country…"
            style={{
              margin: '8px',
              padding: '8px 10px',
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '2px',
              color: '#111111',
              fontSize: '0.8rem',
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
            }}
          />
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '10px 13px', fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)' }}>No matches</div>
            )}
            {filtered.map((opt) => (
              <div
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); setQuery('') }}
                style={{
                  padding: '10px 13px',
                  fontSize: '0.84rem',
                  color: opt === value ? '#000000' : 'rgba(0,0,0,0.75)',
                  fontWeight: opt === value ? 600 : 400,
                  cursor: 'pointer',
                  background: opt === value ? 'rgba(0,0,0,0.06)' : 'transparent',
                }}
                onMouseEnter={(e) => { if (opt !== value) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { if (opt !== value) e.currentTarget.style.background = 'transparent' }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoStep({ onNext }: { onNext: () => void }) {
  const [focused, setFocused] = useState<string | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', country: '', address: '' })
  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onNext() }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <div>
        <div style={{ background: '#000000', display: 'inline-block', padding: '6px 12px', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: '1.5rem', color: '#FFFFFF', margin: 0, lineHeight: 1 }}>CONTACT INFO.</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {([['firstName', 'FIRST NAME', 'Alex'], ['lastName', 'LAST NAME', 'Morgan']] as const).map(([key, label, ph]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={LABEL}>{label}</label>
            <input required value={form[key]} onChange={set(key)} placeholder={ph} style={fieldStyle(focused === key)} onFocus={() => setFocused(key)} onBlur={() => setFocused(null)} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={LABEL}>EMAIL</label>
        <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" style={fieldStyle(focused === 'email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={LABEL}>COUNTRY / REGION</label>
        <CountryDropdown value={form.country} onChange={(v) => setForm((prev) => ({ ...prev, country: v }))} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={LABEL}>ADDRESS (OPTIONAL)</label>
        <input value={form.address} onChange={set('address')} placeholder="Street address" style={fieldStyle(focused === 'address')} onFocus={() => setFocused('address')} onBlur={() => setFocused(null)} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
        <button
          type="submit"
          style={{ padding: '11px 32px', background: '#000000', border: 'none', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.2s', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          CONTINUE TO PAYMENT
        </button>
      </div>
    </form>
  )
}

function PaymentStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [focused, setFocused] = useState<string | null>(null)
  const [form, setForm] = useState({ card: '', name: '', expiry: '', cvv: '' })
  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }))

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    return digits.length >= 3 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onNext() }}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <div>
        <div style={{ background: '#000000', display: 'inline-block', padding: '6px 12px', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: '1.5rem', color: '#FFFFFF', margin: 0, lineHeight: 1 }}>PAYMENT.</h2>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={LABEL}>CARD NUMBER</label>
        <input
          required
          value={form.card}
          onChange={(e) => setForm((p) => ({ ...p, card: formatCard(e.target.value) }))}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          style={fieldStyle(focused === 'card')}
          onFocus={() => setFocused('card')}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={LABEL}>NAME ON CARD</label>
        <input required value={form.name} onChange={set('name')} placeholder="Alex Morgan" style={fieldStyle(focused === 'name')} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={LABEL}>EXPIRY</label>
          <input
            required
            value={form.expiry}
            onChange={(e) => setForm((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
            placeholder="MM / YY"
            maxLength={7}
            style={fieldStyle(focused === 'expiry')}
            onFocus={() => setFocused('expiry')}
            onBlur={() => setFocused(null)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={LABEL}>CVV</label>
          <input
            required
            value={form.cvv}
            onChange={set('cvv')}
            placeholder="• • •"
            maxLength={4}
            type="password"
            style={fieldStyle(focused === 'cvv')}
            onFocus={() => setFocused('cvv')}
            onBlur={() => setFocused(null)}
          />
        </div>
      </div>

      {/* Secure note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '2px' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.5)' }}>Your payment info is encrypted and never stored.</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.5)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: '0', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.5)' }}
        >
          ← Back
        </button>
        <button
          type="submit"
          style={{ padding: '11px 32px', background: '#000000', border: 'none', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.2s', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          PLACE ORDER
        </button>
      </div>
    </form>
  )
}

function ConfirmedStep({ onOrderComplete }: { onOrderComplete: () => void }) {
  const orderId = `ONTO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  useEffect(() => {
    const timer = setTimeout(() => onOrderComplete(), 3000)
    return () => clearTimeout(timer)
  }, [onOrderComplete])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', paddingTop: '32px', textAlign: 'center' }}>
      {/* Circle checkmark */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '2px solid #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Full-width black title block */}
      <div style={{ background: '#000000', padding: '10px 28px' }}>
        <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: '2rem', color: '#FFFFFF', margin: 0, lineHeight: 1, letterSpacing: '-0.01em' }}>
          ORDER CONFIRMED.
        </h2>
      </div>
    </div>
  )
}

export default function CheckoutPage({ cartItems, onOrderComplete }: CheckoutPageProps) {
  const [step, setStep] = useState<Step>('info')
  const { isMobile } = useResponsive()

  const lineItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { product, qty: item.qty } : null
    })
    .filter(Boolean) as { product: (typeof products)[0]; qty: number }[]

  if (lineItems.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.88rem' }}>Nothing to check out.</p>
      </div>
    )
  }

  const px = isMobile ? '20px' : '48px'

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        position: 'relative',
        zIndex: 10,
        padding: `12px ${px} 0`,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
      }}
    >
      {/* Step indicator */}
      <div style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: '24px', flexShrink: 0 }}>
        <StepIndicator step={step} />
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '28px' : '48px',
          flex: 1,
          alignItems: 'flex-start',
          paddingBottom: '32px',
        }}
      >
        {/* Left: form */}
        <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
          {step === 'info' && <InfoStep onNext={() => setStep('payment')} />}
          {step === 'payment' && <PaymentStep onNext={() => setStep('confirmed')} onBack={() => setStep('info')} />}
          {step === 'confirmed' && <ConfirmedStep onOrderComplete={onOrderComplete} />}
        </div>

        {/* Right: order summary (hidden after confirmed) */}
        {step !== 'confirmed' && (
          <div style={{ width: isMobile ? '100%' : '280px', flexShrink: 0 }}>
            <OrderSummary cartItems={cartItems} />
          </div>
        )}
      </div>
    </div>
  )
}
