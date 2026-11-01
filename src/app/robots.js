// /robots.txt — let every crawler in, and point them at the sitemap
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.cyberpears.com/sitemap.xml',
    host: 'https://www.cyberpears.com',
  }
}
