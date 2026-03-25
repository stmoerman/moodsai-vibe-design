'use client'
import { useRef, useLayoutEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ───────────────────────────────────────────────────────────────────

interface CarouselPanel {
  id: string
  number: string
  title: string
  subtitle: string
  bullets: string[]
  svgContent: React.ReactNode
}

interface FlowNode {
  id: string
  x: number
  y: number
  title: string
  description: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'hero',               label: 'Foundation' },
  { id: 'platform',          label: 'Platform' },
  { id: 'ai-features',       label: 'AI' },
  { id: 'practice',          label: 'Practice' },
  { id: 'integrations',      label: 'Integrations' },
  { id: 'security',          label: 'Security' },
  { id: 'pricing',           label: 'Pricing' },
  { id: 'footer',            label: 'Foundation' },
]

const CAROUSEL_PANELS: CarouselPanel[] = [
  {
    id: 'ai-docs',
    number: '01',
    title: 'AI & Documentation',
    subtitle: 'Your AI-powered practice assistant',
    bullets: [
      'Dictation-to-report in under 60 seconds',
      'DSM-5 and ROM-compliant output',
      'Context-aware session summaries',
      'Automatic letter generation',
    ],
    svgContent: (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <rect x="8" y="8" width="48" height="64" rx="2" stroke="#5a7fa0" strokeWidth="1.2" />
        <line x1="16" y1="24" x2="48" y2="24" stroke="#5a7fa0" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="16" y1="34" x2="48" y2="34" stroke="#5a7fa0" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="16" y1="44" x2="40" y2="44" stroke="#5a7fa0" strokeWidth="0.8" strokeDasharray="2 2" />
        <circle cx="88" cy="32" r="18" stroke="#5a7fa0" strokeWidth="1.2" />
        <text x="83" y="37" fontFamily="monospace" fontSize="11" fill="#5a7fa0">AI</text>
        <line x1="56" y1="40" x2="70" y2="36" stroke="#5a7fa0" strokeWidth="0.8" markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#5a7fa0" />
          </marker>
        </defs>
      </svg>
    ),
  },
  {
    id: 'practice-mgmt',
    number: '02',
    title: 'Practice Management',
    subtitle: 'Scheduling, onboarding, triage — streamlined',
    bullets: [
      '9-stage intake pipeline with automation',
      'Drag-and-drop calendar with room booking',
      'Waiting list management',
      'ZPM referral processing',
    ],
    svgContent: (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <rect x="8" y="8" width="30" height="28" rx="2" stroke="#5a7fa0" strokeWidth="1.2" />
        <line x1="8" y1="18" x2="38" y2="18" stroke="#5a7fa0" strokeWidth="0.8" />
        <rect x="14" y="22" width="6" height="6" stroke="#5a7fa0" strokeWidth="0.8" />
        <rect x="24" y="22" width="6" height="6" stroke="#5a7fa0" strokeWidth="0.8" />
        <line x1="44" y1="22" x2="56" y2="22" stroke="#5a7fa0" strokeWidth="0.8" markerEnd="url(#arr2)" />
        <rect x="62" y="8" width="50" height="64" rx="2" stroke="#5a7fa0" strokeWidth="1.2" />
        <line x1="62" y1="24" x2="112" y2="24" stroke="#5a7fa0" strokeWidth="0.8" />
        <rect x="68" y="30" width="10" height="8" rx="1" fill="#5a7fa0" fillOpacity="0.2" stroke="#5a7fa0" strokeWidth="0.6" />
        <rect x="82" y="30" width="10" height="8" rx="1" stroke="#5a7fa0" strokeWidth="0.6" />
        <rect x="96" y="30" width="10" height="8" rx="1" stroke="#5a7fa0" strokeWidth="0.6" />
        <rect x="68" y="44" width="10" height="8" rx="1" stroke="#5a7fa0" strokeWidth="0.6" />
        <rect x="82" y="44" width="10" height="8" rx="1" fill="#5a7fa0" fillOpacity="0.2" stroke="#5a7fa0" strokeWidth="0.6" />
        <defs>
          <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#5a7fa0" />
          </marker>
        </defs>
      </svg>
    ),
  },
  {
    id: 'video-comm',
    number: '03',
    title: 'Video & Communication',
    subtitle: 'Video, chat, newsletters — connected',
    bullets: [
      'Integrated video via Whereby',
      'Secure in-platform messaging',
      'Automated appointment reminders',
      'Client newsletter tooling',
    ],
    svgContent: (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <rect x="8" y="16" width="64" height="44" rx="3" stroke="#5a7fa0" strokeWidth="1.2" />
        <polygon points="76,28 76,52 104,40" stroke="#5a7fa0" strokeWidth="1.2" fill="#5a7fa0" fillOpacity="0.1" />
        <circle cx="40" cy="38" r="10" stroke="#5a7fa0" strokeWidth="0.8" />
        <line x1="33" y1="38" x2="47" y2="38" stroke="#5a7fa0" strokeWidth="0.6" />
        <line x1="40" y1="31" x2="40" y2="45" stroke="#5a7fa0" strokeWidth="0.6" />
      </svg>
    ),
  },
  {
    id: 'hr-team',
    number: '04',
    title: 'HR & Team',
    subtitle: 'Leave, absence, onboarding — managed',
    bullets: [
      'Nmbrs payroll integration',
      'Leave and absence tracking',
      'Staff onboarding workflow',
      'Role-based access control',
    ],
    svgContent: (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <circle cx="28" cy="28" r="12" stroke="#5a7fa0" strokeWidth="1.2" />
        <circle cx="60" cy="20" r="12" stroke="#5a7fa0" strokeWidth="1.2" />
        <circle cx="92" cy="28" r="12" stroke="#5a7fa0" strokeWidth="1.2" />
        <path d="M8,60 Q28,44 48,52 Q60,58 72,52 Q92,44 112,60" stroke="#5a7fa0" strokeWidth="1" fill="none" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    id: 'bi',
    number: '05',
    title: 'Business Intelligence',
    subtitle: 'Dashboards, KPIs, financial control',
    bullets: [
      'Real-time production dashboards',
      'DBC and ZPM financial reporting',
      'Stripe billing integration',
      'Customisable KPI thresholds',
    ],
    svgContent: (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <line x1="12" y1="68" x2="112" y2="68" stroke="#5a7fa0" strokeWidth="1" />
        <line x1="12" y1="12" x2="12" y2="68" stroke="#5a7fa0" strokeWidth="1" />
        <rect x="24" y="44" width="14" height="24" fill="#5a7fa0" fillOpacity="0.2" stroke="#5a7fa0" strokeWidth="0.8" />
        <rect x="44" y="32" width="14" height="36" fill="#5a7fa0" fillOpacity="0.3" stroke="#5a7fa0" strokeWidth="0.8" />
        <rect x="64" y="20" width="14" height="48" fill="#5a7fa0" fillOpacity="0.4" stroke="#5a7fa0" strokeWidth="0.8" />
        <rect x="84" y="38" width="14" height="30" fill="#5a7fa0" fillOpacity="0.2" stroke="#5a7fa0" strokeWidth="0.8" />
        <polyline points="31,44 51,32 71,20 91,38" stroke="#5a7fa0" strokeWidth="1" fill="none" />
      </svg>
    ),
  },
  {
    id: 'security-panel',
    number: '06',
    title: 'Security & Compliance',
    subtitle: 'NEN 7510/7513, encryption, audit trails',
    bullets: [
      'NEN 7510 and NEN 7513 certified',
      'End-to-end encryption at rest and in transit',
      'Full audit trail on all record access',
      'GDPR and Dutch health law compliant',
    ],
    svgContent: (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <path d="M60,8 L100,24 L100,52 Q100,68 60,76 Q20,68 20,52 L20,24 Z" stroke="#5a7fa0" strokeWidth="1.2" fill="#5a7fa0" fillOpacity="0.05" />
        <path d="M60,20 L88,32 L88,50 Q88,62 60,68 Q32,62 32,50 L32,32 Z" stroke="#5a7fa0" strokeWidth="0.8" fill="none" strokeDasharray="3 2" />
        <circle cx="60" cy="44" r="6" stroke="#5a7fa0" strokeWidth="1" />
        <line x1="60" y1="38" x2="60" y2="30" stroke="#5a7fa0" strokeWidth="1" />
      </svg>
    ),
  },
]

const PRICING_ROWS = [
  { feature: 'AI documentation',       free: true,  pro: true,  lifetime: true  },
  { feature: 'Session reports',         free: true,  pro: true,  lifetime: true  },
  { feature: 'Video consultations',     free: false, pro: true,  lifetime: true  },
  { feature: 'Practice management',     free: false, pro: true,  lifetime: true  },
  { feature: 'HR & team management',    free: false, pro: true,  lifetime: true  },
  { feature: 'Business intelligence',   free: false, pro: true,  lifetime: true  },
  { feature: 'API access',              free: false, pro: false, lifetime: true  },
  { feature: 'White-label branding',    free: false, pro: false, lifetime: true  },
  { feature: 'Priority support',        free: false, pro: false, lifetime: true  },
]

// ─── SVG subcomponents ────────────────────────────────────────────────────────

function FloorPlanSVG() {
  return (
    <svg
      className="d02-floorplan"
      viewBox="0 0 640 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Isometric floor plan of the Moods platform"
    >
      {/* Outer boundary */}
      <rect x="20" y="20" width="600" height="320" rx="2" stroke="#5a7fa0" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Room: AI Documentation */}
      <rect className="d02-room" x="40" y="40" width="160" height="120" rx="2" stroke="#5a7fa0" strokeWidth="1.2" fill="#5a7fa0" fillOpacity="0.04" />
      <text x="120" y="92" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="9" fill="#5a7fa0" letterSpacing="0.08em">AI DOCUMENTATION</text>
      <text x="120" y="108" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="7" fill="#5a7fa0" fillOpacity="0.6" letterSpacing="0.06em">AskMoody · Reports</text>

      {/* Room: Practice Management */}
      <rect className="d02-room" x="40" y="180" width="160" height="140" rx="2" stroke="#5a7fa0" strokeWidth="1.2" fill="#5a7fa0" fillOpacity="0.04" />
      <text x="120" y="244" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="9" fill="#5a7fa0" letterSpacing="0.08em">PRACTICE MGMT</text>
      <text x="120" y="260" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="7" fill="#5a7fa0" fillOpacity="0.6" letterSpacing="0.06em">Scheduling · Intake</text>

      {/* Room: Video & Communication */}
      <rect className="d02-room" x="220" y="40" width="180" height="100" rx="2" stroke="#5a7fa0" strokeWidth="1.2" fill="#5a7fa0" fillOpacity="0.04" />
      <text x="310" y="84" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="9" fill="#5a7fa0" letterSpacing="0.08em">VIDEO & COMMS</text>
      <text x="310" y="100" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="7" fill="#5a7fa0" fillOpacity="0.6" letterSpacing="0.06em">Video · Chat · Mail</text>

      {/* Room: HR */}
      <rect className="d02-room" x="220" y="160" width="180" height="100" rx="2" stroke="#5a7fa0" strokeWidth="1.2" fill="#5a7fa0" fillOpacity="0.04" />
      <text x="310" y="204" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="9" fill="#5a7fa0" letterSpacing="0.08em">HR & TEAM</text>
      <text x="310" y="220" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="7" fill="#5a7fa0" fillOpacity="0.6" letterSpacing="0.06em">Leave · Onboarding</text>

      {/* Room: Business Intelligence */}
      <rect className="d02-room" x="220" y="280" width="180" height="60" rx="2" stroke="#5a7fa0" strokeWidth="1.2" fill="#5a7fa0" fillOpacity="0.04" />
      <text x="310" y="315" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="9" fill="#5a7fa0" letterSpacing="0.08em">BUSINESS INTELLIGENCE</text>

      {/* Room: Security */}
      <rect className="d02-room" x="420" y="40" width="180" height="300" rx="2" stroke="#5a7fa0" strokeWidth="1.2" fill="#5a7fa0" fillOpacity="0.04" />
      <text x="510" y="184" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="9" fill="#5a7fa0" letterSpacing="0.08em">SECURITY &</text>
      <text x="510" y="200" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="9" fill="#5a7fa0" letterSpacing="0.08em">COMPLIANCE</text>
      <text x="510" y="218" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="7" fill="#5a7fa0" fillOpacity="0.6" letterSpacing="0.06em">NEN 7510 · 7513</text>

      {/* Corridor lines */}
      <line x1="200" y1="40" x2="200" y2="320" stroke="#5a7fa0" strokeWidth="0.6" strokeDasharray="3 3" />
      <line x1="400" y1="40" x2="400" y2="320" stroke="#5a7fa0" strokeWidth="0.6" strokeDasharray="3 3" />
      <line x1="40" y1="160" x2="400" y2="160" stroke="#5a7fa0" strokeWidth="0.6" strokeDasharray="3 3" />

      {/* Corner marks */}
      {[
        [40, 40], [200, 40], [220, 40], [400, 40], [420, 40], [600, 40],
        [40, 320], [200, 320], [220, 320], [400, 320], [420, 320], [600, 320],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#5a7fa0" fillOpacity="0.5" />
      ))}
    </svg>
  )
}

function RadialDiagramSVG() {
  const partners = [
    { label: 'HCI',          angle: -90  },
    { label: 'Nmbrs',        angle: -30  },
    { label: 'Whereby',      angle: 30   },
    { label: 'Stripe',       angle: 90   },
    { label: 'Anthropic',    angle: 150  },
    { label: 'AssemblyAI',   angle: 210  },
  ]
  const cx = 220
  const cy = 200
  const r = 140

  return (
    <svg viewBox="0 0 440 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="d02-radial-svg">
      {/* Outer orbit circle */}
      <circle cx={cx} cy={cy} r={r} stroke="#5a7fa0" strokeWidth="0.6" strokeDasharray="4 4" />
      <circle cx={cx} cy={cy} r={r * 0.55} stroke="#5a7fa0" strokeWidth="0.4" strokeDasharray="3 5" />

      {/* Center node */}
      <circle cx={cx} cy={cy} r={36} stroke="#5a7fa0" strokeWidth="1.5" fill="#faf8f5" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="10" fill="#2c3e50" letterSpacing="0.06em">MOODS</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="8" fill="#5a7fa0" letterSpacing="0.04em">.AI</text>

      {partners.map((p) => {
        const rad = (p.angle * Math.PI) / 180
        const px = cx + r * Math.cos(rad)
        const py = cy + r * Math.sin(rad)
        const lx1 = cx + 38 * Math.cos(rad)
        const ly1 = cy + 38 * Math.sin(rad)
        const lx2 = px - 26 * Math.cos(rad)
        const ly2 = py - 26 * Math.sin(rad)

        return (
          <g key={p.label} className="d02-integration-node">
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#5a7fa0" strokeWidth="0.8" strokeDasharray="3 2" />
            <circle cx={px} cy={py} r={24} stroke="#5a7fa0" strokeWidth="1" fill="#faf8f5" />
            <text
              x={px}
              y={py + 4}
              textAnchor="middle"
              fontFamily="'Space Mono', monospace"
              fontSize="7.5"
              fill="#2c3e50"
              letterSpacing="0.04em"
            >
              {p.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function SecurityLayersSVG() {
  const layers = [
    { label: 'INFRASTRUCTURE', y: 0,   fill: 0.12 },
    { label: 'DATABASE',       y: 50,  fill: 0.10 },
    { label: 'RECORD',         y: 100, fill: 0.08 },
    { label: 'FIELD',          y: 150, fill: 0.06 },
  ]

  return (
    <svg viewBox="0 0 480 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="d02-security-svg">
      {layers.map((layer, i) => (
        <g key={layer.label} className="d02-security-layer" style={{ transform: `translate(${i * 10}px, 0)` }}>
          <rect
            x={20 + i * 10}
            y={layer.y + 20}
            width={380 - i * 20}
            height={56}
            rx="2"
            stroke="#5a7fa0"
            strokeWidth="1.2"
            fill="#5a7fa0"
            fillOpacity={layer.fill}
          />
          <text
            x={210}
            y={layer.y + 52}
            textAnchor="middle"
            fontFamily="'Space Mono', monospace"
            fontSize="10"
            fill="#2c3e50"
            letterSpacing="0.1em"
          >
            {layer.label}
          </text>
          {i < layers.length - 1 && (
            <line
              x1={210}
              y1={layer.y + 76}
              x2={210}
              y2={layer.y + 90}
              stroke="#5a7fa0"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
          )}
        </g>
      ))}
      {/* Lock icon */}
      <rect x="198" y="218" width="24" height="20" rx="2" stroke="#5a7fa0" strokeWidth="1" fill="none" />
      <path d="M202,218 Q202,208 210,208 Q218,208 218,218" stroke="#5a7fa0" strokeWidth="1" fill="none" />
      <circle cx="210" cy="228" r="3" fill="#5a7fa0" />
    </svg>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Design02() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const carouselContainerRef = useRef<HTMLDivElement>(null)
  const carouselTrackRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)

  const handleNavClick = useCallback((index: number) => {
    const sectionEl = document.getElementById(SECTIONS[index].id)
    if (sectionEl) sectionEl.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {

      // ── Section ScrollTriggers for nav indicator ──────────────────────────
      SECTIONS.forEach((section, index) => {
        const el = document.getElementById(section.id)
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => setActiveSection(index),
          onEnterBack: () => setActiveSection(index),
        })
      })

      // ── Hero entrance ─────────────────────────────────────────────────────
      gsap.from('.d02-hero-eyebrow', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.2 })
      gsap.from('.d02-hero-headline', { opacity: 0, y: 30, duration: 1, ease: 'power2.out', delay: 0.4 })
      gsap.from('.d02-hero-sub', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.7 })
      gsap.from('.d02-hero-cta', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.9 })

      // ── Floor plan rooms illuminate sequentially ──────────────────────────
      const rooms = gsap.utils.toArray<SVGElement>('.d02-room')
      gsap.from(rooms, {
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top 40%',
        },
      })

      // ── Horizontal scroll carousel ────────────────────────────────────────
      const carouselContainer = carouselContainerRef.current
      const carouselTrack = carouselTrackRef.current
      if (carouselContainer && carouselTrack) {
        const totalWidth = carouselTrack.scrollWidth
        const viewportWidth = carouselContainer.offsetWidth

        if (totalWidth > viewportWidth) {
          gsap.to(carouselTrack, {
            x: -(totalWidth - viewportWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: carouselContainer,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${totalWidth - viewportWidth}`,
              invalidateOnRefresh: true,
            },
          })
        }
      }

      // ── AI flowchart nodes stagger in ────────────────────────────────────
      gsap.from('.d02-flow-node', {
        opacity: 0,
        scale: 0.85,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '#ai-features',
          start: 'top 60%',
        },
      })

      // ── SVG path draw: flow connector lines ───────────────────────────────
      const flowLines = gsap.utils.toArray<SVGPathElement>('.d02-flow-line')
      flowLines.forEach((line) => {
        const length = line.getTotalLength ? line.getTotalLength() : 200
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '#ai-features',
            start: 'top 55%',
          },
        })
      })

      // ── Practice section diagrams ─────────────────────────────────────────
      gsap.from('.d02-process-card', {
        opacity: 0,
        x: 40,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#practice',
          start: 'top 60%',
        },
      })

      // ── Integration nodes radiate out ─────────────────────────────────────
      gsap.from('.d02-integration-node', {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        stagger: 0.1,
        transformOrigin: '50% 50%',
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: '#integrations',
          start: 'top 60%',
        },
      })

      // ── Security layers slide in with offset ─────────────────────────────
      gsap.from('.d02-security-layer', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#security',
          start: 'top 65%',
        },
      })

      // ── Pricing leader lines draw ────────────────────────────────────────
      const leaderLines = gsap.utils.toArray<SVGLineElement>('.d02-leader')
      leaderLines.forEach((line) => {
        const x1 = parseFloat(line.getAttribute('x1') ?? '0')
        const x2 = parseFloat(line.getAttribute('x2') ?? '100')
        const lineLength = Math.abs(x2 - x1)
        gsap.set(line, { strokeDasharray: lineLength, strokeDashoffset: lineLength })
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '#pricing',
            start: 'top 60%',
          },
        })
      })

      // ── Footer reveal ─────────────────────────────────────────────────────
      gsap.from('.d02-footer-text', {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#footer',
          start: 'top 70%',
        },
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Reset / Base ── */
        .d02-page {
          background: #faf8f5;
          color: #2c3e50;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── Sticky Nav ── */
        .d02-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: #f2ede6;
          border-bottom: 1px solid rgba(90,127,160,0.2);
          height: 48px;
          display: flex;
          align-items: center;
          padding: 0 32px;
          gap: 0;
        }

        .d02-nav-brand {
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          color: #2c3e50;
          letter-spacing: 0.04em;
          margin-right: auto;
          text-decoration: none;
        }

        .d02-nav-brand span {
          color: #5a7fa0;
        }

        .d02-nav-indicators {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .d02-nav-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 2px;
          cursor: pointer;
          background: transparent;
          border: none;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: rgba(44,62,80,0.35);
          letter-spacing: 0.08em;
          transition: color 0.2s, background 0.2s;
        }

        .d02-nav-indicator:hover {
          color: #2c3e50;
          background: rgba(90,127,160,0.08);
        }

        .d02-nav-indicator.active {
          color: #2c3e50;
          background: rgba(90,127,160,0.1);
        }

        .d02-nav-indicator .d02-nav-num {
          font-size: 0.58rem;
          color: #5a7fa0;
        }

        @media (max-width: 768px) {
          .d02-nav-indicators { display: none; }
        }

        .d02-nav-cta {
          margin-left: 20px;
          padding: 7px 18px;
          background: #2c3e50;
          color: #faf8f5;
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          text-decoration: none;
          border-radius: 2px;
          transition: background 0.2s;
        }

        .d02-nav-cta:hover { background: #5a7fa0; }

        /* ── Dot-grid pattern ── */
        .d02-dot-grid {
          background-image: radial-gradient(circle, rgba(90,127,160,0.25) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── Section base ── */
        .d02-section {
          padding: 96px 0;
        }

        .d02-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 48px;
        }

        @media (max-width: 768px) {
          .d02-container { padding: 0 24px; }
          .d02-section { padding: 64px 0; }
        }

        /* ── Section label ── */
        .d02-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5a7fa0;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .d02-section-label::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: #5a7fa0;
        }

        /* ─────────────────────────────────────────────────────── */
        /* SECTION 1 — Hero */
        /* ─────────────────────────────────────────────────────── */

        .d02-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding-top: 48px;
          position: relative;
          overflow: hidden;
        }

        .d02-hero-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #5a7fa0;
          margin-bottom: 24px;
        }

        .d02-hero-headline {
          font-family: 'Space Mono', monospace;
          font-size: clamp(1.8rem, 4vw, 3rem);
          color: #2c3e50;
          line-height: 1.25;
          letter-spacing: -0.02em;
          max-width: 800px;
          margin: 0 auto 28px;
        }

        .d02-hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 1rem;
          color: rgba(44,62,80,0.6);
          max-width: 520px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }

        .d02-hero-cta {
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 64px;
        }

        .d02-btn-primary {
          padding: 13px 32px;
          background: #2c3e50;
          color: #faf8f5;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-decoration: none;
          border-radius: 2px;
          transition: background 0.2s;
        }

        .d02-btn-primary:hover { background: #5a7fa0; }

        .d02-btn-outline {
          padding: 12px 28px;
          border: 1px solid rgba(90,127,160,0.5);
          color: #5a7fa0;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-decoration: none;
          border-radius: 2px;
          transition: border-color 0.2s, color 0.2s;
        }

        .d02-btn-outline:hover { border-color: #5a7fa0; color: #2c3e50; }

        .d02-floorplan-wrap {
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        .d02-floorplan {
          width: 100%;
          height: auto;
        }

        /* ─────────────────────────────────────────────────────── */
        /* SECTION 2 — Horizontal Carousel */
        /* ─────────────────────────────────────────────────────── */

        .d02-carousel-outer {
          overflow: hidden;
          will-change: transform;
        }

        .d02-carousel-track {
          display: flex;
          flex-direction: row;
          align-items: stretch;
        }

        .d02-carousel-panel {
          min-width: 80vw;
          width: 80vw;
          border-right: 1px solid rgba(90,127,160,0.2);
          padding: 80px 64px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          background: #faf8f5;
          flex-shrink: 0;
        }

        .d02-carousel-panel:first-child {
          padding-left: 10vw;
        }

        .d02-carousel-panel:last-child {
          border-right: none;
          padding-right: 10vw;
        }

        .d02-panel-number {
          font-family: 'Space Mono', monospace;
          font-size: 4rem;
          color: rgba(90,127,160,0.1);
          line-height: 1;
          margin-bottom: 24px;
          letter-spacing: -0.04em;
        }

        .d02-panel-title {
          font-family: 'Space Mono', monospace;
          font-size: 1.35rem;
          color: #2c3e50;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .d02-panel-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.88rem;
          color: #5a7fa0;
          margin-bottom: 32px;
        }

        .d02-panel-bullets {
          list-style: none;
          padding: 0;
          margin: 0 0 40px;
          flex: 1;
        }

        .d02-panel-bullets li {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.88rem;
          color: rgba(44,62,80,0.75);
          padding: 9px 0;
          border-bottom: 1px solid rgba(90,127,160,0.12);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .d02-panel-bullets li::before {
          content: '→';
          color: #5a7fa0;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          flex-shrink: 0;
        }

        .d02-panel-diagram {
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .d02-carousel-outer {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .d02-carousel-track {
            flex-direction: column;
          }
          .d02-carousel-panel {
            min-width: 100%;
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(90,127,160,0.2);
          }
          .d02-carousel-panel:first-child { padding-left: 24px; }
          .d02-carousel-panel:last-child  { padding-right: 24px; border-bottom: none; }
        }

        /* ─────────────────────────────────────────────────────── */
        /* SECTION 3 — AI Features Flowchart */
        /* ─────────────────────────────────────────────────────── */

        .d02-flow-wrapper {
          position: relative;
          overflow: visible;
        }

        .d02-flow-grid {
          display: grid;
          grid-template-columns: 1fr 80px 1fr 80px 1fr;
          align-items: center;
          gap: 0;
        }

        @media (max-width: 768px) {
          .d02-flow-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .d02-flow-connector { display: none; }
        }

        .d02-flow-node {
          border: 1px solid rgba(90,127,160,0.35);
          border-radius: 4px;
          padding: 32px 28px;
          background: #faf8f5;
          position: relative;
          transition: box-shadow 0.2s;
        }

        .d02-flow-node:hover {
          box-shadow: 0 2px 20px rgba(90,127,160,0.12);
        }

        .d02-flow-node-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5a7fa0;
          margin-bottom: 12px;
        }

        .d02-flow-node-title {
          font-family: 'Space Mono', monospace;
          font-size: 1rem;
          color: #2c3e50;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .d02-flow-node-desc {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.85rem;
          color: rgba(44,62,80,0.65);
          line-height: 1.6;
        }

        .d02-flow-connector {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .d02-flow-line {
          stroke: #5a7fa0;
          stroke-width: 1;
        }

        /* ─────────────────────────────────────────────────────── */
        /* SECTION 4 — Practice Management */
        /* ─────────────────────────────────────────────────────── */

        .d02-process-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        @media (max-width: 768px) {
          .d02-process-grid { grid-template-columns: 1fr; }
        }

        .d02-process-card {
          border: 1px solid rgba(90,127,160,0.2);
          border-radius: 4px;
          padding: 28px 24px;
          background: #faf8f5;
        }

        .d02-process-card-title {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .d02-intake-flow {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .d02-intake-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          color: rgba(44,62,80,0.7);
        }

        .d02-intake-step-num {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: #5a7fa0;
          width: 20px;
          flex-shrink: 0;
        }

        .d02-intake-arrow {
          margin-left: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: rgba(90,127,160,0.4);
        }

        .d02-schedule-visual {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(4, 28px);
          gap: 4px;
        }

        .d02-cal-slot {
          border: 1px solid rgba(90,127,160,0.18);
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          color: rgba(90,127,160,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .d02-cal-slot.booked {
          background: rgba(90,127,160,0.12);
          border-color: rgba(90,127,160,0.3);
          color: #5a7fa0;
        }

        .d02-triage-tree {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 8px;
        }

        .d02-triage-root {
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: #2c3e50;
          background: rgba(90,127,160,0.08);
          border: 1px solid rgba(90,127,160,0.25);
          border-radius: 2px;
          padding: 8px 12px;
        }

        .d02-triage-branches {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .d02-triage-branch {
          flex: 1;
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: #5a7fa0;
          border: 1px solid rgba(90,127,160,0.2);
          border-radius: 2px;
          padding: 7px 6px;
        }

        .d02-triage-connector {
          display: flex;
          justify-content: center;
        }

        /* ─────────────────────────────────────────────────────── */
        /* SECTION 5 — Integrations */
        /* ─────────────────────────────────────────────────────── */

        .d02-integrations-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .d02-integrations-layout { grid-template-columns: 1fr; gap: 32px; }
        }

        .d02-radial-svg {
          width: 100%;
          height: auto;
        }

        .d02-integrations-copy h3 {
          font-family: 'Space Mono', monospace;
          font-size: 1.4rem;
          color: #2c3e50;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .d02-integrations-copy p {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.9rem;
          color: rgba(44,62,80,0.65);
          line-height: 1.75;
          margin-bottom: 24px;
        }

        .d02-partner-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .d02-partner-item {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: #2c3e50;
          letter-spacing: 0.06em;
          padding: 10px 12px;
          border: 1px solid rgba(90,127,160,0.2);
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .d02-partner-item::before {
          content: '◆';
          font-size: 0.4rem;
          color: #5a7fa0;
        }

        /* ─────────────────────────────────────────────────────── */
        /* SECTION 6 — Security */
        /* ─────────────────────────────────────────────────────── */

        .d02-security-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .d02-security-layout { grid-template-columns: 1fr; gap: 32px; }
        }

        .d02-security-svg {
          width: 100%;
          height: auto;
          max-width: 480px;
        }

        .d02-security-copy h3 {
          font-family: 'Space Mono', monospace;
          font-size: 1.4rem;
          color: #2c3e50;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .d02-security-copy p {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.9rem;
          color: rgba(44,62,80,0.65);
          line-height: 1.75;
          margin-bottom: 28px;
        }

        .d02-cert-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .d02-cert-badge {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          color: #5a7fa0;
          border: 1px solid rgba(90,127,160,0.35);
          border-radius: 2px;
          padding: 6px 12px;
        }

        /* ─────────────────────────────────────────────────────── */
        /* SECTION 7 — Pricing */
        /* ─────────────────────────────────────────────────────── */

        .d02-pricing-heading {
          font-family: 'Space Mono', monospace;
          font-size: clamp(1.4rem, 3vw, 2rem);
          color: #2c3e50;
          text-align: center;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .d02-pricing-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.9rem;
          color: rgba(44,62,80,0.6);
          text-align: center;
          margin-bottom: 48px;
        }

        .d02-pricing-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid rgba(90,127,160,0.2);
        }

        .d02-pricing-table thead th {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #2c3e50;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(90,127,160,0.2);
          text-align: left;
        }

        .d02-pricing-table thead th.plan-col {
          text-align: center;
          font-size: 0.8rem;
        }

        .d02-pricing-table thead th .price {
          display: block;
          font-size: 1.2rem;
          margin-top: 6px;
          letter-spacing: -0.02em;
          color: #5a7fa0;
        }

        .d02-pricing-table thead th .price-note {
          display: block;
          font-size: 0.58rem;
          color: rgba(44,62,80,0.4);
          font-weight: 300;
          margin-top: 2px;
          letter-spacing: 0.06em;
        }

        .d02-pricing-table tbody tr {
          border-bottom: 1px solid rgba(90,127,160,0.1);
        }

        .d02-pricing-table tbody tr:last-child { border-bottom: none; }

        .d02-pricing-table tbody td {
          padding: 13px 24px;
          vertical-align: middle;
        }

        .d02-pricing-table tbody td:first-child {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.85rem;
          color: rgba(44,62,80,0.8);
          position: relative;
        }

        .d02-pricing-table tbody td.plan-col {
          text-align: center;
        }

        .d02-check {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: #5a7fa0;
        }

        .d02-dash {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: rgba(44,62,80,0.2);
        }

        /* Blueprint-style leader line (SVG behind table rows) */
        .d02-pricing-row-svg {
          position: absolute;
          top: 50%;
          left: 100%;
          transform: translateY(-50%);
          pointer-events: none;
          overflow: visible;
        }

        /* ─────────────────────────────────────────────────────── */
        /* SECTION 8 — Footer */
        /* ─────────────────────────────────────────────────────── */

        .d02-footer-section {
          padding: 120px 48px;
          text-align: center;
          border-top: 1px solid rgba(90,127,160,0.15);
        }

        .d02-footer-text h2 {
          font-family: 'Space Mono', monospace;
          font-size: clamp(1.4rem, 3.5vw, 2.4rem);
          color: #2c3e50;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .d02-footer-text p {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.95rem;
          color: rgba(44,62,80,0.55);
          margin-bottom: 40px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
        }

        .d02-footer-links {
          display: flex;
          gap: 32px;
          justify-content: center;
          margin-top: 48px;
          flex-wrap: wrap;
        }

        .d02-footer-link {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(44,62,80,0.4);
          text-decoration: none;
          transition: color 0.2s;
        }

        .d02-footer-link:hover { color: #5a7fa0; }

        .d02-footer-byline {
          margin-top: 40px;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          color: rgba(44,62,80,0.25);
        }

        /* ── Section heading styles ── */
        .d02-section-heading {
          font-family: 'Space Mono', monospace;
          font-size: clamp(1.4rem, 3vw, 2rem);
          color: #2c3e50;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .d02-section-intro {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.95rem;
          color: rgba(44,62,80,0.6);
          max-width: 520px;
          line-height: 1.75;
          margin-bottom: 52px;
        }

        /* ── Divider ── */
        .d02-divider {
          width: 100%;
          height: 1px;
          background: rgba(90,127,160,0.12);
          margin: 0;
        }
      `}</style>

      <div className="d02-page" ref={containerRef}>

        {/* ── Sticky Nav ── */}
        <nav className="d02-nav" ref={navRef} aria-label="Section navigation">
          <span className="d02-nav-brand">moods<span>.ai</span></span>
          <div className="d02-nav-indicators" role="list">
            {SECTIONS.slice(0, 7).map((section, index) => (
              <button
                key={section.id}
                className={`d02-nav-indicator${activeSection === index ? ' active' : ''}`}
                onClick={() => handleNavClick(index)}
                role="listitem"
                aria-label={`Go to ${section.label} section`}
                aria-current={activeSection === index ? 'true' : undefined}
              >
                <span className="d02-nav-num">{String(index + 1).padStart(2, '0')}</span>
                {section.label}
              </button>
            ))}
          </div>
          <a href="#hero" className="d02-nav-cta">Request demo</a>
        </nav>

        {/* ── SECTION 1: Hero ── */}
        <section id="hero" className="d02-hero d02-dot-grid">
          <div className="d02-container">
            <div className="d02-hero-eyebrow">Moods.AI — Platform overview</div>
            <h1 className="d02-hero-headline">
              The intelligent practice,<br />designed from the ground up.
            </h1>
            <p className="d02-hero-sub">
              One integrated platform for Dutch mental health organisations. Replace five separate tools with one architectural plan — built to last.
            </p>
            <div className="d02-hero-cta">
              <a href="#" className="d02-btn-primary">Start free trial</a>
              <a href="#platform" className="d02-btn-outline">Explore platform →</a>
            </div>
            <div className="d02-floorplan-wrap">
              <FloorPlanSVG />
            </div>
          </div>
        </section>

        <div className="d02-divider" />

        {/* ── SECTION 2: Platform Overview (Horizontal Carousel) ── */}
        <section id="platform">
          <div className="d02-container" style={{ paddingBottom: 0 }}>
            <div className="d02-section-label" style={{ paddingTop: 64 }}>
              02 / Platform overview
            </div>
            <h2 className="d02-section-heading">Six pillars. One platform.</h2>
            <p className="d02-section-intro">
              Every GGZ organisation runs on multiple systems. Moods replaces them all — a single platform across documentation, scheduling, HR, communications, analytics and security.
            </p>
          </div>
          <div className="d02-carousel-outer" ref={carouselContainerRef}>
            <div className="d02-carousel-track" ref={carouselTrackRef}>
              {CAROUSEL_PANELS.map((panel) => (
                <div key={panel.id} className="d02-carousel-panel">
                  <div>
                    <div className="d02-panel-number">{panel.number}</div>
                    <div className="d02-section-label" style={{ marginBottom: 8 }}>
                      {panel.title}
                    </div>
                    <div className="d02-panel-subtitle">{panel.subtitle}</div>
                    <ul className="d02-panel-bullets">
                      {panel.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="d02-panel-diagram">{panel.svgContent}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="d02-divider" />

        {/* ── SECTION 3: AI Features Flowchart ── */}
        <section id="ai-features" className="d02-section">
          <div className="d02-container">
            <div className="d02-section-label">03 / AI features</div>
            <h2 className="d02-section-heading">Documentation at the speed of thought.</h2>
            <p className="d02-section-intro">
              AskMoody understands the clinical context of your session. Dictate in Dutch, and receive DSM-5 compliant reports in under 60 seconds.
            </p>
            <div className="d02-flow-wrapper">
              <div className="d02-flow-grid">

                {/* Node 1 */}
                <div className="d02-flow-node">
                  <div className="d02-flow-node-tag">01 — Input</div>
                  <div className="d02-flow-node-title">AskMoody</div>
                  <div className="d02-flow-node-desc">
                    Conversational AI assistant. Ask clinical questions, retrieve records, draft communications — all in natural Dutch.
                  </div>
                </div>

                {/* Connector 1→2 */}
                <div className="d02-flow-connector">
                  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" overflow="visible">
                    <path
                      className="d02-flow-line"
                      d="M 0 20 L 68 20"
                      markerEnd="url(#flowArrow)"
                    />
                    <defs>
                      <marker id="flowArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                        <path d="M0,0 L0,8 L8,4 z" fill="#5a7fa0" />
                      </marker>
                    </defs>
                  </svg>
                </div>

                {/* Node 2 */}
                <div className="d02-flow-node">
                  <div className="d02-flow-node-tag">02 — Processing</div>
                  <div className="d02-flow-node-title">Dictated Reports</div>
                  <div className="d02-flow-node-desc">
                    Speak your session notes after a consultation. AssemblyAI transcribes, Anthropic structures. Delivered in &lt;60 s.
                  </div>
                </div>

                {/* Connector 2→3 */}
                <div className="d02-flow-connector">
                  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" overflow="visible">
                    <path
                      className="d02-flow-line"
                      d="M 0 20 L 68 20"
                      markerEnd="url(#flowArrow2)"
                    />
                    <defs>
                      <marker id="flowArrow2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                        <path d="M0,0 L0,8 L8,4 z" fill="#5a7fa0" />
                      </marker>
                    </defs>
                  </svg>
                </div>

                {/* Node 3 */}
                <div className="d02-flow-node">
                  <div className="d02-flow-node-tag">03 — Output</div>
                  <div className="d02-flow-node-title">Session Reports</div>
                  <div className="d02-flow-node-desc">
                    Structured SOAP notes, treatment letters, referral documents. Reviewed once, signed, filed — in the patient record.
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <div className="d02-divider" />

        {/* ── SECTION 4: Practice Management ── */}
        <section id="practice" className="d02-section" style={{ background: 'rgba(90,127,160,0.03)' }}>
          <div className="d02-container">
            <div className="d02-section-label">04 / Practice management</div>
            <h2 className="d02-section-heading">From first contact to closed file.</h2>
            <p className="d02-section-intro">
              A 9-stage intake pipeline, smart scheduling, and a triage questionnaire that routes patients to the right clinician — automatically.
            </p>
            <div className="d02-process-grid">

              {/* Card 1: Scheduling */}
              <div className="d02-process-card">
                <div className="d02-process-card-title">Scheduling</div>
                <div className="d02-schedule-visual">
                  {['Mo','Tu','We','Th','Fr'].map((d) => (
                    <div key={d} className="d02-cal-slot" style={{ gridColumn: 'auto', fontWeight: 'normal', borderColor: 'transparent', color: 'rgba(90,127,160,0.5)', fontSize: '0.52rem', paddingBottom: 2 }}>{d}</div>
                  ))}
                  {[false,true,false,true,false,true,false,false,true,false,false,true,true,false,true,true,false,false,true,false].map((booked, i) => (
                    <div key={i} className={`d02-cal-slot${booked ? ' booked' : ''}`}>
                      {booked ? '■' : ''}
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.8rem', color: 'rgba(44,62,80,0.55)', marginTop: 16, lineHeight: 1.6 }}>
                  Drag-and-drop calendar with room booking, recurring appointments, and waiting list management.
                </p>
              </div>

              {/* Card 2: Onboarding Pipeline */}
              <div className="d02-process-card">
                <div className="d02-process-card-title">Intake pipeline</div>
                <div className="d02-intake-flow">
                  {[
                    'Referral received',
                    'Triage questionnaire',
                    'Intake call scheduled',
                    'Assessment completed',
                    'Treatment plan drafted',
                    'Patient informed',
                    'First session booked',
                    'ROM baseline sent',
                    'Active treatment',
                  ].map((step, i) => (
                    <div key={step} className="d02-intake-step">
                      <span className="d02-intake-step-num">{String(i + 1).padStart(2, '0')}</span>
                      <span>{step}</span>
                      {i < 8 && <span className="d02-intake-arrow">↓</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Triage */}
              <div className="d02-process-card">
                <div className="d02-process-card-title">Triage routing</div>
                <div className="d02-triage-tree">
                  <div className="d02-triage-root">Intake questionnaire</div>
                  <div className="d02-triage-connector">
                    <svg width="2" height="16" viewBox="0 0 2 16"><line x1="1" y1="0" x2="1" y2="16" stroke="#5a7fa0" strokeWidth="1" strokeDasharray="2 2" /></svg>
                  </div>
                  <div className="d02-triage-branches">
                    <div className="d02-triage-branch">Low<br/>complexity</div>
                    <div className="d02-triage-branch">Medium<br/>severity</div>
                    <div className="d02-triage-branch">Crisis<br/>protocol</div>
                  </div>
                  <div className="d02-triage-branches">
                    <div className="d02-triage-branch" style={{ fontSize: '0.58rem', color: 'rgba(44,62,80,0.5)' }}>POH-GGZ</div>
                    <div className="d02-triage-branch" style={{ fontSize: '0.58rem', color: 'rgba(44,62,80,0.5)' }}>Psychologist</div>
                    <div className="d02-triage-branch" style={{ fontSize: '0.58rem', color: 'rgba(44,62,80,0.5)' }}>Psychiatrist</div>
                  </div>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.8rem', color: 'rgba(44,62,80,0.55)', marginTop: 16, lineHeight: 1.6 }}>
                  Configurable routing rules ensure every patient reaches the right level of care.
                </p>
              </div>

            </div>
          </div>
        </section>

        <div className="d02-divider" />

        {/* ── SECTION 5: Integrations ── */}
        <section id="integrations" className="d02-section">
          <div className="d02-container">
            <div className="d02-section-label">05 / Integrations</div>
            <div className="d02-integrations-layout">
              <RadialDiagramSVG />
              <div className="d02-integrations-copy">
                <h3>Connects with the tools<br/>you already rely on.</h3>
                <p>
                  Moods integrates deeply with the Dutch healthcare ecosystem. From HCI patient records to Nmbrs payroll — data flows securely between systems without manual re-entry.
                </p>
                <div className="d02-partner-list">
                  {['HCI (EPD)', 'Nmbrs payroll', 'Whereby video', 'Stripe billing', 'Anthropic AI', 'AssemblyAI'].map((p) => (
                    <div key={p} className="d02-partner-item">{p}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="d02-divider" />

        {/* ── SECTION 6: Security ── */}
        <section id="security" className="d02-section" style={{ background: 'rgba(90,127,160,0.03)' }}>
          <div className="d02-container">
            <div className="d02-section-label">06 / Security & compliance</div>
            <div className="d02-security-layout">
              <div className="d02-security-copy">
                <h3>Security built<br/>into every layer.</h3>
                <p>
                  Patient data in Dutch mental healthcare is among the most sensitive. Moods is built to NEN 7510 and NEN 7513 standards — with encryption at rest and in transit, full audit trails, and role-based access control.
                </p>
                <div className="d02-cert-badges">
                  <span className="d02-cert-badge">NEN 7510</span>
                  <span className="d02-cert-badge">NEN 7513</span>
                  <span className="d02-cert-badge">GDPR</span>
                  <span className="d02-cert-badge">AVG compliant</span>
                  <span className="d02-cert-badge">AES-256</span>
                </div>
              </div>
              <SecurityLayersSVG />
            </div>
          </div>
        </section>

        <div className="d02-divider" />

        {/* ── SECTION 7: Pricing ── */}
        <section id="pricing" className="d02-section">
          <div className="d02-container">
            <div className="d02-section-label">07 / Pricing</div>
            <h2 className="d02-pricing-heading">Simple, transparent pricing.</h2>
            <p className="d02-pricing-sub">Start free. Scale as your practice grows.</p>
            <table className="d02-pricing-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Feature</th>
                  <th className="plan-col">
                    Free
                    <span className="price">€0</span>
                    <span className="price-note">per practitioner</span>
                  </th>
                  <th className="plan-col">
                    Pro
                    <span className="price">€89</span>
                    <span className="price-note">per practitioner / month</span>
                  </th>
                  <th className="plan-col">
                    Lifetime
                    <span className="price">€1,490</span>
                    <span className="price-note">one-time per seat</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td style={{ position: 'relative' }}>
                      {row.feature}
                      {/* Blueprint leader line SVG */}
                      <svg
                        className="d02-pricing-row-svg"
                        width="20"
                        height="2"
                        viewBox="0 0 20 2"
                        style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle' }}
                      >
                        <line className="d02-leader" x1="0" y1="1" x2="20" y2="1" stroke="#5a7fa0" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                      </svg>
                    </td>
                    <td className="plan-col">
                      {row.free
                        ? <span className="d02-check">✓</span>
                        : <span className="d02-dash">—</span>}
                    </td>
                    <td className="plan-col">
                      {row.pro
                        ? <span className="d02-check">✓</span>
                        : <span className="d02-dash">—</span>}
                    </td>
                    <td className="plan-col">
                      {row.lifetime
                        ? <span className="d02-check">✓</span>
                        : <span className="d02-dash">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="d02-divider" />

        {/* ── SECTION 8: Footer ── */}
        <footer id="footer" className="d02-footer-section">
          <div className="d02-footer-text">
            <h2>Build your practice<br/>on solid ground.</h2>
            <p>
              Moods gives Dutch GGZ organisations the architectural foundation to deliver better care, faster — without the overhead.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#" className="d02-btn-primary">Start free trial</a>
              <a href="#" className="d02-btn-outline">Schedule a demo</a>
            </div>
          </div>
          <div className="d02-footer-links">
            <a href="#" className="d02-footer-link">Product</a>
            <a href="#" className="d02-footer-link">Pricing</a>
            <a href="#" className="d02-footer-link">Security</a>
            <a href="#" className="d02-footer-link">Documentation</a>
            <a href="#" className="d02-footer-link">Contact</a>
            <a href="#" className="d02-footer-link">Privacy</a>
          </div>
          <div className="d02-footer-byline">
            Design 02 — The Blueprint · Moods.AI · &copy; 2026
          </div>
        </footer>

      </div>
    </>
  )
}
