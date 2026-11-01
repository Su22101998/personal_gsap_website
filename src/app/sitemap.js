const SITE = 'https://www.cyberpears.com'

// /sitemap.xml — the pages search engines should index
export default function sitemap() {
  return [
    { url: `${SITE}/`, changeFrequency: 'monthly', priority: 1 },
  ]
}
