'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { hasFastGPU } from '@/lib/gpu'
import { onIntroDone } from '@/lib/intro'

// Dynamic import — Three.js cannot run during SSR, and devices that get the
// poster never download it at all
const OrbitScene = dynamic(() => import('./OrbitScene'), { ssr: false })

/** One finished frame of the orbit scene, captured with its backdrop and glow */
const POSTER_SRC = '/hero/planet-poster.jpg'
/** How far the poster scales by the end of the scroll zoom */
const POSTER_ZOOM = 4

/**
 * Still stand-in for devices without a usable GPU: WebGL would be drawn in
 * software there, freezing the page for every frame. Fades in as the page is
 * revealed, scales with the scroll zoom, and reports its "intro" done so the
 * hero text entrance runs as usual.
 */
function PlanetPoster({ zoomProgress, onNodesIntroComplete }) {
  const ref = useRef(null)

  useEffect(() => {
    const img = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stopWaiting = onIntroDone(() => {
      gsap.to(img, {
        opacity: 1,
        scale: 1,
        duration: reduce ? 0 : 1.2,
        ease: 'power3.out',
        onComplete: () => onNodesIntroComplete?.(),
      })
    })

    // Follow the scroll zoom: only touch the DOM when the value changes,
    // and only while the hero is on screen
    let raf = 0
    let last = -1
    const follow = () => {
      raf = requestAnimationFrame(follow)
      const z = zoomProgress?.current?.value ?? 0
      if (Math.abs(z - last) < 0.001) return
      last = z
      gsap.set(img, { scale: 1 + z * z * (POSTER_ZOOM - 1) })
    }
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      if (entry.isIntersecting) raf = requestAnimationFrame(follow)
    })
    io.observe(img)

    return () => {
      stopWaiting()
      io.disconnect()
      cancelAnimationFrame(raf)
      gsap.killTweensOf(img)
    }
  }, [zoomProgress, onNodesIntroComplete])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={POSTER_SRC}
      alt=""
      aria-hidden="true"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: 0, transform: 'scale(0.96)' }}
    />
  )
}

/**
 * The hero's planet: the live Three.js scene on devices with a real GPU,
 * a still image of it everywhere else (see lib/gpu.js).
 */
export default function HeroScene(props) {
  // Decided after mount (needs the browser); the CSS glow shows meanwhile
  const [mode, setMode] = useState(null)
  useEffect(() => {
    // ?scene=poster previews the fallback on any machine
    const forced = new URLSearchParams(window.location.search).get('scene')
    setMode(forced === 'poster' ? 'poster' : hasFastGPU() ? 'live' : 'poster')
  }, [])

  if (mode === 'live') return <OrbitScene {...props} />
  if (mode === 'poster') return <PlanetPoster {...props} />
  return null
}
