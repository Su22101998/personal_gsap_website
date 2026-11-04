import About from '@/components/concepts/ross/About'
import { JsonLd } from '@/components/concepts/ross/Shell'

export const metadata = {
  title: 'About Ross Simmonds',
  description: 'Ross Simmonds boosts B2B and SaaS brands’ organic growth with content marketing, SEO and technology. Founder of Foundation and author of Create Once, Distribute Forever.',
}

const profile = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: 'https://rosssimmonds.com/about/',
  mainEntity: {
    '@type': 'Person',
    name: 'Ross Simmonds',
    jobTitle: 'Founder & CEO, Foundation',
    award: ['Harry Jerome Young Entrepreneur Award', 'Top 50 CEOs in Atlantic Canada'],
    sameAs: ['https://twitter.com/TheCoolestCool', 'https://www.linkedin.com/in/rosssimmonds/', 'https://www.instagram.com/thecoolestcool'],
  },
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={profile} />
      <About />
    </>
  )
}
