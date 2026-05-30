import gsap from 'gsap'

/**
 * Initializes cinematic hero entrance animation.
 * Call once after the hero section is mounted.
 *
 * @param {HTMLElement} heroElement - The root hero section element
 * @returns {gsap.core.Timeline} The GSAP timeline for external control
 */
export function initHeroAnimation(heroElement) {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.3,
  })

  // Fade in Three.js canvas
  const canvas = heroElement.querySelector('canvas')
  if (canvas) {
    tl.from(canvas, { opacity: 0, duration: 1.5 }, 0)
  }

  // Animate headline words
  const headlineWords = heroElement.querySelectorAll('.hero-word')
  if (headlineWords.length) {
    tl.from(
      headlineWords,
      {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      },
      0.4
    )
  }

  // Animate subtext
  const subtext = heroElement.querySelector('.hero-subtext')
  if (subtext) {
    tl.from(subtext, { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
  }

  // Animate CTA buttons
  const ctaButtons = heroElement.querySelectorAll('.hero-cta')
  if (ctaButtons.length) {
    tl.from(ctaButtons, { y: 20, opacity: 0, stagger: 0.15, duration: 0.6 }, '-=0.3')
  }

  return tl
}
