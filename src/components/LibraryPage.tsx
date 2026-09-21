import { useEffect, useState } from 'react'
import { accountApi } from '../lib/account'

type Product = { id: string; name: string; purchasedAt: number }
export default function LibraryPage({ worker, email, onDownload, onSignOut }: { worker: string; email: string; onDownload: (productId: string, platform: 'windows') => Promise<void>; onSignOut: () => Promise<void> }) {
  const [products, setProducts] = useState<Product[]>([]), [error, setError] = useState(''), [busy, setBusy] = useState('')
  useEffect(() => {
    let cancelled = false, attempts = 0, timer = 0
    const load = () => accountApi<{ products: Product[] }>(worker, '/library').then(r => {
      if (cancelled) return
      setProducts(r.products)
      setError('')
      attempts += 1
      if (r.products.length === 0 && attempts < 16) timer = window.setTimeout(load, 2000)
    }).catch(e => { if (!cancelled) setError(e.message) })
    void load()
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [worker])
  const download = async (productId: string) => { setBusy(productId); setError(''); try { await onDownload(productId, 'windows') } catch (e) { setError(e instanceof Error ? e.message : 'Download failed.') } finally { setBusy('') } }
  return <main className="library-page">
    <div className="library-heading"><div><span className="library-kicker">YOUR ACCOUNT</span><h1>Library</h1><p className="library-intro">{email} · Your purchased plugins stay available here.</p></div><button onClick={() => void onSignOut()}>Sign out</button></div>
    {error && <div className="library-error">{error}</div>}
    {!error && products.length === 0 && <div className="library-empty">No purchases yet.</div>}
    {products.map(product => <article className="library-product" key={product.id}>
      <div><span className="library-product-mark">{product.name.charAt(0)}</span><div><h2>{product.name}</h2><p>Premiere Pro extension · Lifetime access</p></div></div>
      <div className="library-downloads"><button disabled={Boolean(busy)} onClick={() => void download(product.id)}>{busy === product.id ? 'Preparing…' : 'Download for Windows'}</button></div>
    </article>)}
  </main>
}
