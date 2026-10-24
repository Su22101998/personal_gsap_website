/**
 * Abstract placeholder artwork standing in for project imagery until real
 * photography exists. Pure CSS, built from the brand channels, so it
 * follows the active brand (violet / noir). Decorative: hidden from
 * assistive tech.
 *
 * @param {number} seed  picks one of the compositions (wraps around)
 */

const base = 'linear-gradient(160deg, rgb(var(--c-accent-deep)) 0%, rgb(var(--c-ink)) 100%)'

const COMPOSITIONS = [
  // Orb with a fine ring
  {
    background: [
      'radial-gradient(circle at 64% 38%, rgb(var(--c-accent-soft)) 0%, rgb(var(--c-accent) / 0.55) 16%, transparent 40%)',
      base,
    ].join(','),
    ring: { size: '62%', top: '7%', left: '33%' },
  },
  // Horizon with a setting sun
  {
    background: [
      'radial-gradient(circle at 50% 62%, rgb(var(--c-accent-soft)) 0%, rgb(var(--c-accent)) 14%, transparent 15%)',
      'linear-gradient(180deg, rgb(var(--c-ink)) 0%, rgb(var(--c-accent-deep)) 61%, rgb(var(--c-ink)) 61.3%, rgb(var(--c-ink)) 100%)',
    ].join(','),
  },
  // Concentric arches
  {
    background: [
      'repeating-radial-gradient(circle at 50% 115%, rgb(var(--c-accent-soft) / 0.45) 0 1.5px, transparent 1.5px 26px)',
      'radial-gradient(circle at 50% 115%, rgb(var(--c-accent)) 0%, transparent 60%)',
      base,
    ].join(','),
  },
  // Soft conic sweep
  {
    background: [
      'conic-gradient(from 200deg at 28% 72%, rgb(var(--c-accent-soft)), rgb(var(--c-accent-deep)) 30%, rgb(var(--c-ink)) 55%, rgb(var(--c-accent)) 85%, rgb(var(--c-accent-soft)))',
    ].join(','),
    ring: { size: '40%', top: '14%', left: '48%' },
  },
  // Dot grid with a glow
  {
    background: [
      'radial-gradient(rgb(var(--c-paper) / 0.32) 1px, transparent 1.6px) 0 0 / 22px 22px',
      'radial-gradient(circle at 30% 70%, rgb(var(--c-accent)) 0%, transparent 45%)',
      base,
    ].join(','),
  },
]

export default function PlaceholderArt({ seed = 0, className = '', style }) {
  const composition = COMPOSITIONS[seed % COMPOSITIONS.length]

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ background: composition.background, ...style }}
    >
      {composition.ring && (
        <div
          className="absolute rounded-full"
          style={{
            width: composition.ring.size,
            aspectRatio: '1',
            top: composition.ring.top,
            left: composition.ring.left,
            border: '1px solid rgb(var(--c-paper) / 0.35)',
          }}
        />
      )}
    </div>
  )
}
