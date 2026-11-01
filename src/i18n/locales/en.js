/**
 * English locale — default language.
 *
 * To add a new language, duplicate this file (e.g. `fr.js`), translate every
 * value, then register it in `../TranslationProvider.jsx`.
 *
 * Keys are grouped by section, top to bottom. Arrays must keep the same
 * length and order as the original — components merge them with
 * non-translatable config (artwork seeds etc.) by index.
 *
 * PLACEHOLDER CONTENT: client names, projects, results, people, quotes and
 * awards are fictional stand-ins. Replace every one with real material
 * before launch.
 */
const en = {
  /* ── Navbar ── */
  nav: {
    manifesto: 'Manifesto',
    work: 'Work',
    services: 'Services',
    process: 'Process',
    studio: 'Studio',
    logo: 'CP',
    brand: 'Cyber Pears',
    toggleMenu: 'Toggle menu',
    bookCall: 'Get in touch',
  },

  /* ── Brand theme switch ── */
  brandSwitch: {
    label: 'Colour theme',
    violet: 'Violet',
    noir: 'Noir',
  },

  /* ── Primary CTA button ── */
  bookCallButton: {
    label: 'Get in touch',
  },

  /* ── Preloader ── */
  preloader: {
    wordmark: 'Cyber Pears',
    tagline: 'Design & Development Studio',
    loading: 'Loading',
  },

  /* ── Scroll progress rail (keyed by section id) ── */
  progress: {
    manifesto: 'Manifesto',
    services: 'Services',
    work: 'Work',
    cases: 'Case studies',
    process: 'Process',
    clients: 'Clients',
    studio: 'About',
    testimonials: 'Kind words',
    contact: 'Contact',
  },

  /* ── Hero ── */
  hero: {
    // "\n" marks a line break
    headline: 'Be Less Ordinary.',
    // Set in italic, in the accent colour (must match a word exactly, incl. punctuation)
    accentWords: ['Ordinary.'],
    subtext:
      'We create websites for brands that refuse to blend in.',
    scrollLabel: 'Scroll',
  },

  /* ── Manifesto ── */
  manifesto: {
    label: 'The manifesto',
    statement:
      'Cyber Pears is for ambitious brands. We don\'t design with restraint, we build for brands who are obsessed with becoming extraordinary.\nNot everyone gets it.',
  },

  /* ── Services ── */
  services: {
    label: 'What we do',
    heading: 'Three disciplines, one standard',
    items: [
      {
        title: 'Brand Identity',
        description: 'Naming, visual identity and the systems that keep a brand unmistakable.',
        tags: ['Strategy', 'Identity', 'Guidelines'],
      },
      {
        title: 'Digital Design',
        description: 'Websites and products designed to be felt, not just seen.',
        tags: ['Web', 'Product', 'Design systems'],
      },
      {
        title: 'Development',
        description: 'Fast, accessible, maintainable builds — engineered to last.',
        tags: ['Next.js', 'Headless CMS', 'E-commerce'],
      },
    ],
  },

  /* ── Selected Work (horizontal carousel) ── */
  selectedWork: {
    label: 'Selected work',
    heading: 'Recent flagships',
    description: 'A few of the brands we have helped launch, rebuild and reimagine.',
    viewProject: 'View project',
    prev: 'Previous project',
    next: 'Next project',
    goTo: 'Go to project',
    projects: [
      { client: 'Maison Verre', title: 'A glasshouse brand, rebuilt in light', year: '2026', services: ['Identity', 'Web'] },
      { client: 'Nordlicht', title: 'E-commerce for a Nordic outerwear label', year: '2026', services: ['Design', 'Development'] },
      { client: 'Atelier Sol', title: 'Portfolio site for an architecture practice', year: '2025', services: ['Web', 'Motion'] },
      { client: 'Hollow & Pine', title: 'Launch campaign for a small-batch distillery', year: '2025', services: ['Identity', 'Motion'] },
      { client: 'Kinoko Labs', title: 'Product marketing site with live 3D', year: '2025', services: ['Design', 'WebGL'] },
    ],
  },

  /* ── Featured case studies (stacked panels) ── */
  caseStudies: {
    label: 'Case studies',
    heading: 'Work, in depth',
    cases: [
      {
        client: 'Maison Verre',
        category: 'Identity · Web · Motion',
        title: 'Turning a 90-year-old glassworks into a modern luxury house',
        description:
          'A new identity, a cinematic e-commerce flagship and a motion language built around the way light moves through glass.',
        stats: [
          { value: 3.2, suffix: '×', label: 'Online revenue' },
          { value: 48, suffix: '%', label: 'Longer sessions' },
          { value: 1.1, suffix: 's', label: 'Load time' },
        ],
      },
      {
        client: 'Nordlicht',
        category: 'Design · Development',
        title: 'A storefront as calm and capable as the jackets it sells',
        description:
          'Headless commerce with a product story told through scroll — from fabric to fjord — without slowing the path to checkout.',
        stats: [
          { value: 62, suffix: '%', label: 'Conversion lift' },
          { value: 99, suffix: '', label: 'Lighthouse score' },
          { value: 14, suffix: '', label: 'Markets at launch' },
        ],
      },
      {
        client: 'Kinoko Labs',
        category: 'Design · WebGL',
        title: 'Explaining an invisible product with a world you can touch',
        description:
          'A real-time 3D product tour that turns a complex platform into something visitors can explore at their own pace.',
        stats: [
          { value: 2.4, suffix: '×', label: 'Demo requests' },
          { value: 3, suffix: 'm', label: 'Avg. time on page' },
          { value: 60, suffix: 'fps', label: 'On mid-range phones' },
        ],
      },
    ],
  },

  /* ── Process ── */
  process: {
    label: 'How we work',
    heading: 'A process built for craft',
    steps: [
      { title: 'Discover', description: 'We learn the business, the audience and what success looks like.' },
      { title: 'Design', description: 'Direction first, then every screen, state and transition.' },
      { title: 'Build', description: 'Engineered in parallel with design, reviewed weekly with you.' },
      { title: 'Launch', description: 'Performance, accessibility and a calm, well-rehearsed go-live.' },
    ],
  },

  /* ── Clients & recognition ── */
  clients: {
    label: 'Trusted by',
    names: ['Maison Verre', 'Nordlicht', 'Atelier Sol', 'Hollow & Pine', 'Kinoko Labs', 'Oro Studio', 'Field & Fable', 'Lumen House'],
    awardsLabel: 'Recognition',
    awards: [
      { name: 'Site of the Day', body: 'Placeholder awards body', year: '2026' },
      { name: 'Developer Award', body: 'Placeholder awards body', year: '2025' },
      { name: 'Honourable Mention', body: 'Placeholder awards body', year: '2025' },
    ],
  },

  /* ── Studio ── */
  studio: {
    label: 'Studio',
    heading: 'Small by design',
    body:
      'Cyber Pears is a deliberately small team of designers and engineers. Every project is led by the people who do the work — no hand-offs, no account managers in between.',
    bodySecondary:
      'We take on a handful of projects each year, so each one gets our full attention from the first workshop to the last line of code.',
    stats: [
      { value: 7, suffix: '', label: 'Years in practice' },
      { value: 60, suffix: '+', label: 'Launches' },
      { value: 12, suffix: '', label: 'People' },
    ],
  },

  /* ── Testimonials ── */
  testimonials: {
    label: 'Kind words',
    prev: 'Previous testimonial',
    next: 'Next testimonial',
    goTo: 'Show testimonial',
    cursorNext: 'Next',
    items: [
      { quote: 'Placeholder quote — they treated our brand like it was their own, and it shows in every detail.', name: 'Client name', role: 'Founder, Company' },
      { quote: 'Placeholder quote — the most considered launch we have ever shipped, and the calmest.', name: 'Client name', role: 'Marketing Director, Company' },
      { quote: 'Placeholder quote — every interaction moves exactly the way it should. People notice.', name: 'Client name', role: 'Head of Product, Company' },
    ],
  },

  /* ── Contact ── */
  contact: {
    label: 'Contact',
    heading: 'Let’s make something rare.',
    description: 'Tell us about your project. We reply within two working days.',
    emailLabel: 'Or write to us',
    email: 'hello@cyberpears.studio',
    fields: {
      name: 'Your name',
      email: 'Email',
      company: 'Company (optional)',
      budget: 'Budget',
      message: 'Tell us about the project',
    },
    budgets: ['Under $25k', '$25k–$75k', '$75k–$150k', '$150k+'],
    submit: 'Send enquiry',
    sending: 'Sending…',
    successTitle: 'Thank you.',
    successMessage: 'We’ve received your enquiry and will be in touch shortly.',
    errorMessage: 'Something went wrong sending your message. Please email us directly.',
  },

  /* ── Footer ── */
  footer: {
    tagline: 'Design & development for brands that refuse to be ordinary.',
    navLabel: 'Studio',
    socialLabel: 'Elsewhere',
    // Placeholder profiles — point these at real accounts before launch
    socials: [
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Dribbble', href: '#' },
    ],
    wordmark: 'Cyber Pears',
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },
}

export default en
