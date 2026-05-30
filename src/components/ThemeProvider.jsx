'use client'

import { useState, useEffect, useCallback } from 'react'
import Loader from '@/components/Loader'

/**
 * Manages the animated loader on first load.
 * The site starts dark; the hero scroll animation handles the
 * dark-to-purple transition — no manual theme toggle needed.
 */
export function ThemeProvider({ children }) {
  const [isMounted, setIsMounted] = useState(false)
  // const [isLoaderDone, setIsLoaderDone] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // const handleLoaderComplete = useCallback(() => {
  //   setIsLoaderDone(true)
  // }, [])

  return (
    <>
      {/* Show loader while the app is hydrating */}
      {/* {!isLoaderDone && <Loader onComplete={handleLoaderComplete} />} */}

      {/* Render children immediately (hidden behind loader until it exits).
          This lets Three.js, fonts, and images start loading in the background. */}
      <div style={{ visibility: isMounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  )
}
