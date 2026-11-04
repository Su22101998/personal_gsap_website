'use client'

import { useMemo, useState } from 'react'
import { RLink } from './Shell'
import { isBuilt } from './data'
import urls from './urls.json'

const group = (p) => (p.startsWith('/blog/') ? 'Blog' : p.startsWith('/resources/') ? 'Resources' : 'Pages')

/**
 * Every URL in the live sitemaps (pages, resources, posts), each kept at the
 * same path in the makeover. Built concept pages open here; the rest open live.
 */
export default function UrlMap() {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => urls.filter((p) => p.includes(q.trim().toLowerCase())), [q])
  const counts = useMemo(() => ['Pages', 'Resources', 'Blog'].map((g) => [g, urls.filter((p) => group(p) === g).length]), [])

  return (
    <section className="px-5 pb-24 pt-16 md:px-8 md:pt-24">
      <div className="mx-auto max-w-[1400px]">
        <p className="rs-label mb-6">SEO & folder structure</p>
        <h1 className="rs-display text-[clamp(3rem,8vw,7rem)] leading-[0.9]">
          {urls.length} URLs. <span className="rs-serif text-rs-accent">None move.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-[18px] leading-relaxed text-white/65">
          Every address in the live sitemaps keeps its exact path, slug and trailing slash in the makeover, so no rankings are lost and no redirects are needed. The pages built for this concept are marked; the rest open on the live site.
        </p>
        <dl className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-white/10 bg-white/10">
          {counts.map(([g, n]) => (
            <div key={g} className="flex flex-col-reverse bg-[#0a0a0a] p-6">
              <dt className="rs-label mt-1">{g}</dt>
              <dd className="rs-display text-5xl">{n}</dd>
            </div>
          ))}
        </dl>

        <label htmlFor="rs-url-q" className="rs-label mb-3 mt-14 block">
          Search the map
        </label>
        <input id="rs-url-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. reddit, /blog/, consulting" className="rs-input w-full max-w-xl" />
        <p className="rs-mono mt-3 text-[12px] text-white/40">{filtered.length} shown</p>

        <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {filtered.map((p) => (
            <li key={p} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="rs-mono text-[13px] text-white/75">rosssimmonds.com{p}</span>
              <span className="flex items-center gap-4">
                <span className="rs-mono text-[11px] uppercase tracking-[0.12em] text-white/35">{group(p)}</span>
                <span className="rs-mono rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white/55">Same path</span>
                <RLink path={p} label={p} className={`rs-mono text-[11px] uppercase tracking-[0.12em] ${isBuilt(p) ? 'text-rs-accent' : 'text-white/45'} hover:underline`}>
                  {isBuilt(p) ? 'Open concept →' : 'Open live ↗'}
                </RLink>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
