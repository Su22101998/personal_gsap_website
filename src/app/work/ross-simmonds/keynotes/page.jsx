import Keynotes from '@/components/concepts/ross/Keynotes'
import { JsonLd } from '@/components/concepts/ross/Shell'
import { keynotes } from '@/components/concepts/ross/data'

export const metadata = {
  title: 'Book Ross Simmonds as Your Next Keynote Speaker',
  description: 'Keynotes on AI search, content distribution, GEO and Reddit marketing from Ross Simmonds, for event organizers and marketing teams.',
}

const talks = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Keynotes by Ross Simmonds',
  itemListElement: keynotes.talks.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title })),
}
const crumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rosssimmonds.com/' },
    { '@type': 'ListItem', position: 2, name: 'Keynotes', item: 'https://rosssimmonds.com/keynotes/' },
  ],
}

export default function KeynotesPage() {
  return (
    <>
      <JsonLd data={talks} />
      <JsonLd data={crumbs} />
      <Keynotes />
    </>
  )
}
