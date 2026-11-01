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
      'We create website experiences for brands that refuse to blend in.',
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
    heading: 'Everything your brand needs to stand out',
    items: [
      {
        title: 'Brand Identity',
        description: 'Your brand gets a clear look and a recognizable voice from our team.',
        tags: ['Strategy', 'Identity', 'Guidelines'],
      },
      {
        title: 'Digital Design',
        description: 'Every page is designed by hand around your story, never pulled from a template.',
        tags: ['Web', 'Product', 'Design systems'],
      },
      {
        title: 'Development',
        description: 'Our engineers turn each design into a fast, reliable website on any device.',
        tags: ['Next.js', 'Headless CMS', 'E-commerce'],
      },
    ],
  },

  /* ── Selected Work (horizontal carousel) ── */
  selectedWork: {
    label: 'Selected work',
    heading: 'Recent flagships',
    description: 'Here is a look at some recent brand launches from our studio.',
    viewProject: 'View project',
    prev: 'Previous project',
    next: 'Next project',
    goTo: 'Go to project',
    projects: [
      { client: 'Maison Verre', title: 'A glasshouse brand, rebuilt in light', year: '2026', services: ['Identity', 'Web'] },
      { client: 'Nordlicht', title: 'E-commerce for a Nordic outerwear label', year: '2026', services: ['Design', 'Development'] },
      { client: 'Atelier Sol', title: 'Portfolio site for an architecture practice', year: '2025', services: ['Web', 'Motion'] },
      { client: 'Hollow & Pine', title: 'Launch campaign for a small-batch distillery', year: '2025', services: ['Identity', 'Motion'] },
      { client: 'Kinoko Labs', title: 'Product marketing site with live 3D', year: '2025', services: ['Design', 'WebGL']},
    ],
  },

  /* ── Featured case studies (stacked panels) ── */
  caseStudies: {
    label: 'Case studies',
    heading: 'A closer look at the results',
    cases: [
      {
        client: 'Maison Verre',
        category: 'Identity · Web · Motion',
        title: 'Turning a 90-year-old glassworks into a modern luxury house',
        description:
          'We gave this old glassworks a new identity and a cinematic online store. Its motion design borrows from the play of light inside glass.',
        stats: [
          { value: 3.2, suffix: '×', label: 'Online revenue' },
          { value: 48, suffix: '%', label: 'Longer sessions' },
          { value: 1.1, suffix: 's', label: 'Load time' },
        ],
      },
      {
        client: 'Nordlicht',
        category: 'Design · Development',
        title: 'A calm, capable storefront for premium outerwear',
        description:
          'Shoppers scroll through the story of each jacket, from fabric to fjord. The trip to checkout still takes only a few quick steps.',
        stats: [
          { value: 62, suffix: '%', label: 'Conversion lift' },
          { value: 99, suffix: '', label: 'Lighthouse score' },
          { value: 14, suffix: '', label: 'Markets at launch' },
        ],
      },
      {
        client: 'Kinoko Labs',
        category: 'Design · WebGL',
        title: 'Explaining an invisible product through a hands-on 3D world',
        description:
          'Our real-time 3D tour turns a complex platform into an easy place to explore. Visitors move through it at their own pace and stay much longer.',
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
    heading: 'How a project comes together',
    steps: [
      { title: 'Discover', description: 'We start by getting to know your business and its customers.' },
      { title: 'Design', description: 'Our designers then shape every screen around your brand story.' },
      { title: 'Build', description: 'Engineering runs alongside design, with a review call every week.' },
      { title: 'Launch', description: 'Your site goes live after careful testing for speed and accessibility.' },
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
      { name: 'Honorable Mention', body: 'Placeholder awards body', year: '2025' },
    ],
  },

  /* ── Studio ── */
  studio: {
    label: 'Studio',
    heading: 'Small by design',
    body:
      'Cyber Pears is a small team of designers and engineers with an obsession for detail. The people doing the work lead every project from start to finish, with no account managers in between.',
    bodySecondary:
      'Taking on only a handful of projects each year gives every client our full attention.',
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
      { quote: 'Placeholder quote: Our customers now mention the website on almost every sales call.', name: 'Client name', role: 'Founder, Company' },
      { quote: 'Placeholder quote: Our new site brought in a record number of leads during its first month.', name: 'Client name', role: 'Marketing Director, Company' },
      { quote: 'Placeholder quote: Months after launch, people still bring up our site in meetings.', name: 'Client name', role: 'Head of Product, Company' },
    ],
  },

  /* ── Contact ── */
  contact: {
    label: 'Contact',
    heading: 'Want a website people talk about?',
    description: 'Send us a few details about your project for a reply within two business days.',
    emailLabel: 'Or write to us',
    email: 'hello@cyberpears.studio',
    fields: {
      name: 'Your name',
      email: 'Email',
      company: 'Company (optional)',
      budget: 'Budget',
      message: 'Tell us about the project',
    },
    // `label` is what the form sends; `note` says what the budget covers
    budgets: [
      { label: 'Under $5k', note: 'Single-page website with pixel perfect design, transitions, and interactions' },
      { label: '$5k–$15k', note: 'Multi-page website with pixel perfect design, transitions, and interactions' },
      { label: '$15k–$25k', note: 'Website with 3D renders, stunning motion and interactions that users can explore and interact with' },
      { label: '$25k+', note: 'Custom requirements/ extended, year-long collaboration' },
    ],
    submit: 'Send inquiry',
    sending: 'Sending…',
    successTitle: 'Thank you.',
    successMessage: 'Your inquiry reached us safely. Expect a reply from our team very soon.',
    errorMessage: 'Sorry, your message didn’t go through. Please email us directly instead.',
  },

  /* ── Footer ── */
  footer: {
    tagline: 'Hand-tailored, high-end websites for ambitious brands.',
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
