/**
 * One-shot "intro done" signal: fired by the Preloader as its exit wipe
 * reveals the page (or immediately when the preloader is skipped).
 *
 * The hero entrance, the 3D scene's intro and smooth scrolling all wait for
 * it, so nothing plays unseen behind the preloader.
 */
export const INTRO_SEEN_KEY = 'cp-intro-seen'

/**
 * Runs inline in <head> before first paint:
 * - marks <html data-js> so CSS can hide entrance-animated elements before
 *   hydration (no flash of the server-rendered hero); without JS they show
 * - skips the preloader for the rest of the session once it's been seen,
 *   and always for reduced-motion users (CSS hides `.preloader` when
 *   <html data-intro="skip">)
 */
export const PRELOADER_INIT_SCRIPT = `(function(){var d=document.documentElement;d.dataset.js='';try{if(sessionStorage.getItem('${INTRO_SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.intro='skip'}catch(e){d.dataset.intro='skip'}})()`

let done = false
const listeners = new Set()

export const isIntroDone = () => done

export function markIntroDone() {
  if (done) return
  done = true
  listeners.forEach((fn) => fn())
  listeners.clear()
}

/** Runs `fn` once the intro is done (immediately if it already is). Returns an unsubscribe. */
export function onIntroDone(fn) {
  if (done) {
    fn()
    return () => {}
  }
  listeners.add(fn)
  return () => listeners.delete(fn)
}
