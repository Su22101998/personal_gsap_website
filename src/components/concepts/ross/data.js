/*
 * Ross Simmonds — data for the concept makeover at /work/ross-simmonds.
 *
 * Unsolicited concept by Cyber Pears. Facts (stats, prices, client names,
 * talk titles, H1s, post titles/dates, URLs) are from rosssimmonds.com.
 * Longer copy is written fresh for the concept; endorsement quotes are NOT
 * reproduced or paraphrased — only names and roles appear.
 */

export const BASE = '/work/ross-simmonds'
export const LIVE = 'https://rosssimmonds.com'

// Pages built in the concept; every other path opens the live site
const BUILT = ['/', '/about/', '/book/', '/consulting/', '/keynotes/', '/blog/', '/url-map/']
export const isBuilt = (path) => BUILT.includes(path) || /^\/blog\/[^/]+\/$/.test(path)
// Concept routes drop the trailing slash (this app runs trailingSlash: false);
// a production rebuild would set trailingSlash: true to match his URLs exactly
export const href = (path) => (isBuilt(path) ? `${BASE}${path.replace(/\/$/, '')}` : `${LIVE}${path}`)

export const nav = [
  { label: 'About', path: '/about/' },
  { label: 'Keynotes', path: '/keynotes/' },
  { label: 'Blog', path: '/blog/' },
  { label: 'Consulting', path: '/consulting/' },
  { label: 'Book', path: '/book/' },
]

export const proof = [
  { value: 100, suffix: '+', label: 'Brands advised' },
  { value: 75, suffix: 'K+', label: 'Newsletter readers' },
  { value: 100, suffix: 'K+', label: 'Social followers' },
  { value: 1, prefix: '#', label: 'Amazon bestseller' },
]

/*
 * Logos: full wordmarks, recoloured white and cropped tight, at
 * public/work/ross-simmonds/logos/<id>.png. `w` is the width at the files'
 * 120px height; <Logo> uses it to give every mark the same visual weight.
 */
export const LOGOS = {
  forbes: { name: 'Forbes', w: 469 },
  huffpost: { name: 'HuffPost', w: 983 },
  cbc: { name: 'CBC', w: 237 },
  venturebeat: { name: 'VentureBeat', w: 911 },
  bet: { name: 'BET', w: 122 },
  'business-com': { name: 'business.com', w: 780 },
  canva: { name: 'Canva', w: 374 },
  snowflake: { name: 'Snowflake', w: 530 },
  webex: { name: 'Webex', w: 435 },
  procore: { name: 'Procore', w: 955 },
  eventbrite: { name: 'Eventbrite', w: 669 },
  jobber: { name: 'Jobber', w: 722 },
  ahrefs: { name: 'Ahrefs Evolve', w: 469 },
  'cmo-huddles': { name: 'CMO Huddles', w: 146 },
  hubspot: { name: 'HubSpot', w: 414 },
  'exit-five': { name: 'Exit Five DRIVE', w: 867 },
}

// The live site's press strip, plus BET from his bio
export const featuredIn = ['forbes', 'huffpost', 'cbc', 'venturebeat', 'bet', 'business-com']

// The "one idea → every channel" tiles on the home page
export const channels = [
  'LinkedIn post', 'X thread', 'YouTube Short', 'Reddit thread', 'Newsletter', 'Podcast clip',
  'Explainer video', 'LinkedIn carousel', 'Pinterest pin', 'Instagram carousel', 'Quora answer', 'Slide deck',
  'Blog refresh', 'TikTok', 'Webinar', 'Community post', 'Infographic', 'Sales one-pager',
  'Medium repost', 'Guest article', 'Quote card', 'Email nurture', 'Case study', 'Keynote slide',
]

export const waysIn = [
  { title: 'Work with Foundation', body: 'Content, SEO, Reddit, paid and AI visibility for B2B brands, run by the agency Ross founded in 2014.', cta: 'Explore Foundation', url: 'https://foundationinc.co' },
  { title: 'Book Ross to speak', body: 'Keynotes on AI visibility and distribution for rooms that need a plan, not just a pep talk.', cta: 'See the talks', path: '/keynotes/' },
  { title: 'Use the software', body: 'Distribution.ai turns one blog post, podcast or video into a week of platform-ready posts.', cta: 'Try Distribution.ai', url: 'https://distribution.ai' },
  { title: 'Run a workshop', body: 'A facilitated session that ends with a strategy, owners and a 90-day roadmap.', cta: 'Ask about a workshop', path: '/consulting/' },
]

// The shoutouts from the live home page's hero carousel, word for word
export const shoutouts = [
  { name: 'Jason Dodge', role: 'Founder, Black Truck Media', photo: 'jason-dodge', quote: 'Anybody interested in speaking and engaging while on stage, take notes from Ross - awesome energy & delivering the goods' },
  { name: 'Crystal Carter', role: 'Head of SEO Comms, Wix', photo: 'crystal-carter', quote: 'I spent ages thanking Ross when I met him because I tried his content distro method and it’s fire.' },
  { name: 'Kieran Flanagan', role: 'Marketing Against The Grain', photo: 'kieran-flanagan', quote: 'Ross is a person who understands how to grow companies, grow audiences, get millions of eyeballs using content and literally wrote the book on it.' },
  { name: 'Jordan Scheltgen', role: 'Cave Social', photo: 'jordan-scheltgen', quote: 'Ross is a gem of a person and a great content marketer.' },
  { name: 'Dave Gerhardt', role: 'Exit Five', photo: 'dave-gerhardt', quote: 'There’s no one better to teach you about content distribution and content marketing than Ross. Get the highlighter ready.' },
]

// Photos are the headshots from his live site (public/work/ross-simmonds/people/)
export const endorsers = [
  // Rand's photo: Sam Barnes / Web Summit, CC BY 2.0, via Wikimedia Commons
  { name: 'Rand Fishkin', role: 'SparkToro', photo: 'rand-fishkin', url: 'https://www.linkedin.com/in/randfishkin/' },
  { name: 'Jay Baer', role: 'Author, Talk Triggers', photo: 'jay-baer', url: 'https://www.linkedin.com/in/jaybaer/' },
  { name: 'Dave Gerhardt', role: 'Exit Five', photo: 'dave-gerhardt', url: 'https://www.linkedin.com/in/davegerhardt/' },
  { name: 'Joanna Wiebe', role: 'Copy Hackers', photo: 'joanna-wiebe', url: 'https://www.linkedin.com/in/joannawiebe/' },
  { name: 'Joel Klettke', role: 'Case Study Buddy', photo: 'joel-klettke', url: 'https://www.linkedin.com/in/joelklettke/' },
  { name: 'Enrique Hoyos', role: 'Pexels', photo: 'enrique-hoyos', url: 'https://www.linkedin.com/in/enriquehoyos/' },
  { name: 'Kieran Flanagan', role: 'Marketing Against The Grain', photo: 'kieran-flanagan', url: 'https://www.linkedin.com/in/kieranjflanagan/' },
  { name: 'Crystal Carter', role: 'Wix', photo: 'crystal-carter', url: 'https://www.linkedin.com/in/crystal-carter-digital/' },
  { name: 'Jason Dodge', role: 'Black Truck Media', photo: 'jason-dodge', url: 'https://www.linkedin.com/in/dodgejd/' },
  { name: 'Jordan Scheltgen', role: 'Cave Social', photo: 'jordan-scheltgen', url: 'https://www.linkedin.com/in/jordanscheltgen/' },
]

export const podcast = {
  name: 'The Ross Simmonds Show',
  episodes: '150+',
  rating: '4.9★',
  network: 'HubSpot Podcast Network',
  apple: 'https://podcasts.apple.com/us/podcast/the-ross-simmonds-show/id1653650073',
}

/* ---------- Keynotes ---------- */

export const keynotes = {
  h1: 'Book Ross Simmonds as Your Next Keynote Speaker',
  stats: [
    { value: '10+', label: 'Years on stage' },
    { value: 'Monthly', label: 'Appearances' },
    { value: '100+', label: 'References' },
  ],
  stages: ['ahrefs', 'cmo-huddles', 'hubspot', 'exit-five'],
  talks: [
    {
      title: 'Content Distribution In The Age Of Artificial Intelligence',
      sub: 'From SEO & AEO to Social Media & Video',
      points: ['Why distribution, not volume, decides who gets seen', 'Owned, earned and untapped channels', 'Measuring what actually moves pipeline'],
      img: 'keynote-ballroom.jpg',
    },
    {
      title: 'Generative Engine Optimization',
      sub: 'How To Leverage Content To Shape LLMs & AI',
      points: ['How AI answers choose which brands to name', 'Third-party citations as the new authority', 'First steps to raise your AI visibility'],
      img: 'keynote-data-chart.jpg',
    },
    {
      title: 'Reddit Marketing',
      sub: 'How To Unlock The Power Of Reddit',
      points: ['Community first, campaign second', 'Finding high-intent threads with AI', 'Winning trust without getting banned'],
      img: 'keynote-storytelling.jpg',
    },
    {
      title: 'Putting Marketing Back Into Content Marketing',
      sub: 'This Is How You Do It',
      points: ['Tie every piece to a business goal', 'Story first, format second', 'Prove the value with real numbers'],
      img: 'keynote-black-stage.jpg',
    },
    {
      title: 'How Enterprise Marketing Teams Can Use AI To Do More',
      sub: 'Augment the team, not replace it',
      points: ['Where AI actually saves time', 'Tools and workflows that stick', 'Upskilling the team you already have'],
      img: 'keynote-plaid-blazer.jpg',
    },
  ],
  formats: [
    { title: 'In-person keynote', body: 'Main stage, 30 to 60 minutes, built around your theme.' },
    { title: 'Virtual keynote', body: 'Studio-quality delivery for remote and hybrid events.' },
    { title: 'Team workshop', body: 'Half or full day, ending with a working plan.' },
    { title: 'Fireside or panel', body: 'Moderated conversation with live audience questions.' },
  ],
  // Long-form uploads from youtube.com/@RossSimmondsTV (thumbnails in videos/)
  channel: 'https://www.youtube.com/@RossSimmondsTV/videos',
  // His three most-watched videos (YouTube's Popular sort, Nov 2026)
  videos: [
    { id: 'wPEO-Gjld_E', views: '87K', title: 'B2B Marketing Strategy: How to Get More Leads for B2B Businesses' },
    { id: 'gmtNHPS0Ycw', views: '50K', title: 'Reddit Marketing: How to Make the Most Out of Reddit' },
    { id: 'kxj_aARpEc0', views: '27K', title: 'The Caption Mistake Killing Your Instagram Growth' },
  ],
  gallery: ['keynote-ballroom.jpg', 'arms-out.jpg', 'headset-closeup.jpg', 'conference-panel.jpg', 'exit-five-drive.jpg', 'panel-portrait.jpg'],
}

/* ---------- Consulting ---------- */

export const consulting = {
  h1: 'Advisory for marketing leaders who need to win in AI search.',
  clients: ['canva', 'snowflake', 'webex', 'procore', 'eventbrite', 'jobber'],
  shift: {
    title: 'The playbook that got you here is being rewritten in real time.',
    body: 'Buyers now ask an AI assistant before they ever visit your site. Search traffic is flattening, and publishing more of the same content into the same channels has become the expensive mistake.',
    creds: ['Founder and CEO of Foundation and Distribution.ai', 'Author of Create Once, Distribute Forever', 'Top 50 CEO, Atlantic Canada'],
  },
  results: [
    { value: 156, prefix: '+', suffix: '%', label: 'Organic traffic', who: 'Event management SaaS' },
    { value: 107, prefix: '+', suffix: '%', label: 'YoY blog growth', who: 'Construction tech leader' },
    { value: 228, prefix: '$', suffix: 'K', label: 'Yearly traffic value', who: 'Home services SaaS' },
    { value: 128, prefix: '+', suffix: '%', label: 'Sign-ups', who: 'SaaS, rebuilt GTM' },
    { value: 1, suffix: 'M+', label: 'New search impressions', who: 'SaaS, 12 months' },
    { value: 300, prefix: '+', suffix: '%', label: 'Social engagement', who: 'Audience intelligence platform' },
  ],
  fit: {
    yes: ['You own the pipeline number at a B2B or SaaS company', 'Organic and AI discovery shape your pipeline', 'Your team can execute once the plan is clear', 'You want to hear what to stop doing'],
    no: ['You need daily hands-on execution', 'You want a quick SEO audit or a one-off blog plan', 'Leadership is not bought in yet', 'You are pre-revenue'],
  },
  offers: [
    { name: 'Keynote + leadership session', price: 'Scoped per event', points: ['Keynote for the wider team', 'Closed-door leadership working session', 'Start / stop / double-down list'], cta: 'See keynote topics', path: '/keynotes/' },
    { name: 'AI Visibility Strategy Workshop', price: 'From $50K', popular: true, points: ['Pre-work AI visibility audit', 'Facilitated strategy workshop', 'Owners and a 90-day roadmap', '30-day follow-up'], cta: 'Ask about a workshop', path: '/contact-ross/' },
    { name: 'Private advisory retainer', price: '6-month minimum', points: ['Strategy with your CMO or VP', 'Monthly planning and async access', 'Feedback on shipped work', 'Early insights from Foundation clients'], cta: 'Request availability', path: '/contact-ross/' },
  ],
  process: [
    { title: 'Discovery call', body: '30 minutes, with a few questions to answer beforehand.' },
    { title: 'Fit and format', body: 'Agree on the right engagement, or part ways early.' },
    { title: 'Scope', body: 'NDA, a data review, then a written scope with pricing.' },
    { title: 'Kickoff', body: 'Workshops start within about four weeks; advisory on the first of the month.' },
  ],
  faq: [
    { q: 'How is this different from Foundation?', a: 'Foundation is the execution agency. This is Ross advising your leadership team directly on strategy.' },
    { q: 'What is the minimum engagement?', a: 'Workshops start at $50K, the advisory retainer runs for at least six months, and executive sessions are scoped per event.' },
    { q: 'Do you work with agencies or consultants?', a: 'Selectively, and never as a white-label service.' },
    { q: 'Can you work alongside our current agency?', a: 'Yes. Advisory engagements often sit next to an existing agency.' },
    { q: 'Where are you based?', a: 'Nova Scotia, working with teams across North America and Europe.' },
  ],
}

/* ---------- Blog ---------- */

export const categories = ['All', 'Artificial Intelligence', 'B2B Marketing', 'Entrepreneurship', 'Reddit Marketing', 'Social Media']

export const posts = [
  { slug: 'hire-marketers-ai-fluency-test', title: 'Hire Marketers in the AI Era: My AI Fluency Test', cats: ['Artificial Intelligence', 'Business Lessons'], date: '2026-11-03' },
  { slug: 'be-unblockable-the-trait-every-team-wants-to-grab', title: 'Be Unblockable: The Trait Every Team Wants to Grab', cats: ['Entrepreneurship', 'Inspiration'], date: '2026-11-01' },
  { slug: 'ai-search-citation-sources', title: 'Where Each AI Engine Gets Its Answers [Citation Data]', cats: ['Artificial Intelligence', 'B2B Marketing'], date: '2026-10-28' },
  { slug: 'g2-ai-citations', title: 'G2 and AI Search: Why Review Sites Win Citations [Data]', cats: ['Artificial Intelligence', 'B2B Marketing'], date: '2026-10-27' },
  { slug: 'generative-engine-optimization', title: 'Generative Engine Optimization (GEO): What It Is, How It Works & What To Know', cats: ['Artificial Intelligence', 'B2B Marketing'], date: '2026-10-26' },
  { slug: 'ai-visibility-by-category', title: 'Which AI Engine Matters Most? 81 B2B Categories Ranked', cats: ['Artificial Intelligence', 'B2B Marketing'], date: '2026-10-26' },
  { slug: 'youtube-marketing', title: 'YouTube Marketing: What It Is, How It Works & What To Know', cats: ['Artificial Intelligence', 'B2B Marketing', 'Social Media'], date: '2026-10-25' },
  { slug: 'chatgpt-reddit-citations', title: 'ChatGPT Cut Reddit Citations by 50% [Our Data]', cats: ['Artificial Intelligence', 'Reddit Marketing'], date: '2026-10-24' },
  { slug: 'ai-visibility-statistics', title: 'AI Visibility Statistics (2027): 380K Answers Analyzed', cats: ['Artificial Intelligence', 'B2B Marketing', 'Marketing'], date: '2026-10-18' },
]

export const formatDate = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/* ---------- About ---------- */

export const about = {
  h1: "Ross Simmonds boosts B2B & SaaS brands' organic growth with content marketing, SEO, and technology",
  numbers: [
    { value: 110, prefix: '$', suffix: 'M+', label: 'New business generated for clients' },
    { value: 100, suffix: '+', label: 'Brands advised' },
    { value: 75, suffix: 'K+', label: 'Newsletter readers' },
  ],
  chapters: [
    { mark: '2010', title: 'Starts writing', body: 'The blog begins: early lessons on marketing, business and life, published in public.', img: 'keynote-storytelling.jpg' },
    { mark: '2014', title: 'Founds Foundation', body: 'A remote-first B2B content agency, later trusted by Canva, Procore, Unbounce, Jobber and Snowflake.', img: 'exit-five-drive.jpg' },
    { mark: 'The book', title: 'Create Once, Distribute Forever', body: 'A #1 Amazon bestseller that turned his favourite idea into a playbook.', img: null },
    { mark: 'The software', title: 'Distribution.ai', body: 'A tool that turns one blog post, podcast or video into platform-ready assets.', img: 'keynote-data-chart.jpg' },
    { mark: 'The show', title: 'The Ross Simmonds Show', body: 'A podcast on the HubSpot Podcast Network, with 150+ episodes.', img: 'headset-closeup.jpg' },
    { mark: 'Today', title: 'Advising on AI search', body: 'Helping CMOs get their brands named in AI answers, and taking that message to stages.', img: 'arms-out.jpg' },
  ],
  roles: [
    { title: 'Founder & CEO', body: 'Running Foundation and Distribution.ai.', img: 'founder-ceo.jpg' },
    { title: 'Keynote speaker', body: 'On stage at marketing conferences around the world.', img: 'keynote-ballroom.jpg' },
    { title: 'Writer', body: 'Fifteen years of articles, research and a bestselling book.', img: 'keynote-storytelling.jpg' },
    { title: 'Marketer', body: 'Content, SEO and distribution engines for B2B and SaaS.', img: 'keynote-data-chart.jpg' },
    { title: 'SaaS & B2B tech investor', body: 'Backing companies that build what marketers need next.', img: 'panel-portrait.jpg' },
  ],
  ventures: ['Foundation', 'Distribution.ai', 'Hustle & Grind', 'SaaS investments', 'Board, Boys & Girls Club of Preston'],
  recognition: [
    'Named a top marketer by BuzzSumo and Semrush',
    'Harry Jerome Young Entrepreneur Award',
    'Top 50 CEOs in Atlantic Canada',
    'LinkedIn Learning instructor',
  ],
}

/* ---------- Book ---------- */

export const book = {
  h1: 'Create Once, Distribute Forever',
  // The live page's "8 things this book will teach you", reworded
  lessons: [
    'How to get far more reach from the work you already make',
    'The tools that give you an edge',
    'How to build a distribution engine that scales',
    'The distribution tactics nobody talks about',
    'Why distribution separates the best from the rest',
    'How to sell more with LinkedIn, Facebook and Instagram',
    'How one piece of content becomes twenty',
    'Why second-time founders put distribution first',
  ],
  formats: [
    { name: 'Print', icon: 'print', note: 'On Amazon', url: 'https://www.amazon.com/Create-Once-Distribute-Forever-Creators/dp/1544541295/' },
    { name: 'Kindle', icon: 'kindle', note: 'Read it tonight', url: 'https://www.amazon.com/Create-Once-Distribute-Forever-Creators-ebook/dp/B0CVSF4JV9/' },
    { name: 'Audiobook', icon: 'audio', note: 'Narrated by Ross, on Audible', url: 'https://www.audible.ca/pd/B0HGHP1KZ2' },
  ],
  // Reader reviews from the live book page; photos in people/
  readers: [
    { name: 'Jay Baer', role: 'Bestselling author of Talk Triggers', photo: 'jay-baer', quote: 'Creating content that nobody finds is an expensive mistake. If content is ‘king,’ distribution is the chariot, and this book is the roadmap.' },
    { name: 'Talia Wolf', role: 'Founder and Chief Optimizer at Getuplift', photo: 'talia-wolf', quote: 'Create Once, Distribute Forever is a game-changer for anyone who wants to master the MOST important part of content marketing: distribution. It is jam packed with practical tips, an action plan and a complete step-by-step playbook that will hold your hand every step of the way and give you everything you need to succeed. I guarantee you will be using this book over and over again for years to come.' },
    { name: 'Peep Laja', role: 'CEO of Wynter, Founder of CXL.com', photo: 'peep-laja', quote: 'Everyone talks about the importance of distribution. This book actually teaches you how to do it.' },
    { name: 'Wendy Jacobson', role: 'Owner of Incredible Content', photo: 'wendy-jacobson', quote: 'Ross will change the way you think about your content distribution strategy, and if you haven’t thought about it before reading his book, you will now. Full of analogies and examples, Ross walks you through the what, why, and how to distribute your content in an engaging and easy-to-consume manner. Leaving no stone unturned, he even includes a guide for every imaginable distribution channel, so you have no excuse not to be inspired and motivated. I can’t wait to apply what I’ve learned!' },
    { name: 'Aditya Sheth', role: 'SEO Advisor at Superhuman', photo: 'aditya-sheth', quote: 'There are 100s of books on creating content, but none on distributing content. If you create great content, but never see the traffic, likes, or shares it deserves, this book is your bible. Read it and free yourself.' },
    { name: 'Dave Gerhardt', role: 'Founder of ExitFive.com and former startup CMO', photo: 'dave-gerhardt', quote: 'Creating content is only half of the game. The other half is knowing how to get eyeballs on your content, and there’s no one better to teach you about content distribution and content marketing than Ross. Get the highlighter ready.' },
    { name: 'Bobby Warren', role: 'Founder, Wooster Media Group LLC', photo: 'bobby-warren', quote: 'Google forever reminds us of the importance of helpful, relevant content. Now comes Ross Simmonds to remind us much work remains after content creation: meaningful distribution. In Create Once, Distribute Forever, Simmonds provides a masterclass in how to distribute and repurpose your prized content.' },
    { name: 'Katelyn Bourgoin', role: 'CEO and Lead Trainer of Customer Camp', photo: 'katelyn-bourgoin', quote: 'If you’re spending hours creating outstanding content, congrats! You’ve mastered the first part of content marketing. In this book, Ross teaches the second part, the part that most marketers miss out on: content distribution. It’s a must-read.' },
  ],
}
