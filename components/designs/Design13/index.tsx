'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import s from './styles.module.css'

/* ═══════════════════════════════════════════════════════════════
   Design 13 — "The Impossible"
   A paper-first, 3D interactive experience for Moods AI
   ═══════════════════════════════════════════════════════════════ */

// ── Typing effect hook ──────────────────────────────────────
function useTypingEffect(phrases: string[], speed = 60, deleteSpeed = 40, pauseMs = 1500) {
  const [text, setText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 2200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!started) return
    const current = phrases[phraseIdx]
    if (!current) return

    if (!isDeleting && charIdx <= current.length) {
      const timer = setTimeout(() => {
        setText(current.slice(0, charIdx))
        setCharIdx(charIdx + 1)
      }, speed)
      return () => clearTimeout(timer)
    }

    if (!isDeleting && charIdx > current.length) {
      if (phraseIdx === phrases.length - 1) return // stop at last phrase
      const timer = setTimeout(() => setIsDeleting(true), pauseMs)
      return () => clearTimeout(timer)
    }

    if (isDeleting && charIdx > 0) {
      const timer = setTimeout(() => {
        setText(current.slice(0, charIdx - 1))
        setCharIdx(charIdx - 1)
      }, deleteSpeed)
      return () => clearTimeout(timer)
    }

    if (isDeleting && charIdx === 0) {
      setIsDeleting(false)
      setPhraseIdx((phraseIdx + 1) % phrases.length)
    }
  }, [started, charIdx, isDeleting, phraseIdx, phrases, speed, deleteSpeed, pauseMs])

  return text
}

// ── IntersectionObserver hook ────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ── Scroll progress hook ────────────────────────────────────
function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId: number
    const handler = () => {
      rafId = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
        setProgress(p)
      })
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => {
      window.removeEventListener('scroll', handler)
      cancelAnimationFrame(rafId)
    }
  }, [ref])

  return progress
}

/* ═══════════════════════════════════════════════════════════════
   FEATURE CARD DATA
   ═══════════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    id: 'ai-doc',
    title: 'AI Documentation',
    bullets: ['Voice-to-report in real-time', 'NEN 7510 compliant output', '25 min to 5 min per session'],
    rotate: -1.5,
  },
  {
    id: 'practice',
    title: 'Practice Management',
    bullets: ['Smart scheduling & planning', 'Automated billing & invoicing', 'Patient journey tracking'],
    rotate: 2,
  },
  {
    id: 'video',
    title: 'Video & Communication',
    bullets: ['HD video consultations', 'Secure messaging built-in', 'Session recording & transcripts'],
    rotate: -0.8,
  },
  {
    id: 'hr',
    title: 'HR & Team',
    bullets: ['Team capacity overview', 'Leave & absence management', 'Performance dashboards'],
    rotate: 1.2,
  },
  {
    id: 'bi',
    title: 'Business Intelligence',
    bullets: ['Revenue & utilization metrics', 'Treatment outcome tracking', 'Custom report builder'],
    rotate: -2.1,
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    bullets: ['End-to-end encryption', 'NEN 7510 & 7513 certified', 'AES-256 at rest & in transit'],
    rotate: 0.7,
  },
]

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS DATA
   ═══════════════════════════════════════════════════════════════ */

const TESTIMONIALS = [
  {
    quote: 'We went from 25 minutes of documentation per session to under 5. Our therapists actually enjoy their evenings now.',
    name: 'Dr. Annemarie de Vries',
    title: 'Clinical Director, Amsterdam GGZ',
    color: 'noteColor1' as const,
    rotate: -2.5,
    scatterX: '-60px',
    scatterY: '40px',
  },
  {
    quote: 'AskMoody changed how we run our practice. One question and we have a full financial breakdown.',
    name: 'Mark Jansen',
    title: 'Practice Owner, Utrecht',
    color: 'noteColor2' as const,
    rotate: 1.8,
    scatterX: '50px',
    scatterY: '-30px',
  },
  {
    quote: 'The security certifications gave us confidence from day one. NEN 7510 compliance out of the box is rare.',
    name: 'Lisa van den Berg',
    title: 'IT Manager, Rotterdam Clinic',
    color: 'noteColor3' as const,
    rotate: -1.2,
    scatterX: '-40px',
    scatterY: '55px',
  },
  {
    quote: 'Finally, one platform that replaces our six different tools. The team adopted it within a week.',
    name: 'Joost Bakker',
    title: 'Operations Lead, Den Haag',
    color: 'noteColor4' as const,
    rotate: 2.3,
    scatterX: '65px',
    scatterY: '-45px',
  },
]

/* ═══════════════════════════════════════════════════════════════
   TERMINAL SEQUENCE DATA
   ═══════════════════════════════════════════════════════════════ */

const TERMINAL_LINES = [
  { type: 'prompt', text: '> ' },
  { type: 'command', text: 'moods ai:ask "Show me this week\'s revenue breakdown"', delay: 60 },
  { type: 'blank', text: '' },
  { type: 'muted', text: 'Processing... \u25A0\u25A0\u25A0\u25A1\u25A1 60%' },
  { type: 'muted', text: 'Processing... \u25A0\u25A0\u25A0\u25A0\u25A0 100%' },
  { type: 'blank', text: '' },
  { type: 'table', text: '\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510' },
  { type: 'table', text: '\u2502  Revenue Breakdown \u2014 Week 13, 2026       \u2502' },
  { type: 'table', text: '\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524' },
  { type: 'table', text: '\u2502  Category    \u2502  Amount   \u2502  vs Last Week \u2502' },
  { type: 'table', text: '\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524' },
  { type: 'row-up', text: '\u2502  Treatment   \u2502  \u20AC12,400  \u2502  \u2191 8%         \u2502' },
  { type: 'row-down', text: '\u2502  Diagnostics \u2502  \u20AC4,200   \u2502  \u2193 2%         \u2502' },
  { type: 'row-up', text: '\u2502  eHealth     \u2502  \u20AC1,830   \u2502  \u2191 15%        \u2502' },
  { type: 'row-neutral', text: '\u2502  Workshops   \u2502  \u20AC2,100   \u2502  \u2192 0%         \u2502' },
  { type: 'table', text: '\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524' },
  { type: 'row-up', text: '\u2502  Total       \u2502  \u20AC20,530  \u2502  \u2191 7%         \u2502' },
  { type: 'table', text: '\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518' },
  { type: 'blank', text: '' },
  { type: 'prompt-end', text: '> ' },
]

/* ═══════════════════════════════════════════════════════════════
   MINI INTERACTIONS FOR CARDS
   ═══════════════════════════════════════════════════════════════ */

function WaveformMini() {
  return (
    <div className={s.waveform}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={s.waveBar} style={{ height: `${8 + Math.random() * 12}px` }} />
      ))}
    </div>
  )
}

function CalendarMini() {
  const days = Array.from({ length: 14 }, (_, i) => i + 18)
  return (
    <div className={s.miniCalendar}>
      {days.map(d => (
        <div key={d} className={`${s.calDay} ${d === 25 ? s.calToday : ''}`}>
          {d}
        </div>
      ))}
    </div>
  )
}

function VideoMini() {
  return (
    <div className={s.miniVideo}>
      <div className={s.liveDot} />
      <span>LIVE 00:34:12</span>
    </div>
  )
}

function OrgMini() {
  return (
    <div className={s.miniOrg}>
      <div className={s.orgRow}>
        <div className={s.orgNode} />
      </div>
      <div className={s.orgRow}>
        <div className={s.orgNode} />
        <div className={s.orgNode} />
        <div className={s.orgNode} />
      </div>
    </div>
  )
}

function ChartMini() {
  return (
    <svg className={s.miniChart} viewBox="0 0 120 32" fill="none">
      <polyline
        className={s.chartLine}
        points="0,28 15,24 30,26 45,18 60,20 75,12 90,14 105,6 120,8"
      />
    </svg>
  )
}

function LockMini() {
  return (
    <div className={s.miniLock}>
      <div className={`${s.lockShackle} ${s.lockShackleOpen}`} />
      <div className={s.lockBody} />
    </div>
  )
}

const CARD_MINIS: Record<string, React.FC> = {
  'ai-doc': WaveformMini,
  'practice': CalendarMini,
  'video': VideoMini,
  'hr': OrgMini,
  'bi': ChartMini,
  'security': LockMini,
}

/* Card icon SVGs */
function CardIconSvg({ id }: { id: string }) {
  const iconMap: Record<string, JSX.Element> = {
    'ai-doc': (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8h24l8 8v24H8V8z" />
        <path d="M32 8v8h8" />
        <path d="M14 20h20M14 26h16M14 32h12" />
      </svg>
    ),
    'practice': (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="10" width="36" height="30" rx="2" />
        <path d="M6 18h36" />
        <path d="M16 6v8M32 6v8" />
        <rect x="12" y="24" width="6" height="6" />
      </svg>
    ),
    'video': (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="12" width="28" height="24" rx="2" />
        <path d="M32 20l12-6v20l-12-6z" />
      </svg>
    ),
    'hr': (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="14" r="6" />
        <path d="M12 36c0-6.627 5.373-12 12-12s12 5.373 12 12" />
        <circle cx="38" cy="18" r="4" />
        <path d="M38 26c4 0 6 2 6 6" />
      </svg>
    ),
    'bi': (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 40h36" />
        <rect x="10" y="24" width="6" height="16" />
        <rect x="21" y="16" width="6" height="24" />
        <rect x="32" y="8" width="6" height="32" />
      </svg>
    ),
    'security': (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="22" width="24" height="18" rx="2" />
        <path d="M18 22v-6a6 6 0 0112 0v6" />
        <circle cx="24" cy="32" r="2" />
      </svg>
    ),
  }
  return <div className={s.cardIcon}>{iconMap[id]}</div>
}

/* ═══════════════════════════════════════════════════════════════
   TERMINAL COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function TerminalSection() {
  const { ref, inView } = useInView(0.3)
  const [lines, setLines] = useState<string[]>([])
  const [showCursor, setShowCursor] = useState(false)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (!inView || animatedRef.current) return
    animatedRef.current = true

    let timeout: NodeJS.Timeout
    let lineIdx = 0

    function addLine() {
      if (lineIdx >= TERMINAL_LINES.length) {
        setShowCursor(true)
        return
      }
      const line = TERMINAL_LINES[lineIdx]
      const lineText = line.text

      if (line.type === 'command') {
        // Type character by character
        let charI = 0
        function typeChar() {
          if (charI <= lineText.length) {
            setLines(prev => {
              const copy = [...prev]
              copy[copy.length - 1] = '> ' + lineText.slice(0, charI)
              return copy
            })
            charI++
            timeout = setTimeout(typeChar, line.delay || 60)
          } else {
            lineIdx++
            timeout = setTimeout(addLine, 200)
          }
        }
        setLines(prev => [...prev, '> '])
        lineIdx++ // skip prompt that was already added
        typeChar()
        return
      }

      setLines(prev => [...prev, lineText])
      lineIdx++
      const delay = line.type === 'blank' ? 100 : line.type === 'muted' ? 600 : 80
      timeout = setTimeout(addLine, delay)
    }

    timeout = setTimeout(addLine, 500)
    return () => clearTimeout(timeout)
  }, [inView])

  return (
    <section className={s.terminalSection} ref={ref}>
      <div className={s.terminal}>
        <div className={s.terminalBar}>
          <div className={`${s.terminalDot} ${s.terminalDotRed}`} />
          <div className={`${s.terminalDot} ${s.terminalDotYellow}`} />
          <div className={`${s.terminalDot} ${s.terminalDotGreen}`} />
          <span className={s.terminalTitle}>AskMoody v2.0</span>
        </div>
        <div className={s.terminalBody}>
          {lines.map((line, i) => (
            <div key={i}>
              {line}
            </div>
          ))}
          {showCursor && (
            <span>
              <span className={s.termPrompt}>{'> '}</span>
              <span className={s.termCursor} />
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ODOMETER DIGIT COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function OdometerDigit({ digit, triggered }: { digit: string; triggered: boolean }) {
  const num = parseInt(digit, 10)
  if (isNaN(num)) {
    return <span className={s.odometerStatic}>{digit}</span>
  }

  const offset = triggered ? -(num * 64) : 0

  return (
    <div className={s.odometerDigit}>
      <div
        className={s.digitStrip}
        style={{ transform: `translateY(${offset}px)` }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={s.digitChar}>{i}</div>
        ))}
      </div>
    </div>
  )
}

function OdometerValue({ value, triggered }: { value: string; triggered: boolean }) {
  return (
    <div className={s.odometerWrap}>
      {value.split('').map((ch, i) => (
        <OdometerDigit key={i} digit={ch} triggered={triggered} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   VAULT DOOR SVG
   ═══════════════════════════════════════════════════════════════ */

function VaultDoorSvg({ open }: { open: boolean }) {
  return (
    <div className={`${s.vaultDoor} ${open ? s.open : ''}`}>
      <svg viewBox="0 0 200 200" fill="none">
        {/* Outer ring */}
        <circle cx="100" cy="100" r="95" stroke="#CBBDB9" strokeWidth="3" />
        <circle cx="100" cy="100" r="80" stroke="#CBBDB9" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="65" stroke="#CBBDB9" strokeWidth="1" />
        {/* Spokes */}
        <line x1="100" y1="5" x2="100" y2="35" stroke="#CBBDB9" strokeWidth="2" />
        <line x1="100" y1="165" x2="100" y2="195" stroke="#CBBDB9" strokeWidth="2" />
        <line x1="5" y1="100" x2="35" y2="100" stroke="#CBBDB9" strokeWidth="2" />
        <line x1="165" y1="100" x2="195" y2="100" stroke="#CBBDB9" strokeWidth="2" />
        {/* Handle */}
        <circle cx="100" cy="100" r="20" stroke="#423C38" strokeWidth="3" fill="none" />
        <circle cx="100" cy="100" r="4" fill="#423C38" />
        {/* Bolts */}
        {[0, 60, 120, 180, 240, 300].map(angle => {
          const rad = (angle * Math.PI) / 180
          const x = 100 + 88 * Math.cos(rad)
          const y = 100 + 88 * Math.sin(rad)
          return <circle key={angle} cx={x} cy={y} r="5" fill="#CBBDB9" />
        })}
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAPER AIRPLANE SVG
   ═══════════════════════════════════════════════════════════════ */

function PaperAirplaneSvg() {
  return (
    <svg className={s.airplaneSvg} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M5 30l50-25-15 25 15 25-50-25z" />
      <path d="M5 30h35" />
      <path d="M40 5l-5 25 5 25" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PIN SVG
   ═══════════════════════════════════════════════════════════════ */

function PinSvg() {
  return (
    <svg className={s.notePin} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="8" r="5" fill="#c44" />
      <circle cx="10" cy="8" r="2.5" fill="#e66" />
      <line x1="10" y1="13" x2="10" y2="20" stroke="#888" strokeWidth="1" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Design13() {
  // ── Hero typing ──
  const typedText = useTypingEffect([
    'What if your practice ran itself?',
    'Almost.',
  ])

  // ── Card stack ──
  const cardSection = useInView(0.15)

  // ── Split world ──
  const splitRef = useRef<HTMLDivElement>(null)
  const splitProgress = useScrollProgress(splitRef)

  // ── Metrics ──
  const metricsSection = useInView(0.3)

  // ── Testimonials ──
  const testimonialsSection = useInView(0.2)

  // ── Vault ──
  const vaultSection = useInView(0.3)

  // ── CTA / Airplane ──
  const ctaSection = useInView(0.3)
  const [airplaneLaunched, setAirplaneLaunched] = useState(false)

  useEffect(() => {
    if (ctaSection.inView) {
      const t = setTimeout(() => setAirplaneLaunched(true), 800)
      return () => clearTimeout(t)
    }
  }, [ctaSection.inView])

  // ── Flip cards ──
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const toggleFlip = useCallback((idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }))
  }, [])

  // ── CTA ripple ──
  const handleRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = s.ripple
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px'
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px'
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }, [])

  // ── Split clip-path values ──
  const splitX = 70 - splitProgress * 60
  const splitX2 = 55 - splitProgress * 60

  // ── Pricing data ──
  const pricingPlans = [
    {
      name: 'Starter',
      price: '\u20AC19',
      per: 'per seat / month',
      features: ['AI Documentation', 'Basic scheduling', 'Video consultations', 'Secure messaging', 'Email support'],
    },
    {
      name: 'Professional',
      price: '\u20AC29',
      per: 'per seat / month',
      isPro: true,
      features: ['Everything in Starter', 'AskMoody AI assistant', 'Business Intelligence', 'HR & Team management', 'API access', 'Priority support'],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      per: 'contact us',
      features: ['Everything in Professional', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'On-premise option', 'Training & onboarding'],
    },
  ]

  return (
    <div className={s.root}>

      {/* ═══ 1. HERO — Paper Unfolds ═══ */}
      <section className={s.heroWrapper}>
        <div className={s.paperFold}>
          <div className={`${s.foldPanel} ${s.foldTop}`} />
          <div className={`${s.foldPanel} ${s.foldBottom}`} />
          <div className={`${s.foldPanel} ${s.foldLeft}`} />
          <div className={`${s.foldPanel} ${s.foldRight}`} />
        </div>

        <div className={s.heroContent}>
          <h1 className={s.heroLogo}>Moods.ai</h1>
          <p className={s.heroTagline}>The intelligent practice for modern mental healthcare</p>
          <div className={s.heroTyped}>
            {typedText}
            <span className={s.cursor} />
          </div>
          <button className={s.heroCta}>Start free trial</button>
        </div>
      </section>

      {/* ═══ 2. 3D CARD STACK ═══ */}
      <section className={s.cardStackSection} ref={cardSection.ref}>
        <h2 className={s.cardStackTitle}>One platform, every tool you need</h2>
        <p className={s.cardStackSub}>Six pillars. Zero compromises.</p>

        <div className={s.cardStackGrid}>
          {FEATURES.map((feat, i) => {
            const MiniComponent = CARD_MINIS[feat.id]
            return (
              <div
                key={feat.id}
                className={`${s.featureCard} ${cardSection.inView ? s.revealed : s.stacked}`}
                style={{
                  '--card-rotate': `${feat.rotate}deg`,
                  '--card-z': `${i * -10}px`,
                  transitionDelay: cardSection.inView ? `${i * 0.1}s` : '0s',
                } as React.CSSProperties}
              >
                <CardIconSvg id={feat.id} />
                <h3 className={s.cardTitle}>{feat.title}</h3>
                <ul className={s.cardBullets}>
                  {feat.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                <div className={s.cardMini}>
                  {MiniComponent && <MiniComponent />}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ 3. SPLIT WORLD ═══ */}
      <section className={s.splitSection} ref={splitRef}>
        <div className={s.splitDark}>
          <span className={s.splitLabel}>Without Moods</span>
          <h2 className={s.splitHeading} style={{ color: '#888' }}>Chaos. Fragmentation. Burnout.</h2>
          <div className={s.chaosIcons}>
            {['\uD83D\uDCC5', '\uD83D\uDCF9', '\uD83D\uDCCA', '\uD83D\uDD12', '\uD83D\uDCDD', '\uD83D\uDCE7', '\uD83D\uDCB0', '\uD83D\uDC65'].map((icon, i) => (
              <div key={i} className={s.chaosIcon}>{icon}</div>
            ))}
          </div>
        </div>
        <div
          className={s.splitLight}
          style={{
            '--split-x': `${splitX}%`,
            '--split-x2': `${splitX2}%`,
          } as React.CSSProperties}
        >
          <span className={s.splitLabel}>With Moods</span>
          <h2 className={s.splitHeading}>Order. Clarity. Focus.</h2>
          <div className={s.orderGrid}>
            {['\uD83D\uDCC5', '\uD83D\uDCF9', '\uD83D\uDCCA', '\uD83D\uDD12', '\uD83D\uDCDD', '\uD83D\uDCE7', '\uD83D\uDCB0', '\uD83D\uDC65'].map((icon, i) => (
              <div key={i} className={s.orderIcon}>{icon}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. ASKMOODY TERMINAL ═══ */}
      <TerminalSection />

      {/* ═══ 5. METRIC ODOMETERS ═══ */}
      <section className={s.metricsSection} ref={metricsSection.ref}>
        <h2 className={s.metricsSectionTitle}>The numbers speak</h2>
        <p className={s.metricsSub}>Measured impact across hundreds of practices.</p>

        <div className={s.metricsGrid}>
          <div className={s.metricCard}>
            <OdometerValue value="5" triggered={metricsSection.inView} />
            <div className={s.metricLabel}>Minutes per session</div>
            <div className={s.metricDetail}>Down from 25 minutes</div>
          </div>
          <div className={s.metricCard}>
            <OdometerValue value="500K" triggered={metricsSection.inView} />
            <div className={s.metricLabel}>AI tokens / month</div>
            <div className={s.metricDetail}>Powering intelligent docs</div>
          </div>
          <div className={s.metricCard}>
            <OdometerValue value="99.2%" triggered={metricsSection.inView} />
            <div className={s.metricLabel}>Accuracy</div>
            <div className={s.metricDetail}>Clinical-grade precision</div>
          </div>
          <div className={s.metricCard}>
            <OdometerValue value="\u20AC29" triggered={metricsSection.inView} />
            <div className={s.metricLabel}>Per seat / month</div>
            <div className={s.metricDetail}>Most popular plan</div>
          </div>
        </div>
      </section>

      {/* ═══ 6. TESTIMONIAL PAPER NOTES ═══ */}
      <section className={s.testimonialsSection} ref={testimonialsSection.ref}>
        <h2 className={s.testimonialsSectionTitle}>What practitioners say</h2>

        <div className={s.notesGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`${s.paperNote} ${s[t.color]} ${testimonialsSection.inView ? s.settled : s.scattered}`}
              style={{
                '--note-rotate': `${t.rotate}deg`,
                '--scatter-x': t.scatterX,
                '--scatter-y': t.scatterY,
                transitionDelay: testimonialsSection.inView ? `${i * 0.12}s` : '0s',
              } as React.CSSProperties}
            >
              <PinSvg />
              <p className={s.noteQuote}>{t.quote}</p>
              <div className={s.noteAttribution}>
                {t.name}<br />
                {t.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. PRICING FLIP CARDS ═══ */}
      <section className={s.pricingSection}>
        <h2 className={s.pricingSectionTitle}>Simple, transparent pricing</h2>
        <p className={s.pricingSub}>Click a card to see what is included.</p>

        <div className={s.pricingGrid}>
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              className={`${s.flipCard} ${flippedCards[i] ? s.flipped : ''} ${plan.isPro ? s.proCard : ''}`}
              onClick={() => toggleFlip(i)}
            >
              <div className={s.flipCardInner}>
                <div className={s.flipFront}>
                  <div className={s.planName}>{plan.name}</div>
                  <div className={s.planPrice}>{plan.price}</div>
                  <div className={s.planPer}>{plan.per}</div>
                  <div className={s.flipHint}>Click to see features</div>
                </div>
                <div className={s.flipBack}>
                  <div className={s.backTitle}>{plan.name}</div>
                  <ul className={s.backFeatures}>
                    {plan.features.map((f, j) => (
                      <li key={j}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 8. SECURITY VAULT ═══ */}
      <section className={s.vaultSection} ref={vaultSection.ref}>
        <h2 className={s.vaultTitle}>Built for trust</h2>
        <p className={s.vaultSub}>Enterprise-grade security, certified for Dutch healthcare.</p>

        <div className={s.vaultContainer}>
          <VaultDoorSvg open={vaultSection.inView} />

          <div className={`${s.certGrid} ${vaultSection.inView ? s.visible : ''}`}>
            {[
              { name: 'NEN 7510', desc: 'Healthcare IT' },
              { name: 'NEN 7513', desc: 'Audit logging' },
              { name: 'AES-256', desc: 'Encryption' },
              { name: 'ISO 27001', desc: 'Information security' },
              { name: 'GDPR', desc: 'Data protection' },
            ].map((cert, i) => (
              <div key={i} className={s.certBadge}>
                <div className={s.certName}>{cert.name}</div>
                <div className={s.certDesc}>{cert.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA — PAPER AIRPLANE ═══ */}
      <section className={s.ctaSection} ref={ctaSection.ref}>
        <div className={`${s.airplane} ${airplaneLaunched ? s.launched : s.folding}`}>
          <PaperAirplaneSvg />
        </div>

        <h2 className={s.ctaHeading}>Your practice deserves better.</h2>
        <button className={s.ctaButton} onClick={handleRipple}>
          Start free trial
        </button>
        <p className={s.ctaSubtext}>14 days free. No credit card.</p>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className={s.footer}>
        <p className={s.footerText}>Moods.ai — The intelligent practice for modern mental healthcare</p>
      </footer>
    </div>
  )
}
