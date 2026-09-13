export interface Product {
  id: number
  slug: string
  version: string
  description: string
  platform: string
  host: string
  license: string
  updates: string
  price: number
  features: string[]
  img: string
  tour?: { video: string; title: string; description: string }
  featureGroups?: Array<{ title: string; items: string[] }>
  comparisons?: Array<{ standard: string; vplay: string }>
  comingSoon?: boolean
}

export const ACCENT = '#000000'

const publicAsset = (name: string) => `${import.meta.env.BASE_URL}${name}`

export const products: Product[] = [
  /* PremiereBind is hidden until it is ready for sale.
  {
    id: 1,
    slug: 'PREMIEREBIND.',
    version: 'V1.0',
    description:
      'Save a complete timeline arrangement - clips, tracks, timing, and effects - and insert it back into any project with one shortcut.',
    platform: 'Windows',
    host: 'Premiere Pro',
    license: 'Lifetime',
    updates: 'Included',
    price: 19,
    comingSoon: true,
    features: [
      'Save selections as reusable presets',
      'Insert at playhead with Start, Anchor, or End alignment',
      'Keyboard shortcuts, even while the panel is unfocused',
      'Organize with profiles, folders, and Audio Randomizer folders',
      'Works across projects and after restarting Premiere Pro',
    ],
    img: publicAsset('premiere-bind.png'),
  },
  */
  {
    id: 2,
    slug: 'VPLAY.',
    version: 'V1.0',
    description:
      'Paste a link from YouTube, Instagram, Twitter, Twitch, Facebook, and more - VPlay downloads it straight into your project with one click.',
    platform: 'Windows',
    host: 'Premiere Pro',
    license: 'Lifetime',
    updates: 'Included',
    price: 19,
    features: [
      'Trim/clip a specific range before downloading, with a start/end slider - pull a 5-second clip from a 12-hour video in just 15-22 seconds',
      'Auto-paste: copy a link and VPlay detects and pastes it into the URL field automatically',
      'Auto import straight into your project',
      'Add to timeline (linked to auto import - turns off automatically if auto import is off)',
      'Download all available qualities and thumbnails, plus Instagram/Twitter multi-image posts',
      'History panel with thumbnails, format, and platform filters, plus one-click redownload so you never lose track of where a clip came from',
      'Customizable save location in settings - choose exactly where downloads go',
    ],
    img: publicAsset('vplay-hero-pluginverse.png'),
    tour: {
      video: publicAsset('vplay-panel-demo.mp4'),
      title: 'One panel. From link to timeline.',
      description: 'Watch the real VPlay workflow - from link detection and quality selection to clip preview, download, and panel settings.',
    },
    featureGroups: [
      {
        title: 'Download exactly what you need',
        items: [
          'Paste links from YouTube, Instagram, X/Twitter, Twitch, Facebook, and other supported media pages.',
          'Choose video, video-only, audio, thumbnails, available resolutions, and frame-rate variants.',
          'Trim a precise range before downloading instead of pulling an entire long video first.',
          'Download multi-image posts from supported social platforms in one workflow.',
        ],
      },
      {
        title: 'Built for Premiere Pro',
        items: [
          'Import completed media directly into the open Premiere Pro project.',
          'Create clean project bins automatically when Organize assets is enabled.',
          'Place media at the active playhead with smart timeline insertion.',
          'When a track is occupied, VPlay targets a clear track above and creates the required track when needed.',
        ],
      },
      {
        title: 'Clip, transcript, and queue tools',
        items: [
          'Use IN and OUT controls, a range selector, frame stepping, and an integrated clip preview.',
          'Search available transcripts and click a spoken moment to move the clip start precisely.',
          'Save multiple ranges, queue full videos or clips, and track the queue count from the toolbar badge.',
          'Cancel active downloads cleanly without leaving partial download files behind.',
        ],
      },
      {
        title: 'History, control, and updates',
        items: [
          'Find previous downloads, reopen their folders, and redownload from the original source link.',
          'Detect missing files and optionally clean broken or expired history records automatically.',
          'Choose your download folder, language, theme, arrow-step unit, scrollbar visibility, and tooltips.',
          'Check for updates inside VPlay, follow download progress, and reuse an installer that is already downloaded.',
        ],
      },
    ],
    comparisons: [
      { standard: 'Open a browser, use a download site, then return to Premiere.', vplay: 'Paste and download without leaving the Premiere Pro panel.' },
      { standard: 'Download the whole source first and trim it afterward.', vplay: 'Select the exact range before downloading - even from very long videos.' },
      { standard: 'Import, organize, and place every file manually.', vplay: 'Auto-import, organize assets, and insert at the playhead.' },
      { standard: 'Lose track of the original link after the file is saved.', vplay: 'Keep searchable history with source-aware redownload controls.' },
      { standard: 'Repeat settings and cleanup work for every download.', vplay: 'Use queues, saved preferences, automatic cleanup, and an integrated updater.' },
    ],
  },
]
