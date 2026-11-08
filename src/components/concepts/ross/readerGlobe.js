/*
 * The newsletter globe: 7,500 dots on a sphere, one for every ten readers.
 *
 * - The dots gather from a loose cloud the first time the section is seen.
 * - A few at a time keep flying in from the cloud and land lit in red: new
 *   readers joining.
 * - Dots under the cursor rise off the surface and turn red.
 *
 * Loaded on demand by <ReaderGlobe> (shared.jsx). With `animate: false` it
 * draws one finished frame and stops.
 */
import * as THREE from 'three'
import gsap from 'gsap'

const COUNT = 7500
const RADIUS = 1

const vertexShader = /* glsl */ `
  attribute vec3 aCloud;
  attribute float aSeed;
  uniform float uTime;
  uniform float uGather;
  uniform float uScale;
  uniform vec3 uHit;
  uniform float uHitStrength;
  varying float vLit;
  varying float vAlpha;

  void main() {
    // Gather from the cloud, each dot on its own delay
    float g = clamp(uGather * 1.6 - aSeed * 0.6, 0.0, 1.0);
    g = 1.0 - pow(1.0 - g, 3.0);
    vec3 p = mix(aCloud, position, g);

    // Newcomers: a few dots loop in from the cloud and land lit
    float joining = step(aSeed, 0.035) * uGather;
    float t = fract(uTime * 0.07 + aSeed * 29.0);
    float land = 1.0 - pow(1.0 - smoothstep(0.0, 0.55, t), 3.0);
    p = mix(p, mix(aCloud * 1.3, position, land), joining);

    // Cursor: dots near the hit point rise off the surface
    float bump = uHitStrength * smoothstep(0.55, 0.0, distance(position, uHit));
    p += normalize(position) * bump * 0.16;

    // A sprinkling of dots twinkles red
    float twinkle = step(0.965, fract(sin(aSeed * 91.7) * 43758.5)) * (0.5 + 0.5 * sin(uTime * 1.7 + aSeed * 40.0));
    vLit = clamp(max(max(bump * 1.4, twinkle), joining * (1.0 - smoothstep(0.55, 1.0, t))), 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.4 + vLit * 1.8) * uScale / -mv.z;

    // Dots on the far side fade back
    vec3 n = normalize(normalMatrix * normalize(position));
    vAlpha = mix(0.16, 1.0, smoothstep(-0.2, 0.6, n.z)) * mix(0.35, 1.0, g);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uAccent;
  varying float vLit;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.15, r) * vAlpha;
    vec3 col = mix(vec3(0.95, 0.94, 0.92) * 0.78, uAccent, vLit);
    gl_FragColor = vec4(col, a * mix(0.6, 1.0, vLit));
  }
`

function geometry() {
  const position = new Float32Array(COUNT * 3)
  const cloud = new Float32Array(COUNT * 3)
  const seed = new Float32Array(COUNT)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < COUNT; i++) {
    // Fibonacci sphere: an even spread of dots
    const y = 1 - (i / (COUNT - 1)) * 2
    const ring = Math.sqrt(1 - y * y)
    const a = golden * i
    position.set([Math.cos(a) * ring * RADIUS, y * RADIUS, Math.sin(a) * ring * RADIUS], i * 3)
    // The cloud: the same direction, pushed out 1.6–3.6× and jittered
    const out = 1.6 + Math.random() * 2
    cloud.set(
      [Math.cos(a) * ring * out + (Math.random() - 0.5), y * out + (Math.random() - 0.5), Math.sin(a) * ring * out + (Math.random() - 0.5)],
      i * 3
    )
    seed[i] = Math.random()
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(position, 3))
  g.setAttribute('aCloud', new THREE.BufferAttribute(cloud, 3))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  return g
}

export function createReaderGlobe(container, { animate = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
  camera.position.z = 4.4

  const accent = (getComputedStyle(container).getPropertyValue('--rs-accent-rgb') || '255 59 48').trim().split(/\s+/).map(Number)
  const uniforms = {
    uTime: { value: 0 },
    uGather: { value: animate ? 0 : 1 },
    uScale: { value: 1 },
    uHit: { value: new THREE.Vector3(0, 0, 5) },
    uHitStrength: { value: 0 },
    uAccent: { value: new THREE.Color(accent[0] / 255, accent[1] / 255, accent[2] / 255) },
  }
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const globe = new THREE.Points(geometry(), material)
  globe.rotation.set(0.35, -0.6, 0)
  scene.add(globe)

  const resize = () => {
    const { width, height } = container.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Keep the whole globe in frame on tall, narrow layouts
    camera.position.z = width / height < 0.9 ? 4.4 / (width / height / 0.9) : 4.4
    camera.updateProjectionMatrix()
    uniforms.uScale.value = renderer.getDrawingBufferSize(new THREE.Vector2()).y * 0.0065
    if (!animate) renderer.render(scene, camera)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  if (!animate) {
    renderer.render(scene, camera)
    return () => {
      ro.disconnect()
      material.dispose()
      globe.geometry.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }

  // The cursor anywhere in the section steers the globe and raises the dots under it
  const section = container.closest('section') || container
  const pointer = new THREE.Vector2(0, 0)
  let pointerIn = false
  const onMove = (e) => {
    const r = renderer.domElement.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    pointerIn = true
  }
  const onLeave = () => (pointerIn = false)
  section.addEventListener('pointermove', onMove)
  section.addEventListener('pointerleave', onLeave)

  const raycaster = new THREE.Raycaster()
  const sphere = new THREE.Sphere(new THREE.Vector3(), RADIUS)
  const hit = new THREE.Vector3()
  const clock = new THREE.Clock()
  let raf = 0
  let visible = false

  const frame = () => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(clock.getDelta(), 0.05)
    uniforms.uTime.value += dt
    globe.rotation.y += dt * 0.08
    globe.rotation.x += ((pointerIn ? pointer.y * 0.25 : 0) + 0.35 - globe.rotation.x) * 0.04

    let target = 0
    if (pointerIn) {
      raycaster.setFromCamera(pointer, camera)
      if (raycaster.ray.intersectSphere(sphere, hit)) {
        uniforms.uHit.value.copy(globe.worldToLocal(hit.clone()))
        target = 1
      }
    }
    uniforms.uHitStrength.value += (target - uniforms.uHitStrength.value) * 0.08
    renderer.render(scene, camera)
  }

  // Run only while on screen; gather the first time it's seen
  let gathered = false
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    cancelAnimationFrame(raf)
    if (!visible) return
    clock.getDelta()
    raf = requestAnimationFrame(frame)
    if (!gathered) {
      gathered = true
      gsap.to(uniforms.uGather, { value: 1, duration: 2.6, ease: 'power2.out' })
    }
  })
  io.observe(container)

  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
    gsap.killTweensOf(uniforms.uGather)
    section.removeEventListener('pointermove', onMove)
    section.removeEventListener('pointerleave', onLeave)
    material.dispose()
    globe.geometry.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
}
