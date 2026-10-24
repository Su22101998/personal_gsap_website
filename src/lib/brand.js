/**
 * Brand themes. Each one is a full palette (see `[data-brand]` in globals.css)
 * plus a matching 3D scene palette (see three/OrbitScene).
 *   violet — purple signature accent, original planet
 *   noir   — black / ivory / champagne gold, planet recoloured
 *
 * Plain module (no 'use client') so the server layout can read the constants.
 * The React hook lives in `@/hooks/useBrand`.
 */
export const BRANDS = ['violet', 'noir']
export const DEFAULT_BRAND = 'violet'
const STORAGE_KEY = 'cp-brand'

/**
 * The switch is hidden for now — the site ships in violet only. Flip this
 * to `true` to bring back the BrandSwitch in the navbar and remembered
 * choices. While it's off, `?brand=noir` still previews noir for one visit.
 */
export const BRAND_SWITCH_ENABLED = false

/**
 * Runs inline in <head> before first paint so the stored brand (or a
 * `?brand=noir` URL param) is applied without a flash of the default palette.
 */
export const BRAND_INIT_SCRIPT = `(function(){try{var b=new URLSearchParams(location.search).get('brand')${BRAND_SWITCH_ENABLED ? `||localStorage.getItem('${STORAGE_KEY}')` : ''};if(${JSON.stringify(BRANDS)}.indexOf(b)>-1)document.documentElement.dataset.brand=b}catch(e){}})()`

export function setBrand(brand) {
  if (!BRANDS.includes(brand)) return
  document.documentElement.dataset.brand = brand
  try {
    localStorage.setItem(STORAGE_KEY, brand)
  } catch {
    // Storage can be blocked (private mode) — the brand still applies for this visit
  }
}
