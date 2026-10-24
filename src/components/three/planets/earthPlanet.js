import * as THREE from 'three'
import {
  LAND_MASK_URL,
  LAND_HEIGHT,
  lonLatToVector3,
  createGlobeMaterial,
  createAtmosphereMaterial,
  createCityLightsMaterial,
  createMarkerMaterial,
  createOrbitLineMaterial,
  createContourShellMaterial,
} from '../planetShaders'

/*
 * "Earth" hero planet: a revolving night-side globe with extruded
 * continents, glowing coastlines, city lights, ocean contour lines, pulsing
 * location markers with arcs between them, and orbit trails.
 *
 * Same interface as every hero planet (see OrbitScene):
 *   createEarthPlanet({ renderer, shared, radius })
 *     → { object, update(frame), dispose() }
 */

/** Axial rotation (radians/sec) */
const SPIN = 0.04
/** Initial rotation: brings the Americas round to face the camera */
const START_ROTATION = -0.26

/** City lights scattered over land (see buildCityLights) */
const CITY_LIGHT_COUNT = 9000
const CITY_CLUSTER_COUNT = 320

/** Pulsing location markers [lon, lat] */
const MARKERS = [
  [-74.0, 40.7], // New York
  [-0.13, 51.5], // London
  [-46.6, -23.5], // São Paulo
  [103.8, 1.35], // Singapore
  [139.7, 35.7], // Tokyo
]

/** Arcs between markers (indices into MARKERS) */
const ARCS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [3, 4],
]

/** Orbit trails around the globe: radius (× globe radius), tilt, comet speed */
const ORBITS = [
  { radius: 1.42, tilt: [1.2, 0, 0.5], speed: 0.045, offset: 0 },
  { radius: 1.78, tilt: [1.4, 0.45, -0.35], speed: 0.03, offset: 0.5 },
]

/** Small seeded PRNG, so the city lights land in the same places every visit */
function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * City lights from the land mask: dense clusters ("cities") of varying size
 * plus a sparse rural sprinkle, kept off the poles. Returns point geometry
 * with `aSize` / `aSeed` attributes for createCityLightsMaterial.
 */
function buildCityLights(image, radius) {
  const W = 1024
  const H = 512
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(image, 0, 0, W, H)
  const mask = ctx.getImageData(0, 0, W, H).data
  const isLand = (lon, lat) => {
    const x = Math.min(W - 1, Math.floor(((lon + 180) / 360) * W))
    const y = Math.min(H - 1, Math.floor(((90 - lat) / 180) * H))
    return mask[(y * W + x) * 4] > 140
  }

  const random = mulberry32(20261023)
  const gaussian = () => Math.sqrt(-2 * Math.log(random() + 1e-9)) * Math.cos(2 * Math.PI * random())
  const randomLand = (minLat, maxLat) => {
    for (let tries = 0; tries < 200; tries++) {
      const lon = random() * 360 - 180
      // Uniform over the sphere's area, not over latitude
      const lat = THREE.MathUtils.radToDeg(Math.asin(random() * 2 - 1))
      if (lat > minLat && lat < maxLat && isLand(lon, lat)) return [lon, lat]
    }
    return null
  }

  const clusters = []
  while (clusters.length < CITY_CLUSTER_COUNT) {
    const at = randomLand(-48, 64)
    if (at) clusters.push({ lon: at[0], lat: at[1], size: random() ** 2 })
  }
  const totalWeight = clusters.reduce((sum, c) => sum + 0.2 + c.size, 0)
  const pickCluster = () => {
    let r = random() * totalWeight
    for (const c of clusters) {
      r -= 0.2 + c.size
      if (r <= 0) return c
    }
    return clusters[clusters.length - 1]
  }

  const positions = []
  const sizes = []
  const seeds = []
  const v = new THREE.Vector3()
  let guard = 0
  while (seeds.length < CITY_LIGHT_COUNT && guard++ < CITY_LIGHT_COUNT * 20) {
    let lon
    let lat
    let size
    if (random() < 0.78) {
      const c = pickCluster()
      const spread = 0.5 + c.size * 2.4 // degrees
      const dx = gaussian()
      const dy = gaussian()
      lat = c.lat + dy * spread
      lon = c.lon + (dx * spread) / Math.max(0.3, Math.cos(THREE.MathUtils.degToRad(c.lat)))
      // Brighter towards each cluster's centre
      size = 1 + (1.2 + c.size * 1.6) * Math.exp(-(dx * dx + dy * dy) / 2) * (0.4 + 0.6 * random())
    } else {
      const at = randomLand(-56, 70)
      if (!at) continue
      ;[lon, lat] = at
      size = 0.7 + random() * 0.7
    }
    if (lon > 180) lon -= 360
    if (lon < -180) lon += 360
    if (Math.abs(lat) > 85 || !isLand(lon, lat)) continue
    lonLatToVector3(lon, lat, radius, v)
    positions.push(v.x, v.y, v.z)
    sizes.push(size)
    seeds.push(random())
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1))
  geometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1))
  return geometry
}

export function createEarthPlanet({ renderer, shared, radius }) {
  // Surface + atmosphere + floating contours, tilted on its axis. City
  // lights, markers and arcs are children of the surface so they turn with it.
  const object = new THREE.Group()
  const planet = new THREE.Mesh(
    // Dense enough (0.5°) for the extruded coastlines to read as walls
    new THREE.SphereGeometry(radius, 720, 360),
    createGlobeMaterial(shared, { seed: 3.1 })
  )
  const atmosphereMaterial = createAtmosphereMaterial(shared)
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.14, 64, 48), atmosphereMaterial)
  const contourShellMaterial = createContourShellMaterial(shared)
  const contourShell = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.1, 96, 64), contourShellMaterial)
  const tilt = new THREE.Group()
  tilt.rotation.set(0.3, 0, 0.32)
  tilt.add(planet, atmosphere, contourShell)
  object.add(tilt)

  // Lights and markers sit on the land's top surface, which rises as the
  // continents extrude: they live in a layer scaled to match
  const surfaceLayer = new THREE.Group()
  planet.add(surfaceLayer)

  const cityLightsMaterial = createCityLightsMaterial(shared)
  const markerMaterial = createMarkerMaterial(shared)
  const markerGeometry = new THREE.BufferGeometry()
  markerGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      MARKERS.flatMap(([lon, lat]) => lonLatToVector3(lon, lat, radius * 1.003).toArray()),
      3
    )
  )
  markerGeometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(MARKERS.map((_, i) => i * 0.37), 1))
  surfaceLayer.add(new THREE.Points(markerGeometry, markerMaterial))

  // Arcs between markers: great circles lifted off the surface, each with
  // a comet travelling along it
  const arcMaterials = ARCS.map(([from, to], i) => {
    const a = lonLatToVector3(...MARKERS[from], 1)
    const b = lonLatToVector3(...MARKERS[to], 1)
    const angle = a.angleTo(b)
    const segments = 128
    const points = []
    const along = []
    const v = new THREE.Vector3()
    for (let s = 0; s <= segments; s++) {
      const t = s / segments
      // Slerp between the two directions, lifted in the middle
      v.copy(a)
        .multiplyScalar(Math.sin((1 - t) * angle))
        .addScaledVector(b, Math.sin(t * angle))
        .divideScalar(Math.sin(angle))
      const lift = 1 + LAND_HEIGHT + 0.005 + Math.sin(Math.PI * t) * angle * 0.12
      v.multiplyScalar(radius * lift)
      points.push(v.x, v.y, v.z)
      along.push(t)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    geometry.setAttribute('aAlong', new THREE.Float32BufferAttribute(along, 1))
    const material = createOrbitLineMaterial(shared, { speed: 0.12, offset: i * 0.29, base: 0.4 })
    planet.add(new THREE.Line(geometry, material))
    return material
  })

  // Orbit trails (not spinning with the surface)
  const orbitMaterials = ORBITS.map(({ radius: r, tilt: [rx, ry, rz], speed, offset }) => {
    const segments = 256
    const points = []
    const along = []
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2
      points.push(Math.cos(a) * r * radius, 0, Math.sin(a) * r * radius)
      along.push(i / segments)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    geometry.setAttribute('aAlong', new THREE.Float32BufferAttribute(along, 1))
    const material = createOrbitLineMaterial(shared, { speed, offset })
    const line = new THREE.Line(geometry, material)
    line.rotation.set(rx, ry, rz)
    object.add(line)
    return material
  })

  // Continents arrive with the land mask; the globe shows as open ocean
  // until then, and the land rises into place
  let disposed = false
  let landTexture = null
  new THREE.TextureLoader().load(
    LAND_MASK_URL,
    (texture) => {
      if (disposed) {
        texture.dispose()
        return
      }
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      texture.wrapS = THREE.RepeatWrapping // continuous across the antimeridian
      landTexture = texture
      shared.uLandMap.value = texture
      surfaceLayer.add(new THREE.Points(buildCityLights(texture.image, radius * 1.002), cityLightsMaterial))
    },
    undefined,
    (err) => console.warn('earthPlanet: land mask failed to load', err)
  )

  return {
    object,

    update({ elapsed, zoom, intro, reduceMotion }) {
      planet.rotation.y = START_ROTATION + elapsed * SPIN

      const landTarget = landTexture ? 1 : 0
      shared.uLandReady.value = reduceMotion
        ? landTarget
        : shared.uLandReady.value + (landTarget - shared.uLandReady.value) * 0.035
      surfaceLayer.scale.setScalar(1 + LAND_HEIGHT * shared.uLandReady.value)

      // The atmosphere would wash over the screen once the camera is inside it
      atmosphereMaterial.uniforms.uStrength.value = 1 - THREE.MathUtils.smoothstep(zoom, 0.7, 0.92)
      // Surface details appear with the globe; orbits clear out of the
      // camera's way early in the zoom, markers a little later
      cityLightsMaterial.uniforms.uOpacity.value = intro * shared.uLandReady.value
      const markerOpacity = intro * shared.uLandReady.value * (1 - THREE.MathUtils.smoothstep(zoom, 0.35, 0.75))
      markerMaterial.uniforms.uOpacity.value = markerOpacity
      arcMaterials.forEach((m) => {
        m.uniforms.uOpacity.value = markerOpacity
      })
      const orbitOpacity = intro * (1 - THREE.MathUtils.smoothstep(zoom, 0.1, 0.45))
      orbitMaterials.forEach((m) => {
        m.uniforms.uOpacity.value = orbitOpacity
      })
      contourShellMaterial.uniforms.uOpacity.value = orbitOpacity
    },

    dispose() {
      disposed = true
      landTexture?.dispose()
      shared.uLandMap.value = null
      // Not in the scene graph if the mask never arrived
      cityLightsMaterial.dispose()
    },
  }
}
