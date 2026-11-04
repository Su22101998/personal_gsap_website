import { Inter_Tight, JetBrains_Mono } from 'next/font/google'
import Shell from '@/components/concepts/ross/Shell'

const tight = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-rs', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-rs-mono', display: 'swap' })

// Every page in the concept stays out of search results: it's a pitch that
// uses a real person's name and content
export const metadata = {
  title: { template: '%s — Ross Simmonds concept by Cyber Pears', default: 'Ross Simmonds concept by Cyber Pears' },
  robots: { index: false, follow: false },
}

export default function RossLayout({ children }) {
  return <Shell className={`${tight.variable} ${mono.variable}`}>{children}</Shell>
}
