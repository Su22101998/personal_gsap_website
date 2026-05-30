import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Creates a fade-in-up scroll animation for a target element.
 *
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Configuration overrides
 * @returns {gsap.core.Tween} The GSAP tween for external control
 */
export function fadeInOnScroll(element, options = {}) {
  return gsap.from(element, {
    y: options.y ?? 60,
    opacity: 0,
    duration: options.duration ?? 1,
    ease: options.ease ?? 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: options.start ?? 'top 80%',
      end: options.end ?? 'top 20%',
      toggleActions: options.toggleActions ?? 'play none none reverse',
    },
  })
}

/**
 * Creates staggered reveal animation for a group of elements.
 *
 * @param {HTMLElement[]} elements - Array of elements to animate
 * @param {Object} options - Configuration overrides
 * @returns {gsap.core.Tween}
 */
export function staggerReveal(elements, options = {}) {
  return gsap.from(elements, {
    y: options.y ?? 40,
    opacity: 0,
    duration: options.duration ?? 0.8,
    stagger: options.stagger ?? 0.15,
    ease: options.ease ?? 'power2.out',
    scrollTrigger: {
      trigger: options.trigger ?? elements[0],
      start: options.start ?? 'top 75%',
    },
  })
}

/**
 * Creates a parallax scroll effect on an element.
 *
 * @param {HTMLElement} element - Element to apply parallax to
 * @param {number} speed - Parallax speed multiplier (positive = slower, negative = faster)
 */
export function parallaxScroll(element, speed = 0.3) {
  return gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/**
 * Animated number counter that counts up when scrolled into view.
 *
 * @param {HTMLElement} element - Element to display the counter value
 * @param {number} targetValue - The final number value
 * @param {string} suffix - String appended after the number (e.g., '+', '%', 'M')
 * @param {number} duration - Animation duration in seconds
 */
export function animateCounter(element, targetValue, suffix = '', duration = 2) {
  const counter = { val: 0 }

  return gsap.to(counter, {
    val: targetValue,
    duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
    },
    onUpdate: () => {
      const formatted =
        targetValue % 1 !== 0
          ? counter.val.toFixed(1)
          : Math.round(counter.val).toLocaleString()
      element.textContent = formatted + suffix
    },
  })
}
