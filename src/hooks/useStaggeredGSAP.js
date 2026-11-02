'use client'

import { useGSAP } from '@gsap/react'

/*
 * useGSAP, but the setup runs in its own short task instead of inside React's
 * hydration commit.
 *
 * Every section building its scroll animations at once (text splits, pins,
 * triggers) made one long, page-freezing task on load. Queued here, they run
 * one per task — still in mount order (top of the page first, so pins stack
 * correctly, and the page-level hooks last) — and the browser can respond to
 * input between them.
 *
 * Same signature as useGSAP. Use it for setup only — not for hooks whose
 * `dependencies` re-run on interaction, which should stay immediate.
 */

const queue = []
let posted = false
const channel = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null

function pump() {
  posted = false
  const job = queue.shift()
  job?.()
  if (queue.length) post()
}

function post() {
  if (posted) return
  posted = true
  if (channel) channel.port2.postMessage(0)
  else setTimeout(pump, 0)
}

if (channel) channel.port1.onmessage = pump

export function useStaggeredGSAP(callback, config) {
  useGSAP((context, contextSafe) => {
    // Runs inside the context later, so everything it creates is still
    // reverted with the component
    const run = context.add(null, () => callback(context, contextSafe))
    let cancelled = false
    const job = () => {
      if (!cancelled) run()
    }
    queue.push(job)
    post()

    return () => {
      cancelled = true
      const i = queue.indexOf(job)
      if (i > -1) queue.splice(i, 1)
    }
  }, config)
}
