import { useEffect } from 'react'

export type DownloadPlatform = 'windows' | 'mac'

interface PlatformModalProps {
  open: boolean
  onClose: () => void
  onSelect: (platform: DownloadPlatform) => void
}

const platformOptions: Array<{ id: DownloadPlatform; name: string; detail: string; available: boolean; icon: JSX.Element }> = [
  {
    id: 'windows',
    name: 'Windows',
    detail: 'Windows 10 or later',
    available: true,
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.7 10.6 3.6v7.6H3V4.7Zm8.6-1.2L21 2v9.2h-9.4V3.5ZM3 12.2h7.6v7.6L3 18.7v-6.5Zm8.6 0H21V22l-9.4-1.4v-8.4Z" fill="currentColor" /></svg>,
  },
  {
    id: 'mac',
    name: 'macOS',
    detail: 'Intel and Apple Silicon',
    available: true,
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.8 12.7c0-2.5 2-3.7 2.1-3.8a4.5 4.5 0 0 0-3.5-1.9c-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.8a4.9 4.9 0 0 0-4.1 2.5c-1.8 3-.5 7.5 1.2 10 .9 1.2 1.8 2.5 3.2 2.4 1.3 0 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.1-2.4a10.8 10.8 0 0 0 1.4-2.9 4.3 4.3 0 0 1-3.2-4Zm-2.4-7.3A4.3 4.3 0 0 0 15.5 2a4.7 4.7 0 0 0-3.1 1.6 4 4 0 0 0-1.1 3.2 3.9 3.9 0 0 0 3.1-1.4Z" fill="currentColor" /></svg>,
  },
]

export default function PlatformModal({ open, onClose, onSelect }: PlatformModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="platform-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="platform-modal" role="dialog" aria-modal="true" aria-labelledby="platform-modal-title">
        <button className="platform-modal-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <p className="platform-modal-kicker">VPLAY INSTALLER</p>
        <h2 id="platform-modal-title">Choose your platform</h2>
        <p className="platform-modal-copy">We could not detect this device. Select the computer where you'll use VPlay.</p>
        <div className="platform-modal-options">
          {platformOptions.map((option) => (
            <button key={option.id} type="button" className={`platform-option${option.available ? '' : ' platform-option-disabled'}`} disabled={!option.available} onClick={() => onSelect(option.id)}>
              <span className="platform-option-icon">{option.icon}</span>
              <span className="platform-option-text"><strong>{option.name}</strong><small>{option.detail}</small></span>
              <span className="platform-option-arrow" aria-hidden="true">{option.available ? '→' : 'SOON'}</span>
            </button>
          ))}
        </div>
        <p className="platform-modal-note">The universal Mac installer selects Intel or Apple Silicon automatically.</p>
      </section>
    </div>
  )
}
