'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

// Pre-generated hex-like strings for the background data stream.
// Using static values avoids server/client hydration mismatch.
const STREAM_STRINGS = [
  ['a8f3d1e0', '4b7c9f21', 'e0d5a832', '9c1f7b4e', '3d6e8a15', 'f2b09c47', '71e4d3a8', '0c8a5f92', 'b6d1e7f3', '5a3c9d08', '82f6b1d4', 'e9a0c573', '1d4f8e26', '7b2a6d91', 'c3e5f048', '96d8a1b7', '0f3c7e52', 'a4b8d196', '58e2c0f7', '2d9f4a83'],
  ['f7e2a1b5', '3c9d0842', '8a6f1de7', 'd4b5c398', '1e7a2f60', '95c8d4b1', '0b3f6e27', '72a1d5c9', 'e8f03b74', '4d9c7a16', 'a3e6f182', 'c0d7b945', '6f1e8a3d', 'b2c4d708', '59a3f1e6', '1d8b0c74', '7e5a2f93', 'f4d6c1a8', '3b9e7052', '86a1d4cf'],
  ['c1d8e3f7', '5a2b9048', '0e7f3d16', 'b4a6c891', '82d5f1e3', '39c0a7b5', 'f6e1d428', '7b3a9c05', '14e8f2d6', 'a0c5b793', 'd7f3e184', '4b8a1c60', '93d6f0e2', 'e5a2c847', '2f1d7b39', 'c8e4a0f5', '61b3d9c7', '0a5f2e81', 'f9c7d3b4', '37e1a806'],
  ['9e4a7bf1', 'd3c1f825', '7b0e6a49', '1f8d2c73', 'a5e9b0d6', '42c7f318', '86d4a1e5', 'e0b3c972', '5d1f8a47', 'c9e6d0b3', '3a7f1e84', 'f2d5c096', '0b8a4e21', '74c1d8f5', 'e3a9f267', '18d4b5c0', 'a6f0e3d9', '52c8b147', '9f3d1a86', 'd7e2c5f0'],
  ['b0f4d289', '6e1c3a57', 'a8d7f130', '3c5b9e42', 'f1e0d876', '49a2c5b8', '82f6e1d3', 'd5c3a094', '1b7e4f28', '96d0a3e5', 'e4f8c172', '0a3d5b96', 'c7e1f4d0', '53b8a2e9', '2f9d1c74', 'a1e5d837', '68c4f0b2', 'f3d7a9e1', 'b5c20e48', '7a1f3d65'],
  ['d6e3f1a8', '2c7b0954', 'a1f4d8e3', '83c5b9d0', '4e0a2f17', 'f8d1c6b5', '17e9a3c2', 'b4f2d876', '5c8e1a03', '92d6f4e1', 'e7a0c3b8', '31d5f924', 'c0b8e6a7', '6f4a1d82', 'a9e3c5f0', '45d7b1e8', '0c2f8a63', 'f6d0e4b9', '83a1c725', '2e5d9f41'],
  ['4b8f2d17', 'e3a5c960', '9d1f7b83', 'c6e0d4a2', '0f3b8e51', '72d4a9c5', 'a1e6f3b8', 'd8c2b047', '5e9a1d36', 'b3f7e0c4', '1c4d8a92', 'f0e5b3d7', '86a2c1f4', '3d7f0e69', 'c4b9d528', 'e1a3f780', '59d6c2b4', '0b8e4a13', 'f2c7d1e6', 'a4e8b359'],
  ['7c1d5e93', 'b0f8a426', 'e6d3c178', '2a9f4b50', 'd1e7f3c4', '48b5a0e9', '93c2d617', 'f4a8e1b5', '0d6c3f72', 'a5e1d8c0', 'c7f2b493', '31a0e6d4', '86f4c5b2', 'e9d1a378', '5b2c0f41', '14e8d7a6', 'a3c9f052', 'd6b4e183', 'f0a5c2d7', '72e1b849'],
]
export default function Contact() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const { t } = useTranslation()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      gsap.from('.contact-form-container', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })

      gsap.from('.contact-info', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({ name: '', email: '', company: '', message: '' })
    }, 1500)
  }

  return (
    <section ref={sectionRef} id="contact" className="section-padding relative overflow-hidden">
      {/* Background data stream effect — deterministic strings avoid hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        {[3.2, 4.1, 3.7, 4.5, 3.4, 4.8, 3.9, 4.3].map((dur, i) => (
          <div
            key={i}
            className="absolute font-mono text-[10px] animate-data-stream"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${dur}s`,
              color: 'var(--accent-teal)',
            }}
          >
            {STREAM_STRINGS[i % STREAM_STRINGS.length].map((str, j) => (
              <div key={j} className="py-0.5">
                {str}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="contact-title text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
            style={{ color: 'var(--accent-teal)', background: 'var(--glow-color)' }}
          >
            {t('contact.sectionLabel')}
          </span>
          <h2 className="heading-section mb-4">
            {t('contact.heading')}{' '}
            <span className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-blue)] bg-clip-text text-transparent">
              {t('contact.headingAccent')}
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Terminal Form */}
          <div className="contact-form-container lg:col-span-3">
            <div className="terminal">
              {/* Terminal Header */}
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500/80" />
                <div className="terminal-dot bg-yellow-500/80" />
                <div className="terminal-dot bg-green-500/80" />
                <span className="ml-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {t('contact.terminalTitle')}
                </span>
              </div>

              {/* Form */}
              <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="text-4xl mb-4">✓</div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--accent-teal)' }}>
                      {t('contact.successTitle')}
                    </p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.successMessage')}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Name */}
                    <div>
                      <label
                        className="block text-[10px] uppercase tracking-wider font-mono mb-1.5"
                        style={{ color: 'var(--accent-teal)' }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>{t('contact.promptSymbol')}</span> {t('contact.fields.name.label')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder={t('contact.fields.name.placeholder')}
                        required
                        className="terminal-input rounded-lg"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        className="block text-[10px] uppercase tracking-wider font-mono mb-1.5"
                        style={{ color: 'var(--accent-teal)' }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>{t('contact.promptSymbol')}</span> {t('contact.fields.email.label')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder={t('contact.fields.email.placeholder')}
                        required
                        className="terminal-input rounded-lg"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label
                        className="block text-[10px] uppercase tracking-wider font-mono mb-1.5"
                        style={{ color: 'var(--accent-teal)' }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>{t('contact.promptSymbol')}</span> {t('contact.fields.company.label')}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        placeholder={t('contact.fields.company.placeholder')}
                        className="terminal-input rounded-lg"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        className="block text-[10px] uppercase tracking-wider font-mono mb-1.5"
                        style={{ color: 'var(--accent-teal)' }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>{t('contact.promptSymbol')}</span> {t('contact.fields.message.label')}
                      </label>
                      <textarea
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder={t('contact.fields.message.placeholder')}
                        rows={4}
                        required
                        className="terminal-input rounded-lg resize-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full mt-4"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('contact.submitLoading')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {t('contact.submitLabel')}
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 14L14 2M14 2H4M14 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-info lg:col-span-2 space-y-6">
            {/* Availability status */}
            <div className="fintech-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t('contact.availableTag')}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t('contact.availableDescription')}
              </p>
            </div>

            {/* Quick links */}
            <div className="fintech-card p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {t('contact.connectTitle')}
              </h3>
              {t('contact.channels').map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer hover:translate-x-1"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <span>{item.icon}</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {item.label}
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="fintech-card p-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--glow-color)' }}
                >
                  <span style={{ color: 'var(--accent-teal)' }}>⚡</span>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {t('contact.responseTimeLabel')}
                  </p>
                  <p className="text-lg font-bold font-mono" style={{ color: 'var(--accent-teal)' }}>
                    {t('contact.responseTimeValue')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
