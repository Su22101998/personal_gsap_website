'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useBrand } from '@/hooks/useBrand'
import { onIntroDone } from '@/lib/intro'
import { PLANET_PALETTES, createSharedUniforms, applyPalette, createGlobeMaterial } from './planetShaders'
import { PLANETS, resolvePlanet } from './planets'

/* =====================================================
   Three.js orbital scene (hero)

   Renders a 3D scene with:
   - A central planet — one of the variants in ./planets (Earth globe,
     interactive ripple sphere, …), picked by resolvePlanet()
   - Small moons in orbit around it
   - Animated connection lines and flowing particles between them
   - Mouse-reactive camera movement
   Every colour follows the active brand (see planetShaders.js).
   ===================================================== */

const CENTRAL_NODE_INDEX = 5
/** Central planet radius (world units) */
const CENTRAL_RADIUS = 2.5
/** Satellite radius × node.scale */
const SATELLITE_RADIUS = 0.13
/** Satellites: growth factor on cursor proximity. final = base * (1 + gi * GROW) */
const SATELLITE_GROW = 1.6

/** Satellites' axial rotation (radians/sec) */
const SATELLITE_SPIN = 0.4

/** How close the scroll zoom brings the camera to the surface (× radius) */
const ZOOM_END_DISTANCE = 1.1

/** 1.5× is visually indistinguishable on this soft, glowing scene but ~44%
 *  fewer pixels than 2× — matters because the planet is shaded per pixel */
const MAX_PIXEL_RATIO = typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, 1.5)

// Node layout. `tone` picks the node's glow colour from the brand palette.
const NODE_DATA = [
  { x: -7, y: 2.8, z: -1.4, tone: 'soft', scale: 1.2 },
  { x: -4.2, y: -2.1, z: 0.7, tone: 'deep', scale: 1.0 },
  { x: 5.6, y: 1.4, z: -0.7, tone: 'base', scale: 1.1 },
  { x: 2.8, y: -2.8, z: 1.4, tone: 'soft', scale: 1.0 },
  { x: -1.4, y: 4.2, z: -2.1, tone: 'deep', scale: 0.8 },
  { x: 0, y: 0, z: 0, tone: 'base', scale: 1.4 }, // central planet
  { x: 7, y: -1.4, z: 0, tone: 'base', scale: 0.9 },
  { x: -5.6, y: -4.2, z: -0.7, tone: 'deep', scale: 0.9 },
  { x: 4.2, y: 4.2, z: 0.7, tone: 'soft', scale: 0.8 },
  { x: -2.8, y: 1.4, z: 2.1, tone: 'base', scale: 1.0 },
  { x: 1.4, y: -4.9, z: -1.4, tone: 'deep', scale: 0.7 },
  { x: -7.7, y: 0, z: 0, tone: 'soft', scale: 0.85 },
  { x: 8.4, y: 3.5, z: -0.4, tone: 'deep', scale: 0.9 },
  { x: -2.1, y: -2.8, z: -1.7, tone: 'base', scale: 0.75 },
  { x: 3.5, y: 0, z: 2.1, tone: 'soft', scale: 0.8 },
]

// Define which nodes are connected
const CONNECTIONS = [
  [0, 5], [0, 9], [0, 11], [1, 5], [1, 7], [1, 3],
  [2, 5], [2, 6], [2, 8], [3, 5], [3, 6], [4, 5],
  [4, 0], [5, 6], [5, 14], [7, 10], [8, 2], [9, 5],
  [10, 5], [11, 7], [12, 6], [12, 2], [13, 7], [13, 1],
  [14, 6], [14, 3],
]

// Number of particles flowing along connections
const PARTICLE_COUNT = 200

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

/** Central hub first (FMP), then others by distance from origin */
function buildNodeIntroOrder() {
  const centralIdx = CENTRAL_NODE_INDEX
  const others = NODE_DATA.map((_, i) => i)
    .filter((i) => i !== centralIdx)
    .sort((a, b) => {
      const da =
        NODE_DATA[a].x ** 2 + NODE_DATA[a].y ** 2 + NODE_DATA[a].z ** 2
      const db =
        NODE_DATA[b].x ** 2 + NODE_DATA[b].y ** 2 + NODE_DATA[b].z ** 2
      return da - db
    })
  const order = [centralIdx, ...others]
  const orderIndex = {}
  order.forEach((nodeIdx, seq) => {
    orderIndex[nodeIdx] = seq
  })
  return { orderIndex, count: order.length }
}

const INTRO_STAGGER_MS = 95
const INTRO_DURATION_MS = 420

export default function OrbitScene({ zoomProgress, onNodesIntroComplete }) {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const onNodesIntroDoneRef = useRef(onNodesIntroComplete)
  onNodesIntroDoneRef.current = onNodesIntroComplete

  const brand = useBrand()
  const brandRef = useRef(brand)
  brandRef.current = brand
  // Set by the scene effect; recolours the live scene without rebuilding it
  const applyBrandRef = useRef(null)

  useEffect(() => {
    applyBrandRef.current?.(brand)
  }, [brand])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- Scene Setup ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 12)

    // WebGL can be disabled, unsupported, or out of contexts. Fail soft: the
    // CSS backdrop still renders, and the hero text entrance starts at once.
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch (err) {
      console.warn('OrbitScene: WebGL unavailable, skipping 3D scene', err)
      onNodesIntroDoneRef.current?.()
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(MAX_PIXEL_RATIO)
    container.appendChild(renderer.domElement)

    // --- Create Glow Texture ---
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = 64
    glowCanvas.height = 64
    const glowCtx = glowCanvas.getContext('2d')
    const gradient = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.3)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    glowCtx.fillStyle = gradient
    glowCtx.fillRect(0, 0, 64, 64)
    const glowTexture = new THREE.CanvasTexture(glowCanvas)

    // --- Planet materials (shared palette / time / light uniforms) ---
    const shared = createSharedUniforms()

    // --- Create Nodes ---
    const nodeGroup = new THREE.Group()
    const nodeMeshes = []
    const satelliteGeometry = new THREE.SphereGeometry(1, 40, 28)

    const haloMaterial = () =>
      new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

    // Central planet (variant), revolving on its own; update()d every frame
    const centralPlanet = PLANETS[resolvePlanet()]({
      renderer,
      shared,
      radius: CENTRAL_RADIUS,
      camera,
    })
    const centralGroup = centralPlanet.object

    NODE_DATA.forEach((node, index) => {
      const isCentral = index === CENTRAL_NODE_INDEX
      const body = isCentral
        ? centralGroup
        : new THREE.Mesh(
            satelliteGeometry,
            createGlobeMaterial(shared, { seed: index * 7.13, land: false, contourDensity: 7 })
          )
      body.position.set(node.x, node.y, node.z)
      nodeGroup.add(body)

      // Glow sprite (additive halo; satellites' fades up with cursor proximity)
      const sprite = new THREE.Sprite(haloMaterial())
      sprite.position.copy(body.position)
      nodeGroup.add(sprite)

      nodeMeshes.push({
        mesh: body,
        // What spins on its own axis (the central planet spins itself)
        spinner: isCentral ? null : body,
        sprite,
        data: node,
        baseY: node.y,
      })
    })
    scene.add(nodeGroup)

    // --- Create Connection Lines ---
    const lineGroup = new THREE.Group()
    CONNECTIONS.forEach(([fromIdx, toIdx]) => {
      const from = NODE_DATA[fromIdx]
      const to = NODE_DATA[toIdx]
      const points = [
        new THREE.Vector3(from.x, from.y, from.z),
        new THREE.Vector3(to.x, to.y, to.z),
      ]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0,
      })
      lineGroup.add(new THREE.Line(geometry, material))
    })
    scene.add(lineGroup)

    // --- Create Flowing Particles ---
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3)
    const particleProgress = new Float32Array(PARTICLE_COUNT)
    const particleConnectionIdx = new Uint16Array(PARTICLE_COUNT)
    const particleSpeeds = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleProgress[i] = Math.random()
      particleConnectionIdx[i] = Math.floor(Math.random() * CONNECTIONS.length)
      particleSpeeds[i] = 0.001 + Math.random() * 0.004
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // --- Background Ambient Particles ---
    const ambientCount = 300
    const ambientPositions = new Float32Array(ambientCount * 3)
    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 40
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 28
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    const ambientGeometry = new THREE.BufferGeometry()
    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3))
    const ambientMaterial = new THREE.PointsMaterial({
      size: 0.015,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    scene.add(new THREE.Points(ambientGeometry, ambientMaterial))

    // --- Brand colours ---
    const applyBrand = (brandName) => {
      const palette = PLANET_PALETTES[brandName] ?? PLANET_PALETTES.violet
      applyPalette(shared, palette)
      nodeMeshes.forEach((n) => n.sprite.material.color.setHex(palette.glow[n.data.tone]))
      lineGroup.children.forEach((line) => line.material.color.setHex(palette.glow.soft))
      particleMaterial.color.setHex(palette.glow.soft)
      ambientMaterial.color.setHex(palette.glow.soft)
    }
    applyBrand(brandRef.current)
    applyBrandRef.current = applyBrand

    // --- Mouse Tracking ---
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // --- Ripple Repulsion Setup ---
    // Raycaster projects mouse onto an invisible plane at z = 0
    const raycaster = new THREE.Raycaster()
    const mouseVec = new THREE.Vector2()
    const repulsionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const mouseWorld = new THREE.Vector3() // cursor position in world space
    const hitPoint = new THREE.Vector3() // reused every frame to avoid GC churn

    // --- Orbital revolution setup ---
    // Precompute polar coords (angle + radius) for each node relative to the center
    const ORBIT_SPEED = 0.04 // radians per second — slow, elegant revolution
    const nodeOrbits = nodeMeshes.map((n) => {
      const r = Math.sqrt(n.data.x * n.data.x + n.data.y * n.data.y)
      const angle = Math.atan2(n.data.y, n.data.x)
      return { radius: r, initialAngle: angle }
    })

    // Per-node smooth offset that lerps toward target repulsion
    const repulsionOffsets = nodeMeshes.map(() => ({ x: 0, y: 0, z: 0 }))
    const REPULSION_RADIUS = 4.5  // how close cursor must be to push nodes
    const REPULSION_STRENGTH = 2.8 // max push distance
    const REPULSION_LERP = 0.06    // smoothing speed (lower = softer)

    // Per-node glow intensity (0 = idle, 1 = fully glowing)
    const glowIntensity = nodeMeshes.map(() => 0)
    const GLOW_TOUCH_RADIUS = 5.0  // how close cursor must be to trigger glow
    const GLOW_LERP_IN = 0.12      // speed to ramp up
    const GLOW_LERP_OUT = 0.04     // speed to fade back (slower for a lingering feel)

    const { orderIndex, count: introNodeCount } = buildNodeIntroOrder()
    const introTotalMs =
      Math.max(0, introNodeCount - 1) * INTRO_STAGGER_MS + INTRO_DURATION_MS
    let introDoneNotified = false

    function introEaseForNode(nodeIdx, elapsedMs) {
      const seq = orderIndex[nodeIdx]
      const startMs = seq * INTRO_STAGGER_MS
      const raw = (elapsedMs - startMs) / INTRO_DURATION_MS
      const t = Math.max(0, Math.min(1, raw))
      return easeOutCubic(t)
    }

    // --- Animation Loop ---
    let animationId
    let running = false
    let lowRes = false
    let lastFrameTime = performance.now()
    const clock = new THREE.Clock()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // The intro (nodes popping in) is timed from when the page is revealed,
    // i.e. when the preloader lifts — not from mount, which is behind it
    let introStarted = false
    const stopWaitingForIntro = onIntroDone(() => {
      clock.start()
      introStarted = true
    })

    const animate = () => {
      if (!running) return
      animationId = requestAnimationFrame(animate)
      const clockTime = introStarted ? clock.getElapsedTime() : 0
      const now = performance.now()
      const delta = (now - lastFrameTime) / 1000
      lastFrameTime = now
      // Reduced motion: no ambient motion (orbit, float, spin, pulse) and the
      // intro is shown already complete
      const elapsed = reduceMotion ? 0 : clockTime
      const elapsedMs = reduceMotion ? introTotalMs : clockTime * 1000

      // Scroll-driven zoom progress (0 → 1)
      const zoomValue = zoomProgress?.current?.value ?? 0
      const mouseInfluence = reduceMotion ? 0 : 1 - zoomValue

      // Camera follows mouse, but influence fades as we zoom in
      camera.position.x += (mouseRef.current.x * 1.5 * mouseInfluence - camera.position.x) * 0.02
      camera.position.y += (mouseRef.current.y * 1.0 * mouseInfluence - camera.position.y) * 0.02

      // Zoom the camera toward the planet, stopping just above its surface
      // (the hero's stage overlay takes over from there)
      const endZ = CENTRAL_RADIUS * ZOOM_END_DISTANCE
      camera.position.z = 12 - zoomValue * (12 - endZ)

      // Performance: the shaded planet filling the screen is the expensive
      // moment. Drop to 1× while it does (hysteresis so it can't flicker),
      // and don't draw at all once the hero's overlay fully covers the scene.
      const wantLowRes = zoomValue > (lowRes ? 0.5 : 0.55)
      if (wantLowRes !== lowRes) {
        lowRes = wantLowRes
        renderer.setPixelRatio(lowRes ? 1 : MAX_PIXEL_RATIO)
      }
      const hiddenByOverlay = zoomValue > 0.92

      shared.uTime.value = elapsed
      shared.uPixelRatio.value = renderer.getPixelRatio()
      centralPlanet.update({
        elapsed,
        delta,
        zoom: zoomValue,
        intro: introEaseForNode(CENTRAL_NODE_INDEX, elapsedMs),
        reduceMotion,
      })

      camera.lookAt(0, 0, 0)

      const centralIdx = CENTRAL_NODE_INDEX

      const introDone = elapsedMs >= introTotalMs
      if (
        introDone &&
        !introDoneNotified &&
        typeof onNodesIntroDoneRef.current === 'function'
      ) {
        introDoneNotified = true
        queueMicrotask(() => {
          onNodesIntroDoneRef.current?.()
        })
      }

      // --- Project mouse into world space for ripple repulsion ---
      mouseVec.set(mouseRef.current.x, mouseRef.current.y)
      raycaster.setFromCamera(mouseVec, camera)
      const didHit = raycaster.ray.intersectPlane(repulsionPlane, hitPoint)
      if (didHit) mouseWorld.copy(hitPoint)

      // Animate nodes — orbital revolution + gentle floating + ripple repulsion
      nodeMeshes.forEach((n, i) => {
        const introTe = introEaseForNode(i, elapsedMs)
        const orbit = nodeOrbits[i]

        // Orbital base position — revolve around center (skip central node)
        let orbitX = n.data.x
        let orbitY = n.data.y
        if (i !== centralIdx) {
          const currentAngle = orbit.initialAngle + elapsed * ORBIT_SPEED
          orbitX = Math.cos(currentAngle) * orbit.radius
          orbitY = Math.sin(currentAngle) * orbit.radius
        }

        const floatY = Math.sin(elapsed * 0.5 + i * 0.7) * 0.15
        const floatX = Math.cos(elapsed * 0.3 + i * 0.5) * 0.08

        // Base position (orbit + float, before repulsion)
        const baseX = orbitX + floatX
        const baseY = orbitY + floatY
        const baseZ = n.data.z

        // --- Ripple repulsion (skip central node) ---
        const offset = repulsionOffsets[i]
        if (i !== centralIdx && didHit) {
          const dx = baseX - mouseWorld.x
          const dy = baseY - mouseWorld.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < REPULSION_RADIUS && dist > 0.01) {
            // Strength falls off smoothly with distance
            const falloff = 1 - dist / REPULSION_RADIUS
            const strength = falloff * falloff * REPULSION_STRENGTH
            const dirX = dx / dist
            const dirY = dy / dist
            // Lerp toward target repulsion
            offset.x += (dirX * strength - offset.x) * REPULSION_LERP
            offset.y += (dirY * strength - offset.y) * REPULSION_LERP
          } else {
            // Spring back to origin
            offset.x += (0 - offset.x) * REPULSION_LERP
            offset.y += (0 - offset.y) * REPULSION_LERP
          }
        } else if (i !== centralIdx) {
          // No hit — ease back
          offset.x += (0 - offset.x) * REPULSION_LERP
          offset.y += (0 - offset.y) * REPULSION_LERP
        }

        n.mesh.position.x = baseX + offset.x
        n.mesh.position.y = baseY + offset.y
        n.mesh.position.z = baseZ + offset.z
        n.sprite.position.copy(n.mesh.position)

        // Axial rotation — satellites alternate direction for variety
        if (n.spinner) n.spinner.rotation.y = elapsed * SATELLITE_SPIN * (i % 2 === 0 ? 1 : -1)

        // --- Cursor-proximity glow ---
        if (i !== centralIdx && didHit) {
          const gdx = n.mesh.position.x - mouseWorld.x
          const gdy = n.mesh.position.y - mouseWorld.y
          const gDist = Math.sqrt(gdx * gdx + gdy * gdy)
          const targetGlow = gDist < GLOW_TOUCH_RADIUS
            ? Math.pow(1 - gDist / GLOW_TOUCH_RADIUS, 1.5)
            : 0
          const lerpSpeed = targetGlow > glowIntensity[i] ? GLOW_LERP_IN : GLOW_LERP_OUT
          glowIntensity[i] += (targetGlow - glowIntensity[i]) * lerpSpeed
        } else if (i !== centralIdx) {
          glowIntensity[i] += (0 - glowIntensity[i]) * GLOW_LERP_OUT
        }

        if (i === centralIdx) {
          n.mesh.scale.setScalar(introTe)
          n.sprite.scale.setScalar(CENTRAL_RADIUS * 4.2 * introTe)
          n.sprite.material.opacity = 0.3 * introTe * (1 - zoomValue)
        } else {
          const gi = glowIntensity[i]
          const size = n.data.scale * SATELLITE_RADIUS
          n.mesh.scale.setScalar(size * (1 + gi * SATELLITE_GROW) * introTe)
          // Glow halo is decoupled from the small planet's size so it actually reads
          n.sprite.scale.setScalar(n.data.scale * 1.2 * (1 + gi * 2.5) * introTe)
          n.sprite.material.opacity = (0.35 + gi * 0.6) * introTe
        }
      })

      // Update connection line positions to follow animated nodes
      lineGroup.children.forEach((line, idx) => {
        const [fromIdx, toIdx] = CONNECTIONS[idx]
        const fromMesh = nodeMeshes[fromIdx].mesh
        const toMesh = nodeMeshes[toIdx].mesh
        const positions = line.geometry.attributes.position.array
        positions[0] = fromMesh.position.x
        positions[1] = fromMesh.position.y
        positions[2] = fromMesh.position.z
        positions[3] = toMesh.position.x
        positions[4] = toMesh.position.y
        positions[5] = toMesh.position.z
        line.geometry.attributes.position.needsUpdate = true
        const connIntro = Math.min(
          introEaseForNode(fromIdx, elapsedMs),
          introEaseForNode(toIdx, elapsedMs)
        )
        line.material.opacity = connIntro * 0.08
      })

      // Animate flowing particles along connections
      const posArray = particles.geometry.attributes.position.array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particleProgress[i] += reduceMotion ? 0 : particleSpeeds[i]
        if (particleProgress[i] > 1) {
          particleProgress[i] = 0
          particleConnectionIdx[i] = Math.floor(Math.random() * CONNECTIONS.length)
        }

        const [fromIdx, toIdx] = CONNECTIONS[particleConnectionIdx[i]]
        const fromMesh = nodeMeshes[fromIdx].mesh
        const toMesh = nodeMeshes[toIdx].mesh
        const t = particleProgress[i]

        posArray[i * 3] = fromMesh.position.x + (toMesh.position.x - fromMesh.position.x) * t
        posArray[i * 3 + 1] = fromMesh.position.y + (toMesh.position.y - fromMesh.position.y) * t
        posArray[i * 3 + 2] = fromMesh.position.z + (toMesh.position.z - fromMesh.position.z) * t
      }
      particles.geometry.attributes.position.needsUpdate = true

      const flowReveal = Math.min(1, elapsedMs / introTotalMs)
      particleMaterial.opacity = 0.7 * flowReveal
      ambientMaterial.opacity = 0.3 * flowReveal

      if (!hiddenByOverlay) renderer.render(scene, camera)
    }

    const start = () => {
      if (running) return
      running = true
      animationId = requestAnimationFrame(animate)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(animationId)
    }

    // Only render while the hero is on screen — saves GPU/battery for the
    // rest of the visit once the user has scrolled past it.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start()
      else stop()
    })
    visibilityObserver.observe(container)
    start()

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // --- Cleanup ---
    return () => {
      stop()
      centralPlanet.dispose()
      applyBrandRef.current = null
      stopWaitingForIntro()
      visibilityObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      // Free every geometry/material on the GPU, not just a few
      scene.traverse((obj) => {
        obj.geometry?.dispose()
        obj.material?.dispose()
      })
      glowTexture.dispose()
      renderer.dispose()
      // Release the context immediately — browsers cap live WebGL contexts,
      // and dev hot reloads would otherwise pile them up
      renderer.forceContextLoss()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
    />
  )
}
