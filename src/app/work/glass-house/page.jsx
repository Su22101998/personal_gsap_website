import { Plus_Jakarta_Sans } from 'next/font/google'
import GlassPeople from '@/components/concepts/glass-people/GlassPeople'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-gp',
  display: 'swap',
})

export const metadata = {
  title: 'The Glass People — a concept redesign by Cyber Pears',
  description: 'A proposed redesign of The Glass People (Mahaveer Glass House, Bengaluru) by Cyber Pears.',
  // A pitch for a real business: keep it out of search results
  robots: { index: false, follow: false },
}

export default function GlassPeoplePage() {
  return <GlassPeople className={jakarta.variable} />
}
