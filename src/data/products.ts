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
      'Save a complete timeline arrangement — clips, tracks, timing, and effects — and insert it back into any project with one shortcut.',
    platform: 'Windows & macOS',
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
      'Paste a link from YouTube, Instagram, Twitter, Twitch, Facebook, and more — VPlay downloads it straight into your project with one click.',
    platform: 'Windows & macOS',
    host: 'Premiere Pro',
    license: 'Lifetime',
    updates: 'Included',
    price: 19,
    features: [
      'Trim/clip a specific range before downloading, with a start/end slider — pull a 5-second clip from a 12-hour video in just 15-22 seconds',
      'Auto-paste: copy a link and VPlay detects and pastes it into the URL field automatically',
      'Auto import straight into your project',
      'Add to timeline (linked to auto import — turns off automatically if auto import is off)',
      'Download all available qualities and thumbnails, plus Instagram/Twitter multi-image posts',
      'History panel with thumbnails, format, and platform filters, plus one-click redownload so you never lose track of where a clip came from',
      'Customizable save location in settings — choose exactly where downloads go',
    ],
    img: publicAsset('vplay.png'),
  },
]
