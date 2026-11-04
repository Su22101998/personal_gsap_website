/*
 * The book as a CSS 3D object (front cover, spine, page edges, back),
 * rebuilt from the real cover. Whoever renders it animates its rotation.
 */

// Starburst lines for the cover, generated once
const BURST = Array.from({ length: 60 }, (_, i) => {
  const a = (i / 60) * Math.PI * 2 + (i % 3) * 0.07
  const r = 40 + ((i * 53) % 70)
  return `M100 100 L${(100 + Math.cos(a) * r).toFixed(1)} ${(100 + Math.sin(a) * r).toFixed(1)}`
}).join(' ')

function BookCover() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-r-[4px] bg-[#0b0b0b] px-5 py-6 text-center">
      <svg viewBox="0 0 200 200" className="absolute inset-0 m-auto h-[90%] w-[90%] opacity-60" aria-hidden="true">
        <path d={BURST} stroke="#d8d8d8" strokeWidth="0.35" fill="none" />
        <circle cx="100" cy="100" r="9" fill="#fff" opacity="0.5" />
      </svg>
      <span className="relative text-[8px] italic tracking-wide text-white/70">How great creators spread their ideas and how you can too</span>
      <span className="rs-display relative text-[34px] uppercase leading-[0.95] tracking-[0.04em] text-[#f6c445]">
        Create once, distribute forever
      </span>
      <span className="rs-display relative text-[13px] uppercase tracking-[0.2em] text-[#f6c445]">Ross Simmonds</span>
    </div>
  )
}

export default function Book3D({ className = '' }) {
  return (
    <div className={`relative h-[420px] w-[280px] [transform-style:preserve-3d] ${className}`} role="img" aria-label="Create Once, Distribute Forever by Ross Simmonds">
      {/* Front */}
      <div className="absolute inset-0 [backface-visibility:hidden] [transform:translateZ(22px)]">
        <BookCover />
      </div>
      {/* Spine */}
      <div className="absolute inset-y-0 left-0 flex w-[44px] items-center justify-center bg-[#151515] [transform:translateZ(-22px)_rotateY(-90deg)] [transform-origin:left_center]">
        <span className="rs-display whitespace-nowrap text-[12px] uppercase tracking-[0.2em] text-[#f6c445] [writing-mode:vertical-rl]">
          Create Once, Distribute Forever
        </span>
      </div>
      {/* Page edges */}
      <div className="absolute inset-y-[6px] left-full w-[44px] bg-[repeating-linear-gradient(90deg,#e8e4da_0_1px,#cfcabd_1px_2px)] [transform:translateZ(22px)_rotateY(90deg)] [transform-origin:left_center]" />
      {/* Back */}
      <div className="absolute inset-0 rounded-l-[4px] bg-[#111] [transform:rotateY(180deg)_translateZ(22px)]" />
    </div>
  )
}
