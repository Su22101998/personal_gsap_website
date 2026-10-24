import { createEarthPlanet } from './earthPlanet'
import { createRipplePlanet } from './ripplePlanet'

/*
 * Hero planet variants. Each factory takes { renderer, shared, radius, camera }
 * and returns { object, update(frame), dispose() } — see OrbitScene.
 *
 * DEFAULT_PLANET is what visitors see. Any variant can be previewed with a
 * URL parameter, e.g. /?planet=earth
 */
export const PLANETS = {
  earth: createEarthPlanet,
  ripple: createRipplePlanet,
}

export const DEFAULT_PLANET = 'ripple'

export function resolvePlanet() {
  const requested = new URLSearchParams(window.location.search).get('planet')
  return requested in PLANETS ? requested : DEFAULT_PLANET
}
