/**
 * Card artwork for the Authority Juice redesign in Selected Work — a cropped
 * glimpse of the page in their own palette: logo, serif headline, a 69X stat
 * and the rocket from their process section. Decorative: hidden from
 * assistive tech.
 *
 * The art layer is oversized by 8% each side for parallax (SelectedWork), so
 * content is inset ~15% to stay inside the visible card.
 */
import Image from 'next/image'
import { asset } from './content'

export default function PreviewArt({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'radial-gradient(60% 45% at 50% 42%, rgb(255 102 18 / 0.45), transparent 70%), #1a1a1a', color: '#fff' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.16) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      />

      <div className="absolute right-[15%] top-[10%] h-7 w-[70px]">
        <Image src={asset('logo.png')} alt="" fill sizes="70px" className="object-contain object-right" />
      </div>

      <p className="absolute inset-x-[15%] top-[30%] text-center font-display text-[clamp(1.7rem,2.6vw,2.6rem)] leading-[1]">
        Grow <span className="text-[#ff6612]">organic.</span>
        <br />
        Spend less on paid.
      </p>

      <div className="absolute bottom-[12%] left-[15%] rounded-2xl border border-white/10 bg-[#212121] px-4 py-3">
        <p className="text-[1.6rem] font-bold leading-none tracking-[-0.04em]">69X</p>
        <p className="mt-1 font-display text-sm">Growth in organic traffic</p>
      </div>

      <div className="absolute bottom-[12%] right-[15%] h-16 w-16 overflow-hidden rounded-full shadow-[0_0_40px_rgb(255_102_18/0.6)]">
        <Image src={asset('step-rocket.gif')} alt="" fill sizes="64px" unoptimized className="object-cover" />
      </div>
    </div>
  )
}
