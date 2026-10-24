import { NextResponse } from 'next/server'

/*
 * Contact form → email via Resend (https://resend.com).
 *
 * Environment (see .env.example):
 *   RESEND_API_KEY      required — Resend API key
 *   CONTACT_TO_EMAIL    required — where enquiries are delivered
 *   CONTACT_FROM_EMAIL  optional — a sender on a domain verified in Resend.
 *                       Defaults to Resend's test sender, which can only
 *                       deliver to the Resend account owner's address.
 */

const MAX_LENGTH = { name: 120, email: 200, company: 160, budget: 40, message: 5000 }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort rate limit. In-memory, so per server instance only — on
// serverless hosting each instance keeps its own count.
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT = 5
const recentByIp = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const recent = (recentByIp.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS)
  recent.push(now)
  recentByIp.set(ip, recent)
  return recent.length > RATE_LIMIT
}

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const fail = (status, error) => NextResponse.json({ error }, { status })

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return fail(400, 'Invalid request body')
  }

  // Honeypot filled in → almost certainly a bot. Pretend it worked.
  if (typeof body?.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true })
  }

  const data = {}
  for (const [key, max] of Object.entries(MAX_LENGTH)) {
    const value = typeof body?.[key] === 'string' ? body[key].trim() : ''
    if (value.length > max) return fail(400, `${key} is too long`)
    data[key] = value
  }
  if (!data.name || !data.message || !EMAIL_PATTERN.test(data.email)) {
    return fail(400, 'Name, a valid email and a message are required')
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (isRateLimited(ip)) return fail(429, 'Too many requests')

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    console.error('Contact form: RESEND_API_KEY and CONTACT_TO_EMAIL must be set')
    return fail(503, 'Contact form is not configured')
  }
  const from = process.env.CONTACT_FROM_EMAIL || 'Cyber Pears <onboarding@resend.dev>'

  // Strip line breaks from anything that lands in a header
  const subjectPart = (value) => value.replace(/[\r\n]+/g, ' ')
  const subject = `New enquiry — ${subjectPart(data.name)}${data.company ? ` (${subjectPart(data.company)})` : ''}`

  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Company', data.company || '—'],
    ['Budget', data.budget || '—'],
  ]
  const text = `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${data.message}`
  const html = `${rows
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
    .join('')}<p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`

  let response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, text, html }),
    })
  } catch (err) {
    console.error('Contact form: could not reach Resend', err)
    return fail(502, 'Email service unavailable')
  }

  if (!response.ok) {
    console.error('Contact form: Resend error', response.status, await response.text())
    return fail(502, 'Email service error')
  }

  return NextResponse.json({ ok: true })
}
