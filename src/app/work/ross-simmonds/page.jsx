import Home from '@/components/concepts/ross/Home'
import { JsonLd } from '@/components/concepts/ross/Shell'

// Mirrors the live homepage's title; structured data the live site can adopt
export const metadata = {
  title: 'Ross Simmonds | Marketing Expert & Entrepreneur',
  description: 'Ross Simmonds helps B2B brands get found in search, on social and in AI answers through content distribution, SEO and storytelling.',
}

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ross Simmonds',
  url: 'https://rosssimmonds.com/',
  jobTitle: 'Founder & CEO, Foundation',
  sameAs: ['https://twitter.com/TheCoolestCool', 'https://www.linkedin.com/in/rosssimmonds/', 'https://www.instagram.com/thecoolestcool'],
  knowsAbout: ['Content distribution', 'Generative Engine Optimization', 'B2B marketing', 'SEO', 'Reddit marketing'],
}

export default function RossHomePage() {
  return (
    <>
      <JsonLd data={person} />
      <Home />
    </>
  )
}
