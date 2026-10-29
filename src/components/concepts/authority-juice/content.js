/**
 * Content for the Authority Juice redesign (/work/authority-juice).
 *
 * Copy, imagery, video and results are Authority Juice's own, taken from
 * authorityjuice.com and used with the owner's permission. Assets live in
 * /public/work/authority-juice (downscaled, renamed copies of the originals).
 */
export const LIVE_SITE = 'https://authorityjuice.com/'
export const BOOK_CALL = 'https://calendly.com/authorityjuice/30min'

const A = '/work/authority-juice'
export const asset = (name) => `${A}/${name}`

export const frame = {
  back: 'Cyber Pears',
  label: 'Concept redesign',
  client: 'Authority Juice',
  live: 'Visit the live site',
}

export const nav = [
  { label: 'Home', href: '#aj-top' },
  { label: 'What we solve', href: '#aj-solve' },
  { label: 'Our process', href: '#aj-process' },
  { label: 'Services', href: '#aj-services' },
  { label: 'Results', href: '#aj-results' },
  { label: 'FAQs', href: '#aj-faq' },
]

export const hero = {
  badge: '10+ founders & CMOs booked a call this week',
  // `accent` words are set in orange
  headline: [{ text: 'Grow' }, { text: 'organic.', accent: true }, { text: 'Spend' }, { text: 'less' }, { text: 'on' }, { text: 'paid.' }],
  description: 'We help B2B brands dominate search and build content systems that drive compounding results.',
  cta: 'Book a call',
}

export const stats = [
  {
    value: 69,
    suffix: 'X',
    title: 'Growth in organic traffic',
    text: 'One project scaled from just ~22 clicks to 3,000+ clicks in less than 6 months. Proof that the right SEO strategy compounds fast.',
    href: `${LIVE_SITE}case-study/distribution-ai-69x-organic-lift`,
  },
  {
    value: 90,
    suffix: 'X',
    title: 'Surge in search visibility',
    text: 'From 4K impressions to 390K+ — capturing 1,000+ new keyword rankings across the funnel in under 6 months.',
    href: `${LIVE_SITE}case-study/how-a-fintech-brand-achieved-a-90x-surge-in-search-visibility`,
  },
  {
    value: 50,
    prefix: '$',
    suffix: 'K+',
    title: 'Partner revenue added',
    text: 'Our white-label SEO audits helped a partner agency unlock $50,000+ in new sales, supporting 5+ client projects in just 3 months',
    href: `${LIVE_SITE}case-study/the-hidden-partner-behind-50k-in-new-agency-revenue`,
  },
]
export const statsLink = 'See detailed report'

export const press = {
  heading: [{ text: 'Our' }, { text: 'clients', accent: true }, { text: 'have been featured in' }],
  logos: [
    { name: 'Forbes', src: asset('press-forbes.png') },
    { name: 'USA Today', src: asset('press-usatoday.png') },
    { name: 'Moz', src: asset('press-moz.png') },
    { name: 'Semrush', src: asset('press-semrush.png') },
    { name: 'VentureBeat', src: asset('press-venturebeat.png') },
    { name: 'HubSpot', src: asset('press-hubspot.webp') },
    { name: 'Nasdaq', src: asset('press-nasdaq.png') },
  ],
}

export const pain = {
  heading: 'The hidden costs of a bad organic strategy',
  sub: 'Burnt budget. Flat metrics. Scattered content. No compounding returns.',
  cards: [
    { tag: 'Paid ads band-aid', text: 'You’re overspending on ads to make up for weak organic growth.', img: asset('pain-paid-ads.png') },
    { tag: 'Ghost mode', text: 'Your founder voice is buried in ghostwritten fluff.', img: asset('pain-ghost.png'), ghost: true },
    { tag: 'SEO tactics are failing', text: 'SEO feels like a slot machine.', img: asset('pain-slot-machine.png') },
    { tag: 'Content factory trap', text: 'You’re churning out posts that don’t move the needle.', img: asset('pain-content-factory.png'), wide: true },
    { tag: 'Lost market share', text: 'Every missed ranking is a competitor gaining ground.', img: asset('pain-wilted-flower.png'), wide: true },
  ],
  // The ghostwritten post mock in the "Ghost mode" card
  ghostPost: {
    context: 'Contextual information',
    heading: 'Generic heading for a blog post or a linkedin article',
    coupon: 'Fake coupon code to buy a course',
    button: 'Default CTA button',
    caption: 'CTA without a strategy',
  },
}

export const gain = {
  heading: 'Here’s what it feels like when things just work.',
  sub: 'A system built to win market share and drive real demand.',
  compounds: {
    tag: 'Content that compounds',
    text: 'Content stops being a cost center & starts driving measurable pipeline.',
    date: '29 July 00:00',
    value: 220342.76,
    change: '+3.4%',
  },
  leaders: {
    tag: 'Founders as category leaders',
    text: 'Your leadership voice shines through. Thought leadership builds trust & strengthens demand.',
    avatars: [1, 2, 3, 4, 5].map((n) => asset(`leader-${n}.jpg`)),
    badge: asset('top-voice.png'),
  },
  strategy: { tag: 'Strategy you can measure', text: 'A clear SEO roadmap that turns visibility into qualified leads & pipeline.' },
  cac: {
    tag: 'Organic that lowers CAC',
    text: ['Organic channels start carrying their weight.', 'Paid spend stops masking weak strategy and starts amplifying a solid base.'],
  },
  deals: { tag: 'Visibility that wins deals', text: 'Every ranking secured is competitor share taken back.', img: asset('gain-flower.png') },
}

export const founder = {
  text: 'Authority Juice helps B2B companies turn their content, SEO, and founder brand into one compounding growth engine. We build clear, search-backed strategies that drive inbound, shape category conversations, and earn trust. Run by organic growth strategists who have been in the trenches for 7+ years.',
  name: 'Madhurima Halder',
  alias: '(aka Rima)',
  role: 'Founder & Chief Strategist, Authority Juice',
  img: asset('founder.png'),
}

export const process = {
  heading: 'Our system for predictable organic growth',
  sub: 'A 3-step system engineered to scale visibility, leads, and revenue.',
  steps: [
    { step: 'Step 1', title: 'Book your free call', text: 'You walk us through what you’ve tried, what’s working, and where things are falling short.' },
    {
      step: 'Step 2',
      title: 'The Organic Authority Audit™',
      text: 'We dig into your site, your content, your search visibility, and how your founder(s) show up across channels. You walk away with a plan of action.',
    },
    {
      step: 'Step 3',
      title: 'Watch the flywheel turn',
      text: 'Once the plan is in place, we start executing with you. Whether you need full support or just high-leverage strategy, we plug in where it counts.',
    },
  ],
}

export const agency = {
  heading: 'Not your typical agency experience',
  sub: 'Built for founders & CMOs who expect strategy, speed, and follow-through.',
  video: asset('agency-video.mp4'),
}

export const compare = {
  heading: 'See what happens when strategy compounds.',
  sub: 'Clarity in process. Consistency in growth.',
  before: {
    label: 'Before',
    text: 'Teams siloed, tools disconnected, effort wasted, and growth feels stuck.',
    files: ['Onboarding.pdf', 'Growth.pdf', 'Plan.pdf'],
  },
  after: {
    label: 'After',
    text: 'One clear strategy. Everything working together. Growth that builds on itself.',
    files: ['SOP.pdf', 'Growth.pdf', 'AI.pdf'],
    chart: 'Growth ++',
  },
  team: [1, 2, 3].map((n) => asset(`team-${n}.png`)),
  file: asset('file.png'),
}

export const testimonials = {
  heading: 'When strategy meets execution',
  sub: 'Here’s what our clients say',
  clients: { value: 40, suffix: '+', label: 'clients served', avatars: [1, 2, 3, 4, 5].map((n) => asset(`client-${n}.png`)) },
  roi: { lead: 'Earn back your investment within 90 days', value: 90, suffix: '%', label: 'ROI (Return on Investment)' },
  booking: 'Now booking for Q3 2026',
  quotes: [
    {
      quote: 'Authority Juice’s communication, knowledge, and skills have been impressive.',
      name: 'Jim Barnish',
      role: 'CEO, Dragonfly Operating Partners',
      img: asset('testimonial-jim.jpeg'),
    },
    {
      quote:
        'Authority Juice rebuilt our inbound engine from the ground up and made it work. We finally see consistent traffic, qualified leads, and real growth from organic.',
      name: '[Details under NDA]',
      role: 'Co-Founder, SaaS [Pre-Seed]',
      img: asset('testimonial-nda.jpg'),
    },
    {
      quote:
        'Authority Juice significantly improved our SEO. The team was extremely organized and on top of everything, they had incredible communication through virtual meetings and email. We were impressed with how they got things done.',
      name: 'Haley Ingram',
      role: 'Founder & CEO, Coffee & Contracts',
      img: asset('testimonial-haley.png'),
    },
    {
      quote:
        'We’ve had a great experience working with the Authority Juice team. They’re strategic, resourceful, and consistently deliver high-quality work on tight timelines. Their insights have helped us bring our content strategy to life and drive real momentum. Highly recommend for any team looking to scale content with intention and speed.',
      name: 'Elijah Hosein',
      role: 'Senior Growth Marketing Manager, Chattr.ai [Acquired by UKG]',
      img: asset('testimonial-elijah.jpg'),
    },
    {
      quote:
        'We get data regularly and their updates to keep us in the loop on what they are doing and when has to be some of the best I have ever seen! I strongly recommend Authority Juice. They are some great people, a great team doing some amazing work!',
      name: 'Ross Simmonds',
      role: 'Founder, Distribution.ai & Foundation Marketing',
      img: asset('testimonial-ross.jpeg'),
    },
  ],
}

export const services = {
  heading: 'The growth stack we bring in',
  items: [
    {
      title: 'Generative Engine Optimization (GEO/ AI Search)',
      text: [
        'We help your content appear in Google’s AI Overviews and generative search results.',
        'That means shaping your pages into clear, LLM-friendly content that AI systems can understand, quote, and rank.',
      ],
      img: asset('service-geo.png'),
    },
    {
      title: 'Search Engine Optimization (SEO)',
      text: [
        'We help your site rank for high-intent keywords that drive tangible business outcomes.',
        'This includes deep technical audits, on-page improvements, and a smart keyword strategy that aligns with what your buyers are searching.',
      ],
      img: asset('service-seo.png'),
    },
    {
      title: 'Full funnel content strategy & creation',
      text: [
        'We build strategies that turn content into a growth channel.',
        'We map assets to every stage of the funnel so buyers move smoothly from first touch to final decision.',
      ],
      img: asset('service-content.png'),
    },
    {
      title: 'Founder branding',
      text: [
        'We turn founder insights into visibility across search, social, and earned channels.',
        'This includes thought leadership, LinkedIn content, and podcast features that build trust while supporting your broader SEO and demand strategy.',
      ],
      img: asset('service-founder.svg'),
    },
    {
      title: 'Link building',
      text: [
        'We earn backlinks that improve rankings and build domain authority where it counts.',
        'These come from trusted publications, partner features, and editorial placements that send the right signals to Google.',
      ],
      img: asset('service-links.png'),
    },
    {
      title: 'Website experience & CRO',
      text: [
        'We turn traffic into pipeline by aligning your site experience with how buyers convert.',
        'That means running CRO experiments, tightening messaging and design, and rebuilding high-impact pages (or entire sites) when needed.',
      ],
      img: asset('service-cro.png'),
    },
    {
      title: 'Team workshops & enablement',
      text: [
        'We lead workshops that help your team understand and execute the strategies behind sustainable search growth.',
        'Each (on-site/ virtual) session is tailored to your site, funnel, and goals. From AI-first SEO to content systems, your team learns how to drive results without relying on outdated playbooks.',
      ],
      img: asset('service-workshops.png'),
    },
  ],
}

export const plans = {
  heading: 'Choose your growth plan',
  includes: 'Includes:',
  items: [
    {
      tab: 'The Organic Authority Audit™',
      plan: 'Plan 1',
      title: 'The Organic Authority Audit™',
      text: 'An exhaustive, strategic teardown of your organic visibility— technical, content, authority, founder brand, and AI Overviews & LLM readiness. Comes with a full roadmap and live walkthrough session to align your team.',
      features: [
        'Full technical SEO audit (crawlability, indexation, site structure, etc.)',
        'Content & keyword gap analysis (vs 5 competitors)',
        'AI-readiness & generative search positioning',
        'BOFU content & intent-matching roadmap',
        'Schema markup & backlink profile evaluation',
        '50–60 page audit deck',
        '60-minute live walkthrough + Q&A',
      ],
    },
    {
      tab: 'Execution Engine',
      plan: 'Plan 2',
      title: 'Execution Engine',
      text: 'Once the strategies are in place, this is where we get to work. We join your team, create the right content, fix your SEO and GEO gaps, and build organic momentum that compounds over time.',
      features: [
        'Content calendar development based on audit insights',
        'SEO-driven blog creation (TOFU, MOFU & BOFU)',
        'On-page optimization for key landing pages',
        'Internal linking strategy',
        'Keyword tracking and performance monitoring',
        'Backlink building strategy',
        'Fortnightly check-ins and recommendations',
        'Slack + async support with your point of contact',
        'Option to scale up content volume or integrate Plan 3 / 4',
      ],
    },
    {
      tab: 'Founder Brand Accelerator',
      plan: 'Plan 3',
      addOn: true,
      title: 'Founder Brand Accelerator',
      text: 'We help you turn your founder voice into visibility on search, social, and key industry channels. We make sure your founder shows up where it counts and says things that stick.',
      features: [
        'Founder brand audit + positioning',
        'Monthly LinkedIn content calendar and ghostwriting',
        'Thought leadership article development',
        'Podcast pitching and earned media opportunities',
        'Content repurposing for team accounts',
      ],
    },
    {
      tab: 'Website Experience & CRO',
      plan: 'Plan 4',
      addOn: true,
      title: 'Website Experience & CRO',
      text: 'If organic traffic is landing but not converting, this is what fixes it. We test, rebuild, and optimize your key pages to close the gap between visits and pipeline.',
      features: [
        'CRO audit of high-impact pages',
        'Messaging and UX teardown',
        'Conversion-focused design briefs',
        'A/B test setup and analysis',
        'Dev-ready recommendations or direct implementation',
        'Full-page or site rebuild support, scoped based on goals',
      ],
    },
  ],
}

export const faq = {
  heading: 'What teams ask before working with us',
  items: [
    {
      q: 'How is Authority Juice different from other SEO and content agencies?',
      a: 'Most agencies approach organic growth in fragments. One team runs SEO. Another handles content. The founder brand is usually an afterthought (if it’s touched at all). At Authority Juice, we treat organic growth as ONE system. Strategy, search, and storytelling all need to work together to drive results that compound. We start by helping you get clear on your point of view. Then, we build a content engine that maps to your funnel, your buyers, and how search works today— including Google’s AI Overviews and generative platforms like ChatGPT, Gemini, and Perplexity. What most agencies get wrong is that they treat organic like a set of deliverables: keywords, blogs, and backlinks. But organic growth doesn’t work like that anymore, especially not in B2B. You won’t get recycled playbooks, junior teams, or endless meetings. You’ll work with senior operators who move fast, plug into your goals, and bring the kind of clarity most agencies miss.',
    },
    {
      q: 'How do you tie SEO and content strategy back to pipeline and revenue?',
      a: 'We start by mapping content to your buyer journey– from first search to final decision. Every topic we target aligns with a real intent, not just search volume. That means we prioritize BOFU keywords, comparison queries, and decision-stage content that speaks directly to what your buyers care about. We track how those pages perform. KPIs include: rankings, clicks, engagement, and assisted conversions, so you know what’s influencing pipeline, not just traffic.',
    },
    {
      q: 'We’ve invested in content before and saw no ROI. What would you do differently?',
      a: 'Most content efforts fail because they aren’t tied to a clear strategy. Teams often chase keywords, publish without direction, or focus on volume over intent. The result is a lot of content that looks busy but doesn’t drive traffic, leads, or conversions. We do it differently. We start by identifying what your buyers are searching for at every stage of the funnel. Then we build content that speaks to those needs, supports your sales motion, and is structured to rank in both traditional and AI-driven search.',
    },
    {
      q: 'How do you approach AI Overviews and generative search differently from traditional SEO?',
      a: 'Traditional SEO focuses on rankings. Our approach includes visibility in AI Overviews and platforms like ChatGPT, Gemini, and Perplexity. We structure your content so it’s easy for large language models to understand, quote, and surface as the first result. That means optimizing for clarity, trust signals, and content structure (not just keywords). You stay discoverable in both the old and the new search landscape.',
    },
    {
      q: 'Do you handle both technical SEO and content production or just one side?',
      a: 'We do both. Our strength lies in integrating technical SEO and content strategy to support each other effectively. That means identifying technical issues, prioritizing the right content to publish, and making sure everything ladders up to visibility and growth. You can bring us in for strategy, execution, or both. Whatever drives the most value for your team.',
    },
    {
      q: 'Can you plug into our existing marketing team, or do you operate as a standalone partner?',
      a: 'We’re built to integrate with your team. Whether you already have writers, a demand gen lead, or a growth marketer in place, we’ll support them with strategy and execution where it matters most. If you don’t have an in-house team yet, we can act as your organic growth function until you build one. Either way, we’re here to create momentum, not duplicate what you already have.',
    },
    {
      q: 'We don’t have a lot of internal bandwidth. How much of a lift is this for our team?',
      a: 'Very little. We designed our process for lean teams that need results without adding more to their plate. You’ll need to be present for strategy calls and give feedback on key deliverables. Beyond that, we take care of the rest. That includes research, writing, optimization, and day-to-day coordination. If anything needs input, we flag it early and keep moving. You won’t need to micromanage us or chase updates. We come in with a plan, own the process, and keep things moving so your team can stay focused on what they do best.',
    },
    {
      q: 'What do your services cost? How do I explain this expense to my CFO/ CEO?',
      a: 'Our pricing starts at $4,000 per month. Final pricing depends on the scope of work we align on— strategy depth, execution volume, and the level of support your team needs. This is not a cost center. It’s instead a growth investment with clear outputs, a defined scope, and measurable impact. Most marketing spend gets questioned because it’s vague or hard to track. We fix that. You’ll get a strategic roadmap tied to tangible business outcomes. That includes pipeline, visibility, search performance, and buyer trust. Every initiative ladders up to something the CFO/CEO already cares about: revenue efficiency.',
    },
  ],
}

export const newsletter = {
  heading: 'You’ve just sipped Authority Juice →',
  text: 'Subscribe to receive posts and the latest updates on all things organic marketing directly in your inbox.',
  fields: { first: 'First name', last: 'Last name', email: 'john@company.com' },
  button: 'Sign up',
  // This page is a showcase — sign-ups go to the live site
  demoNote: 'This is a design showcase — subscribe on authorityjuice.com.',
  video: asset('newsletter-video.mp4'),
}

export const footer = {
  columns: [
    {
      title: 'Links',
      links: [
        ...nav,
        { label: 'Blogs', href: `${LIVE_SITE}blogs`, external: true },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy policy', href: `${LIVE_SITE}privacy-policy`, external: true },
        { label: 'Terms of use', href: `${LIVE_SITE}term-of-use`, external: true },
        { label: 'Refund policy', href: `${LIVE_SITE}refund-policy`, external: true },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/authorityjuice/', external: true },
        { label: 'info@authorityjuice.com', href: 'mailto:info@authorityjuice.com' },
      ],
    },
  ],
  marquee: 'AUTHORITY JUICE *',
  rights: 'ALL RIGHTS RESERVED',
}

export const outro = {
  label: 'Concept by Cyber Pears',
  heading: 'Want a site that works this hard?',
  text: 'A concept redesign of authorityjuice.com by Cyber Pears, shared with Authority Juice’s permission. All content, imagery and results belong to Authority Juice.',
  primary: 'Start a project',
  secondary: 'Back to our work',
}
