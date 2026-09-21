import { products } from '../data/products'

export default function Storefront({ kind, onAddToCart, showRetryDownload, downloadInProgress, onRetryDownload }: { kind: 'vplay' | 'timelinekit'; onAddToCart: (productId: number) => void; showRetryDownload: boolean; downloadInProgress: boolean; onRetryDownload: () => void }) {
  const product = products.find(item => item.slug === 'VPLAY.') || products[0]
  const timelineKit = products.find(item => item.slug === 'TIMELINEKIT.')
  const action = () => showRetryDownload ? onRetryDownload() : onAddToCart(product.id)
  const actionText = showRetryDownload ? (downloadInProgress ? 'Preparing download…' : 'Download again') : 'Get VPlay'
  if (kind === 'timelinekit' && timelineKit) return <main className="store-page"><div className="timelinekit-store">
    <section className="store-hero timelinekit-hero"><div className="store-hero-copy"><h1>Build once.<br/>Edit faster.</h1><p>Save complete timeline arrangements and bring them into any Premiere Pro project with one shortcut.</p><div className="store-platform">Windows&nbsp;&nbsp;·&nbsp;&nbsp;Premiere Pro</div><div className="store-buy"><button disabled>Coming soon</button></div></div><img className="store-hero-art" src={timelineKit.img} alt="TimelineKit timeline preset workflow" /></section>
    <section className="store-feature"><div className="store-feature-copy"><h2>Your timeline becomes reusable.</h2><p>Capture clips, tracks, timing, and effects as one dependable preset.</p></div><div className="bind-capture" aria-hidden="true"><div className="bind-tracks"><i/><i/><i/><b/></div><div className="bind-save">Save selection</div></div></section>
    <section className="feature-duo"><div className="feature-duo-cell is-visual"><div className="bind-insert" aria-hidden="true"><div className="bind-playhead"/><div className="bind-blocks"><i/><i/><i/></div><div className="bind-modes"><span>Start</span><span>Anchor</span><span>End</span></div></div></div><div className="feature-duo-cell store-feature-copy"><h2>Insert exactly where you want.</h2><p>Choose start, anchor, or end alignment and place the arrangement at the playhead.</p></div><div className="feature-duo-cell store-feature-copy"><h2>Organized for every project.</h2><p>Profiles and folders keep frequently used arrangements easy to find.</p></div><div className="feature-duo-cell is-visual"><div className="bind-library" aria-hidden="true"><div className="bind-sidebar"><b>Profiles</b><span>Social</span><span>Podcast</span><span>Commercial</span></div><div className="bind-cards"><i/><i/><i/><i/></div></div></div></section>
    <section className="store-final"><h2>TimelineKit is coming soon.</h2><p>A faster way to reuse the edits you already built.</p><button disabled>Coming soon</button></section>
  </div></main>
  return <main className="store-page">
    <section className="store-hero">
      <div className="store-hero-copy">
        <h1>Download media.<br/>Stay in Premiere.</h1>
        <p>Bring video, audio, images, and exact clips from the web directly into your edit.</p>
        <div className="store-platform">Windows&nbsp;&nbsp;·&nbsp;&nbsp;Premiere Pro</div>
        <div className="store-buy"><button onClick={action} disabled={downloadInProgress}>{actionText}</button><strong>$19</strong></div>
      </div>
      <img className="store-hero-art" src={product.img} alt="VPlay sends media from popular platforms into a Premiere Pro timeline" />
    </section>

    <section className="store-feature">
      <div className="store-feature-copy"><h2>One place for every source.</h2><p>Paste a supported link. VPlay finds the available media and formats automatically.</p></div>
      <div className="source-motion" aria-hidden="true"><div className="source-row"><span>YouTube</span><span>Instagram</span><span>TikTok</span><span>X</span><span>Facebook</span><span>Twitch</span></div><div className="source-line"><i/></div><div className="source-result"><b>Ready</b><span>MP4&nbsp;&nbsp;1080p</span></div></div>
    </section>

    <section className="feature-duo">
      <div className="feature-duo-cell is-visual"><div className="range-motion" aria-hidden="true"><div className="range-preview"><i/></div><div className="range-time"><span>00:12</span><span>00:17</span></div><div className="range-rail"><i/><b/><i/></div><div className="range-caption">5 second clip</div></div></div>
      <div className="feature-duo-cell store-feature-copy"><h2>Take the moment, not the whole video.</h2><p>Set the exact start and end before downloading—even from hours-long sources.</p></div>
      <div className="feature-duo-cell store-feature-copy"><h2>Already where your edit needs it.</h2><p>Import, organize, and place completed media at the active playhead automatically.</p></div>
      <div className="feature-duo-cell is-visual"><div className="timeline-motion" aria-hidden="true"><div className="timeline-labels"><span>V3</span><span>V2</span><span>V1</span></div><div className="timeline-rails"><i/><i/><i/><b/><em/></div></div></div>
    </section>

    <section className="store-feature is-reversed">
      <div className="store-feature-copy"><h2>Everything stays findable.</h2><p>Search previous downloads, reopen their folders, or download again from the original link.</p></div>
      <div className="history-motion" aria-hidden="true"><div className="history-search">Search downloads</div><div className="history-row"><i/><span><b>Project reference</b><small>YouTube · 1080p</small></span><em>↗</em></div><div className="history-row"><i/><span><b>Interview clip</b><small>Instagram · MP4</small></span><em>↗</em></div><div className="history-row"><i/><span><b>Music bed</b><small>Audio · MP3</small></span><em>↗</em></div></div>
    </section>

    <section className="store-final"><h2>Link in. Edit on.</h2><p>Stop breaking your flow every time you need media.</p><button onClick={action} disabled={downloadInProgress}>{actionText}</button></section>

  </main>
}
