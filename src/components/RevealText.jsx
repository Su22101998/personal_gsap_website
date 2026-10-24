'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/**
 * Text that rises into view line by line, each line masked, the first time
 * it's scrolled to. Lines are re-split automatically when fonts load or the
 * width changes. Children should be text (inline elements like <span> are
 * fine). Reduced-motion users get the text with no animation.
 *
 * @param {string} as       element to render ('h2', 'p'…)
 * @param {number} delay    seconds before the first line moves
 * @param {string} start    ScrollTrigger start position
 */
export default function RevealText({
  as: Tag = 'p',
  children,
  className = '',
  delay = 0,
  start = 'top 85%',
  ...rest
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        SplitText.create(ref.current, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          // Returning the tween lets SplitText revert and rebuild it on re-split
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.08,
              delay,
              scrollTrigger: { trigger: ref.current, start, once: true },
            }),
        })
      })
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
