'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import s from './styles.module.css'

/* ═══════════════════════════════════════════════════════
   Design 11 — "The Synthesis" (Polished)
   reMarkable-inspired premium homepage for Moods AI.
   ═══════════════════════════════════════════════════════ */

// ── Types ───────────────────────────────────────────────

interface TimelineNode {
  title: string
  desc: string
  icon: React.ReactNode
  side: 'left' | 'right'
}

// ── Data ────────────────────────────────────────────────

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

const TOOLS: string[] = [
  'Scheduling software',
  'Video conferencing',
  'Team chat',
  'HR system',
  'Leave management',
  'Document storage',
  'Analytics platform',
  'Billing system',
  'Client portal',
  'Compliance tools',
]

const TIMELINE_NODES: TimelineNode[] = [
  {
    title: 'AI Documentation',
    desc: 'Voice-to-report in 5 minutes. AskMoody answers questions about your practice.',
    side: 'left',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="20" height="24" rx="0" />
        <line x1="10" y1="10" x2="22" y2="10" />
        <line x1="10" y1="14" x2="22" y2="14" />
        <line x1="10" y1="18" x2="17" y2="18" />
        <circle cx="22" cy="22" r="3" />
        <line x1="24" y1="24" x2="27" y2="27" />
      </svg>
    ),
  },
  {
    title: 'Practice Management',
    desc: 'Scheduling, intake pipeline, triage flows — all connected.',
    side: 'right',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="24" height="20" rx="0" />
        <line x1="4" y1="11" x2="28" y2="11" />
        <line x1="11" y1="6" x2="11" y2="11" />
        <line x1="21" y1="6" x2="21" y2="11" />
        <line x1="10" y1="16" x2="14" y2="16" />
        <line x1="18" y1="16" x2="22" y2="16" />
        <line x1="10" y1="20" x2="14" y2="20" />
      </svg>
    ),
  },
  {
    title: 'Video & Communication',
    desc: 'Whereby-powered video, encrypted team & care chat.',
    side: 'left',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="14" rx="0" />
        <polyline points="21,13 29,9 29,23 21,19" />
      </svg>
    ),
  },
  {
    title: 'HR & Team',
    desc: 'Leave management, absence tracking, onboarding checklists.',
    side: 'right',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="4" />
        <path d="M4,26 C4,20 8,17 12,17 C16,17 20,20 20,26" />
        <circle cx="23" cy="12" r="3" />
        <path d="M20,26 C20,22 21,20 23,19 C25,18 28,20 28,26" />
      </svg>
    ),
  },
  {
    title: 'Business Intelligence',
    desc: 'Custom dashboards, declarability tracking, financial control.',
    side: 'left',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4,24 10,16 16,19 22,10 28,14" />
        <line x1="4" y1="28" x2="28" y2="28" />
        <line x1="4" y1="8" x2="4" y2="28" />
      </svg>
    ),
  },
  {
    title: 'Security & Compliance',
    desc: 'NEN 7510/7513, field-level encryption, multi-tenant isolation.',
    side: 'right',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16,4 L28,9 L28,18 C28,23 22,28 16,30 C10,28 4,23 4,18 L4,9 Z" />
        <polyline points="11,16 14,19 21,13" />
      </svg>
    ),
  },
]

const COMPLIANCE = [
  { title: 'NEN 7510', desc: 'Information security in healthcare' },
  { title: 'NEN 7513', desc: 'Logging access to patient data' },
  { title: 'AES-256-GCM', desc: 'End-to-end encryption at rest' },
  { title: 'RBAC', desc: 'Role-based access control' },
  { title: 'BSN Redaction', desc: 'Auto-redact citizen service numbers' },
  { title: 'Multi-tenant', desc: 'Strict data isolation per org' },
]

const QUOTES = [
  { text: 'Finally, a platform that understands how GGZ practices actually work.', attrib: 'Practice Owner' },
  { text: 'I spend 25 minutes less on documentation every day.', attrib: 'Therapist' },
  { text: 'The declarability dashboard alone paid for itself.', attrib: 'HR Manager' },
]

const PRICING = [
  { name: 'Free', price: '\u20AC0', unit: 'up to 3 team members', features: ['AI documentation', 'Basic scheduling', 'Video calls'], featured: false },
  { name: 'Pro', price: '\u20AC29', unit: 'per seat / month', features: ['Everything in Free', 'Unlimited members', 'Analytics & billing', 'Priority support'], featured: true },
  { name: 'Lifetime', price: '\u20AC499', unit: 'one-time payment', features: ['Everything in Pro', 'Lifetime updates', 'Early access features'], featured: false },
]

const MOODY_RESPONSE =
  'Your practice average is 79.2% across 24 therapists. That\u2019s 1.2% above your 78% target. 3 therapists are below individual targets.'

const SECTION_IDS = ['hero', 'problem', 'solution', 'tour', 'ai', 'security', 'social', 'pricing', 'cta']

// ── Helpers ─────────────────────────────────────────────

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

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

// SVG paper grain overlay (feTurbulence)
function GrainOverlay() {
  return (
    <svg className={s.grain} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <filter id="grain11">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain11)" />
    </svg>
  )
}

// Animated number counter
function AnimatedCounter({
  end,
  prefix = '',
  suffix = '',
  duration = 1200,
  decimals = 0,
  inView,
}: {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
  inView: boolean
}) {
  const [value, setValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * end)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, end, duration])

  return (
    <span>
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value)}
      {suffix}
    </span>
  )
}

// ── Main Component ──────────────────────────────────────

export default function Design11() {
  const progressRef = useRef<HTMLDivElement>(null)
  const dotGridRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<SVGPathElement>(null)
  const toolItemRefs = useRef<(HTMLLIElement | null)[]>([])
  const checkRefs = useRef<(SVGPathElement | null)[]>([])
  const pricingCheckRefs = useRef<(SVGPathElement | null)[]>([])
  const arrowRef = useRef<SVGPathElement>(null)
  const arrowHeadRef = useRef<SVGPathElement>(null)
  const chatResponseRef = useRef<HTMLSpanElement>(null)
  const chatCursorRef = useRef<HTMLSpanElement>(null)
  const chatStartedRef = useRef(false)
  const arrowIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const timelineLineRef = useRef<HTMLDivElement>(null)
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  const waveformRef = useRef<HTMLDivElement>(null)
  const waveformRafRef = useRef<number>(0)
  const thinkingRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([])
  const convergePulseRef = useRef<SVGCircleElement>(null)

  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const [sliderPos, setSliderPos] = useState(50)
  const [activeSection, setActiveSection] = useState(0)
  const [statsInView, setStatsInView] = useState(false)

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

  // ── Organic waveform (rAF-driven) ──
  const startWaveform = useCallback(() => {
    if (reducedMotion) return
    const container = waveformRef.current
    if (!container) return
    const bars = container.children
    const barCount = bars.length

    // Seed phases for organic look
    const phases = Array.from({ length: barCount }, () => Math.random() * Math.PI * 2)
    const speeds = Array.from({ length: barCount }, () => 0.8 + Math.random() * 1.5)

    const animate = (time: number) => {
      const t = time / 1000
      for (let i = 0; i < barCount; i++) {
        const bar = bars[i] as HTMLElement
        if (!bar) continue
        const base = Math.sin(t * speeds[i] + phases[i]) * 0.5 + 0.5
        const neighbor = Math.sin(t * 0.7 + i * 0.3) * 0.2 + 0.2
        const height = 10 + (base + neighbor) * 55
        bar.style.height = `${height}%`
      }
      waveformRafRef.current = requestAnimationFrame(animate)
    }
    waveformRafRef.current = requestAnimationFrame(animate)
  }, [reducedMotion])

  // ── Chat streaming with variable speed ──
  const streamChat = useCallback(() => {
    if (chatStartedRef.current) return
    chatStartedRef.current = true
    const el = chatResponseRef.current
    const cursor = chatCursorRef.current
    const thinking = thinkingRef.current
    if (!el || !cursor) return

    el.textContent = ''
    cursor.style.display = 'none'

    // Show thinking dots first
    if (thinking) thinking.style.display = 'inline-flex'

    const thinkDelay = 1200
    setTimeout(() => {
      if (thinking) thinking.style.display = 'none'
      cursor.style.display = 'inline-block'

      let i = 0
      const type = () => {
        if (i < MOODY_RESPONSE.length) {
          el.textContent = MOODY_RESPONSE.slice(0, i + 1)
          const char = MOODY_RESPONSE[i]
          // Variable speed: slow on punctuation, faster on common chars
          let delay = 18
          if (char === '.' || char === ',') delay = 90 + Math.random() * 60
          else if (char === ' ') delay = 12
          else delay = 14 + Math.random() * 12
          i++
          setTimeout(type, delay)
        }
      }
      type()
    }, thinkDelay)
  }, [])

  // ── Arrow draw + redraw ──
  const drawArrow = useCallback(() => {
    const a = arrowRef.current
    const h = arrowHeadRef.current
    if (!a || !h) return
    a.style.transition = 'none'
    h.style.transition = 'none'
    a.style.strokeDashoffset = '120'
    h.style.strokeDashoffset = '20'
    void a.getBoundingClientRect()
    a.style.transition = 'stroke-dashoffset 1s ease-out'
    h.style.transition = 'stroke-dashoffset 0.4s ease-out 0.8s'
    a.style.strokeDashoffset = '0'
    h.style.strokeDashoffset = '0'
  }, [])

  // ── Magnetic cursor effect ──
  const handleMagnetic = useCallback((e: React.MouseEvent<HTMLDivElement>, maxDist: number = 6) => {
    if (reducedMotion || isMobile) return
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const dist = Math.sqrt(x * x + y * y)
    const maxRadius = Math.max(rect.width, rect.height)
    if (dist < maxRadius) {
      const pull = Math.min(dist / maxRadius, 1) * maxDist
      const angle = Math.atan2(y, x)
      el.style.transform = `translate(${Math.cos(angle) * pull}px, ${Math.sin(angle) * pull}px)`
    }
  }, [reducedMotion, isMobile])

  const resetMagnetic = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)'
  }, [])

  // ── Before/After slider drag ──
  const handleSliderDrag = useCallback((clientX: number) => {
    const container = sliderRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setSliderPos(pct)
  }, [])

  const onSliderMouseDown = useCallback(() => {
    const onMove = (e: MouseEvent) => handleSliderDrag(e.clientX)
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [handleSliderDrag])

  const onSliderTouchStart = useCallback(() => {
    const onMove = (e: TouchEvent) => {
      if (e.touches[0]) handleSliderDrag(e.touches[0].clientX)
    }
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onEnd)
  }, [handleSliderDrag])

  // ── Nav dot click ──
  const scrollToSection = useCallback((idx: number) => {
    const el = sectionRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // ── Main effect ──
  useEffect(() => {
    if (reducedMotion) {
      // Draw everything immediately
      const ul = underlineRef.current
      if (ul) ul.classList.add(s.drawn)
      toolItemRefs.current.forEach((item) => { if (item) item.classList.add(s.struck) })
      checkRefs.current.forEach((path) => { if (path) path.classList.add(s.drawn) })
      pricingCheckRefs.current.forEach((path) => { if (path) path.classList.add(s.drawn) })
      const a = arrowRef.current
      const h = arrowHeadRef.current
      if (a) a.style.strokeDashoffset = '0'
      if (h) h.style.strokeDashoffset = '0'
      chatStartedRef.current = true
      const cr = chatResponseRef.current
      if (cr) cr.textContent = MOODY_RESPONSE
      dividerRefs.current.forEach((div) => { if (div) div.classList.add(s.dividerVisible) })
      setStatsInView(true)
      return
    }

    // ── Scroll progress bar + dot-grid parallax + section tracking ──
    const handleScroll = () => {
      const el = progressRef.current
      if (!el) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      el.style.width = `${pct}%`

      // Dot-grid parallax
      if (!isMobile) {
        const dg = dotGridRef.current
        if (dg) {
          const y = scrollTop * 0.12
          const x = scrollTop * 0.03
          dg.style.backgroundPosition = `${x}px ${y}px`
        }
      }

      // Timeline line progress
      const tlContainer = timelineContainerRef.current
      const tlLine = timelineLineRef.current
      if (tlContainer && tlLine) {
        const rect = tlContainer.getBoundingClientRect()
        const viewH = window.innerHeight
        if (rect.top < viewH && rect.bottom > 0) {
          const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (rect.height + viewH * 0.5)))
          tlLine.style.height = `${progress * 100}%`
        }
      }

      // Active section tracking
      let current = 0
      sectionRefs.current.forEach((sec, i) => {
        if (sec) {
          const rect = sec.getBoundingClientRect()
          if (rect.top < window.innerHeight * 0.5) current = i
        }
      })
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── Underline draw ──
    const underlineTimer = setTimeout(() => {
      const path = underlineRef.current
      if (path) path.classList.add(s.drawn)
    }, 2200)

    // ── IntersectionObserver for reveals ──
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const delay = target.dataset.delay ?? '0'
            setTimeout(() => {
              target.classList.add(s.visible)
            }, parseInt(delay, 10))
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const revealEls = document.querySelectorAll(
      `.${s.reveal}, .${s.revealLeft}, .${s.revealRight}`
    )
    revealEls.forEach((el) => observer.observe(el))

    // ── Section divider draw-on ──
    const dividerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(s.dividerVisible)
            dividerObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )
    dividerRefs.current.forEach((div) => { if (div) dividerObserver.observe(div) })

    // ── Tool strikethroughs ──
    const strikeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            toolItemRefs.current.forEach((item, i) => {
              if (item) {
                setTimeout(() => { item.classList.add(s.struck) }, i * 120)
              }
            })
            // Pulse the converge node after all tools struck
            setTimeout(() => {
              const pulse = convergePulseRef.current
              if (pulse) pulse.classList.add(s.convergePulse)
            }, TOOLS.length * 120 + 200)
            strikeObserver.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    const toolList = document.querySelector(`.${s.toolList}`)
    if (toolList) strikeObserver.observe(toolList)

    // ── Security checkmarks ──
    const checkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            checkRefs.current.forEach((path, i) => {
              if (path) setTimeout(() => { path.classList.add(s.drawn) }, i * 150)
            })
            checkObserver.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    const secGrid = document.querySelector(`.${s.securityGrid}`)
    if (secGrid) checkObserver.observe(secGrid)

    // ── Pricing checkmarks ──
    const priceCheckObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pricingCheckRefs.current.forEach((path, i) => {
              if (path) setTimeout(() => { path.classList.add(s.drawn) }, i * 80)
            })
            priceCheckObserver.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    const pricingGrid = document.querySelector(`.${s.pricingGrid}`)
    if (pricingGrid) priceCheckObserver.observe(pricingGrid)

    // ── Chat streaming trigger ──
    const chatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startWaveform()
            streamChat()
            chatObserver.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    const chatWindow = document.querySelector(`.${s.chatWindow}`)
    if (chatWindow) chatObserver.observe(chatWindow)

    // ── Stats counter trigger ──
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsInView(true)
            statsObserver.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    const statsEl = document.querySelector(`.${s.aiStats}`)
    if (statsEl) statsObserver.observe(statsEl)

    // ── CTA arrow ──
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            drawArrow()
            arrowIntervalRef.current = setInterval(drawArrow, 5000)
            ctaObserver.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    const ctaSection = document.querySelector(`.${s.ctaSection}`)
    if (ctaSection) ctaObserver.observe(ctaSection)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(underlineTimer)
      observer.disconnect()
      dividerObserver.disconnect()
      strikeObserver.disconnect()
      checkObserver.disconnect()
      priceCheckObserver.disconnect()
      chatObserver.disconnect()
      statsObserver.disconnect()
      ctaObserver.disconnect()
      if (arrowIntervalRef.current) clearInterval(arrowIntervalRef.current)
      if (waveformRafRef.current) cancelAnimationFrame(waveformRafRef.current)
    }
  }, [reducedMotion, isMobile, streamChat, drawArrow, startWaveform])

  // Pricing check ref collector
  let priceCheckIdx = 0
  // Divider ref collector
  let dividerIdx = 0

  // Helper to register divider refs
  const dividerRef = (el: HTMLDivElement | null) => {
    const idx = dividerIdx
    dividerRefs.current[idx] = el
    dividerIdx++
  }

  return (
    <div className={s.root}>
      {/* Dot-grid background (fixed, parallax) */}
      <div className={s.dotGrid} ref={dotGridRef} aria-hidden="true" />

      {/* Paper grain overlay */}
      <GrainOverlay />

      {/* Floating particles */}
      {!reducedMotion && !isMobile && (
        <div className={s.particles} aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={s.particle}
              style={{
                left: `${8 + Math.random() * 84}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${12 + Math.random() * 18}s`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll progress bar — reMarkable blue */}
      <div className={s.progressBar} ref={progressRef} role="progressbar" aria-hidden="true" />

      {/* Floating navigation dots */}
      {!isMobile && (
        <nav className={s.navDots} aria-label="Section navigation">
          {SECTION_IDS.map((id, i) => (
            <button
              key={id}
              className={`${s.navDot} ${activeSection === i ? s.navDotActive : ''}`}
              onClick={() => scrollToSection(i)}
              aria-label={`Go to section ${id}`}
            />
          ))}
        </nav>
      )}

      <div className={s.page}>

        {/* ════════════════════════════════════════════
            Section 1: Hero
        ════════════════════════════════════════════ */}
        <section
          className={s.hero}
          ref={(el) => { sectionRefs.current[0] = el }}
          id="hero"
        >
          <h1 className={s.heroHeadline}>
            {staggerChars('Therapists became therapists to help people.', 0.2)}
            <br />
            {staggerChars('Not to type reports.', 1.6)}
          </h1>

          {/* "Moods.ai" with hand-drawn SVG underline */}
          <div className={`${s.heroProduct} ${s.reveal}`} data-delay="2400">
            <span className={s.heroProductText}>Moods.ai</span>
            <svg
              className={s.heroUnderline}
              width="200"
              height="14"
              viewBox="0 0 200 14"
              aria-hidden="true"
            >
              <path
                ref={underlineRef}
                d="M0,7 C16,2 32,12 50,5 C68,0 84,10 100,4 C116,-1 132,9 150,5 C168,2 184,9 200,7"
                className={s.underlinePath}
              />
            </svg>
          </div>

          <p className={`${s.heroSub} ${s.reveal}`} data-delay="2600">
            Moods AI gives mental health professionals their time back —
            so they can do what they were trained to do.
          </p>

          <div
            className={`${s.magneticWrap} ${s.reveal}`}
            data-delay="2800"
            onMouseMove={(e) => handleMagnetic(e, 7)}
            onMouseLeave={resetMagnetic}
          >
            <a href="#" className={s.heroCta}>
              <span className={s.heroCtaText}>Start free trial</span>
            </a>
          </div>
        </section>

        <div className={s.sectionDivider} ref={dividerRef} />

        {/* ════════════════════════════════════════════
            Section 2: The Problem (interactive slider)
        ════════════════════════════════════════════ */}
        <section
          className={s.comparisonSection}
          ref={(el) => { sectionRefs.current[1] = el }}
          id="problem"
        >
          <p className={`${s.sectionLabel} ${s.reveal}`}>
            01 — The problem
          </p>
          <h2 className={`${s.sectionHeadline} ${s.reveal}`} data-delay="100">
            A therapist&apos;s day: before &amp; after
          </h2>

          {/* Desktop: interactive draggable slider */}
          <div
            className={`${s.sliderContainer} ${s.reveal}`}
            data-delay="200"
            ref={sliderRef}
          >
            {/* After (background, full width) */}
            <div className={s.sliderSide}>
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

            {/* Before (overlay, clipped) */}
            <div
              className={s.sliderBefore}
              style={{ width: `${sliderPos}%` }}
            >
              <div className={s.sliderSide} style={{ width: sliderRef.current?.offsetWidth || '100%' }}>
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
            </div>

            {/* Drag handle */}
            <div
              className={s.sliderHandle}
              style={{ left: `${sliderPos}%` }}
              onMouseDown={onSliderMouseDown}
              onTouchStart={onSliderTouchStart}
            >
              <div className={s.sliderHandleGrip}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="4" y1="3" x2="4" y2="11" />
                  <line x1="10" y1="3" x2="10" y2="11" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile: stacked side by side */}
          <div className={s.splitScreenMobile}>
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
        </section>

        <div className={s.sectionDivider} ref={dividerRef} />

        {/* ════════════════════════════════════════════
            Section 3: The Solution (strikethrough -> Moods)
        ════════════════════════════════════════════ */}
        <section
          className={s.solutionSection}
          ref={(el) => { sectionRefs.current[2] = el }}
          id="solution"
        >
          <p className={`${s.sectionLabel} ${s.reveal}`}>
            02 — The solution
          </p>
          <h2 className={`${s.sectionHeadline} ${s.reveal}`} data-delay="100">
            One platform. Not ten.
          </h2>
          <p className={`${s.solutionSubline} ${s.reveal}`} data-delay="200">
            Replace your scattered toolkit with one integrated system.
          </p>
          <div className={`${s.solutionGrid} ${s.reveal}`} data-delay="300">
            {/* Before column: 10 tools with strikethrough */}
            <div className={s.solutionBefore}>
              <ul className={s.toolList}>
                {TOOLS.map((tool, i) => (
                  <li
                    key={tool}
                    className={s.toolItem}
                    ref={(el) => { toolItemRefs.current[i] = el }}
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
            {/* Converging lines SVG */}
            <div className={s.solutionCenter}>
              <svg
                className={s.convergeSvg}
                viewBox="0 0 120 340"
                fill="none"
                stroke="#CBBDB9"
                strokeWidth="1"
                aria-hidden="true"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const y = 16 + i * 32
                  return (
                    <g key={i}>
                      <circle cx="8" cy={y} r="2.5" fill="#CBBDB9" stroke="none" />
                      <path d={`M11,${y} C40,${y} 80,170 112,170`} />
                    </g>
                  )
                })}
                <circle cx="112" cy="170" r="6" fill="#423C38" stroke="none" />
                <circle
                  ref={convergePulseRef}
                  cx="112"
                  cy="170"
                  r="11"
                  fill="none"
                  stroke="#423C38"
                  strokeWidth="1"
                />
              </svg>
            </div>
            {/* After: single Moods node */}
            <div className={s.solutionAfter}>
              <span className={s.convergeTarget}>Moods.ai</span>
            </div>
          </div>
        </section>

        <div className={s.sectionDivider} ref={dividerRef} />

        {/* ════════════════════════════════════════════
            Section 4: Product Tour (vertical timeline)
        ════════════════════════════════════════════ */}
        <section
          className={s.tourSection}
          ref={(el) => { sectionRefs.current[3] = el }}
          id="tour"
        >
          <p className={`${s.sectionLabel} ${s.sectionLabelWide} ${s.reveal}`}>
            03 — Product tour
          </p>
          <div className={s.timelineContainer} ref={timelineContainerRef}>
            <div className={s.timelineLine} aria-hidden="true">
              <div className={s.timelineLineProgress} ref={timelineLineRef} />
            </div>
            {TIMELINE_NODES.map((node, i) => {
              const isLeft = node.side === 'left'
              const cardClass = isLeft
                ? `${s.timelineCard} ${s.left} ${s.revealLeft}`
                : `${s.timelineCard} ${s.right} ${s.revealRight}`
              const emptyClass = `${s.timelineCard} ${s.empty}`

              return (
                <div key={node.title} className={s.timelineItem}>
                  {isLeft ? (
                    <>
                      <div className={cardClass} data-delay={String(i * 150)}>
                        <div className={s.timelineCardIcon}>{node.icon}</div>
                        <div className={s.timelineCardTitle}>{node.title}</div>
                        <p className={s.timelineCardDesc}>{node.desc}</p>
                      </div>
                      <div className={s.timelineNode} aria-hidden="true" />
                      <div className={emptyClass} />
                    </>
                  ) : (
                    <>
                      <div className={emptyClass} />
                      <div className={s.timelineNode} aria-hidden="true" />
                      <div className={cardClass} data-delay={String(i * 150)}>
                        <div className={s.timelineCardIcon}>{node.icon}</div>
                        <div className={s.timelineCardTitle}>{node.title}</div>
                        <p className={s.timelineCardDesc}>{node.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <div className={s.sectionDivider} ref={dividerRef} />

        {/* ════════════════════════════════════════════
            Section 5: AI in Action
        ════════════════════════════════════════════ */}
        <section
          className={s.aiSection}
          ref={(el) => { sectionRefs.current[4] = el }}
          id="ai"
        >
          <p className={`${s.sectionLabel} ${s.reveal}`}>
            04 — AI in action
          </p>
          <h2 className={`${s.sectionHeadline} ${s.reveal}`} data-delay="100">
            Your voice becomes your documentation.
          </h2>

          <div className={`${s.aiFlow} ${s.reveal}`} data-delay="200">
            {/* Left: organic waveform */}
            <div className={s.aiFlowPanel}>
              <div className={s.aiFlowLabel}>Recording</div>
              <div className={s.waveformContainer} ref={waveformRef}>
                {Array.from({ length: 40 }, (_, i) => (
                  <div
                    key={i}
                    className={s.waveBar}
                    style={{ height: '15%' }}
                  />
                ))}
              </div>
            </div>

            {/* Center: processing dots */}
            <div className={s.aiFlowCenter}>
              <div className={s.processingDots}>
                <span className={s.dot} />
                <span className={s.dot} />
                <span className={s.dot} />
              </div>
            </div>

            {/* Right: e-ink chat */}
            <div className={s.aiFlowPanel}>
              <div className={s.aiFlowLabel}>AskMoody</div>
              <div className={s.chatWindow}>
                <div className={s.chatHeader}>
                  AskMoody &middot; Intelligence layer
                </div>
                <div className={s.chatBody}>
                  <div className={`${s.chatMsg} ${s.chatMsgUser}`}>
                    What&rsquo;s our declarability average this week?
                  </div>
                  <div className={`${s.chatMsg} ${s.chatMsgMoody}`}>
                    <div
                      ref={thinkingRef}
                      className={s.thinkingDots}
                      style={{ display: 'none' }}
                    >
                      <span className={s.thinkingDot} />
                      <span className={s.thinkingDot} />
                      <span className={s.thinkingDot} />
                    </div>
                    <span ref={chatResponseRef} />
                    <span ref={chatCursorRef} className={s.chatCursor} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated stat counters */}
          <div className={`${s.aiStats} ${s.reveal}`} data-delay="400">
            <div className={s.aiStat}>
              <div className={s.statBig}>
                <AnimatedCounter end={25} suffix=" min" inView={statsInView} />
              </div>
              <div className={s.statCaption}>Saved per session</div>
            </div>
            <div className={s.aiStat}>
              <div className={s.statBig}>
                <AnimatedCounter end={500} suffix="K" inView={statsInView} />
              </div>
              <div className={s.statCaption}>AI tokens processed daily</div>
            </div>
            <div className={s.aiStat}>
              <div className={s.statBig}>
                <AnimatedCounter end={29} prefix={'\u20AC'} suffix="/seat" inView={statsInView} />
              </div>
              <div className={s.statCaption}>Starting price</div>
            </div>
          </div>
        </section>

        <div className={s.sectionDivider} ref={dividerRef} />

        {/* ════════════════════════════════════════════
            Section 6: Security
        ════════════════════════════════════════════ */}
        <section
          className={s.securitySection}
          ref={(el) => { sectionRefs.current[5] = el }}
          id="security"
        >
          <p className={`${s.sectionLabel} ${s.reveal}`}>
            05 — Security &amp; compliance
          </p>
          <h2 className={`${s.sectionHeadline} ${s.reveal}`} data-delay="100">
            Healthcare-grade by default.
          </h2>
          <p className={`${s.securitySubline} ${s.reveal}`} data-delay="200">
            Built for Dutch GGZ compliance from day one.
          </p>
          <div className={s.securityGrid}>
            {COMPLIANCE.map((item, i) => (
              <div
                key={item.title}
                className={`${s.securityItem} ${s.reveal}`}
                data-delay={String(i * 80)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className={s.checkmarkSvg}
                  aria-hidden="true"
                >
                  <path
                    d="M3,12 L9,18 L21,6"
                    ref={(el) => { checkRefs.current[i] = el }}
                    className={s.checkPath}
                  />
                </svg>
                <div className={s.securityItemTitle}>{item.title}</div>
                <div className={s.securityItemDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className={s.sectionDivider} ref={dividerRef} />

        {/* ════════════════════════════════════════════
            Section 7: Social Proof
        ════════════════════════════════════════════ */}
        <section
          className={s.socialSection}
          ref={(el) => { sectionRefs.current[6] = el }}
          id="social"
        >
          <p className={`${s.sectionLabel} ${s.reveal}`}>
            06 — From practitioners
          </p>
          <div className={s.socialGrid}>
            {QUOTES.map((q, i) => (
              <div
                key={q.attrib}
                className={`${s.quoteCard} ${s.reveal}`}
                data-delay={String(i * 120)}
              >
                <span className={s.quoteMark} aria-hidden="true">{'\u201C'}</span>
                <p className={s.quoteText}>{q.text}</p>
                <p className={s.quoteAttrib}>{q.attrib}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={s.sectionDivider} ref={dividerRef} />

        {/* ════════════════════════════════════════════
            Section 8: Pricing
        ════════════════════════════════════════════ */}
        <section
          className={s.pricingSection}
          ref={(el) => { sectionRefs.current[7] = el }}
          id="pricing"
        >
          <p className={`${s.sectionLabel} ${s.reveal}`}>
            07 — Pricing
          </p>
          <h2 className={`${s.sectionHeadline} ${s.reveal}`} data-delay="100">
            Simple, transparent pricing.
          </h2>
          <p className={`${s.pricingSubline} ${s.reveal}`} data-delay="200">
            Start free. Scale when you&apos;re ready.
          </p>
          <div className={`${s.pricingGrid} ${s.reveal}`} data-delay="300">
            {PRICING.map((plan) => (
              <div
                className={`${s.pricingCard} ${plan.featured ? s.pricingCardFeatured : ''}`}
                key={plan.name}
              >
                <div className={s.pricingName}>{plan.name}</div>
                <div className={s.pricingPrice}>{plan.price}</div>
                <div className={s.pricingUnit}>{plan.unit}</div>
                {plan.features.map((f, fi) => (
                  <div className={s.pricingFeature} key={fi}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      className={s.pricingCheck}
                      aria-hidden="true"
                    >
                      <path
                        d="M3,12 L9,18 L21,6"
                        ref={(el) => {
                          pricingCheckRefs.current[priceCheckIdx] = el
                          priceCheckIdx++
                        }}
                        className={s.pricingCheckPath}
                      />
                    </svg>
                    <span>{f}</span>
                  </div>
                ))}
                <div
                  className={s.magneticWrap}
                  onMouseMove={(e) => handleMagnetic(e, 5)}
                  onMouseLeave={resetMagnetic}
                >
                  <a
                    href="#"
                    className={`${s.pricingCta} ${plan.featured ? s.pricingCtaFeatured : ''}`}
                  >
                    <span className={s.pricingCtaText}>
                      {plan.featured ? 'Start free trial' : 'Get started'}
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={s.sectionDivider} ref={dividerRef} />

        {/* ════════════════════════════════════════════
            Section 9: CTA (dark section)
        ════════════════════════════════════════════ */}
        <section
          className={s.ctaSection}
          ref={(el) => { sectionRefs.current[8] = el }}
          id="cta"
        >
          <div className={`${s.ctaArrowWrapper} ${s.reveal}`}>
            <svg
              width="100"
              height="90"
              viewBox="0 0 100 90"
              className={s.ctaArrowSvg}
              aria-hidden="true"
            >
              <path
                ref={arrowRef}
                d="M50,0 C40,25 20,45 28,70 Q35,82 42,80"
                className={s.arrowPath}
              />
              <path
                ref={arrowHeadRef}
                d="M38,80 L42,80 L44,74"
                className={s.arrowHeadPath}
              />
            </svg>
          </div>

          <h2 className={`${s.ctaHeadline} ${s.reveal}`} data-delay="100">
            Your practice deserves better.
          </h2>
          <div
            className={`${s.magneticWrap} ${s.reveal}`}
            data-delay="200"
            onMouseMove={(e) => handleMagnetic(e, 8)}
            onMouseLeave={resetMagnetic}
          >
            <a href="#" className={s.ctaButton}>
              <span className={s.ctaButtonText}>Start for free</span>
            </a>
          </div>
          <p className={`${s.ctaNote} ${s.reveal}`} data-delay="300">
            14 days free. No credit card.
          </p>
        </section>

        {/* ── Footer ── */}
        <footer className={s.footer}>
          <p className={s.footerText}>
            Moods AI &middot; Amsterdam &middot;{' '}
            <a href="mailto:info@ohmymood.com">info@ohmymood.com</a>
          </p>
        </footer>

      </div>
    </div>
  )
}
