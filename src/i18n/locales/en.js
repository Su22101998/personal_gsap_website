/**
 * English locale — default language.
 *
 * To add a new language, duplicate this file (e.g. `fr.js`), translate every
 * value, then register it in `../TranslationProvider.jsx`.
 *
 * Keys are grouped by component / section so translators can work through the
 * site top-to-bottom. Arrays must keep the same length and order as the
 * original — components merge them with non-translatable config (colours,
 * positions, etc.) by index.
 */
const en = {
  /* ── Site metadata (used in layout.jsx — server component) ── */
  meta: {
    title: 'Portfolio — UI/UX Designer, Software Developer & Product Builder',
    description:
      'Pixel perfect digital experiences that demand attention, engage users, and drive real results.',
  },

  /* ── Navbar ── */
  nav: {
    home: 'Home',
    systems: 'Systems',
    work: 'Work',
    caseStudies: 'Case Studies',
    skills: 'Skills',
    about: 'About',
    logo: 'FX',
    brand: 'FinPort',
    toggleMenu: 'Toggle menu',
    bookCall: 'Book a Call',
  },

  /* ── Book-a-Call CTA button ── */
  bookCallButton: {
    label: 'Book a Call',
  },

  /* ── Loader ── */
  loader: {
    logo: 'FX',
    brand: 'FinPort',
    initializing: 'Initializing systems...',
    loading: 'Loading financial modules...',
    connecting: 'Connecting networks...',
    online: 'Systems online',
  },

  /* ── Smooth Letters Intro ── */
  intro: {
    greeting: 'Hey!',
    scrollLabel: 'Scroll',
    sentence:
      "I won't waste your time with bullshit. Let's cut to the chase, and start building!",
  },

  /* ── Hero ── */
  hero: {
    badge: '10+ founders booked a call this week.',
    headline: "WEBSITES THAT TELL YOUR STORY.",
    accentWords: [''],
    subtext:
      'Dive into a world of endless possibilities.',
    scrollLabel: 'Scroll',
  },

  /* ── Fintech Systems ── */
  fintechSystems: {
    sectionLabel: 'Ecosystem',
    heading: 'Interactive Fintech ',
    headingAccent: 'Architecture',
    description:
      'A complete view of the financial systems designed — from bank integrations to consumer-facing applications.',
    challengesTitle: 'UX Challenges Solved',
    nodes: [
      {
        label: 'Banks',
        description:
          'Multi-bank integration with 500+ financial institutions via secure APIs.',
        challenges:
          'Handling diverse data formats, ensuring 99.99% uptime, real-time balance sync.',
      },
      {
        label: 'Aggregator',
        description:
          'Unified data pipeline aggregating accounts, transactions, and balances.',
        challenges:
          'Data normalization across banks, consent management, PSD2 compliance.',
      },
      {
        label: 'Credit Systems',
        description:
          'Credit card data analysis, scoring models, and utilization dashboards.',
        challenges:
          'Real-time credit scoring, fraud detection UI, spending pattern visualization.',
      },
      {
        label: 'Investment Platforms',
        description:
          'Portfolio management with asset allocation and performance tracking.',
        challenges:
          'Real-time market data rendering, complex chart interactions, risk displays.',
      },
      {
        label: 'Stock Brokerage',
        description:
          'Trading interfaces with order books, candlestick charts, and execution flows.',
        challenges:
          'Sub-second UI updates, order flow visualization, watchlist management.',
      },
      {
        label: 'User Application',
        description:
          'Consumer-facing app combining all financial services in one unified experience.',
        challenges:
          'Onboarding complexity, information hierarchy, accessibility at scale.',
      },
    ],
  },

  /* ── Experience Timeline ── */
  experienceTimeline: {
    sectionLabel: 'Experience',
    heading: 'Building Tech ',
    headingHighlight: 'Since 2019',
    description:
      'Scroll horizontally through five years of designing financial systems that handle billions in transactions.',
    prevCard: 'Previous card',
    nextCard: 'Next card',
    goToCard: 'Go to card',
    cards: [
      {
        year: '2019–2020',
        title: 'Bank Aggregator Systems',
        company: 'NexBank Financial',
        description:
          'Designed unified banking dashboards aggregating data from 500+ institutions. Built real-time balance sync interfaces and consent management flows.',
        metrics: ['500+ Banks', '2M+ Users', '99.9% Uptime'],
        tags: ['Open Banking', 'PSD2', 'API Design'],
      },
      {
        year: '2020–2021',
        title: 'Credit Card Data Platforms',
        company: 'CreditPulse Analytics',
        description:
          'Created credit monitoring dashboards with real-time scoring, spending pattern visualizations, and fraud alert interfaces.',
        metrics: ['50M+ Transactions', '98% Accuracy', '3s Load Time'],
        tags: ['Credit Scoring', 'Fraud Detection', 'Data Viz'],
      },
      {
        year: '2021–2022',
        title: 'Investment Portfolio Dashboards',
        company: 'InvestFlow Capital',
        description:
          'Built portfolio management interfaces with asset allocation views, performance tracking, and risk assessment tools.',
        metrics: ['$2B+ AUM', '15K Portfolios', '4.8★ Rating'],
        tags: ['Portfolio Mgmt', 'Risk Analysis', 'Charts'],
      },
      {
        year: '2022–2023',
        title: 'Financial Management Platform',
        company: 'WealthOS Systems',
        description:
          'Designed an enterprise FMP handling budgeting, forecasting, and multi-entity financial reporting for mid-market companies.',
        metrics: ['200+ Enterprises', '$500M Managed', '40% Efficiency ↑'],
        tags: ['Enterprise', 'Budgeting', 'Reporting'],
      },
      {
        year: '2023–2024',
        title: 'Stock Trading Applications',
        company: 'TradeAxis Markets',
        description:
          'Designed high-frequency trading interfaces with real-time order books, candlestick charts, and one-tap execution flows.',
        metrics: ['1M+ Trades/Day', '<100ms Latency', '25% ↑ Conversion'],
        tags: ['Trading UI', 'Real-time', 'Order Flow'],
      },
    ],
  },

  /* ── Case Studies ── */
  caseStudies: {
    sectionLabel: 'Case Studies',
    heading: 'Products That Move ',
    headingAccent: 'Real Money',
    description:
      'Each project is a mini product reveal — designed to handle millions of financial data points with precision.',
    cases: [
      {
        title: 'NexBank Aggregator',
        category: 'Bank Aggregation Platform',
        description:
          'Designed a unified banking experience connecting 500+ financial institutions. Built real-time account sync, transaction categorization, and multi-bank balance views.',
        stats: [
          { label: 'Institutions', value: 500, suffix: '+' },
          { label: 'Active Users', value: 2.4, suffix: 'M' },
          { label: 'Sync Speed', value: 1.2, suffix: 's' },
        ],
      },
      {
        title: 'CreditPulse Analytics',
        category: 'Credit Data System',
        description:
          'Created an intelligent credit monitoring platform with real-time scoring, spending insights, and fraud detection interfaces that process 50M+ transactions monthly.',
        stats: [
          { label: 'Transactions', value: 50, suffix: 'M+/mo' },
          { label: 'Detection Rate', value: 98.7, suffix: '%' },
          { label: 'Avg Response', value: 200, suffix: 'ms' },
        ],
      },
      {
        title: 'InvestFlow Dashboard',
        category: 'Investment Platform',
        description:
          'Built a portfolio management interface tracking $2B+ in assets. Features include real-time P&L, asset allocation charts, and predictive risk scoring.',
        stats: [
          { label: 'AUM', value: 2.1, suffix: 'B' },
          { label: 'Portfolios', value: 15, suffix: 'K+' },
          { label: 'App Rating', value: 4.8, suffix: '★' },
        ],
      },
      {
        title: 'TradeAxis Platform',
        category: 'Stock Broking Application',
        description:
          'Designed a high-performance trading interface supporting 1M+ daily trades. Real-time candlesticks, depth charts, and one-tap order execution.',
        stats: [
          { label: 'Daily Trades', value: 1, suffix: 'M+' },
          { label: 'Latency', value: 80, suffix: 'ms' },
          { label: 'Conversion', value: 25, suffix: '% ↑' },
        ],
      },
    ],
  },

  /* ── Data Playground ── */
  dataPlayground: {
    sectionLabel: 'Interactive Data',
    heading: 'Data Visualization ',
    headingAccent: 'Playground',
    description:
      'Explore interactive fintech data visualizations — the building blocks of every financial interface designed.',
    portfolioTitle: 'Portfolio Allocation',
    creditTitle: 'Credit Monitor',
    creditUtilization: 'Credit Utilization',
    creditHealthy: 'Healthy',
    creditUsed: '$4,250 used',
    creditLimit: '$12,500 limit',
    transactionsTitle: 'Live Transaction Stream',
    cardBrands: ['Visa', 'MC'],
    allocationLabels: ['Equities', 'Fixed Income', 'Real Estate', 'Crypto', 'Cash'],
    transactions: [
      { desc: 'Salary Deposit', amount: '+$8,450.00', time: '2s ago' },
      { desc: 'AWS Services', amount: '-$1,234.56', time: '5s ago' },
      { desc: 'Invoice #1847', amount: '+$3,200.00', time: '12s ago' },
      { desc: 'Stripe Fee', amount: '-$89.32', time: '18s ago' },
      { desc: 'Client Payment', amount: '+$5,670.00', time: '24s ago' },
      { desc: 'Office Rent', amount: '-$2,500.00', time: '31s ago' },
    ],
  },

  /* ── Skills ── */
  skills: {
    sectionLabel: 'Expertise',
    heading: 'System ',
    headingAccent: 'Architecture Map',
    description:
      'Hover over each skill node to explore how different areas of expertise connect in building fintech products.',
    labels: [
      'UI/UX Design',
      'Fintech Systems',
      'API Integrations',
      'Data Visualization',
      'Mobile Apps',
      'Financial Analytics',
      'Design Systems',
    ],
  },

  /* ── About ── */
  about: {
    sectionLabel: 'About',
    heading: 'At the Intersection of ',
    headingAccent: 'Finance & Design',
    stats: [
      { value: '5+', label: 'Years in Fintech' },
      { value: '20+', label: 'Products Shipped' },
      { value: '$2B+', label: 'Assets Under Design' },
      { value: '10M+', label: 'Users Impacted' },
    ],
    bioP1Start: "I'm a product designer who lives at the crossroads of ",
    bioHighlights: ['finance', 'technology', 'product design'],
    bioP2:
      "Over the past five years, I've designed systems that process millions of financial data points in real time — from bank aggregation platforms connecting 500+ institutions to stock trading interfaces executing millions of daily transactions.",
    bioP3:
      'My work focuses on making complex financial systems feel intuitive, secure, and delightful. Every interface I design is built on deep understanding of financial regulations, data architecture, and user psychology.',
    terminalTitle: 'portfolio_terminal.exe',
    terminalStatus: '● SYSTEMS ONLINE',
    terminalLatency: 'LATENCY: 12ms',
    terminalUptime: 'UPTIME: 99.99%',
    terminalLines: [
      { prefix: '→', text: 'Loading financial modules...' },
      { prefix: '✓', text: 'Bank aggregation service connected' },
      { prefix: '✓', text: 'Credit data pipeline initialized' },
      { prefix: '✓', text: 'Investment analytics engine ready' },
      { prefix: '✓', text: 'Trading interface compiled' },
      { prefix: '→', text: 'Running design system audit...' },
      { prefix: 'ℹ', text: '847 components | 62 patterns | 12 themes' },
      { prefix: '→', text: 'Portfolio ready for review' },
    ],
  },

  /* ── Contact ── */
  contact: {
    sectionLabel: 'Contact',
    heading: "Let's Build the Next Generation of ",
    headingAccent: 'Financial Products',
    description:
      "Ready to design fintech systems that move data, money, and decisions? Let's talk.",
    terminalTitle: 'new_collaboration.sh',
    successTitle: 'Transmission received.',
    successMessage: "I'll get back to you within 24 hours.",
    fields: {
      name: { label: 'name', placeholder: 'Enter your name...' },
      email: { label: 'email', placeholder: 'your@email.com' },
      company: { label: 'company', placeholder: 'Company or project name...' },
      message: { label: 'message', placeholder: 'Describe your project...' },
    },
    promptSymbol: '$',
    submitLoading: 'Transmitting...',
    submitLabel: 'Send Transmission',
    availableTag: 'Available for new projects',
    availableDescription:
      'Currently accepting fintech design projects, consulting engagements, and full-time opportunities.',
    connectTitle: 'Connect',
    channels: [
      { label: 'Email', value: 'hello@fintechdesigner.com', icon: '✉' },
      { label: 'LinkedIn', value: '/in/fintechdesigner', icon: '🔗' },
      { label: 'Dribbble', value: '@fintechdesigner', icon: '🎨' },
      { label: 'Twitter', value: '@fintechdesigner', icon: '𝕏' },
    ],
    responseTimeLabel: 'Avg. Response Time',
    responseTimeValue: '< 24hrs',
  },

  /* ── Footer ── */
  footer: {
    logo: 'FX',
    brand: 'FinPort',
    status: 'All systems operational',
    version: 'v2.0.0',
    home: 'Home',
    work: 'Work',
    contact: 'Contact',
    credits:
      'Designed & built with precision. Powered by Next.js, Three.js, and GSAP.',
  },
}

export default en
