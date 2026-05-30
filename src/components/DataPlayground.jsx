'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

/* =====================================================
   Data Visualization Playground
   
   Interactive section showcasing fintech data concepts:
   - Portfolio allocation donut chart
   - Stock ticker feed
   - Credit utilization indicator
   - Banking transaction stream
   ===================================================== */

// Mock stock ticker data
const TICKER_DATA = [
  { symbol: 'AAPL', price: '189.84', change: '+1.23%', up: true },
  { symbol: 'GOOGL', price: '141.80', change: '+0.87%', up: true },
  { symbol: 'MSFT', price: '378.91', change: '-0.32%', up: false },
  { symbol: 'AMZN', price: '178.25', change: '+2.15%', up: true },
  { symbol: 'NVDA', price: '875.28', change: '+3.42%', up: true },
  { symbol: 'META', price: '505.75', change: '-0.18%', up: false },
  { symbol: 'TSLA', price: '248.42', change: '+1.65%', up: true },
  { symbol: 'JPM', price: '196.30', change: '+0.55%', up: true },
]

const ALLOCATION_CONFIG = [
  { value: 45, color: 'var(--accent-teal)' },
  { value: 25, color: 'var(--accent-blue)' },
  { value: 15, color: 'var(--accent-purple)' },
  { value: 10, color: '#f59e0b' },
  { value: 5, color: 'var(--text-muted)' },
]

const TRANSACTION_TYPES = ['credit', 'debit', 'credit', 'debit', 'credit', 'debit']

/**
 * SVG Donut Chart for portfolio allocation.
 */
function DonutChart({ data }) {
  const chartRef = useRef(null)
  let cumulativePercent = 0

  // Build SVG arc paths
  const segments = data.map((item) => {
    const startAngle = cumulativePercent * 3.6 * (Math.PI / 180)
    cumulativePercent += item.value
    const endAngle = cumulativePercent * 3.6 * (Math.PI / 180)
    const largeArc = item.value > 50 ? 1 : 0

    const x1 = 50 + 35 * Math.sin(startAngle)
    const y1 = 50 - 35 * Math.cos(startAngle)
    const x2 = 50 + 35 * Math.sin(endAngle)
    const y2 = 50 - 35 * Math.cos(endAngle)

    return {
      ...item,
      path: `M ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2}`,
    }
  })

  useEffect(() => {
    if (!chartRef.current) return
    const paths = chartRef.current.querySelectorAll('.donut-segment')
    gsap.from(paths, {
      strokeDashoffset: 220,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: chartRef.current,
        start: 'top 80%',
      },
    })
  }, [])

  return (
    <div className="flex items-center gap-6">
      <svg ref={chartRef} viewBox="0 0 100 100" className="w-40 h-40">
        {segments.map((seg, i) => (
          <path
            key={i}
            className="donut-segment"
            d={seg.path}
            fill="none"
            stroke={seg.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset="0"
          />
        ))}
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: item.color }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            <span className="font-mono font-bold ml-auto" style={{ color: 'var(--text-primary)' }}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Credit utilization gauge.
 */
function CreditGauge() {
  const [utilization] = useState(34)
  const gaugeRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!gaugeRef.current) return
    gsap.from(gaugeRef.current, {
      '--gauge-value': '0%',
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: gaugeRef.current,
        start: 'top 80%',
      },
    })
  }, [])

  return (
    <div ref={gaugeRef} className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {t('dataPlayground.creditUtilization')}
          </p>
          <p className="text-3xl font-bold font-mono" style={{ color: 'var(--accent-teal)' }}>
            {utilization}%
          </p>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ color: '#22c55e', background: 'rgba(34,197,94,0.1)' }}
        >
          {t('dataPlayground.creditHealthy')}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${utilization}%`,
            background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-blue))',
          }}
        />
      </div>
      <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
        <span>{t('dataPlayground.creditUsed')}</span>
        <span>{t('dataPlayground.creditLimit')}</span>
      </div>
    </div>
  )
}

export default function DataPlayground() {
  const sectionRef = useRef(null)
  const [visibleTransactions, setVisibleTransactions] = useState(3)
  const { t } = useTranslation()
  const allocationData = ALLOCATION_CONFIG.map((item, i) => ({ ...item, label: t('dataPlayground.allocationLabels')[i] }))
  const transactions = t('dataPlayground.transactions').map((tx, i) => ({ ...tx, type: TRANSACTION_TYPES[i] }))

  // Auto-reveal transactions over time for streaming effect
  const showMoreTransactions = useCallback(() => {
    setVisibleTransactions((prev) => Math.min(prev + 1, transactions.length))
  }, [transactions.length])

  useEffect(() => {
    const interval = setInterval(showMoreTransactions, 2000)
    return () => clearInterval(interval)
  }, [showMoreTransactions])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.playground-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      gsap.from('.playground-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="data" className="section-padding relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="playground-title text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
            style={{ color: 'var(--accent-teal)', background: 'var(--glow-color)' }}
          >
            {t('dataPlayground.sectionLabel')}
          </span>
          <h2 className="heading-section mb-4">
            {t('dataPlayground.heading')}{' '}
            <span className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--accent-blue)] bg-clip-text text-transparent">
              {t('dataPlayground.headingAccent')}
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            {t('dataPlayground.description')}
          </p>
        </div>

        {/* Stock Ticker */}
        <div
          className="playground-card mb-8 rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <div className="relative overflow-hidden py-3">
            <div className="flex animate-ticker" style={{ width: 'max-content' }}>
              {[...TICKER_DATA, ...TICKER_DATA].map((stock, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-6 border-r"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {stock.symbol}
                  </span>
                  <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                    ${stock.price}
                  </span>
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: stock.up ? '#22c55e' : '#ef4444' }}
                  >
                    {stock.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Widgets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Portfolio Allocation */}
          <div className="playground-card fintech-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
              {t('dataPlayground.portfolioTitle')}
            </h3>
            <DonutChart data={allocationData} />
          </div>

          {/* Credit Utilization */}
          <div className="playground-card fintech-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
              {t('dataPlayground.creditTitle')}
            </h3>
            <CreditGauge />

            {/* Mini credit cards */}
            <div className="mt-4 flex gap-2">
              {t('dataPlayground.cardBrands').map((card, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-lg p-3 text-[10px]"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))'
                      : 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                  }}
                >
                  <div className="text-white/70 mb-1">{card}</div>
                  <div className="text-white font-mono font-bold">
                    •••• {i === 0 ? '4589' : '7721'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Stream */}
          <div className="playground-card fintech-card p-6 md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
              {t('dataPlayground.transactionsTitle')}
            </h3>
            <div className="space-y-2 max-h-60 overflow-hidden">
              {transactions.slice(0, visibleTransactions).map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-500"
                  style={{
                    background: 'var(--bg-secondary)',
                    animation: i === visibleTransactions - 1 ? 'fadeInUp 0.5s ease-out' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                      style={{
                        background: tx.type === 'credit' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: tx.type === 'credit' ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {tx.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {tx.desc}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {tx.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: tx.type === 'credit' ? '#22c55e' : '#ef4444' }}
                  >
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
