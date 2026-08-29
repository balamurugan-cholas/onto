export interface Testimonial {
  id: number
  productId: number
  author: string
  role: string
  company: string
  initials: string
  rating: number
  text: string
  date: string
}

export const testimonials: Testimonial[] = [
  // PREMIEREBIND (id: 1)
  {
    id: 1,
    productId: 1,
    author: 'Marcus Rivera',
    role: 'Senior Editor',
    company: 'Skyline Post',
    initials: 'MR',
    rating: 5,
    text: "PremiereBind completely changed my documentary workflow. I can drop a full interview timeline into any project in seconds. It's one of those tools you don't know you needed until you use it.",
    date: 'Aug 2026',
  },
  {
    id: 2,
    productId: 1,
    author: 'Lena Hoffmann',
    role: 'Freelance Editor',
    company: 'Independent',
    initials: 'LH',
    rating: 5,
    text: 'The keyboard shortcut support is flawless — even when Premiere isn\'t focused. I use it across 12+ client projects weekly and it\'s never once failed me.',
    date: 'Jul 2026',
  },
  {
    id: 3,
    productId: 1,
    author: 'Daniel Okafor',
    role: 'Post Production Lead',
    company: 'Tidewater Films',
    initials: 'DO',
    rating: 5,
    text: 'We standardized PremiereBind across our whole team. The profile and folder organization keeps everyone\'s presets clean. Absolute must-have.',
    date: 'Jun 2026',
  },
  {
    id: 4,
    productId: 1,
    author: 'Sofia Martens',
    role: 'Motion Designer',
    company: 'Orbital Studio',
    initials: 'SM',
    rating: 4,
    text: 'Works great for saving complex sequences with effects baked in. Would love multi-monitor support but otherwise flawless.',
    date: 'May 2026',
  },
  {
    id: 5,
    productId: 1,
    author: 'James Whitfield',
    role: 'Commercial Director',
    company: 'Apex Creative',
    initials: 'JW',
    rating: 5,
    text: 'Saves me 30–40 minutes per project. The anchor alignment on insert is precise. Worth every cent.',
    date: 'Apr 2026',
  },

  ]
