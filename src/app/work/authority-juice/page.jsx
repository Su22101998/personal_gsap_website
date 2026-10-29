import { Inter_Tight } from 'next/font/google'
import AuthorityJuice from '@/components/concepts/authority-juice/AuthorityJuice'

// Authority Juice's numeral face (their headings use Instrument Serif and body
// Inter, both already loaded by the root layout)
const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-aj-tight',
  display: 'swap',
})

export const metadata = {
  title: 'Authority Juice — Redesign · Cyber Pears',
  description:
    'A concept redesign of authorityjuice.com by Cyber Pears, made with Authority Juice’s permission: their brand and content, with a richer motion layer.',
}

export default function AuthorityJuicePage() {
  return <AuthorityJuice className={interTight.variable} />
}
