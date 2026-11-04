/*
 * The Glass People (Mahaveer Glass House, Bengaluru) — copy for the concept
 * redesign at /work/glass-house.
 *
 * Unsolicited concept by Cyber Pears. Business facts, products and listed
 * prices come from their current site (theglasspeople.in, IndiaMART).
 * No reviews, results or numbers here are invented — keep it that way.
 */

export const company = {
  brand: 'The Glass People',
  legal: 'Mahaveer Glass House',
  phone: '080 4387 4561',
  phoneHref: 'tel:+918043874561',
  address: ['No. 32 (Old No. 34), B V K Iyengar Road', 'Bengaluru 560053, Karnataka'],
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=12.97097,77.57627',
  gst: '29ACOPM2080N1ZY',
  currentSite: 'https://www.theglasspeople.in/',
}

export const nav = [
  { label: 'Glass', href: '#gp-range' },
  { label: 'Spaces', href: '#gp-spaces' },
  { label: 'Estimate', href: '#gp-estimate' },
  { label: 'Visit', href: '#gp-visit' },
]

export const hero = {
  eyebrow: 'Toughened & interior glass · Bengaluru',
  title: ['Glass that', 'lets the light', 'do the talking.'],
  sub: 'The Glass People supply toughened, safety and designer glass to homes, offices and builders across Bengaluru, at wholesale prices.',
  primary: 'Estimate your glass',
  secondary: 'Explore the range',
}

// `kind` picks the live glass sample (see GlassSample.jsx); prices are the
// "from" prices on their current listing, per sq ft unless noted
export const range = {
  eyebrow: 'The range',
  title: 'Eight kinds of glass, one supplier',
  body: 'Hover a sample to see how it catches the light. Every price is a starting point from our current listing.',
  items: [
    { name: 'Toughened glass', kind: 'toughened', note: 'Partitions, doors and railings', price: 90, unit: 'sq ft' },
    { name: 'Laminated safety glass', kind: 'laminated', note: 'Holds together if it breaks', price: 350, unit: 'sq ft' },
    { name: 'Clear & tinted glass', kind: 'tinted', note: 'Windows and interiors', price: 40, unit: 'sq ft' },
    { name: 'Mirror glass', kind: 'mirror', note: '6 mm mirrors, cut to size', price: 100, unit: 'sq ft' },
    { name: 'One-way glass', kind: 'oneway', note: 'Privacy for cabins and stores', price: null },
    { name: 'Lacquered glass', kind: 'lacquered', note: 'Solid colour for walls and furniture', price: null },
    { name: 'Glass blocks & bricks', kind: 'blocks', note: 'Walls that let light through', price: 160, unit: 'piece' },
    { name: 'Digital print glass', kind: 'print', note: 'Your pattern, printed in glass', price: null },
  ],
}

export const spaces = {
  eyebrow: 'Where it goes',
  title: 'Made for real rooms',
  items: [
    { title: 'Offices', body: 'Toughened partitions and one-way cabin glass keep a floor open without losing privacy.' },
    { title: 'Homes', body: 'Shower doors, designer mirrors and lacquered panels bring light into every room.' },
    { title: 'Retail & showrooms', body: 'Clear storefronts and printed glass put your products and your brand on show.' },
    { title: 'Builders & contractors', body: 'Wholesale quantities of toughened and laminated glass, cut to your drawings.' },
  ],
}

export const process = {
  eyebrow: 'How an order works',
  title: 'From measurement to installed',
  steps: [
    { title: 'Measure', body: 'Share your sizes, or ask us to visit the site and measure for you.' },
    { title: 'Cut & toughen', body: 'Your glass is cut, edged and toughened to the exact size.' },
    { title: 'Deliver & fit', body: 'We deliver across Bengaluru, and our team can install it too.' },
  ],
}

// Published business facts from their listing (not marketing claims)
export const facts = [
  { value: 8, suffix: '', label: 'Glass families in stock' },
  { value: 92, suffix: '%', label: 'Enquiry response rate' },
  { value: 2017, suffix: '', label: 'GST registered since' },
]

export const estimate = {
  eyebrow: 'Estimate',
  title: 'Price your glass in seconds',
  body: 'Pick a glass, enter the size and get a ballpark figure before you call. Final prices depend on thickness, edging and fitting.',
  glassLabel: 'Glass type',
  widthLabel: 'Width (ft)',
  heightLabel: 'Height (ft)',
  qtyLabel: 'Panels',
  total: 'Estimated cost',
  area: 'Total area',
  cta: 'Call for an exact quote',
  disclaimer: 'Indicative only, based on the "from" prices in their current listing. Excludes GST, edging, hardware and installation.',
}

export const visit = {
  eyebrow: 'Visit the showroom',
  title: 'Come and see the glass for yourself',
  hours: 'Call ahead to check opening hours.',
  call: 'Call us',
  directions: 'Get directions',
}
