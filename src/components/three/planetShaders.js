import * as THREE from 'three'

/*
 * Materials for the hero's night-side globe. Continents come from a baked
 * land mask (public/textures/earth/land.png, see scripts/build-earth-mask.mjs);
 * everything else — ocean contours, coastlines, city lights, markers, orbits —
 * is procedural. All materials read their colours from one shared uniform set,
 * so switching brand recolours the whole scene at once.
 */

export const LAND_MASK_URL = '/textures/earth/land.png'

/** Per-brand globe colours and glow tones. */
export const PLANET_PALETTES = {
  violet: {
    ocean: 0x17134a,
    land: 0x09071c,
    coast: 0xb9a2ff,
    contour: 0x7a5ff0,
    city: 0xebe3ff,
    rim: 0x8b6cff,
    glow: { soft: 0xa78bfa, base: 0x8b5cf6, deep: 0x7c3aed },
  },
  noir: {
    ocean: 0x221a10,
    land: 0x0a0805,
    coast: 0xe6c991,
    contour: 0x9a7740,
    city: 0xffe2a6,
    rim: 0xd9b97a,
    glow: { soft: 0xe2cfa6, base: 0xc9a96e, deep: 0x8c6c38 },
  },
}

/**
 * Uniforms shared by every material (by reference — update once, applies
 * everywhere): palette, time, light direction and the land mask.
 */
export function createSharedUniforms() {
  return {
    uOcean: { value: new THREE.Color() },
    uLand: { value: new THREE.Color() },
    uCoast: { value: new THREE.Color() },
    uContour: { value: new THREE.Color() },
    uCity: { value: new THREE.Color() },
    uRim: { value: new THREE.Color() },
    uTime: { value: 0 },
    // Key light from the upper left, fairly side-on so the terminator
    // crosses the disc and the globe reads as round
    uLightDir: { value: new THREE.Vector3(-0.85, 0.4, 0.45).normalize() },
    uLandMap: { value: null },
    // 0 → 1 once the land mask has loaded (continents fade in)
    uLandReady: { value: 0 },
    // Pixel ratio, for sizing point sprites
    uPixelRatio: { value: 1 },
  }
}

export function applyPalette(shared, palette) {
  shared.uOcean.value.setHex(palette.ocean)
  shared.uLand.value.setHex(palette.land)
  shared.uCoast.value.setHex(palette.coast)
  shared.uContour.value.setHex(palette.contour)
  shared.uCity.value.setHex(palette.city)
  shared.uRim.value.setHex(palette.rim)
}

/** Lon/lat (degrees) → point on a sphere, matching THREE.SphereGeometry's UVs. */
export function lonLatToVector3(lon, lat, radius, target = new THREE.Vector3()) {
  const lonR = THREE.MathUtils.degToRad(lon)
  const latR = THREE.MathUtils.degToRad(lat)
  return target.set(
    Math.cos(latR) * Math.cos(lonR) * radius,
    Math.sin(latR) * radius,
    -Math.cos(latR) * Math.sin(lonR) * radius
  )
}

export const NOISE_GLSL = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // Smooth 3D value noise
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }

  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * noise(p);
      p = p * 2.03 + vec3(1.7, 9.2, 3.1);
      amplitude *= 0.5;
    }
    return value;
  }
`

/** How far the continents stand proud of the ocean (× globe radius) */
export const LAND_HEIGHT = 0.032

const GLOBE_VERTEX = /* glsl */ `
  #ifdef HAS_LAND
    uniform sampler2D uLandMap;
    uniform float uLandReady;
    uniform float uLandHeight;
  #endif

  varying vec2 vUv;
  varying vec3 vObjPos;      // object space, undisplaced — patterns turn with the mesh
  varying vec3 vWorldPos;    // displaced — for faceted wall normals
  varying vec3 vWorldNormal; // smooth sphere normal, for lighting
  varying vec3 vViewNormal;  // for the rim
  varying vec3 vViewPos;

  void main() {
    vUv = uv;
    vObjPos = position;
    vec3 displaced = position;
    #ifdef HAS_LAND
      // Extrude the continents: steep walls wherever the mask crosses 0.5
      float landHere = smoothstep(0.3, 0.7, textureLod(uLandMap, uv, 2.0).r);
      displaced *= 1.0 + uLandHeight * landHere * uLandReady;
    #endif
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewNormal = normalize(normalMatrix * normal);
    vec4 viewPos = viewMatrix * worldPos;
    vViewPos = viewPos.xyz;
    gl_Position = projectionMatrix * viewPos;
  }
`

const GLOBE_FRAGMENT = /* glsl */ `
  uniform vec3 uOcean;
  uniform vec3 uLand;
  uniform vec3 uCoast;
  uniform vec3 uContour;
  uniform vec3 uRim;
  uniform vec3 uLightDir;
  uniform float uTime;
  uniform float uSeed;
  uniform float uContourDensity;
  #ifdef HAS_LAND
    uniform sampler2D uLandMap;
    uniform float uLandReady;
  #endif

  varying vec2 vUv;
  varying vec3 vObjPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vViewNormal;
  varying vec3 vViewPos;

  ${NOISE_GLSL}

  void main() {
    vec3 n = normalize(vObjPos);
    vec3 sphereNormal = normalize(vWorldNormal);

    float land = 0.0;   // 1 on land (filtered for the current screen size)
    float shelf = 0.0;  // wide soft falloff around coasts
    float coast = 0.0;  // thin anti-aliased coastline
    float wall = 0.0;   // 1 on the extruded continents' side walls
    vec3 facetNormal = sphereNormal;
    #ifdef HAS_LAND
      land = texture(uLandMap, vUv, 0.5).r;
      shelf = textureLod(uLandMap, vUv, 5.0).r;
      // Distance to the 0.5 iso-line in screen pixels → a ~1.5px line at any zoom
      float coastPx = abs(land - 0.5) / max(fwidth(land), 1e-4);
      coast = 1.0 - smoothstep(0.0, 1.5, coastPx);
      land *= uLandReady;
      shelf *= uLandReady;
      coast *= uLandReady;
      // The real (faceted) surface normal tells the walls from the tops
      facetNormal = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
      if (dot(facetNormal, sphereNormal) < 0.0) facetNormal = -facetNormal;
      wall = (1.0 - smoothstep(0.6, 0.9, dot(facetNormal, sphereNormal))) * uLandReady;
    #endif

    // Ocean: slowly drifting topographic contour lines, patchy like weather.
    // The noise is the expensive part, so skip it inland. (Branching on the
    // blurred mask keeps the branch edge well away from the coast, where
    // contours are faded out anyway — fwidth is unreliable across it.)
    vec3 p = n * 1.6 + uSeed;
    float height = 0.5;
    float contour = 0.0;
    float grid = 0.0;
    if (shelf < 0.97) {
      float drift = uTime * 0.02;
      vec2 warp = vec2(
        fbm(p + vec3(0.0, 0.0, drift), 2),
        fbm(p + vec3(5.2, 1.3, 2.8 - drift), 2)
      );
      height = fbm(p * 1.3 + vec3(warp * 1.8, 0.0), 4);
      float isolines = height * uContourDensity;
      float linePx = abs(fract(isolines - 0.5) - 0.5) / max(fwidth(isolines), 1e-4);
      contour = 1.0 - smoothstep(0.0, 1.2, linePx);
      float patches = smoothstep(0.3, 0.7, noise(p * 1.4 + 7.3));
      contour *= (0.25 + 0.75 * patches) * (1.0 - land) * (1.0 - smoothstep(0.05, 0.6, shelf));

      // Very fine 0.5° lat/long mesh over the water — a sheen at a distance,
      // faded out where it would be denser than a few pixels
      vec2 g = vUv * vec2(720.0, 360.0);
      vec2 gw = fwidth(g);
      vec2 gd = abs(fract(g - 0.5) - 0.5) / max(gw, vec2(1e-4));
      grid = 1.0 - smoothstep(0.0, 1.0, min(gd.x, gd.y));
      grid *= (1.0 - smoothstep(0.15, 0.5, max(gw.x, gw.y))) * (1.0 - land);
    }

    vec3 ocean = uOcean * (0.8 + 0.4 * height);
    ocean += uCoast * shelf * 0.1; // shallow water glows faintly near land
    vec3 landColour = uLand * (0.85 + 0.3 * noise(n * 14.0 + uSeed));
    vec3 colour = mix(ocean, landColour, land);
    colour += uContour * contour * 0.55;
    colour += uRim * grid * 0.07;

    // Soft "wrap" lighting with a dim night side
    float diffuse = dot(sphereNormal, normalize(uLightDir));
    float light = smoothstep(-0.35, 1.0, diffuse);
    colour *= 0.4 + light * 0.9;

    // Walls catch the light like cut glass on the side facing it
    float wallLight = max(dot(facetNormal, normalize(uLightDir)), 0.0);
    vec3 wallColour = uLand * 1.4 + uCoast * (0.06 + 0.5 * wallLight * wallLight);
    colour = mix(colour, wallColour, wall);

    // Coastlines glow regardless of light — the defining detail at night
    colour += uCoast * coast * (0.45 + 0.4 * light) * (1.0 - wall * 0.5);

    // Fresnel rim, strongest on the lit side
    vec3 viewDir = normalize(-vViewPos);
    float rim = pow(1.0 - max(dot(normalize(vViewNormal), viewDir), 0.0), 3.0);
    colour += uRim * rim * (0.25 + 0.75 * smoothstep(-0.4, 0.6, diffuse)) * 0.85;

    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
  }
`

/**
 * Globe surface. With `land`, continents come from the shared land mask and
 * are extruded (the geometry needs enough segments to resolve coastlines);
 * without, it is all contoured ocean (used for the small orbiting moons).
 */
export function createGlobeMaterial(shared, { seed = 0, land = true, contourDensity = 16 } = {}) {
  return new THREE.ShaderMaterial({
    defines: land ? { HAS_LAND: '' } : {},
    uniforms: {
      ...shared,
      uSeed: { value: seed },
      uContourDensity: { value: contourDensity },
      uLandHeight: { value: LAND_HEIGHT },
    },
    vertexShader: GLOBE_VERTEX,
    fragmentShader: GLOBE_FRAGMENT,
  })
}

/**
 * Contour lines floating in a shell just above the surface — they drift
 * past the globe's silhouette, strongest towards the limb.
 */
export function createContourShellMaterial(shared, { seed = 11.7 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uContour: shared.uContour,
      uRim: shared.uRim,
      uTime: shared.uTime,
      uSeed: { value: seed },
      uOpacity: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vObjPos;
      varying vec3 vViewNormal;
      varying vec3 vViewPos;
      void main() {
        vObjPos = position;
        vViewNormal = normalize(normalMatrix * normal);
        vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = viewPos.xyz;
        gl_Position = projectionMatrix * viewPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uContour;
      uniform vec3 uRim;
      uniform float uTime;
      uniform float uSeed;
      uniform float uOpacity;
      varying vec3 vObjPos;
      varying vec3 vViewNormal;
      varying vec3 vViewPos;

      ${NOISE_GLSL}

      void main() {
        vec3 n = normalize(vObjPos);
        vec3 p = n * 1.4 + uSeed + vec3(0.0, uTime * 0.015, 0.0);
        float field = fbm(p, 3);
        float isolines = field * 18.0;
        float linePx = abs(fract(isolines - 0.5) - 0.5) / max(fwidth(isolines), 1e-4);
        float line = 1.0 - smoothstep(0.0, 1.1, linePx);
        // Only in a few drifting clusters, like weather systems
        float cluster = smoothstep(0.42, 0.68, noise(n * 1.8 + uSeed * 0.5 - uTime * 0.01));
        // Strongest towards the silhouette, where the shell is seen edge-on
        float edgeOn = 1.0 - abs(dot(normalize(vViewNormal), normalize(-vViewPos)));
        float alpha = min(line * cluster * (0.45 + 1.6 * edgeOn * edgeOn), 1.0) * uOpacity;
        // Lighter than the ocean beneath, so the lines read against it
        gl_FragColor = vec4(mix(uRim, vec3(1.0), 0.4) * 1.2 * alpha, alpha);
        #include <colorspace_fragment>
      }
    `,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

/** Atmosphere: a slightly larger back-face shell with an additive glow. */
export function createAtmosphereMaterial(shared) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRim: shared.uRim,
      uLightDir: shared.uLightDir,
      uStrength: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vViewNormal;
      varying vec3 vViewPos;
      varying vec3 vWorldNormal;
      void main() {
        vViewNormal = normalize(normalMatrix * normal);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = viewPos.xyz;
        gl_Position = projectionMatrix * viewPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRim;
      uniform vec3 uLightDir;
      uniform float uStrength;
      varying vec3 vViewNormal;
      varying vec3 vViewPos;
      varying vec3 vWorldNormal;
      void main() {
        vec3 viewDir = normalize(-vViewPos);
        // Back faces: brightest right at the silhouette, fading outward
        float edge = pow(clamp(0.62 + dot(normalize(vViewNormal), viewDir), 0.0, 1.0), 3.5);
        float lit = 0.35 + 0.65 * smoothstep(-0.5, 0.7, dot(normalize(-vWorldNormal), normalize(uLightDir)));
        float alpha = edge * lit * uStrength;
        gl_FragColor = vec4(uRim * alpha, alpha);
        #include <colorspace_fragment>
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })
}

/**
 * City lights: glowing, twinkling point sprites sitting just above the land.
 * Geometry needs `aSize` and `aSeed` attributes.
 */
export function createCityLightsMaterial(shared) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCity: shared.uCity,
      uTime: shared.uTime,
      uPixelRatio: shared.uPixelRatio,
      uOpacity: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vTwinkle;
      varying float vFacing;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec3 viewNormal = normalize(normalMatrix * normalize(position));
        vFacing = dot(viewNormal, normalize(-mvPosition.xyz));
        vTwinkle = 0.7 + 0.3 * sin(uTime * (1.2 + aSeed * 2.5) + aSeed * 40.0);
        gl_PointSize = min(aSize * uPixelRatio * (14.0 / -mvPosition.z), 28.0 * uPixelRatio);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uCity;
      uniform float uOpacity;
      varying float vTwinkle;
      varying float vFacing;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 2.0);
        float core = 1.0 - smoothstep(0.08, 0.2, d);
        // Fade out towards the limb so lights don't pile up at the edge
        float alpha = (glow * 0.75 + core) * vTwinkle * smoothstep(0.0, 0.35, vFacing) * uOpacity;
        gl_FragColor = vec4(mix(uCity, vec3(1.0), core * 0.6) * alpha, alpha);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

/**
 * Location markers: a bright dot with a ring that pulses outward.
 * Geometry needs an `aSeed` attribute (offsets each pulse).
 */
export function createMarkerMaterial(shared) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRim: shared.uRim,
      uTime: shared.uTime,
      uPixelRatio: shared.uPixelRatio,
      uOpacity: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uPixelRatio;
      varying float vSeed;
      varying float vFacing;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec3 viewNormal = normalize(normalMatrix * normalize(position));
        vFacing = dot(viewNormal, normalize(-mvPosition.xyz));
        vSeed = aSeed;
        gl_PointSize = min(uPixelRatio * (440.0 / -mvPosition.z), 140.0 * uPixelRatio);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRim;
      uniform float uTime;
      uniform float uOpacity;
      varying float vSeed;
      varying float vFacing;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float px = fwidth(d);
        float core = 1.0 - smoothstep(0.045 - px, 0.045 + px, d);
        float coreGlow = pow(1.0 - smoothstep(0.0, 0.16, d), 2.0) * 0.6;
        // Static ring + one that expands and fades
        float ring = (1.0 - smoothstep(0.0, px * 1.5, abs(d - 0.2))) * 0.55;
        float phase = fract(uTime * 0.35 + vSeed);
        float pulse = (1.0 - smoothstep(0.0, px * 2.0, abs(d - mix(0.06, 0.48, phase)))) * (1.0 - phase);
        float alpha = (core + coreGlow + ring + pulse * 0.8) * smoothstep(0.05, 0.4, vFacing) * uOpacity;
        vec3 colour = mix(uRim, vec3(1.0), core * 0.9 + 0.35);
        gl_FragColor = vec4(colour * alpha, alpha);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

/**
 * Orbit path: a faint loop with a bright comet travelling along it.
 * Geometry needs an `aAlong` attribute (0 → 1 around the loop).
 */
export function createOrbitLineMaterial(shared, { speed = 0.05, offset = 0, base = 0.14 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRim: shared.uRim,
      uTime: shared.uTime,
      uSpeed: { value: speed },
      uOffset: { value: offset },
      uBase: { value: base },
      uOpacity: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute float aAlong;
      varying float vAlong;
      void main() {
        vAlong = aAlong;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRim;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uOffset;
      uniform float uBase;
      uniform float uOpacity;
      varying float vAlong;
      void main() {
        float s = fract(vAlong - uTime * uSpeed - uOffset);
        float comet = pow(s, 14.0);
        float alpha = (uBase + (1.0 - uBase) * comet) * uOpacity;
        gl_FragColor = vec4(mix(uRim, vec3(1.0), 0.4 + comet * 0.5) * alpha, alpha);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}
