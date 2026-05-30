import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { TranslationProvider } from '@/i18n'
import SmoothScroll from '@/components/SmoothScroll'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Portfolio — UI/UX Designer, Software Developer & Product Builder',
  description:
    'Pixel perfect digital experiences that demand attention, engage users, and drive real results.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans noise-overlay`}>
        <TranslationProvider>
          <ThemeProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </ThemeProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
