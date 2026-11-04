import Consulting from '@/components/concepts/ross/Consulting'
import { JsonLd } from '@/components/concepts/ross/Shell'
import { consulting } from '@/components/concepts/ross/data'

export const metadata = {
  title: 'AI Search Advisory for Marketing Leaders',
  description: 'Private advisory, strategy workshops and leadership sessions from Ross Simmonds for B2B marketing leaders who need to win in AI search.',
}

const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: consulting.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}
const crumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rosssimmonds.com/' },
    { '@type': 'ListItem', position: 2, name: 'Consulting', item: 'https://rosssimmonds.com/consulting/' },
  ],
}

export default function ConsultingPage() {
  return (
    <>
      <JsonLd data={faq} />
      <JsonLd data={crumbs} />
      <Consulting />
    </>
  )
}
