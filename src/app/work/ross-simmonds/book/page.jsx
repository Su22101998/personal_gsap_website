import BookPage from '@/components/concepts/ross/BookPage'
import { JsonLd } from '@/components/concepts/ross/Shell'

export const metadata = {
  title: 'Create Once, Distribute Forever',
  description: 'The #1 Amazon bestseller by Ross Simmonds on how great creators spread their ideas, in print, Kindle and audiobook.',
}

const bookLd = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: 'Create Once, Distribute Forever',
  alternateName: 'How Great Creators Spread Their Ideas and How You Can Too',
  author: { '@type': 'Person', name: 'Ross Simmonds', url: 'https://rosssimmonds.com/about/' },
  url: 'https://rosssimmonds.com/book/',
  bookFormat: ['https://schema.org/Hardcover', 'https://schema.org/EBook', 'https://schema.org/AudiobookFormat'],
}

export default function BookRoute() {
  return (
    <>
      <JsonLd data={bookLd} />
      <BookPage />
    </>
  )
}
