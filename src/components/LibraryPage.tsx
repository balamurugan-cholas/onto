import { useEffect, useState } from 'react'
import { accountApi } from '../lib/account'

type Product = { id: string; name: string; purchasedAt: number }
export default function LibraryPage({ worker, email, onDownload, onSignOut }: { worker: string; email: string; onDownload: (platform: 'windows' | 'mac') => Promise<void>; onSignOut: () => Promise<void> }) {
  const [products, setProducts] = useState<Product[]>([]), [error, setError] = useState(''), [busy, setBusy] = useState<'windows' | 'mac' | ''>('')
  useEffect(() => { accountApi<{ products: Product[] }>(worker, '/library').then(r => setProducts(r.products)).catch(e => setError(e.message)) }, [worker])
  const download = async (platform: 'windows' | 'mac') => { setBusy(platform); setError(''); try { await onDownload(platform) } catch (e) { setError(e instanceof Error ? e.message : 'Download failed.') } finally { setBusy('') } }
  return <main className="library-page">
    <div className="library-heading"><div><span className="library-kicker">YOUR ACCOUNT</span><h1>Library</h1><p className="library-intro">{email} · Your purchased plugins stay available here.</p></div><button onClick={() => void onSignOut()}>Sign out</button></div>
    {error && <div className="library-error">{error}</div>}
    {!error && products.length === 0 && <div className="library-empty">No purchases yet.</div>}
    {products.map(product => <article className="library-product" key={product.id}>
      <div><span className="library-product-mark">V</span><div><h2>{product.name}</h2><p>Premiere Pro extension · Lifetime access</p></div></div>
      <div className="library-downloads"><button disabled={!!busy} onClick={() => download('windows')}>{busy === 'windows' ? 'Preparing…' : 'Download for Windows'}</button><button disabled={!!busy} onClick={() => download('mac')}>{busy === 'mac' ? 'Preparing…' : 'Download for macOS'}</button></div>
    </article>)}
  </main>
}
