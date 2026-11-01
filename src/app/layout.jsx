import { Inter, Instrument_Serif } from 'next/font/google'
import localFont from 'next/font/local'
import { TranslationProvider } from '@/i18n'
import SmoothScroll from '@/components/SmoothScroll'
import Preloader from '@/components/Preloader'
import Cursor from '@/components/Cursor'
import { BRAND_INIT_SCRIPT, DEFAULT_BRAND } from '@/lib/brand'
import { PRELOADER_INIT_SCRIPT } from '@/lib/intro'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Display serif for headlines
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Dot-matrix face for headlines and numerals (Doto, OFL — self-hosted from
// @fontsource-variable/doto; Next 14's Google font list predates it). The
// "full" file carries both the weight and ROND (dot roundness) axes.
const doto = localFont({
  src: '../../node_modules/@fontsource-variable/doto/files/doto-latin-full-normal.woff2',
  weight: '100 900',
  variable: '--font-dot',
  display: 'swap',
})

export const metadata = {
  title: 'Cyber Pears | Best Design & Development Studio',
  description:
    'Cyber Pears builds hand-tailored, high-end websites to make brands impossible to forget.',
}

export default function RootLayout({ children }) {
  return (
    // data-brand / data-js / data-intro may be set by the head scripts before
    // hydration; data-stage is driven by scroll (see usePageTheme)
    <html lang="en" data-brand={DEFAULT_BRAND} data-stage="ink" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BRAND_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_INIT_SCRIPT }} />
        {/* Without JS nothing would ever lift the preloader */}
        <noscript>
          <style>{'.preloader{display:none}'}</style>
        </noscript>
      </head>
      <body className={`${inter.variable} ${instrumentSerif.variable} ${doto.variable} font-sans noise-overlay`}>
        <TranslationProvider>
          <Preloader />
          <Cursor />
          <SmoothScroll>{children}</SmoothScroll>
        </TranslationProvider>
      </body>
    </html>
  )
}
