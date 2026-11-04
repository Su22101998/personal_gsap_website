import { notFound } from 'next/navigation'
import { BlogPost } from '@/components/concepts/ross/Blog'
import { JsonLd } from '@/components/concepts/ross/Shell'
import { posts } from '@/components/concepts/ross/data'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const post = posts.find((p) => p.slug === params.slug)
  return post ? { title: post.title } : {}
}

export default function PostPage({ params }) {
  const post = posts.find((p) => p.slug === params.slug)
  if (!post) notFound()
  const url = `https://rosssimmonds.com/blog/${post.slug}/`
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Ross Simmonds', url: 'https://rosssimmonds.com/about/' },
    mainEntityOfPage: url,
    articleSection: post.cats,
  }
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rosssimmonds.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://rosssimmonds.com/blog/' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }
  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={crumbs} />
      <BlogPost post={post} />
    </>
  )
}
