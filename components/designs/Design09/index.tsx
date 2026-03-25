'use client'
import { useRef, useEffect } from 'react'

/* ─── types ─────────────────────────────────────────── */
interface StatItem {
  value: string
  numericValue: number
  suffix: string
  label: string
}

/* ─── data ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '◆',
    title: 'AI Documentation',
    bullets: ['Dictation & transcription', 'Auto-generated reports', 'DSM-V structured notes', 'Multiple languages'],
  },
  {
    icon: '▦',
    title: 'Practice Management',
    bullets: ['Client dossiers', 'Secure video consults', 'Appointment scheduling', 'Client portal'],
  },
  {
    icon: '◈',
    title: 'Communication',
    bullets: ['Care Chat (E2E encrypted)', 'Secure messaging', 'Client notifications', 'GP letter generation'],
  },
  {
    icon: '◇',
    title: 'HR & People Ops',
    bullets: ['Leave management', 'Absence tracking', 'Onboarding checklists', 'Schedule overview'],
  },
  {
    icon: '▣',
    title: 'Analytics & Finance',
    bullets: ['Finance dashboard', 'Declarability tracking', 'Custom KPI reporting', 'Billing & invoicing'],
  },
  {
    icon: '◎',
    title: 'Security & Compliance',
    bullets: ['NEN 7510 compliant', 'GDPR-ready', 'End-to-end encryption', 'Dutch hosting'],
  },
]

const STATS: StatItem[] = [
  { value: '25', numericValue: 25, suffix: '', label: 'minutes saved per session' },
  { value: '500K', numericValue: 500, suffix: 'K', label: 'AI tokens per month' },
  { value: '99', numericValue: 99, suffix: '%', label: 'transcription accuracy' },
  { value: '29', numericValue: 29, suffix: '', label: '€ per seat, per month' },
]

const PERSONAS = [
  {
    title: 'Practice Owner',
    description: 'Full visibility into finances, HR, and operations',
    items: ['Finance Dashboard', 'Declarability', 'Custom KPIs', 'Billing'],
  },
  {
    title: 'Therapist',
    description: 'Focus on clients, not paperwork',
    items: ['AI Dictation', 'Session Reports', 'Care Chat', 'Scheduling'],
  },
  {
    title: 'HR Manager',
    description: 'Streamline people operations',
    items: ['Leave Management', 'Absence Tracking', 'Onboarding Checklists', 'Schedule Overview'],
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: '€19',
    period: 'per seat / month',
    features: ['AI Dictation (basic)', 'Session notes', 'Client portal', 'Email support'],
    recommended: false,
  },
  {
    name: 'Pro',
    price: '€29',
    period: 'per seat / month',
    features: ['Everything in Starter', 'Secure video calls', 'HR management', 'Analytics dashboard', 'Care Chat', 'Priority support'],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored pricing',
    features: ['Everything in Pro', 'Custom integrations', 'OZIS / ZorgDomein', 'Dedicated support', 'SLA guarantee'],
    recommended: false,
  },
]

const SECTION_LABELS = ['Hero', 'Philosophy', 'Platform', 'AI in Action', 'Numbers', "Who It's For", 'Pricing', 'Footer']

/* ─── component ──────────────────────────────────────── */
export default function Design09() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const statRefs = useRef<(HTMLSpanElement | null)[]>([])
  const aiSectionRef = useRef<HTMLElement | null>(null)
  const numberEls = useRef<(HTMLSpanElement | null)[]>([])

  /* ── stamp-in: scale(1.02) → scale(1) on scroll ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const stampEls = containerRef.current?.querySelectorAll<HTMLElement>('.d09lp-stamp')
    if (!stampEls) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.style.transform = 'scale(1)'
            el.style.opacity = '1'
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    stampEls.forEach((el) => {
      el.style.transform = 'scale(1.02)'
      el.style.opacity = '0'
      el.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease'
      obs.observe(el)
    })

    return () => obs.disconnect()
  }, [])

  /* ── stat counter with ease-out quart ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = parseInt((entry.target as HTMLElement).dataset.statIdx ?? '0')
          const stat = STATS[idx]
          const el = statRefs.current[idx]
          if (!stat || !el) return

          if (prefersReduced) {
            el.textContent = stat.value
            obs.unobserve(entry.target)
            return
          }

          const end = stat.numericValue
          const duration = 1400
          const startTime = performance.now()

          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            const current = Math.round(end * eased)
            el.textContent = current + stat.suffix
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.unobserve(entry.target)
        })
      },
      { threshold: 0.5 }
    )

    statRefs.current.forEach((ref) => {
      if (ref?.parentElement) obs.observe(ref.parentElement)
    })

    return () => obs.disconnect()
  }, [])

  /* ── section number active state ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = parseInt((entry.target as HTMLElement).dataset.sectionIdx ?? '0')
          numberEls.current.forEach((el, i) => {
            if (!el) return
            el.style.color = i === idx ? '#3a3a3a' : '#d0cdc6'
            el.style.opacity = i === idx ? '1' : '0.6'
          })
        })
      },
      { threshold: 0.4 }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) obs.observe(ref)
    })

    return () => obs.disconnect()
  }, [])

  /* ── AI stages sequential reveal ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const section = aiSectionRef.current
    if (!section) return

    const stages = section.querySelectorAll<HTMLElement>('.d09lp-ai-stage')

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        stages.forEach((stage, i) => {
          setTimeout(() => {
            stage.style.opacity = '1'
            stage.style.transform = 'translateY(0)'
          }, i * 520)
        })
        obs.unobserve(section)
      },
      { threshold: 0.25 }
    )

    stages.forEach((stage) => {
      stage.style.opacity = '0'
      stage.style.transform = 'translateY(22px)'
      stage.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)'
    })

    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  const setSectionRef = (idx: number) => (el: HTMLElement | null) => {
    sectionRefs.current[idx] = el
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');

        /* ── reset & base ── */
        .d09lp * { box-sizing: border-box; margin: 0; padding: 0; }

        .d09lp {
          background: #f3f0ea;
          color: #2d2d2d;
          font-family: 'Crimson Pro', Georgia, 'Times New Roman', serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ── paper texture: SVG feTurbulence fixed overlay ── */
        .d09lp-texture {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }

        /* ── left fixed section numbers ── */
        .d09lp-sidenav {
          position: fixed;
          left: 28px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .d09lp-sidenav-num {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: #d0cdc6;
          opacity: 0.6;
          letter-spacing: 0.04em;
          line-height: 1;
          transition: color 0.35s ease, opacity 0.35s ease;
          cursor: default;
          user-select: none;
          display: block;
        }

        /* ── shared layout ── */
        .d09lp-section {
          position: relative;
          padding: 120px 80px;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── copper rule ── */
        .d09lp-rule {
          width: 48px;
          height: 2px;
          background: #a0785a;
          margin-bottom: 32px;
          flex-shrink: 0;
        }

        /* ── kicker ── */
        .d09lp-kicker {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #a0785a;
          margin-bottom: 24px;
          display: block;
        }

        /* ─────────────────────────────────────────
           §1 HERO
        ───────────────────────────────────────── */
        .d09lp-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 160px 80px 120px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .d09lp-hero-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(4rem, 9vw, 8.5rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: #3a3a3a;
          text-shadow:
            1px 1px 2px rgba(255,255,255,0.55),
            -1px -1px 1px rgba(0,0,0,0.08);
          margin-bottom: 40px;
          max-width: 860px;
        }

        .d09lp-hero-headline em {
          font-style: italic;
          color: #a0785a;
          text-shadow:
            1px 1px 2px rgba(255,255,255,0.4),
            -1px -1px 1px rgba(80,40,10,0.12),
            0 0 40px rgba(160,120,90,0.18);
        }

        .d09lp-hero-sub {
          font-size: 1.3rem;
          color: rgba(45,45,45,0.65);
          line-height: 1.65;
          max-width: 540px;
          margin-bottom: 52px;
          font-weight: 400;
        }

        .d09lp-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 36px;
          border: 1.5px solid #a0785a;
          color: #2d2d2d;
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 0.25s, color 0.25s, box-shadow 0.25s;
          background: transparent;
          cursor: pointer;
        }

        .d09lp-hero-cta:hover {
          background: #a0785a;
          color: #f3f0ea;
          box-shadow: 0 4px 24px rgba(160,120,90,0.28);
        }

        /* ─────────────────────────────────────────
           §2 PHILOSOPHY
        ───────────────────────────────────────── */
        .d09lp-philosophy {
          max-width: 640px;
          margin: 0 auto;
          padding: 120px 40px;
        }

        .d09lp-philosophy p {
          font-size: 1.2rem;
          line-height: 1.8;
          color: rgba(45,45,45,0.8);
          margin-bottom: 2.5rem;
        }

        .d09lp-philosophy p:last-child { margin-bottom: 0; }

        /* ─────────────────────────────────────────
           §3 PLATFORM — feature grid
        ───────────────────────────────────────── */
        .d09lp-section-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          color: #2d2d2d;
          line-height: 1.15;
          max-width: 520px;
          text-shadow:
            1px 1px 2px rgba(255,255,255,0.5),
            -1px -1px 1px rgba(0,0,0,0.06);
          margin-bottom: 0;
        }

        .d09lp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-top: 56px;
        }

        .d09lp-card {
          padding: 32px 32px 28px;
          background: #f3f0ea;
          box-shadow:
            inset 0 0 0 1px #d0cdc6,
            2px 2px 4px rgba(0,0,0,0.05),
            inset 1px 1px 2px rgba(255,255,255,0.5);
          transition: box-shadow 0.35s ease, transform 0.3s ease;
        }

        .d09lp-card:hover {
          box-shadow:
            inset 0 0 0 1px #a0785a,
            3px 3px 8px rgba(0,0,0,0.08),
            inset 1px 1px 3px rgba(255,255,255,0.6);
          transform: translateY(-1px);
        }

        .d09lp-card-icon {
          font-size: 1.4rem;
          color: #a0785a;
          margin-bottom: 14px;
          display: block;
          line-height: 1;
        }

        .d09lp-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.18rem;
          font-weight: 700;
          color: #2d2d2d;
          margin-bottom: 16px;
        }

        .d09lp-card-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .d09lp-card-list li {
          font-size: 0.92rem;
          color: rgba(45,45,45,0.68);
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.4;
        }

        .d09lp-card-list li::before {
          content: '–';
          color: #a0785a;
          flex-shrink: 0;
        }

        /* ─────────────────────────────────────────
           §4 AI IN ACTION
        ───────────────────────────────────────── */
        .d09lp-ai-wrap {
          background: #ede8df;
          padding: 120px 80px;
        }

        .d09lp-ai-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .d09lp-ai-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          font-weight: 700;
          color: #2d2d2d;
          line-height: 1.2;
          max-width: 480px;
          text-shadow:
            1px 1px 2px rgba(255,255,255,0.5),
            -1px -1px 1px rgba(0,0,0,0.06);
          margin-bottom: 0;
        }

        .d09lp-ai-stages {
          display: flex;
          align-items: flex-start;
          gap: 0;
          margin-top: 64px;
          position: relative;
        }

        .d09lp-ai-stages::before {
          content: '';
          position: absolute;
          top: 52px;
          left: 16.66%;
          right: 16.66%;
          height: 1px;
          background: linear-gradient(90deg, #a0785a 0%, #d0cdc6 50%, #a0785a 100%);
          opacity: 0.4;
          z-index: 0;
        }

        .d09lp-ai-stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
          padding: 0 20px;
        }

        .d09lp-ai-stage-visual {
          width: 104px;
          height: 104px;
          background: #f3f0ea;
          box-shadow:
            inset 0 0 0 1px #d0cdc6,
            2px 2px 5px rgba(0,0,0,0.06),
            inset 1px 1px 2px rgba(255,255,255,0.55);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .d09lp-ai-stage-visual--report {
          width: 100%;
          max-width: 280px;
          height: auto;
          min-height: 104px;
          padding: 16px 20px;
          align-items: flex-start;
        }

        .d09lp-ai-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a0785a;
          margin-bottom: 12px;
        }

        .d09lp-ai-desc {
          font-size: 0.9rem;
          color: rgba(45,45,45,0.62);
          line-height: 1.55;
          max-width: 180px;
        }

        /* waveform bars */
        .d09lp-waveform-bar {
          fill: #a0785a;
          animation: d09lpwave 1.1s ease-in-out infinite alternate;
          transform-origin: center;
        }

        @keyframes d09lpwave {
          0%   { transform: scaleY(0.25); }
          100% { transform: scaleY(1); }
        }

        /* processing dots */
        .d09lp-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .d09lp-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #a0785a;
          animation: d09lpdot 1.2s ease-in-out infinite;
        }

        .d09lp-dot:nth-child(1) { animation-delay: 0s; }
        .d09lp-dot:nth-child(2) { animation-delay: 0.2s; }
        .d09lp-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes d09lpdot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40%            { opacity: 1;    transform: scale(1.15); }
        }

        /* report text lines */
        .d09lp-report {
          text-align: left;
          width: 100%;
        }

        .d09lp-report-line {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          line-height: 1.7;
          color: rgba(45,45,45,0.7);
          opacity: 0;
          animation: d09lpfadeline 0.5s ease forwards;
        }

        .d09lp-report-line:nth-child(1) { animation-delay: 0.8s; }
        .d09lp-report-line:nth-child(2) { animation-delay: 1.1s; }
        .d09lp-report-line:nth-child(3) { animation-delay: 1.4s; }
        .d09lp-report-line:nth-child(4) { animation-delay: 1.7s; }

        @keyframes d09lpfadeline {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .d09lp-report-line strong {
          color: #a0785a;
          font-weight: 700;
        }

        /* ─────────────────────────────────────────
           §5 STATS
        ───────────────────────────────────────── */
        .d09lp-stats-wrap {
          background: #2d2d2d;
          padding: 100px 80px;
        }

        .d09lp-stats-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }

        .d09lp-stat {
          text-align: center;
          padding: 40px 20px;
          border-right: 1px solid rgba(208,205,198,0.12);
        }

        .d09lp-stat:last-child { border-right: none; }

        .d09lp-stat-number {
          font-family: 'Space Mono', monospace;
          font-size: clamp(3rem, 5vw, 5rem);
          font-weight: 400;
          color: #f3f0ea;
          line-height: 1;
          margin-bottom: 14px;
          display: block;
        }

        .d09lp-stat-prefix {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.8rem;
          color: #a0785a;
          vertical-align: top;
          line-height: 1.5;
          margin-right: 2px;
        }

        .d09lp-stat-label {
          font-size: 0.9rem;
          color: rgba(243,240,234,0.45);
          line-height: 1.5;
          display: block;
        }

        /* ─────────────────────────────────────────
           §6 PERSONAS
        ───────────────────────────────────────── */
        .d09lp-personas-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 56px;
        }

        .d09lp-persona-card {
          padding: 36px 32px;
          background: #f3f0ea;
          box-shadow:
            inset 0 0 0 1px #d0cdc6,
            2px 2px 4px rgba(0,0,0,0.05),
            inset 1px 1px 2px rgba(255,255,255,0.5);
        }

        .d09lp-persona-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #a0785a;
          margin-bottom: 10px;
        }

        .d09lp-persona-desc {
          font-size: 0.98rem;
          color: rgba(45,45,45,0.65);
          line-height: 1.6;
          margin-bottom: 24px;
          font-style: italic;
        }

        .d09lp-persona-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .d09lp-persona-list li {
          font-size: 0.9rem;
          color: rgba(45,45,45,0.72);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .d09lp-persona-list li::before {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #a0785a;
          flex-shrink: 0;
          display: inline-block;
        }

        /* ─────────────────────────────────────────
           §7 PRICING
        ───────────────────────────────────────── */
        .d09lp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 56px;
          align-items: start;
        }

        .d09lp-price-card {
          padding: 40px 32px;
          background: #f3f0ea;
          box-shadow:
            inset 0 0 0 1px #d0cdc6,
            2px 2px 4px rgba(0,0,0,0.05),
            inset 1px 1px 2px rgba(255,255,255,0.5);
          position: relative;
        }

        .d09lp-price-card--recommended {
          box-shadow:
            inset 0 0 0 2px #a0785a,
            4px 4px 12px rgba(160,120,90,0.18),
            inset 1px 1px 3px rgba(255,255,255,0.55);
          transform: translateY(-4px);
        }

        .d09lp-price-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #a0785a;
          color: #f3f0ea;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 12px;
          white-space: nowrap;
        }

        .d09lp-price-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #2d2d2d;
          margin-bottom: 20px;
        }

        .d09lp-price-amount {
          font-family: 'Space Mono', monospace;
          font-size: 2.6rem;
          color: #2d2d2d;
          line-height: 1;
          margin-bottom: 6px;
        }

        .d09lp-price-amount--copper { color: #a0785a; }

        .d09lp-price-period {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          color: rgba(45,45,45,0.5);
          margin-bottom: 28px;
          display: block;
        }

        .d09lp-price-divider {
          width: 100%;
          height: 1px;
          background: #d0cdc6;
          margin-bottom: 24px;
        }

        .d09lp-price-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 32px;
        }

        .d09lp-price-features li {
          font-size: 0.92rem;
          color: rgba(45,45,45,0.72);
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.4;
        }

        .d09lp-price-features li::before {
          content: '✓';
          color: #a0785a;
          font-size: 0.75rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .d09lp-price-btn {
          display: block;
          width: 100%;
          padding: 13px 0;
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
          cursor: pointer;
        }

        .d09lp-price-btn--outline {
          border: 1.5px solid #d0cdc6;
          color: #2d2d2d;
          background: transparent;
        }

        .d09lp-price-btn--outline:hover {
          border-color: #a0785a;
          color: #a0785a;
        }

        .d09lp-price-btn--copper {
          background: #a0785a;
          color: #f3f0ea;
          border: none;
        }

        .d09lp-price-btn--copper:hover {
          background: #8a6448;
        }

        /* ─────────────────────────────────────────
           §8 FOOTER
        ───────────────────────────────────────── */
        .d09lp-footer {
          padding: 80px 40px 60px;
          text-align: center;
          position: relative;
        }

        .d09lp-footer-rule {
          width: 100%;
          height: 1px;
          background: #a0785a;
          opacity: 0.35;
          margin-bottom: 56px;
        }

        .d09lp-footer-craft {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          font-weight: 400;
          font-style: italic;
          color: #2d2d2d;
          margin-bottom: 28px;
          text-shadow:
            1px 1px 2px rgba(255,255,255,0.5),
            -1px -1px 1px rgba(0,0,0,0.06);
        }

        .d09lp-footer-meta {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: rgba(45,45,45,0.4);
        }

        .d09lp-footer-meta a {
          color: #a0785a;
          text-decoration: none;
        }

        .d09lp-footer-meta a:hover { text-decoration: underline; }

        .d09lp-design-label {
          position: fixed;
          bottom: 24px;
          left: 32px;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: rgba(45,45,45,0.28);
          z-index: 10;
          text-transform: uppercase;
        }

        /* ─────────────────────────────────────────
           MOBILE
        ───────────────────────────────────────── */
        @media (max-width: 900px) {
          .d09lp-sidenav { display: none; }

          .d09lp-hero { padding: 120px 24px 80px; }
          .d09lp-section { padding: 80px 24px; }
          .d09lp-philosophy { padding: 80px 24px; }
          .d09lp-ai-wrap { padding: 80px 24px; }
          .d09lp-stats-wrap { padding: 80px 24px; }

          .d09lp-grid { grid-template-columns: 1fr; }
          .d09lp-personas-grid { grid-template-columns: 1fr; }
          .d09lp-pricing-grid { grid-template-columns: 1fr; }
          .d09lp-price-card--recommended { transform: none; }

          .d09lp-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .d09lp-stat { border-right: none; border-bottom: 1px solid rgba(208,205,198,0.12); }
          .d09lp-stat:nth-child(even) { border-right: none; }
          .d09lp-stat:last-child { border-bottom: none; }

          .d09lp-ai-stages {
            flex-direction: column;
            align-items: center;
            gap: 48px;
          }
          .d09lp-ai-stages::before { display: none; }
          .d09lp-ai-stage { width: 100%; max-width: 320px; }
        }

        /* ── stamp entrance initial state set by JS ── */
        .d09lp-stamp { will-change: transform, opacity; }
      `}</style>

      {/* SVG paper texture overlay */}
      <div className="d09lp-texture" aria-hidden="true" />

      {/* Fixed left section numbers */}
      <nav className="d09lp-sidenav" aria-label="Section index">
        {SECTION_LABELS.map((label, i) => (
          <span
            key={label}
            ref={(el) => { numberEls.current[i] = el }}
            className="d09lp-sidenav-num"
            title={label}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </nav>

      <div className="d09lp" ref={containerRef}>

        {/* ── §1 HERO ── */}
        <section
          className="d09lp-hero"
          ref={setSectionRef(0)}
          data-section-idx="0"
        >
          <span className="d09lp-kicker d09lp-stamp">Moods AI — Dutch GGZ Platform</span>
          <h1 className="d09lp-hero-headline d09lp-stamp">
            Care deserves <em>care.</em>
          </h1>
          <p className="d09lp-hero-sub d09lp-stamp">
            The intelligent practice management platform for modern mental healthcare.
            Built with the same attention therapists give their clients.
          </p>
          <div className="d09lp-stamp">
            <a href="#" className="d09lp-hero-cta">
              Start free trial <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* ── §2 PHILOSOPHY ── */}
        <section
          ref={setSectionRef(1)}
          data-section-idx="1"
        >
          <div className="d09lp-philosophy">
            <div className="d09lp-rule d09lp-stamp" />
            <p className="d09lp-stamp">
              We believe therapists deserve tools built with the same care they give their clients.
            </p>
            <p className="d09lp-stamp">
              Moods AI replaces the patchwork of disconnected software with one integrated
              platform — purpose-built for Dutch mental healthcare.
            </p>
            <p className="d09lp-stamp">
              From AI-powered documentation to HR management, from secure video to financial
              insights — every feature exists because a practice needed it.
            </p>
          </div>
        </section>

        {/* ── §3 THE PLATFORM ── */}
        <section
          className="d09lp-section"
          ref={setSectionRef(2)}
          data-section-idx="2"
        >
          <span className="d09lp-kicker d09lp-stamp">The Platform</span>
          <h2 className="d09lp-section-headline d09lp-stamp">
            Everything a practice needs,<br />nothing it doesn&apos;t.
          </h2>
          <div className="d09lp-grid">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="d09lp-card d09lp-stamp">
                <span className="d09lp-card-icon" aria-hidden="true">{feature.icon}</span>
                <h3 className="d09lp-card-title">{feature.title}</h3>
                <ul className="d09lp-card-list">
                  {feature.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── §4 AI IN ACTION ── */}
        <section
          className="d09lp-ai-wrap"
          ref={(el) => {
            sectionRefs.current[3] = el
            aiSectionRef.current = el
          }}
          data-section-idx="3"
        >
          <div className="d09lp-ai-inner">
            <span className="d09lp-kicker">AI in Action</span>
            <h2 className="d09lp-ai-headline">
              From your voice to<br />a structured report.
            </h2>
            <div className="d09lp-ai-stages">

              {/* Stage 1: Dictate */}
              <div className="d09lp-ai-stage">
                <div className="d09lp-ai-stage-visual">
                  <svg
                    width="72"
                    height="40"
                    viewBox="0 0 72 40"
                    aria-hidden="true"
                  >
                    {([8, 22, 36, 20, 30, 16, 28, 12, 24, 10] as number[]).map((h, i) => (
                      <rect
                        key={i}
                        className="d09lp-waveform-bar"
                        x={i * 7 + 1}
                        y={(40 - h) / 2}
                        width="4"
                        height={h}
                        rx="1"
                        style={{ animationDelay: `${i * 0.09}s` }}
                      />
                    ))}
                  </svg>
                </div>
                <div className="d09lp-ai-label">01 — Dictate</div>
                <p className="d09lp-ai-desc">Speak naturally during or after a session</p>
              </div>

              {/* Stage 2: Process */}
              <div className="d09lp-ai-stage">
                <div className="d09lp-ai-stage-visual">
                  <div className="d09lp-dots" aria-label="Processing">
                    <span className="d09lp-dot" />
                    <span className="d09lp-dot" />
                    <span className="d09lp-dot" />
                  </div>
                </div>
                <div className="d09lp-ai-label">02 — Process</div>
                <p className="d09lp-ai-desc">AI transcribes, structures, and formats</p>
              </div>

              {/* Stage 3: Report */}
              <div className="d09lp-ai-stage">
                <div className="d09lp-ai-stage-visual d09lp-ai-stage-visual--report">
                  <div className="d09lp-report" aria-label="Generated session report">
                    <div className="d09lp-report-line"><strong>Session Report</strong></div>
                    <div className="d09lp-report-line">Client: J. de Vries</div>
                    <div className="d09lp-report-line">DSM-V: F41.1 Gegeneraliseerde angst</div>
                    <div className="d09lp-report-line">Next: 14 april · 14:00</div>
                  </div>
                </div>
                <div className="d09lp-ai-label">03 — Report</div>
                <p className="d09lp-ai-desc">Structured notes ready for your dossier</p>
              </div>

            </div>
          </div>
        </section>

        {/* ── §5 BY THE NUMBERS ── */}
        <section
          className="d09lp-stats-wrap"
          ref={setSectionRef(4)}
          data-section-idx="4"
        >
          <div className="d09lp-stats-inner">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="d09lp-stat d09lp-stamp"
                data-stat-idx={String(i)}
              >
                <span className="d09lp-stat-number">
                  {stat.label.startsWith('€') && (
                    <span className="d09lp-stat-prefix" aria-hidden="true">€</span>
                  )}
                  <span
                    ref={(el) => { statRefs.current[i] = el }}
                  >
                    {stat.value}
                  </span>
                </span>
                <span className="d09lp-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── §6 WHO IT'S FOR ── */}
        <section
          className="d09lp-section"
          ref={setSectionRef(5)}
          data-section-idx="5"
        >
          <span className="d09lp-kicker d09lp-stamp">Who It&apos;s For</span>
          <h2 className="d09lp-section-headline d09lp-stamp">
            Built for every role<br />in the practice.
          </h2>
          <div className="d09lp-personas-grid">
            {PERSONAS.map((persona) => (
              <div key={persona.title} className="d09lp-persona-card d09lp-stamp">
                <h3 className="d09lp-persona-title">{persona.title}</h3>
                <p className="d09lp-persona-desc">{persona.description}</p>
                <ul className="d09lp-persona-list">
                  {persona.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── §7 PRICING ── */}
        <section
          className="d09lp-section"
          ref={setSectionRef(6)}
          data-section-idx="6"
        >
          <span className="d09lp-kicker d09lp-stamp">Pricing</span>
          <h2 className="d09lp-section-headline d09lp-stamp">
            Simple pricing.<br />No surprises.
          </h2>
          <div className="d09lp-pricing-grid">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={[
                  'd09lp-price-card',
                  'd09lp-stamp',
                  plan.recommended ? 'd09lp-price-card--recommended' : '',
                ].filter(Boolean).join(' ')}
              >
                {plan.recommended && (
                  <div className="d09lp-price-badge">Most popular</div>
                )}
                <div className="d09lp-price-name">{plan.name}</div>
                <div className={`d09lp-price-amount${plan.recommended ? ' d09lp-price-amount--copper' : ''}`}>
                  {plan.price}
                </div>
                <span className="d09lp-price-period">{plan.period}</span>
                <div className="d09lp-price-divider" />
                <ul className="d09lp-price-features">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`d09lp-price-btn${plan.recommended ? ' d09lp-price-btn--copper' : ' d09lp-price-btn--outline'}`}
                >
                  {plan.name === 'Enterprise' ? 'Talk to us' : 'Get started'}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── §8 FOOTER ── */}
        <footer
          className="d09lp-footer"
          ref={setSectionRef(7)}
          data-section-idx="7"
        >
          <div className="d09lp-footer-rule" />
          <p className="d09lp-footer-craft d09lp-stamp">Crafted in Amsterdam.</p>
          <p className="d09lp-footer-meta d09lp-stamp">
            Moods AI &middot;{' '}
            <a href="mailto:info@ohmymood.com">info@ohmymood.com</a>
          </p>
        </footer>

      </div>

      <div className="d09lp-design-label" aria-hidden="true">Design 09 — The Letterpress</div>
    </>
  )
}
