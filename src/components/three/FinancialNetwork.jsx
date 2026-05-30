'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

/* =====================================================
   Three.js Financial Network Visualization
   
   Renders a 3D scene with:
   - Floating nodes representing financial entities
   - Animated connection lines between nodes
   - Flowing data particles along connections
   - Mouse-reactive camera movement
   ===================================================== */

// Hub planet billboard: visual size multiplier × NODE_DATA[CENTRAL_NODE_INDEX].scale
const CENTRAL_PLANET_VIS_MULT = 3.0
const CENTRAL_NODE_INDEX = 5

/** Orbital satellites: base visible size (very small idle) × node.scale */
const SMALL_PLANET_BASE_MULT = 0.22
/** Orbital satellites: growth factor on cursor proximity. final = base * (1 + gi * GROW) */
const SMALL_PLANET_GROW = 1.6

/** Slow in-plane spin (radians/sec) applied to SpriteMaterial.rotation */
const CENTRAL_PLANET_SPIN = 0.05
const ORBIT_PLANET_SPIN = 0.18

// Node definitions — each represents a fintech system
const NODE_DATA = [
  { label: 'Banks', x: -7, y: 2.8, z: -1.4, color: 0xa78bfa, scale: 1.2 },
  { label: 'Credit', x: -4.2, y: -2.1, z: 0.7, color: 0x7c3aed, scale: 1.0 },
  { label: 'Trading', x: 5.6, y: 1.4, z: -0.7, color: 0x8b5cf6, scale: 1.1 },
  { label: 'Invest', x: 2.8, y: -2.8, z: 1.4, color: 0xa78bfa, scale: 1.0 },
  { label: 'API', x: -1.4, y: 4.2, z: -2.1, color: 0x7c3aed, scale: 0.8 },
  { label: 'FMP', x: 0, y: 0, z: 0, color: 0x8b5cf6, scale: 1.4 },
  { label: 'User', x: 7, y: -1.4, z: 0, color: 0x8b5cf6, scale: 0.9 },
  { label: 'Data', x: -5.6, y: -4.2, z: -0.7, color: 0x7c3aed, scale: 0.9 },
  { label: 'Risk', x: 4.2, y: 4.2, z: 0.7, color: 0xa78bfa, scale: 0.8 },
  { label: 'Pay', x: -2.8, y: 1.4, z: 2.1, color: 0x8b5cf6, scale: 1.0 },
  { label: 'KYC', x: 1.4, y: -4.9, z: -1.4, color: 0x7c3aed, scale: 0.7 },
  { label: 'Ledger', x: -7.7, y: 0, z: 0, color: 0xa78bfa, scale: 0.85 },
  { label: 'Wallet', x: 8.4, y: 3.5, z: -0.4, color: 0x7c3aed, scale: 0.9 },
  { label: 'Stream', x: -2.1, y: -2.8, z: -1.7, color: 0x8b5cf6, scale: 0.75 },
  { label: 'Auth', x: 3.5, y: 0, z: 2.1, color: 0xa78bfa, scale: 0.8 },
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

export default function FinancialNetwork({ zoomProgress, onNodesIntroComplete }) {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const onIntroDoneRef = useRef(onNodesIntroComplete)
  onIntroDoneRef.current = onNodesIntroComplete

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

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

    const planetTex = new THREE.TextureLoader().load('/planet.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
    })
    const smallPlanetTex = new THREE.TextureLoader().load('/small-planet.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
    })

    // --- Create Nodes ---
    const nodeGroup = new THREE.Group()
    const nodeMeshes = []

    NODE_DATA.forEach((node, index) => {
      if (index === CENTRAL_NODE_INDEX) {
        const planetMaterial = new THREE.SpriteMaterial({
          map: planetTex,
          transparent: true,
          depthWrite: false,
        })
        const planetSprite = new THREE.Sprite(planetMaterial)
        planetSprite.position.set(node.x, node.y, node.z)
        const baseVis = node.scale * CENTRAL_PLANET_VIS_MULT
        planetSprite.scale.setScalar(baseVis)
        nodeGroup.add(planetSprite)

        const spriteMaterial = new THREE.SpriteMaterial({
          map: glowTexture,
          color: node.color,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
        })
        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.position.copy(planetSprite.position)
        sprite.scale.setScalar(node.scale * 1.5)
        nodeGroup.add(sprite)

        nodeMeshes.push({
          mesh: planetSprite,
          sprite,
          data: node,
          baseY: node.y,
        })
        return
      }

      // Orbital satellite — small-planet billboard
      const orbitMat = new THREE.SpriteMaterial({
        map: smallPlanetTex,
        transparent: true,
        depthWrite: false,
      })
      const planetSprite = new THREE.Sprite(orbitMat)
      planetSprite.position.set(node.x, node.y, node.z)
      planetSprite.scale.setScalar(node.scale * SMALL_PLANET_BASE_MULT)
      nodeGroup.add(planetSprite)

      // Glow sprite (additive halo, fades up with cursor proximity)
      const spriteMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color: node.color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.copy(planetSprite.position)
      sprite.scale.setScalar(node.scale * SMALL_PLANET_BASE_MULT * 1.4)
      nodeGroup.add(sprite)

      nodeMeshes.push({ mesh: planetSprite, sprite, data: node, baseY: node.y })
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
        color: 0xa78bfa,
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
      color: 0xa78bfa,
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
      color: 0xa78bfa,
      size: 0.015,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    scene.add(new THREE.Points(ambientGeometry, ambientMaterial))

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
    const clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const elapsedMs = elapsed * 1000

      // Scroll-driven zoom progress (0 → 1)
      const zoomValue = zoomProgress?.current?.value ?? 0
      const mouseInfluence = 1 - zoomValue

      // Camera follows mouse, but influence fades as we zoom in
      camera.position.x += (mouseRef.current.x * 1.5 * mouseInfluence - camera.position.x) * 0.02
      camera.position.y += (mouseRef.current.y * 1.0 * mouseInfluence - camera.position.y) * 0.02

      // Zoom camera deep into the central purple node
      const targetZ = 12 - zoomValue * 11.8 // 12 → 0.2
      camera.position.z += (targetZ - camera.position.z) * 0.15

      camera.lookAt(0, 0, 0)

      // Central node index (FMP — rendered as planet billboard)
      const centralIdx = CENTRAL_NODE_INDEX

      const introDone = elapsedMs >= introTotalMs
      if (
        introDone &&
        !introDoneNotified &&
        typeof onIntroDoneRef.current === 'function'
      ) {
        introDoneNotified = true
        queueMicrotask(() => {
          onIntroDoneRef.current?.()
        })
      }

      // --- Project mouse into world space for ripple repulsion ---
      mouseVec.set(mouseRef.current.x, mouseRef.current.y)
      raycaster.setFromCamera(mouseVec, camera)
      const hitPoint = new THREE.Vector3()
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

        // Slow in-plane planet spin — alternating direction per index for variety.
        const spinSpeed =
          i === centralIdx ? CENTRAL_PLANET_SPIN : ORBIT_PLANET_SPIN
        const spinDir = i % 2 === 0 ? 1 : -1
        n.mesh.material.rotation = elapsed * spinSpeed * spinDir

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
          const baseScale =
            n.data.scale *
            CENTRAL_PLANET_VIS_MULT *
            (1 + Math.sin(elapsed * 2 + i) * 0.05) *
            introTe
          const zoomScale = baseScale + zoomValue * 12 * introTe
          n.mesh.scale.setScalar(zoomScale)
          n.sprite.scale.setScalar(zoomScale * 1.6)
          n.sprite.material.opacity =
            (0.4 + zoomValue * 0.6) * introTe
        } else {
          const gi = glowIntensity[i]
          const pulse = 1 + Math.sin(elapsed * 2 + i) * 0.05
          const idleSize = n.data.scale * SMALL_PLANET_BASE_MULT * pulse
          n.mesh.scale.setScalar(idleSize * (1 + gi * SMALL_PLANET_GROW) * introTe)
          // Glow halo is decoupled from tiny planet size so it actually reads.
          n.sprite.scale.setScalar(
            n.data.scale * 1.2 * (1 + gi * 2.5) * introTe
          )
          n.sprite.material.opacity = (0.4 + gi * 0.6) * introTe
          n.mesh.material.opacity = introTe
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
        particleProgress[i] += particleSpeeds[i]
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

      renderer.render(scene, camera)
    }
    animate()

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      particleGeometry.dispose()
      ambientGeometry.dispose()
      glowTexture.dispose()
      planetTex.dispose()
      smallPlanetTex.dispose()
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
