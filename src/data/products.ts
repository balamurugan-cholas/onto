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
  {
    id: 1,
    slug: 'TIMELINEKIT.',
    version: 'V1.0',
    description:
      'Save a complete timeline arrangement - clips, tracks, timing, and effects - and insert it back into any project with one shortcut.',
    platform: 'Windows',
    host: 'Premiere Pro',
    license: 'Lifetime',
    updates: 'Included',
    price: 19,
    features: [
      'Save selections as reusable presets',
      'Insert at playhead with Start, Anchor, or End alignment',
      'Keyboard shortcuts, even while the panel is unfocused',
      'Organize with profiles, folders, and Audio Randomizer folders',
      'Works across projects and after restarting Premiere Pro',
    ],
    img: publicAsset('timelinekit.png'),
  },
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
  },
]

export interface GridItem {
  id: string
  title: string
  subtitle: string
  tag: string
  img: string
  productId: number
  category: 'workflow' | 'downloader' | 'presets'
  description: string
}

export const showcaseGridItems: GridItem[] = [
  {
    id: 'range-trim',
    title: 'Precision Range Trim',
    subtitle: 'Video & Audio Trimming',
    tag: '$19',
    img: publicAsset('range-trim.png'),
    productId: 2,
    category: 'downloader',
    description: 'Pull a 5-second clip from a 12-hour video in 15–20 seconds without downloading gigabytes of unwanted footage.',
  },
  {
    id: 'timeline-insert',
    title: 'Timeline Direct Insertion',
    subtitle: 'Premiere Pro Timeline',
    tag: 'Included',
    img: publicAsset('timeline-insertion.png'),
    productId: 2,
    category: 'workflow',
    description: 'Import media directly into active project bins and insert onto your playhead target track automatically.',
  },
  {
    id: 'download-history',
    title: 'Searchable History Vault',
    subtitle: 'Asset Management & Sync',
    tag: 'Included',
    img: publicAsset('download-history.png'),
    productId: 2,
    category: 'downloader',
    description: 'Every download, URL, thumbnail, and format stays cataloged with one-click re-download and folder access.',
  },
  {
    id: 'timelinekit-master',
    title: 'TimelineKit Multi-Track',
    subtitle: 'Timeline Presets',
    tag: 'Coming Soon',
    img: publicAsset('timelinekit.png'),
    productId: 1,
    category: 'presets',
    description: 'Save complex multi-track cuts, transitions, effects, and audio sync as reusable presets.',
  },
  {
    id: 'smart-paste',
    title: 'Smart URL Auto-Paste',
    subtitle: 'Workflow Automation',
    tag: 'Included',
    img: publicAsset('vplay.png'),
    productId: 2,
    category: 'workflow',
    description: 'Copy any media link and VPlay detects and pastes it into the panel automatically with instant preview.',
  },
  {
    id: 'hotkey-engine',
    title: 'Global Hotkey Execution',
    subtitle: 'Unfocused Panel Trigger',
    tag: 'Included',
    img: publicAsset('timelinekit.png'),
    productId: 1,
    category: 'presets',
    description: 'Trigger preset insertion using custom keyboard shortcuts even while the panel is not focused.',
  },
  {
    id: 'transcript-search',
    title: 'Transcript Moment Finder',
    subtitle: 'Dialogue & Audio Sync',
    tag: 'Included',
    img: publicAsset('range-trim.png'),
    productId: 2,
    category: 'workflow',
    description: 'Search spoken words in supported video transcripts and jump straight to the exact clip moment.',
  },
  {
    id: 'audio-randomizer',
    title: 'Audio Randomizer Bins',
    subtitle: 'SFX & Foley Organization',
    tag: 'Included',
    img: publicAsset('timelinekit.png'),
    productId: 1,
    category: 'presets',
    description: 'Randomize variation sound effects and foley assets seamlessly into your timeline.',
  },
  {
    id: 'vplay-studio',
    title: 'VPlay All-In-One Panel',
    subtitle: 'Full Extension Suite',
    tag: '$19',
    img: publicAsset('vplay-hero-pluginverse.png'),
    productId: 2,
    category: 'downloader',
    description: 'The definitive media downloader and timeline companion built natively for Premiere Pro.',
  },
]
