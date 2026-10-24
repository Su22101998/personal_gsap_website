import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
 * Shared section transitions. Call these inside a useGSAP callback so the
 * tweens and ScrollTriggers they create are cleaned up with the component.
 */

/**
 * The section rises in as an inset, rounded card and expands to full
 * bleed as it scrolls up to the top of the viewport.
 */
export function clipReveal(el, { start = 'top bottom', end = 'top 10%' } = {}) {
  return gsap.fromTo(
    el,
    { clipPath: 'inset(120px 5% 0px 5% round 40px)' },
    {
      clipPath: 'inset(0px 0% 0px 0% round 0px)',
      ease: 'none',
      scrollTrigger: { trigger: el, start, end, scrub: true },
    }
  )
}

/**
 * Scrubs an element's background from one brand colour to another
 * (`from` / `to` are brand channel names: 'stage', 'ink', 'paper'…).
 * Tweens a 0→1 mix factor rather than a colour, so it follows whichever
 * brand is active — even if it's switched mid-scroll.
 */
export function bleedBackground(el, { from, to, ...scrollTrigger }) {
  el.style.setProperty('--mix', '0')
  el.style.backgroundColor = `color-mix(in srgb, rgb(var(--c-${to})) calc(var(--mix) * 100%), rgb(var(--c-${from})))`
  return gsap.to(el, {
    '--mix': 1,
    ease: 'none',
    scrollTrigger: { scrub: true, ...scrollTrigger },
  })
}
