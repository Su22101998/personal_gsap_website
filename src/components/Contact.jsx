'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '@/i18n'
import { toneProps } from '@/lib/tone'
import { clipReveal } from '@/lib/animation'
import RevealText from '@/components/RevealText'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EMPTY_FORM = { name: '', email: '', company: '', budget: '', message: '', website: '' }

function Field({ id, label, children }) {
  return (
    <div className="contact-field">
      <label htmlFor={id} className="mb-1 block text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--fg-subtle)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

/**
 * Contact — "Start a project". Rises in as a card; posts to /api/contact
 * (Resend). Includes a hidden honeypot field (`website`) for bots.
 */
export default function Contact() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        clipReveal(sectionRef.current)
        gsap.from('.contact-field', {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.contact-form', start: 'top 85%', once: true },
        })
      })
    },
    { scope: sectionRef }
  )

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus('success')
      setForm(EMPTY_FORM)
    } catch {
      setStatus('error')
    }
  }

  const budgets = t('contact.budgets')
  const email = t('contact.email')

  return (
    <section ref={sectionRef} id="contact" {...toneProps('accent')} className="section-padding relative">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow mb-6">{t('contact.label')}</p>
          <RevealText as="h2" className="heading-dot mb-8 text-4xl md:text-6xl lg:text-7xl">
            {t('contact.heading')}
          </RevealText>
          <p className="mb-10 max-w-sm" style={{ color: 'var(--fg-muted)' }}>
            {t('contact.description')}
          </p>
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--fg-subtle)' }}>
            {t('contact.emailLabel')}
          </p>
          <a href={`mailto:${email}`} className="focus-ring heading-display text-2xl underline-offset-8 hover:underline md:text-3xl">
            {email}
          </a>
        </div>

        <div className="md:col-span-7">
          {status === 'success' ? (
            <div role="status" className="flex h-full flex-col justify-center py-12">
              <p className="heading-dot mb-4 text-4xl">{t('contact.successTitle')}</p>
              <p style={{ color: 'var(--fg-muted)' }}>{t('contact.successMessage')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <Field id="contact-name" label={t('contact.fields.name')}>
                  <input id="contact-name" name="name" required autoComplete="name" className="field" value={form.name} onChange={update} />
                </Field>
                <Field id="contact-email" label={t('contact.fields.email')}>
                  <input id="contact-email" name="email" type="email" required autoComplete="email" className="field" value={form.email} onChange={update} />
                </Field>
              </div>
              <Field id="contact-company" label={t('contact.fields.company')}>
                <input id="contact-company" name="company" autoComplete="organization" className="field" value={form.company} onChange={update} />
              </Field>

              <fieldset className="contact-field">
                <legend className="mb-3 block text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--fg-subtle)' }}>
                  {t('contact.fields.budget')}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {budgets.map((budget) => {
                    const checked = form.budget === budget
                    return (
                      <label
                        key={budget}
                        className="cursor-pointer rounded-full px-4 py-2 text-sm transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
                        style={{
                          border: '1px solid var(--hairline)',
                          background: checked ? 'var(--fg)' : 'transparent',
                          color: checked ? 'var(--bg)' : 'var(--fg)',
                        }}
                      >
                        <input type="radio" name="budget" value={budget} checked={checked} onChange={update} className="sr-only" />
                        {budget}
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <Field id="contact-message" label={t('contact.fields.message')}>
                <textarea id="contact-message" name="message" required rows={4} className="field resize-none" value={form.message} onChange={update} />
              </Field>

              {/* Honeypot — hidden from people, filled in by naive bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} />
              </div>

              <div className="contact-field flex flex-wrap items-center gap-6 pt-2">
                <button type="submit" disabled={status === 'sending'} className="btn-retro focus-ring inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em]">
                  {status === 'sending' ? t('contact.sending') : t('contact.submit')}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </button>
                {status === 'error' && (
                  <p role="alert" className="text-sm" style={{ color: 'var(--fg)' }}>
                    {t('contact.errorMessage')}{' '}
                    <a href={`mailto:${email}`} className="underline underline-offset-4">
                      {email}
                    </a>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
