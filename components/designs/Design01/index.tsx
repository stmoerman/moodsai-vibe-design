'use client'

import { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react'
import s from './styles.module.css'

/* ═══════════════════════════════════════════════════════
   Design 01 — "The Manifesto"
   Snap-scroll, story-first SaaS homepage for Moods AI
   ═══════════════════════════════════════════════════════ */

// ── Helpers ──────────────────────────────────────────────

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

// SVG noise pattern for paper grain
function GrainOverlay() {
  return (
    <svg className={s.grain} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <filter id="grain01">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain01)" />
    </svg>
  )
}

// ── Data ─────────────────────────────────────────────────

const WITHOUT_MOODS = [
  { time: '08:00', task: 'Client session — Anna', type: 'client' as const },
  { time: '09:00', task: 'Write treatment plan (Anna)', type: 'admin' as const },
  { time: '09:30', task: 'Email insurance — rejection', type: 'admin' as const },
  { time: '10:00', task: 'Client session — Mark', type: 'client' as const },
  { time: '11:00', task: 'Type session notes (Mark)', type: 'admin' as const },
  { time: '11:30', task: 'Update ROM questionnaires', type: 'admin' as const },
  { time: '13:00', task: 'Client session — Lisa', type: 'client' as const },
  { time: '14:00', task: 'Billing & DBC codes', type: 'admin' as const },
]

const WITH_MOODS = [
  { time: '08:00', task: 'Client session — Anna', type: 'client' as const },
  { time: '09:00', task: 'Client session — Mark', type: 'client' as const },
  { time: '10:00', task: 'Client session — Lisa', type: 'client' as const },
  { time: '11:00', task: 'Client session — James', type: 'client' as const },
  { time: '13:00', task: 'Client session — Sophie', type: 'client' as const },
  { time: '14:00', task: 'Client session — David', type: 'client' as const },
  { time: '15:00', task: 'Team check-in (video)', type: 'client' as const },
  { time: '15:30', task: 'Review AI-generated notes', type: 'client' as const },
]

const TOOLS = [
  'EHR / EPD', 'Scheduling', 'Billing', 'Video calls', 'Chat',
  'Analytics', 'HR & Teams', 'ROM tools', 'Email', 'Documents',
]

const COMPLIANCE = [
  { title: 'NEN 7510', desc: 'Information security in healthcare' },
  { title: 'NEN 7513', desc: 'Logging access to patient data' },
  { title: 'AES-256-GCM', desc: 'End-to-end encryption at rest' },
  { title: 'RBAC', desc: 'Role-based access control' },
  { title: 'BSN Redaction', desc: 'Auto-redact citizen service numbers' },
  { title: 'Multi-tenant', desc: 'Strict data isolation per org' },
]

const PRICING = [
  { name: 'Free', price: '€0', unit: 'up to 3 team members', features: ['AI documentation', 'Basic scheduling', 'Video calls'], featured: false },
  { name: 'Pro', price: '€29', unit: 'per seat / month', features: ['Everything in Free', 'Unlimited members', 'Analytics & billing', 'Priority support'], featured: true },
  { name: 'Lifetime', price: '€499', unit: 'one-time payment', features: ['Everything in Pro', 'Lifetime updates', 'Early access features'], featured: false },
]

const REPORT_LINES = [
  'Patient: Anna V. — Session 14',
  'Presentation: Continued anxiety symptoms, sleep disruption.',
  'Intervention: CBT restructuring, progressive relaxation.',
  'Progress: ROM scores show 22% improvement since baseline.',
  'Plan: Maintain weekly frequency. Review medication w/ psychiatrist.',
]

// ── Main Component ──────────────────────────────────────

export default function Design01() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set())
  const [counterValue, setCounterValue] = useState(0)
  const [reportVisible, setReportVisible] = useState<Set<number>>(new Set())
  const [toolsConverged, setToolsConverged] = useState(false)
  const reducedMotion = useReducedMotion()

  const setSectionRef = useCallback((index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el
  }, [])

  // ── IntersectionObserver for section visibility ──
  useLayoutEffect(() => {
    if (reducedMotion) {
      setVisibleSections(new Set([0, 1, 2, 3, 4, 5, 6]))
      setReportVisible(new Set(REPORT_LINES.map((_, i) => i)))
      setToolsConverged(true)
      setCounterValue(2340)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = sectionRefs.current.indexOf(entry.target as HTMLElement)
          if (idx !== -1 && entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(idx))

            // Trigger section-specific animations
            if (idx === 2) {
              setTimeout(() => setToolsConverged(true), 800)
            }
            if (idx === 3) {
              REPORT_LINES.forEach((_, i) => {
                setTimeout(() => {
                  setReportVisible((prev) => new Set(prev).add(i))
                }, 400 + i * 300)
              })
            }
          }
        })
      },
      { threshold: 0.3, root: containerRef.current }
    )

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [reducedMotion])

  // ── Counter animation ──
  useEffect(() => {
    if (reducedMotion) {
      setCounterValue(2340)
      return
    }
    if (!visibleSections.has(0)) return

    const target = 2340
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCounterValue(target)
        clearInterval(interval)
      } else {
        setCounterValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [visibleSections, reducedMotion])

  // ── Character stagger helper ──
  function staggerChars(text: string, baseDelay: number) {
    if (reducedMotion) return <>{text}</>
    let charIndex = 0
    return (
      <>
        {text.split(' ').map((word, wi) => (
          <span key={wi} style={{ whiteSpace: 'nowrap' }}>
            {word.split('').map((char) => {
              const delay = baseDelay + charIndex * 0.03
              charIndex++
              return (
                <span
                  key={`${wi}-${charIndex}`}
                  className={s.charSpan}
                  style={{ animationDelay: `${delay}s` }}
                >
                  {char}
                </span>
              )
            })}
            {wi < text.split(' ').length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </>
    )
  }

  const vis = (idx: number) =>
    `${s.fadeInUp} ${visibleSections.has(idx) ? s.visible : ''}`

  // ── Waveform bars ──
  function WaveformBars() {
    const bars = 40
    return (
      <div className={s.waveformContainer}>
        {Array.from({ length: bars }, (_, i) => (
          <div
            key={i}
            className={s.waveBar}
            style={{
              animationDelay: `${i * 0.05}s`,
              height: `${15 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={s.container} ref={containerRef}>
      {/* ════════ Section 1: HERO ════════ */}
      <section className={s.section} ref={setSectionRef(0)}>
        <GrainOverlay />
        <div className={`${s.sectionInner} ${s.hero}`}>
          <h1 className={s.heroHeadline}>
            {staggerChars('Therapists became therapists to help people.', 0.2)}
            <br />
            {staggerChars('Not to type reports.', 1.6)}
          </h1>
          <p className={`${s.heroSubline} ${vis(0)}`} style={{ transitionDelay: '2.5s' }}>
            Moods AI gives mental health professionals their time back —
            so they can do what they were trained to do.
          </p>
          <div className={vis(0)} style={{ transitionDelay: '3s' }}>
            <div className={s.counterBlock}>
              <span className={s.counterNumber}>
                {counterValue.toLocaleString('en-US')}+
              </span>
              <span className={s.counterLabel}>
                hours of admin work<br />eliminated this year
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Section 2: THE PROBLEM ════════ */}
      <section className={s.section} ref={setSectionRef(1)}>
        <GrainOverlay />
        <div className={s.sectionInner}>
          <h2 className={`${s.headline} ${vis(1)}`} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            A therapist&apos;s day: before &amp; after
          </h2>
          <div className={`${s.splitScreen} ${vis(1)}`} style={{ transitionDelay: '0.3s' }}>
            <div className={s.splitColumn}>
              <div className={s.splitTitle}>
                Without Moods <span className={s.accent}>(today)</span>
              </div>
              {WITHOUT_MOODS.map((slot, i) => (
                <div className={s.timeSlot} key={i}>
                  <span className={s.timeLabel}>{slot.time}</span>
                  <span className={slot.type === 'admin' ? s.taskAdmin : s.taskClient}>
                    {slot.task}
                  </span>
                </div>
              ))}
            </div>
            <div className={s.splitColumn}>
              <div className={s.splitTitle}>
                With Moods <span className={s.accentGreen}>(your future)</span>
              </div>
              {WITH_MOODS.map((slot, i) => (
                <div className={s.timeSlot} key={i}>
                  <span className={s.timeLabel}>{slot.time}</span>
                  <span className={s.taskClient}>{slot.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ Section 3: THE SOLUTION ════════ */}
      <section className={s.section} ref={setSectionRef(2)}>
        <GrainOverlay />
        <div className={`${s.sectionInner} ${s.solutionCenter}`}>
          <h2 className={`${s.solutionHeadline} ${vis(2)}`}>One platform. Not ten.</h2>
          <p className={`${s.solutionSubline} ${vis(2)}`} style={{ transitionDelay: '0.2s' }}>
            Replace your scattered toolkit with one integrated system.
          </p>
          <div className={`${s.toolGrid} ${vis(2)}`} style={{ transitionDelay: '0.4s' }}>
            {TOOLS.map((tool, i) => (
              <div
                key={i}
                className={`${s.toolLabel} ${toolsConverged ? s.converged : ''}`}
                style={{ transitionDelay: `${0.5 + i * 0.08}s` }}
              >
                {tool}
              </div>
            ))}
          </div>
          <div className={vis(2)} style={{ transitionDelay: '1.5s' }}>
            <span className={s.convergeTarget}>Moods</span>
          </div>
        </div>
      </section>

      {/* ════════ Section 4: AI DOCUMENTATION ════════ */}
      <section className={s.section} ref={setSectionRef(3)}>
        <GrainOverlay />
        <div className={`${s.sectionInner} ${s.aiDocSection}`}>
          <h2 className={`${s.headline} ${vis(3)}`}>
            Your voice becomes your documentation.
          </h2>
          <div className={vis(3)} style={{ transitionDelay: '0.3s' }}>
            <WaveformBars />
          </div>
          <div className={`${s.reportBlock} ${vis(3)}`} style={{ transitionDelay: '0.5s' }}>
            {REPORT_LINES.map((line, i) => (
              <div
                key={i}
                className={`${s.reportLine} ${reportVisible.has(i) ? s.visible : ''}`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                {line}
              </div>
            ))}
          </div>
          <div className={vis(3)} style={{ transitionDelay: '1s' }}>
            <div className={s.statBig}>30 min → 5 min</div>
            <div className={s.statCaption}>Average documentation time per session</div>
          </div>
        </div>
      </section>

      {/* ════════ Section 5: SECURITY ════════ */}
      <section className={s.section} ref={setSectionRef(4)}>
        <GrainOverlay />
        <div className={s.sectionInner}>
          <h2 className={`${s.headline} ${vis(4)}`} style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            Healthcare-grade by default.
          </h2>
          <p className={`${s.body} ${vis(4)}`} style={{ textAlign: 'center', marginBottom: '1rem', transitionDelay: '0.2s' }}>
            Built for Dutch GGZ compliance from day one.
          </p>
          <div className={`${s.securityGrid} ${vis(4)}`} style={{ transitionDelay: '0.4s' }}>
            {COMPLIANCE.map((item, i) => (
              <div className={s.complianceCard} key={i}>
                <div className={s.complianceTitle}>{item.title}</div>
                <div className={s.complianceDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Section 6: PRICING ════════ */}
      <section className={s.section} ref={setSectionRef(5)}>
        <GrainOverlay />
        <div className={s.sectionInner}>
          <h2 className={`${s.headline} ${vis(5)}`} style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            Simple, transparent pricing.
          </h2>
          <p className={`${s.body} ${vis(5)}`} style={{ textAlign: 'center', marginBottom: '1rem', transitionDelay: '0.2s' }}>
            Start free. Scale when you&apos;re ready.
          </p>
          <div className={`${s.pricingGrid} ${vis(5)}`} style={{ transitionDelay: '0.4s' }}>
            {PRICING.map((plan, i) => (
              <div
                className={`${s.pricingCard} ${plan.featured ? s.pricingCardFeatured : ''}`}
                key={i}
              >
                <div className={s.pricingName}>{plan.name}</div>
                <div className={s.pricingPrice}>{plan.price}</div>
                <div className={s.pricingUnit}>{plan.unit}</div>
                {plan.features.map((f, fi) => (
                  <div className={s.pricingFeature} key={fi}>{f}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Section 7: CTA ════════ */}
      <section className={s.section} ref={setSectionRef(6)}>
        <GrainOverlay />
        <div className={`${s.sectionInner} ${s.ctaSection}`}>
          <h2 className={`${s.ctaHeadline} ${vis(6)}`}>
            Your practice deserves better.
          </h2>
          <div className={vis(6)} style={{ transitionDelay: '0.3s' }}>
            <button className={s.ctaButton}>
              Start for free
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
