/**
 * Whether WebGL here runs on a real graphics chip.
 *
 * 1. Ask for a context with `failIfMajorPerformanceCaveat`: browsers refuse
 *    it when they'd draw in software (no GPU, blocklisted driver).
 * 2. Some still hand one out, so also check the renderer's name against the
 *    well-known software renderers.
 *
 * Runs on a throwaway canvas before three.js is even loaded; the result is
 * cached. A device that passes but is still slow is caught later by the
 * scene's own frame timing (see OrbitScene).
 */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i

let cached

export function rendererName(gl) {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    return String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER))
  } catch {
    return ''
  }
}

export function isSoftwareRenderer(gl) {
  return SOFTWARE_RENDERER.test(rendererName(gl))
}

export function hasFastGPU() {
  if (cached !== undefined) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })
    cached = !!gl && !isSoftwareRenderer(gl)
    // Hand the context straight back — browsers cap live WebGL contexts
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
