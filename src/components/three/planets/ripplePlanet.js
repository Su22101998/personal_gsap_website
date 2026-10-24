import * as THREE from 'three'
import { NOISE_GLSL, createAtmosphereMaterial } from '../planetShaders'

/*
 * "Ripple" hero planet: a liquid sphere that answers the cursor.
 *
 * - Hovering presses a soft dimple into the surface under the cursor and
 *   sends rings rolling outward from it — faster and stronger the faster
 *   the cursor moves, with a slow heartbeat ring when it rests.
 * - Clicking (or tapping) drops a splash: a big double ring.
 * - Rings are real geometry (vertex displacement with analytic normals), so
 *   they catch the light, bend the surface pattern and glow along their crests.
 * - Left alone, the planet makes an occasional ring of its own, as a hint.
 * - The planet leans towards the cursor and slows its spin while touched.
 *
 * Same interface as every hero planet (see OrbitScene):
 *   createRipplePlanet({ renderer, shared, radius, camera })
 *     → { object, update(frame), dispose() }
 */

const MAX_RIPPLES = 16
/** Ripple lifetime (s) — must match LIFE in the shader */
const RIPPLE_LIFE = 3.4
/** Surface displacement at full strength (× radius) */
const AMPLITUDE = 0.007

const SPIN = 0.05
/** Spin multiplier while the cursor is on the planet */
const HOVER_SPIN = 0.2

/** Spawn a trail ring after the cursor travels this far over the surface (radians) */
const TRAIL_SPACING = 0.13
/** …or this often while it rests on the surface (s) */
const HEARTBEAT = 1.3
/** With no interaction for this long (s), the planet makes its own rings */
const IDLE_AFTER = 4
const IDLE_EVERY = 2.6

const VERTEX = /* glsl */ `
  #define MAX_RIPPLES ${MAX_RIPPLES}
  uniform vec4 uRipples[MAX_RIPPLES];        // xyz: origin direction (object space), w: start time
  uniform float uRippleStrength[MAX_RIPPLES];
  uniform vec4 uHover;                       // xyz: direction under the cursor, w: 0 → 1
  uniform float uRippleTime;
  uniform float uAmplitude;

  varying vec3 vDir;          // undisplaced direction — the pattern's coordinates
  varying vec3 vObjNormal;    // rippled normal, object space (bends the pattern)
  varying vec3 vWorldNormal;  // rippled normal, world space (lighting)
  varying vec3 vSphereNormal; // undisturbed sphere normal, world space
  varying vec3 vWorldPos;
  varying float vCrest;       // > 0 on the rings' crests

  const float LIFE = ${RIPPLE_LIFE.toFixed(2)};
  const float SPEED = 0.7;         // wavefront speed, radians/s
  const float WAVENUMBER = 38.0;   // ~0.165 rad between rings
  const float PACKET = 0.09;       // width² of each ring train (~3 rings)

  float angleBetween(vec3 a, vec3 b) {
    return acos(clamp(dot(a, b), -1.0, 1.0));
  }

  // Surface height (in units of uAmplitude) at a direction on the sphere
  float field(vec3 dir, out float crest) {
    float h = 0.0;
    crest = 0.0;
    for (int i = 0; i < MAX_RIPPLES; i++) {
      float strength = uRippleStrength[i];
      if (strength <= 0.0) continue;
      float age = uRippleTime - uRipples[i].w;
      if (age < 0.0 || age > LIFE) continue;
      float d = angleBetween(dir, uRipples[i].xyz);
      float x = d - age * SPEED;
      float packet = exp(-x * x / PACKET);
      // Fades with age, spreads (weakens) with distance, and fades in over
      // the first moments so a ring never pops into existence
      float fade = strength * exp(-age * 1.35) / (1.0 + d * 2.6) * smoothstep(0.0, 0.12, age);
      float wave = sin(x * WAVENUMBER) * packet * fade;
      h += wave;
      crest += max(wave, 0.0);
    }
    // Under the cursor: a soft, shallow dimple
    float dh = angleBetween(dir, uHover.xyz);
    h += uHover.w * -0.4 * exp(-dh * dh / 0.010);
    return h;
  }

  void main() {
    vec3 dir = normalize(position);
    float crest;
    float h = field(dir, crest);

    // Analytic-ish normal: displace two nearby points and take the cross product
    vec3 helper = abs(dir.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 t1 = normalize(cross(dir, helper));
    vec3 t2 = cross(dir, t1);
    const float E = 0.008;
    float unused;
    vec3 d1 = normalize(dir + t1 * E);
    vec3 d2 = normalize(dir + t2 * E);
    float r = length(position);
    vec3 p0 = dir * (1.0 + uAmplitude * h);
    vec3 p1 = d1 * (1.0 + uAmplitude * field(d1, unused));
    vec3 p2 = d2 * (1.0 + uAmplitude * field(d2, unused));
    vec3 n = normalize(cross(p1 - p0, p2 - p0));
    if (dot(n, dir) < 0.0) n = -n;

    vec3 displaced = p0 * r;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);

    vDir = dir;
    vObjNormal = n;
    vWorldNormal = normalize(mat3(modelMatrix) * n);
    vSphereNormal = normalize(mat3(modelMatrix) * dir);
    vWorldPos = worldPos.xyz;
    vCrest = crest;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const FRAGMENT = /* glsl */ `
  uniform vec3 uOcean;
  uniform vec3 uLand;
  uniform vec3 uCoast;
  uniform vec3 uContour;
  uniform vec3 uCity;
  uniform vec3 uRim;
  uniform vec3 uLightDir;
  uniform float uTime;

  varying vec3 vDir;
  varying vec3 vObjNormal;
  varying vec3 vWorldNormal;
  varying vec3 vSphereNormal;
  varying vec3 vWorldPos;
  varying float vCrest;

  ${NOISE_GLSL}

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 S = normalize(vSphereNormal);
    vec3 L = normalize(uLightDir);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // How far the ripples tilt the surface here (0 = calm)
    float slope = clamp(length(vObjNormal - vDir) * 1.6, 0.0, 1.0);

    // Body: deep at the night side, richer where lit
    float lit = smoothstep(-0.35, 0.9, dot(S, L));
    vec3 colour = mix(uLand, uOcean, 0.25 + 0.75 * lit);

    // Flowing contour lines, refracted by the ripples passing under them
    vec3 q = vDir + (normalize(vObjNormal) - vDir) * 1.6;
    float field = fbm(q * 1.7 + vec3(0.0, uTime * 0.02, 0.0), 3);
    float isolines = field * 22.0;
    float linePx = abs(fract(isolines - 0.5) - 0.5) / max(fwidth(isolines), 1e-4);
    float lines = 1.0 - smoothstep(0.0, 1.1, linePx);
    colour += uContour * lines * (0.22 + 0.25 * slope);

    // Liquid sheen: a fake environment reflected off the rippled surface
    vec3 R = reflect(-V, N);
    float sky = smoothstep(-0.25, 0.85, R.y * 0.7 + dot(R, L) * 0.5);
    colour = mix(colour, mix(uOcean, uRim, 0.6), sky * 0.28);

    // Diffuse with the rippled normal, so every ring is shaded
    float diffuse = smoothstep(-0.3, 1.0, dot(N, L));
    colour *= 0.45 + 0.85 * diffuse;

    // Glints on the ring slopes facing the light
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 70.0);
    float sheen = pow(max(dot(N, H), 0.0), 12.0);
    colour += uCity * spec * (0.25 + 0.3 * slope) + uRim * sheen * 0.08;

    // Crests glow
    colour += uCoast * smoothstep(0.0, 0.6, vCrest) * 0.12;


    // Fresnel rim
    float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    colour += uRim * rim * (0.35 + 0.65 * smoothstep(-0.4, 0.6, dot(S, L))) * 0.9;

    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
  }
`

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]'

export function createRipplePlanet({ shared, radius, camera }) {
  const ripples = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 1, 0, -100))
  const strengths = new Float32Array(MAX_RIPPLES)
  let nextRipple = 0

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uOcean: shared.uOcean,
      uLand: shared.uLand,
      uCoast: shared.uCoast,
      uContour: shared.uContour,
      uCity: shared.uCity,
      uRim: shared.uRim,
      uLightDir: shared.uLightDir,
      uTime: shared.uTime,
      uRipples: { value: ripples },
      uRippleStrength: { value: strengths },
      uRippleTime: { value: 0 },
      uHover: { value: new THREE.Vector4(0, 0, 1, 0) },
      uAmplitude: { value: AMPLITUDE },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  })

  const object = new THREE.Group()
  const lean = new THREE.Group() // leans towards the cursor
  const tilt = new THREE.Group()
  tilt.rotation.set(0.25, 0, 0.18)
  const planet = new THREE.Mesh(new THREE.SphereGeometry(radius, 256, 192), material)
  const atmosphereMaterial = createAtmosphereMaterial(shared)
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.14, 64, 48), atmosphereMaterial)
  tilt.add(planet)
  lean.add(tilt, atmosphere)
  object.add(lean)

  // --- Pointer (own listeners: needs taps and clicks, not just mouse moves) ---
  const pointer = new THREE.Vector2()
  let pointerInside = false
  let pendingSplash = false
  const raycaster = new THREE.Raycaster()

  const toNdc = (e) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  }
  const onPointerMove = (e) => {
    toNdc(e)
    pointerInside = e.pointerType !== 'touch'
  }
  const onPointerDown = (e) => {
    if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return
    toNdc(e)
    pendingSplash = true
  }
  const onPointerLeave = () => {
    pointerInside = false
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)

  // --- State ---
  let rippleTime = 0
  let spinAngle = 0
  let spinRate = 1
  let lastSpawnTime = -10
  let lastInteraction = -10
  let lastIdleRipple = 0
  const lastSpawnDir = new THREE.Vector3(0, 0, 1)
  const hoverDir = new THREE.Vector3(0, 0, 1)
  const hitDir = new THREE.Vector3()
  const sphere = new THREE.Sphere()
  const hitPoint = new THREE.Vector3()
  const worldScale = new THREE.Vector3()
  const hoverUniform = material.uniforms.uHover.value

  const spawn = (dir, strength, delay = 0) => {
    ripples[nextRipple].set(dir.x, dir.y, dir.z, rippleTime + delay)
    strengths[nextRipple] = strength
    nextRipple = (nextRipple + 1) % MAX_RIPPLES
  }

  /** Cursor ray → direction on the planet in its own (rotating) space, or null */
  const hitTest = () => {
    raycaster.setFromCamera(pointer, camera)
    planet.getWorldPosition(sphere.center)
    planet.getWorldScale(worldScale)
    sphere.radius = radius * worldScale.x
    if (!raycaster.ray.intersectSphere(sphere, hitPoint)) return null
    return planet.worldToLocal(hitDir.copy(hitPoint)).normalize()
  }

  const randomDirection = (target) =>
    target.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize()

  return {
    object,

    update({ delta, zoom, intro, reduceMotion }) {
      rippleTime += Math.min(delta, 0.05) // no catch-up burst after a pause
      material.uniforms.uRippleTime.value = rippleTime
      atmosphereMaterial.uniforms.uStrength.value = 1 - THREE.MathUtils.smoothstep(zoom, 0.7, 0.92)

      // Interaction belongs to the hero at rest — not mid-zoom
      const interactive = !reduceMotion && intro > 0.99 && zoom < 0.25
      const hit = interactive && (pointerInside || pendingSplash) ? hitTest() : null

      if (hit) {
        lastInteraction = rippleTime
        // Trail rings as the cursor moves, scaled by how far it went…
        const travelled = hit.angleTo(lastSpawnDir)
        if (travelled > TRAIL_SPACING) {
          spawn(hit, Math.min(0.2 + travelled * 1.6, 0.5))
          lastSpawnDir.copy(hit)
          lastSpawnTime = rippleTime
        } else if (rippleTime - lastSpawnTime > HEARTBEAT) {
          // …and a slow heartbeat while it rests
          spawn(hit, 0.22)
          lastSpawnTime = rippleTime
        }
        if (pendingSplash) {
          spawn(hit, 1.0)
          spawn(hit, 0.5, 0.2)
        }
        // The dimple follows the cursor smoothly
        hoverDir.lerp(hit, 0.35).normalize()
      } else if (interactive && rippleTime - lastInteraction > IDLE_AFTER && rippleTime - lastIdleRipple > IDLE_EVERY) {
        // Untouched: an occasional ring of its own, on the side facing us
        const dir = randomDirection(new THREE.Vector3())
        const towardCamera = planet.worldToLocal(camera.position.clone()).normalize()
        if (dir.dot(towardCamera) < 0.2) dir.add(towardCamera).normalize()
        spawn(dir, 0.35)
        lastIdleRipple = rippleTime
      }
      pendingSplash = false

      const hoverTarget = hit ? 1 : 0
      hoverUniform.w += (hoverTarget - hoverUniform.w) * (hit ? 0.12 : 0.06)
      hoverUniform.x = hoverDir.x
      hoverUniform.y = hoverDir.y
      hoverUniform.z = hoverDir.z

      // Slow the spin while touched; lean gently towards the cursor
      spinRate += ((hit ? HOVER_SPIN : 1) - spinRate) * 0.05
      if (!reduceMotion) spinAngle += Math.min(delta, 0.05) * SPIN * spinRate
      planet.rotation.y = spinAngle
      const leanAmount = interactive ? hoverUniform.w : 0
      lean.rotation.x += (-pointer.y * 0.06 * leanAmount - lean.rotation.x) * 0.06
      lean.rotation.y += (pointer.x * 0.08 * leanAmount - lean.rotation.y) * 0.06
    },

    dispose() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    },
  }
}
