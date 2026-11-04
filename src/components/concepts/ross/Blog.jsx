'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RLink } from './Shell'
import { Newsletter, SplitHeading, reduce } from './shared'
import { categories, formatDate, posts } from './data'

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP)

/* A typographic cover per post (the live site's images load lazily from
   WordPress; these stand in until the CMS feeds real ones) */
export function PostCover({ index, post, className = '' }) {
  const kind = index % 4
  // Rotate the bar heights per post so no two charts match
  const bars = [38, 62, 46, 88, 70, 54, 96].map((_, i, a) => a[(i + index * 2) % a.length])
  return (
    <div className={`relative overflow-hidden bg-[#141414] ${className}`} aria-hidden="true">
      {kind === 0 ? (
        <div className="absolute inset-x-[12%] bottom-[18%] top-[22%] flex items-end gap-[5%]">
          {bars.map((h, i) => (
            <span key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%`, background: i === 3 || i === 6 ? 'rgb(var(--rs-accent-rgb))' : 'rgb(255 255 255 / 0.14)' }} />
          ))}
        </div>
      ) : kind === 1 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {[90, 68, 46, 24].map((s, i) => (
            <span key={s} className="absolute rounded-full border" style={{ width: `${s}%`, aspectRatio: 1, borderColor: i === 3 ? 'rgb(var(--rs-accent-rgb))' : 'rgb(255 255 255 / 0.14)' }} />
          ))}
        </div>
      ) : kind === 2 ? (
        <div className="rs-grain absolute inset-0 opacity-90">
          <span className="rs-display absolute -bottom-[8%] right-[6%] text-[9rem] leading-none text-rs-accent">{post.title.trim()[0]}</span>
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 22px)' }}>
          <span className="absolute left-[12%] top-1/2 h-[3px] w-[40%] -translate-y-1/2 bg-rs-accent" />
        </div>
      )}
      <span className="rs-mono absolute left-4 top-4 text-[10px] uppercase tracking-[0.16em] text-white/50">{post.cats[0]}</span>
    </div>
  )
}

function PostCard({ post, index, featured = false }) {
  return (
    <RLink path={`/blog/${post.slug}/`} label={post.title} className="group block">
      <div className="overflow-hidden rounded-[10px]">
        <PostCover index={index} post={post} className={`${featured ? 'aspect-[16/9] md:aspect-[21/8]' : 'aspect-[4/3]'} transition-transform duration-700 ease-out group-hover:scale-[1.04]`} />
      </div>
      <p className="rs-label mt-5">
        {post.cats.slice(0, 2).join(' · ')} — {formatDate(post.date)}
      </p>
      <h2 className={`rs-display mt-2 leading-[1.08] transition-colors group-hover:text-rs-accent ${featured ? 'text-[clamp(1.8rem,3.6vw,3.2rem)]' : 'text-[1.45rem]'}`}>{post.title}</h2>
    </RLink>
  )
}

export function BlogIndex() {
  const ref = useRef(null)
  const [cat, setCat] = useState('All')
  const flipState = useRef(null)

  const [featured, ...rest] = posts
  const shown = (p) => cat === 'All' || p.cats.includes(cat)

  const choose = (c) => {
    if (c === cat) return
    // Capture where every card is, then let Flip animate them to the new layout
    if (!reduce()) flipState.current = Flip.getState(ref.current.querySelectorAll('.rs-card'))
    setCat(c)
  }

  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      duration: 0.7,
      ease: 'power3.inOut',
      scale: true,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
    })
    flipState.current = null
  }, [cat])

  useGSAP(
    () => {
      if (reduce()) return
      gsap.from('.rs-card', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.07, delay: 0.3 })
    },
    { scope: ref }
  )

  return (
    <>
      <section className="px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="rs-label mb-6">315 articles since 2010</p>
          {/* Preserves the live page's H1 */}
          <SplitHeading as="h1" immediate className="rs-display text-[clamp(4rem,14vw,13rem)] leading-[0.85]">
            The Blog<span className="text-rs-accent">.</span>
          </SplitHeading>
          <div className="mt-12 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by topic">
            <span className="rs-label mr-3">My thoughts on</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => choose(c)}
                aria-pressed={cat === c}
                className={`rs-mono rounded-full border px-4 py-2 text-[12px] uppercase tracking-[0.12em] transition-colors ${
                  cat === c ? 'border-rs-accent bg-rs-accent text-[#0a0a0a]' : 'border-white/20 text-white/70 hover:border-white/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section ref={ref} className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {[featured, ...rest].map((p, i) => (
              <article
                key={p.slug}
                data-flip-id={p.slug}
                className={`rs-card ${i === 0 && cat === 'All' ? 'md:col-span-2 lg:col-span-3' : ''} ${shown(p) ? '' : 'hidden'}`}
              >
                <PostCard post={p} index={i} featured={i === 0 && cat === 'All'} />
              </article>
            ))}
          </div>

          {/* Same WordPress pagination URLs as the live blog */}
          <nav className="mt-20 flex flex-wrap items-center gap-2 border-t border-white/10 pt-8" aria-label="Pagination">
            <span className="rs-mono flex h-10 w-10 items-center justify-center rounded-full bg-rs-accent text-[13px] text-[#0a0a0a]" aria-current="page">1</span>
            {[2, 3, 4].map((n) => (
              <RLink key={n} path={`/blog/page/${n}/`} className="rs-mono flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[13px] text-white/70 hover:border-rs-accent">
                {n}
              </RLink>
            ))}
            <span className="rs-mono px-2 text-white/40">…</span>
            <RLink path="/blog/page/35/" className="rs-mono flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[13px] text-white/70 hover:border-rs-accent">
              35
            </RLink>
          </nav>
        </div>
      </section>
      <Newsletter />
    </>
  )
}

/* ---------- Post template ---------- */

const TOC = [
  ['template', 'What this template does'],
  ['typography', 'Typography built for long reads'],
  ['data', 'Data that reads at a glance'],
  ['search', 'Built for search and AI answers'],
]

export function BlogPost({ post }) {
  const ref = useRef(null)
  const index = posts.findIndex((p) => p.slug === post.slug)
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  useGSAP(
    () => {
      if (reduce()) return
      gsap.to('.rs-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.rs-article', start: 'top 20%', end: 'bottom bottom', scrub: true },
      })
      gsap.from('.rs-post-fade', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.5 })
      // Highlight the current section in the table of contents
      // Each entry stays lit from its heading until the next heading
      TOC.forEach(([id], i) => {
        const next = TOC[i + 1]
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 40%',
          endTrigger: next ? `#${next[0]}` : '.rs-article',
          end: next ? 'top 40%' : 'bottom 40%',
          toggleClass: { targets: `.rs-toc a[href="#${id}"]`, className: 'rs-toc-active' },
        })
      })
    },
    { scope: ref }
  )

  return (
    <div ref={ref}>
      <div className="rs-progress fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-rs-accent" aria-hidden="true" />

      <header className="px-5 pb-12 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto max-w-[1100px]">
          <nav aria-label="Breadcrumb" className="rs-post-fade rs-mono text-[12px] uppercase tracking-[0.14em] text-white/45">
            <RLink path="/" label="Ross Simmonds" className="hover:text-white">Home</RLink> /{' '}
            <RLink path="/blog/" label="The Blog" className="hover:text-white">Blog</RLink> / <span className="text-white/70">{post.cats[0]}</span>
          </nav>
          <SplitHeading as="h1" immediate className="rs-display mt-8 text-[clamp(2.4rem,5.6vw,5rem)] leading-[1]">
            {post.title}
          </SplitHeading>
          <div className="rs-post-fade mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
            <span className="relative h-11 w-11 overflow-hidden rounded-full">
              <Image src="/work/ross-simmonds/panel-portrait.jpg" alt="Ross Simmonds" fill sizes="44px" className="object-cover object-top" />
            </span>
            <span>
              <span className="block text-[15px]">Ross Simmonds</span>
              <span className="rs-label">
                {formatDate(post.date)} · 8 min read
              </span>
            </span>
            <span className="ml-auto flex flex-wrap gap-2">
              {post.cats.map((c) => (
                <span key={c} className="rs-mono rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-white/55">
                  {c}
                </span>
              ))}
            </span>
          </div>
        </div>
      </header>

      <div className="px-5 md:px-8">
        <PostCover index={index} post={post} className="mx-auto aspect-[21/9] max-w-[1400px] rounded-[12px]" />
      </div>

      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 py-16 md:px-8 lg:grid-cols-[220px_1fr]">
        <aside className="rs-toc hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <p className="rs-label mb-4">In this article</p>
          <ol className="space-y-3 border-l border-white/10 text-[14px]">
            {TOC.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="-ml-px block border-l border-transparent pl-4 text-white/50 transition-colors hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <article className="rs-article rs-prose">
          <p className="rs-mono mb-10 rounded-[10px] border border-rs-accent/40 bg-rs-accent/[0.07] p-4 text-[12px] uppercase leading-relaxed tracking-[0.1em] text-rs-accent">
            Template preview: the body below is sample text showing the design. On the live site, the real article flows in from WordPress under this same URL.
          </p>

          <h2 id="template">What this template does</h2>
          <p>
            Every article keeps its existing address, title and headings, so the rankings it has earned carry straight over. The design around it changes: a calmer measure, a stronger hierarchy and almost no motion, because these pages are where most readers arrive from search.
          </p>
          <p>
            The only movement is functional. A thin progress bar tracks how far you&rsquo;ve read, and the table of contents marks the section you&rsquo;re in.
          </p>

          <h2 id="typography">Typography built for long reads</h2>
          <p>Body text sits at 18 pixels with generous line height and a line length that stays comfortable on any screen. Headings use the same tight grotesk as the rest of the site, so an article still feels like part of the brand.</p>
          <blockquote>Readers skim first and read second. The layout should reward both.</blockquote>
          <ul>
            <li>Lists get orange markers that guide the eye down the page.</li>
            <li>Links stay underlined, so they&rsquo;re obvious without hovering.</li>
            <li>Pull quotes break up long sections without breaking the flow.</li>
          </ul>

          <h2 id="data">Data that reads at a glance</h2>
          <p>Many of the newest posts are built on original research, so tables are styled to scan quickly on a dark background.</p>
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Live site today</th>
                <th>This template</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>URL and slug</td>
                <td>/blog/{post.slug}/</td>
                <td>Unchanged</td>
              </tr>
              <tr>
                <td>Title and H1</td>
                <td>Article title</td>
                <td>Unchanged</td>
              </tr>
              <tr>
                <td>Structured data</td>
                <td>Basic</td>
                <td>BlogPosting + breadcrumbs</td>
              </tr>
            </tbody>
          </table>
          <figure className="my-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[10px]">
              <Image src="/work/ross-simmonds/keynote-data-chart.jpg" alt="Ross Simmonds presenting a data chart on stage" fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
            </div>
            <figcaption className="rs-label mt-3">Figures and captions keep their alt text for image search.</figcaption>
          </figure>

          <h2 id="search">Built for search and AI answers</h2>
          <p>
            The page ships as real HTML with structured data for the article, the author and the breadcrumb trail. That gives search engines and AI assistants a clean, citable version of every post.
          </p>

          <div className="mt-16 flex items-center gap-5 rounded-[12px] border border-white/10 bg-[#111] p-6">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <Image src="/work/ross-simmonds/panel-portrait.jpg" alt="" fill sizes="64px" className="object-cover object-top" />
            </span>
            <p className="m-0 text-[15px] leading-relaxed text-white/65">
              <span className="block text-[17px] text-[#f2f0eb]">Ross Simmonds</span>
              Founder of Foundation, creator of Distribution.ai and author of Create Once, Distribute Forever.
            </p>
          </div>
        </article>
      </div>

      <section className="border-t border-white/10 px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <p className="rs-label mb-10">Keep reading</p>
          <div className="grid gap-10 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} index={posts.indexOf(p)} />
            ))}
          </div>
        </div>
      </section>
      <Newsletter />
    </div>
  )
}
