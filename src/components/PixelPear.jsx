/**
 * Pixel-art pear, leaning 45° to the right: one flat fill and a leaf, in
 * big chunky pixels. The tilt is drawn into the grid itself (rotating pixel
 * art would turn the square pixels into diamonds); colours follow the
 * active brand's tokens.
 *
 *   # body · l leaf
 */
const GRID = [
  '..........l.',
  '.........#ll',
  '........##..',
  '......####..',
  '..#######...',
  '.########...',
  '########....',
  '########....',
  '########....',
  '.#######....',
  '.######.....',
  '...###......',
]

const FILL = {
  '#': 'rgb(var(--c-accent-soft))',
  l: 'rgb(var(--c-paper))',
}

const W = GRID[0].length
const H = GRID.length

export default function PixelPear({ size = 32, className = '', title }) {
  return (
    <svg
      width={size}
      height={(size * H) / W}
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {GRID.flatMap((row, y) =>
        // Slightly oversized cells so no hairline gaps show between pixels
        [...row].map((c, x) =>
          FILL[c] ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={FILL[c]} /> : null
        )
      )}
    </svg>
  )
}
