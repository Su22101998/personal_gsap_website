'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STAGES = ['ink', 'accent', 'paper']
const DEFAULT_STAGE = 'ink'

/** Sets the current scroll stage on <html> (see `[data-stage]` in globals.css). */
export function setPageStage(stage) {
  document.documentElement.dataset.stage = STAGES.includes(stage) ? stage : DEFAULT_STAGE
}

/**
 * Single owner of the page's colour stage.
 *
 * Any element inside `scopeRef` can declare `data-stage="ink|accent|paper"`
 * (and optionally `data-stage-start`, a ScrollTrigger start string — default
 * 'top center'). The active stage is always derived from the scroll position:
 * the last marker whose start has been passed wins. Because it's recomputed
 * from position on every crossing, fast jumps can never leave a stale stage.
 *
 * Hidden markers (display: none, e.g. desktop-only) are ignored, and the
 * marker set is rebuilt when crossing the md breakpoint.
 *
 * Call this from the page component: its layout effect runs after all child
 * sections have created their own (pinning) ScrollTriggers.
 */
export function usePageTheme(scopeRef) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ isDesktop: '(min-width: 768px)', isMobile: '(max-width: 767px)' }, () => {
        // <html> carries data-stage itself, so only look for markers in scope
        const markers = gsap.utils
          .toArray('[data-stage]', scopeRef.current)
          .filter((el) => el.getClientRects().length > 0)

        let triggers = []
        const sync = () => {
          let stage = DEFAULT_STAGE
          triggers.forEach((st, i) => {
            if (st.scroll() >= st.start) stage = markers[i].dataset.stage
          })
          setPageStage(stage)
        }

        triggers = markers.map((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: el.dataset.stageStart || 'top center',
            onEnter: sync,
            onLeaveBack: sync,
          })
        )

        sync()
        ScrollTrigger.addEventListener('refresh', sync)
        return () => ScrollTrigger.removeEventListener('refresh', sync)
      })

      // Web fonts can shift layout after first paint — re-measure once they land
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    },
    { scope: scopeRef }
  )
}
