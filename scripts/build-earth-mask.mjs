/**
 * Bakes the hero globe's land mask: an equirectangular, greyscale PNG where
 * white is land and black is ocean (anti-aliased coastlines).
 *
 *   npm run build:earth   →   public/textures/earth/land.png
 *
 * Source: Natural Earth 1:50m land (public domain) via the `world-atlas`
 * package. Only needs re-running if the resolution or source changes.
 */
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { feature } from 'topojson-client'

const require = createRequire(import.meta.url)
const topology = require('world-atlas/land-50m.json')

const WIDTH = 4096
const HEIGHT = 2048
const SS = 2 // supersampling per axis, for smooth coastlines

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../public/textures/earth/land.png')

// --- Polygons (outer ring + holes), longitudes unwrapped across ±180 ---
function unwrapRing(ring) {
  const out = [[ring[0][0], ring[0][1]]]
  let shift = 0
  for (let i = 1; i < ring.length; i++) {
    const delta = ring[i][0] - ring[i - 1][0]
    if (delta > 180) shift -= 360
    else if (delta < -180) shift += 360
    out.push([ring[i][0] + shift, ring[i][1]])
  }
  // A ring that goes all the way round the globe (Antarctica) only closes
  // through the pole: add the polar edge explicitly
  const net = out[out.length - 1][0] - out[0][0]
  if (Math.abs(net) > 180) {
    const poleLat = out.reduce((s, p) => s + p[1], 0) < 0 ? -90 : 90
    out.push([out[out.length - 1][0], poleLat], [out[0][0], poleLat])
  }
  return out
}

const collection = feature(topology, topology.objects.land)
const polygons = []
for (const { geometry } of collection.features) {
  const list = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates]
  for (const polygon of list) polygons.push(polygon.map(unwrapRing))
}

// --- Scanline fill (even-odd within each polygon, so lakes stay holes) ---
const W = WIDTH * SS
const H = HEIGHT * SS
const hi = new Uint8Array(W * H)

const toX = (lon) => ((lon + 180) / 360) * W
const toY = (lat) => ((90 - lat) / 180) * H

function fillPolygon(rings, offsetX) {
  const edges = []
  let minY = Infinity
  let maxY = -Infinity
  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]
      const b = ring[(i + 1) % ring.length]
      const x0 = toX(a[0]) + offsetX
      const y0 = toY(a[1])
      const x1 = toX(b[0]) + offsetX
      const y1 = toY(b[1])
      if (y0 === y1) continue
      edges.push(x0, y0, x1, y1)
      minY = Math.min(minY, y0, y1)
      maxY = Math.max(maxY, y0, y1)
    }
  }
  const rowStart = Math.max(0, Math.floor(minY))
  const rowEnd = Math.min(H - 1, Math.ceil(maxY))
  const xs = []
  for (let row = rowStart; row <= rowEnd; row++) {
    const y = row + 0.5
    xs.length = 0
    for (let e = 0; e < edges.length; e += 4) {
      const y0 = edges[e + 1]
      const y1 = edges[e + 3]
      if ((y0 <= y && y < y1) || (y1 <= y && y < y0)) {
        const t = (y - y0) / (y1 - y0)
        xs.push(edges[e] + t * (edges[e + 2] - edges[e]))
      }
    }
    xs.sort((a, b) => a - b)
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const from = Math.max(0, Math.ceil(xs[k] - 0.5))
      const to = Math.min(W - 1, Math.floor(xs[k + 1] - 0.5))
      if (to >= from) hi.fill(255, row * W + from, row * W + to + 1)
    }
  }
}

for (const polygon of polygons) {
  // Unwrapped rings can poke past ±180: draw the wrapped copies too
  for (const offset of [-W, 0, W]) fillPolygon(polygon, offset)
}

// --- Downsample (box filter) ---
const pixels = new Uint8Array(WIDTH * HEIGHT)
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    let sum = 0
    for (let sy = 0; sy < SS; sy++) {
      for (let sx = 0; sx < SS; sx++) sum += hi[(y * SS + sy) * W + x * SS + sx]
    }
    pixels[y * WIDTH + x] = Math.round(sum / (SS * SS))
  }
}

// --- Minimal greyscale PNG encoder ---
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c
})
function crc32(buf) {
  let c = -1
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

const header = Buffer.alloc(13)
header.writeUInt32BE(WIDTH, 0)
header.writeUInt32BE(HEIGHT, 4)
header[8] = 8 // bit depth
header[9] = 0 // greyscale
// Each row: filter type 1 (Sub) — long flat runs compress to almost nothing
const raw = Buffer.alloc((WIDTH + 1) * HEIGHT)
for (let y = 0; y < HEIGHT; y++) {
  const o = y * (WIDTH + 1)
  raw[o] = 1
  for (let x = 0; x < WIDTH; x++) {
    const left = x > 0 ? pixels[y * WIDTH + x - 1] : 0
    raw[o + 1 + x] = (pixels[y * WIDTH + x] - left) & 0xff
  }
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', header),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, png)
console.log(`Wrote ${OUT} (${WIDTH}×${HEIGHT}, ${(png.length / 1024).toFixed(0)} KB)`)
