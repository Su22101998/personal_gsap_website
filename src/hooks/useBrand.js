'use client'

import { useSyncExternalStore } from 'react'
import { DEFAULT_BRAND } from '@/lib/brand'

function subscribe(onChange) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-brand'] })
  return () => observer.disconnect()
}

const getSnapshot = () => document.documentElement.dataset.brand || DEFAULT_BRAND
const getServerSnapshot = () => DEFAULT_BRAND

/** Current brand ('violet' | 'noir'); re-renders when it changes. */
export function useBrand() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
