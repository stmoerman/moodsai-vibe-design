'use client'
import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import styles from './styles.module.css'

/* ============================================================
   Design 12 — "The Sketchbook"
   ONE CONTINUOUS HAND-DRAWN SVG LINE flows through the entire
   page, connecting every section, as if someone is sketching
   the whole story as you scroll.
   ============================================================ */

// ---- Path Data ----
// viewBox: 0 0 1200 8000 — organic hand-drawn curves with wobble
const MAIN_PATH = `
M 600,20
C 590,60 615,100 605,140
C 595,180 570,220 580,280
C 590,340 620,360 640,400
C 660,440 680,460 660,500
C 640,540 590,560 560,600
C 530,640 500,680 480,720
C 460,760 440,800 420,840
C 400,880 380,910 360,940
C 340,970 310,990 280,1020
C 250,1050 230,1080 220,1120
C 210,1160 220,1200 250,1240
C 280,1280 340,1300 400,1320
C 460,1340 540,1340 620,1320
C 700,1300 760,1260 820,1240
C 880,1220 920,1200 940,1180
C 960,1160 970,1140 960,1120
C 950,1100 920,1090 890,1100
C 860,1110 830,1140 800,1180
C 770,1220 740,1270 720,1320
C 700,1370 680,1420 660,1470
C 640,1520 620,1570 610,1620
C 600,1670 600,1720 610,1770
C 620,1820 640,1860 660,1900
C 680,1940 690,1980 680,2020
C 670,2060 640,2090 610,2120
C 580,2150 550,2180 530,2220
C 510,2260 500,2300 510,2340
C 520,2380 550,2410 580,2440
C 610,2470 640,2490 660,2520
C 680,2550 690,2590 680,2640
C 670,2690 640,2720 610,2760
C 580,2800 560,2840 560,2880
C 560,2920 580,2960 600,3000
C 620,3040 650,3070 670,3110
C 690,3150 700,3200 690,3250
C 680,3300 650,3340 620,3380
C 590,3420 570,3460 570,3500
C 570,3540 590,3580 620,3610
C 650,3640 680,3670 700,3710
C 720,3750 730,3800 720,3850
C 710,3900 680,3940 650,3980
C 620,4020 590,4060 580,4100
C 570,4140 580,4180 600,4220
C 620,4260 650,4290 680,4320
C 710,4350 740,4400 720,4450
C 700,4500 660,4530 620,4560
C 580,4590 550,4640 560,4700
C 570,4760 600,4810 630,4850
C 660,4890 680,4930 680,4980
C 680,5030 660,5070 640,5110
C 620,5150 600,5200 590,5250
C 580,5300 590,5350 610,5400
C 630,5450 660,5490 680,5540
C 700,5590 710,5640 700,5690
C 690,5740 660,5780 630,5820
C 600,5860 580,5910 580,5960
C 580,6010 600,6060 630,6100
C 660,6140 690,6170 710,6210
C 730,6250 740,6300 730,6350
C 720,6400 690,6440 660,6480
C 630,6520 600,6560 590,6600
C 580,6640 590,6680 610,6720
C 630,6760 660,6790 690,6820
C 720,6850 740,6890 740,6940
C 740,6990 720,7030 700,7070
C 680,7110 660,7160 650,7210
C 640,7260 650,7310 670,7360
C 690,7410 710,7450 720,7500
C 730,7550 720,7600 700,7640
C 680,7680 650,7710 620,7740
C 590,7770 570,7810 580,7850
C 590,7890 610,7920 630,7940
C 650,7960 660,7975 650,7990
`.trim()

// Branch paths — shorter lines splitting off from main line at section junctions
const BRANCH_PATHS = [
  // Hero branches
  { d: 'M 605,140 C 650,150 720,160 780,155', threshold: 0.02 },
  { d: 'M 605,140 C 560,150 480,160 420,155', threshold: 0.02 },
  // Problem branches
  { d: 'M 280,1020 C 260,1030 230,1040 210,1035', threshold: 0.13 },
  { d: 'M 940,1180 C 960,1170 980,1160 990,1170', threshold: 0.15 },
  // Solution branches
  { d: 'M 610,1770 C 560,1780 490,1790 440,1785', threshold: 0.22 },
  { d: 'M 610,1770 C 660,1780 730,1790 780,1785', threshold: 0.22 },
  // Tour branches
  { d: 'M 660,2520 C 710,2530 780,2540 840,2535', threshold: 0.32 },
  { d: 'M 610,2760 C 560,2770 480,2780 420,2775', threshold: 0.35 },
  { d: 'M 620,3380 C 570,3390 490,3400 430,3395', threshold: 0.42 },
  { d: 'M 700,3710 C 750,3720 820,3730 880,3725', threshold: 0.46 },
  // AI branches
  { d: 'M 620,4560 C 570,4570 490,4580 430,4575', threshold: 0.57 },
  // Security branches
  { d: 'M 680,4980 C 730,4990 800,5000 860,4995', threshold: 0.62 },
  { d: 'M 590,5250 C 540,5260 460,5270 400,5265', threshold: 0.66 },
  // Quotes branches
  { d: 'M 630,5820 C 580,5830 500,5840 440,5835', threshold: 0.73 },
  { d: 'M 710,6210 C 760,6220 830,6230 890,6225', threshold: 0.78 },
  // Pricing branches
  { d: 'M 660,6480 C 710,6490 780,6500 840,6495', threshold: 0.81 },
  { d: 'M 590,6600 C 540,6610 460,6620 400,6615', threshold: 0.83 },
]

// Waypoint positions (approximate Y positions in viewBox / 8000 = scroll threshold)
const WAYPOINTS = [
  { id: 'hero', y: 140, label: 'Start', threshold: 0.02, sectionId: 'hero-section' },
  { id: 'problem', y: 940, label: 'Problem', threshold: 0.12, sectionId: 'problem-section' },
  { id: 'solution', y: 1770, label: 'Solution', threshold: 0.22, sectionId: 'solution-section' },
  { id: 'tour', y: 2640, label: 'Tour', threshold: 0.33, sectionId: 'tour-section' },
  { id: 'ai', y: 4220, label: 'AI', threshold: 0.53, sectionId: 'ai-section' },
  { id: 'security', y: 4980, label: 'Security', threshold: 0.62, sectionId: 'security-section' },
  { id: 'quotes', y: 5690, label: 'Quotes', threshold: 0.71, sectionId: 'quotes-section' },
  { id: 'pricing', y: 6350, label: 'Pricing', threshold: 0.79, sectionId: 'pricing-section' },
  { id: 'cta', y: 7500, label: 'CTA', threshold: 0.94, sectionId: 'cta-section' },
]

// Annotations in margins
const ANNOTATIONS = [
  { text: 'start here \u2192', y: '4%', side: 'left' as const, threshold: 0.01 },
  { text: 'the gap', y: '14%', side: 'right' as const, threshold: 0.11 },
  { text: 'this changes everything', y: '24%', side: 'left' as const, threshold: 0.21 },
  { text: 'step by step', y: '36%', side: 'right' as const, threshold: 0.33 },
  { text: 'the magic part', y: '54%', side: 'left' as const, threshold: 0.52 },
  { text: 'locked down', y: '64%', side: 'right' as const, threshold: 0.61 },
  { text: 'real stories', y: '73%', side: 'left' as const, threshold: 0.71 },
  { text: 'fair & simple', y: '82%', side: 'right' as const, threshold: 0.79 },
  { text: 'your move', y: '94%', side: 'left' as const, threshold: 0.93 },
]

// ---- Data ----
const WITHOUT_TASKS = [
  { icon: '\u2717', text: 'Manually typing notes after every session' },
  { icon: '\u2717', text: 'Printing and entering ROM questionnaires' },
  { icon: '\u2717', text: 'Formatting treatment plans in Word' },
  { icon: '\u2717', text: 'Separate calendar, chat, and billing tools' },
  { icon: '\u2717', text: 'Endless admin on Friday afternoons' },
]

const WITH_TASKS = [
  { icon: '\u2713', text: 'AI writes your notes in real time' },
  { icon: '\u2713', text: 'ROM automatically administered and processed' },
  { icon: '\u2713', text: 'Treatment plan generated from intake' },
  { icon: '\u2713', text: 'Everything in one platform, one login' },
  { icon: '\u2713', text: 'Admin finished before your client walks out the door' },
]

const REPLACED_TOOLS = [
  'Pen & paper', 'Word templates', 'Excel ROM', 'Separate calendar',
  'Email', 'Billing app', 'PDF generator', 'Questionnaire tool',
  'Note-taking app', 'Manual DBC registration',
]

const TOUR_STEPS = [
  {
    title: 'Intake',
    desc: 'Structured intake with AI-powered question support. Treatment plan generated immediately.',
  },
  {
    title: 'Session',
    desc: 'Have your conversation. Moods listens along and takes real-time notes in the background.',
  },
  {
    title: 'Notes',
    desc: 'After the session: complete, structured notes ready for review. One click to finalize.',
  },
  {
    title: 'ROM',
    desc: 'Questionnaires sent automatically, completed by clients, results instantly visible.',
  },
  {
    title: 'Reporting',
    desc: 'Progress reports, treatment evaluations, and letters generated from session data.',
  },
  {
    title: 'Billing',
    desc: 'DBC registration and billing automatically updated. Export to your accounting software.',
  },
]

const SECURITY_ITEMS = [
  'NEN 7510 certified',
  'Data in Dutch data centers',
  'End-to-end encryption',
  'AVG / GDPR compliant',
  'Two-factor authentication',
  'Audit logging',
  'BAA agreements',
  'ISO 27001 aligned',
]

const QUOTES = [
  {
    text: '\u201cI have time for my clients again. The admin takes care of itself.\u201d',
    author: 'Healthcare psychologist, Amsterdam',
  },
  {
    text: '\u201cFrom 4 hours of admin per day to 30 minutes. That\u2019s no exaggeration.\u201d',
    author: 'Clinical psychologist, Utrecht',
  },
  {
    text: '\u201cMy notes are better now and I spend less time on them.\u201d',
    author: 'Psychotherapist, Rotterdam',
  },
]

const PRICING_PLANS = [
  {
    name: 'Solo',
    price: '\u20ac79',
    period: '/month',
    desc: 'For independent practices',
    features: ['1 practitioner', 'AI notes', 'ROM', 'Calendar', 'Billing'],
    featured: false,
  },
  {
    name: 'Pro',
    price: '\u20ac149',
    period: '/month',
    desc: 'For group practices',
    features: ['Up to 5 practitioners', 'Everything in Solo', 'Team dashboard', 'Reports', 'Priority support'],
    featured: true,
  },
  {
    name: 'Clinic',
    price: 'Custom',
    period: '',
    desc: 'For large organizations',
    features: ['Unlimited practitioners', 'Everything in Pro', 'SSO / SAML', 'Dedicated support', 'Custom integrations'],
    featured: false,
  },
]

// ---- Sub-components ----

function InkSplash({ active }: { active: boolean }) {
  const dots = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const angle = (i / 5) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const dist = 8 + Math.random() * 12
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      }
    })
  }, [])

  return (
    <div className={styles.inkSplash}>
      {dots.map((dot, i) => (
        <div
          key={i}
          className={`${styles.inkDot} ${active ? styles.animate : ''}`}
          style={{
            '--splash-x': `${dot.x}px`,
            '--splash-y': `${dot.y}px`,
            animationDelay: `${i * 0.05}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

function Checkmark({ drawn }: { drawn: boolean }) {
  return (
    <div className={`${styles.checkmark} ${drawn ? styles.drawn : ''}`}>
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M 3,8 L 7,12 L 13,4" />
      </svg>
    </div>
  )
}

function ContinuousLine({ progress }: { progress: number }) {
  const pathRef = useRef<SVGPathElement>(null)
  const branchRefs = useRef<(SVGPathElement | null)[]>([])
  const [totalLength, setTotalLength] = useState(0)
  const [branchLengths, setBranchLengths] = useState<number[]>([])

  useEffect(() => {
    if (pathRef.current) {
      setTotalLength(pathRef.current.getTotalLength())
    }
    const lengths = branchRefs.current.map((ref) => ref?.getTotalLength() || 0)
    setBranchLengths(lengths)
  }, [])

  const dashOffset = totalLength * (1 - progress)

  return (
    <svg className={styles.lineSvg} viewBox="0 0 1200 8000" preserveAspectRatio="none">
      {/* Glow behind main line */}
      <path
        d={MAIN_PATH}
        stroke="#423C38"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.06"
        filter="blur(3px)"
        strokeDasharray={totalLength || undefined}
        strokeDashoffset={dashOffset}
      />
      {/* Main continuous line */}
      <path
        ref={pathRef}
        d={MAIN_PATH}
        stroke="#423C38"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.8"
        strokeDasharray={totalLength || undefined}
        strokeDashoffset={dashOffset}
      />
      {/* Branch lines */}
      {BRANCH_PATHS.map((branch, i) => {
        const branchProgress = Math.max(0, Math.min(1, (progress - branch.threshold) / 0.04))
        const bLen = branchLengths[i] || 0
        const bOffset = bLen * (1 - branchProgress)
        return (
          <path
            key={i}
            ref={(el) => { branchRefs.current[i] = el }}
            d={branch.d}
            stroke="#423C38"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
            strokeDasharray={bLen || undefined}
            strokeDashoffset={bOffset}
          />
        )
      })}
    </svg>
  )
}

function WaypointDot({
  wp,
  active,
  onClick,
}: {
  wp: typeof WAYPOINTS[0]
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      className={styles.waypoint}
      style={{
        top: `${(wp.y / 8000) * 100}%`,
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
      title={wp.label}
    >
      <div className={`${styles.waypointDot} ${active ? styles.active : ''}`} />
      <InkSplash active={active} />
    </div>
  )
}

// ---- Main Component ----

export default function Design12() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [penPos, setPenPos] = useState<{ x: number; y: number } | null>(null)
  const mainPathRef = useRef<SVGPathElement | null>(null)

  // Scroll handler
  useEffect(() => {
    let rafId: number
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? window.scrollY / docHeight : 0
        setScrollProgress(Math.min(1, Math.max(0, progress)))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Update pen nib position based on scroll progress
  useEffect(() => {
    if (!mainPathRef.current) {
      const svgEl = pageRef.current?.querySelector(`.${styles.lineSvg} path`)
      if (svgEl) mainPathRef.current = svgEl as SVGPathElement
    }
    if (mainPathRef.current) {
      const len = mainPathRef.current.getTotalLength()
      const point = mainPathRef.current.getPointAtLength(len * scrollProgress)
      // Convert from viewBox coords to page coords
      const pageEl = pageRef.current
      if (pageEl) {
        const svgEl = mainPathRef.current.ownerSVGElement
        if (svgEl) {
          const rect = svgEl.getBoundingClientRect()
          const scaleX = rect.width / 1200
          const scaleY = rect.height / 8000
          setPenPos({
            x: point.x * scaleX,
            y: point.y * scaleY + window.scrollY - rect.top - window.scrollY,
          })
        }
      }
    }
  }, [scrollProgress])

  // Section reveal based on scroll progress
  const isRevealed = useCallback(
    (threshold: number) => scrollProgress >= threshold,
    [scrollProgress]
  )

  const revealClass = useCallback(
    (threshold: number) =>
      `${styles.inkDevelop} ${isRevealed(threshold) ? styles.revealed : ''}`,
    [isRevealed]
  )

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className={styles.page} ref={pageRef}>
      {/* The continuous SVG line */}
      <ContinuousLine progress={scrollProgress} />

      {/* Pen nib indicator */}
      {penPos && (
        <div
          className={styles.penNib}
          style={{ left: penPos.x, top: penPos.y }}
        />
      )}

      {/* Waypoint dots */}
      {WAYPOINTS.map((wp) => (
        <WaypointDot
          key={wp.id}
          wp={wp}
          active={isRevealed(wp.threshold)}
          onClick={() => scrollToSection(wp.sectionId)}
        />
      ))}

      {/* Margin annotations */}
      {ANNOTATIONS.map((ann, i) => (
        <div
          key={i}
          className={`${styles.annotation} ${
            ann.side === 'right' ? styles.annotationRight : styles.annotationLeft
          } ${isRevealed(ann.threshold) ? styles.visible : ''}`}
          style={{ top: ann.y }}
        >
          {ann.text}
        </div>
      ))}

      {/* ============ SECTION 1: HERO ============ */}
      <section id="hero-section" className={`${styles.section} ${styles.hero}`}>
        <div className={revealClass(0.0)}>
          <div className={styles.wordmark}>Moods.ai</div>
          <h1 className={styles.heroHeadline}>
            Therapists became therapists to help people.{' '}
            <em>Not to type reports.</em>
          </h1>
          <p className={styles.heroSub}>
            AI-powered practice management for mental healthcare.
            Less admin. More therapy.
          </p>
          <a href="#" className={styles.ctaButton}>
            Start free trial
          </a>
        </div>
      </section>

      {/* ============ SECTION 2: THE PROBLEM ============ */}
      <section id="problem-section" className={`${styles.section} ${styles.problem}`}>
        <div className={styles.sectionInner}>
          <div className={revealClass(0.1)}>
            <div className={styles.sectionLabel}>The problem</div>
            <h2 className={styles.sectionHeading}>
              Half your work week is spent on administration
            </h2>
          </div>
          <div className={styles.splitGrid}>
            <div className={`${styles.splitColumn} ${styles.without}`}>
              <div className={revealClass(0.12)}>
                <h3>Without Moods</h3>
                {WITHOUT_TASKS.map((task, i) => (
                  <div key={i} className={styles.taskItem}>
                    <span className={styles.icon}>{task.icon}</span>
                    <span>{task.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.splitColumn} ${styles.with}`}>
              <div className={revealClass(0.14)}>
                <h3>With Moods</h3>
                {WITH_TASKS.map((task, i) => (
                  <div key={i} className={styles.taskItem}>
                    <span className={styles.icon}>{task.icon}</span>
                    <span>{task.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: THE SOLUTION ============ */}
      <section id="solution-section" className={`${styles.section} ${styles.solution}`}>
        <div className={styles.sectionInner}>
          <div className={revealClass(0.2)}>
            <div className={styles.sectionLabel}>The solution</div>
            <h2 className={styles.sectionHeading}>
              One platform. Not ten.
            </h2>
          </div>
          <div className={`${styles.convergenceContainer} ${revealClass(0.22)}`}>
            <div className={styles.toolList}>
              {REPLACED_TOOLS.map((tool, i) => (
                <span key={i} className={styles.toolChip}>{tool}</span>
              ))}
            </div>
            <div className={styles.centralNode}>MOODS</div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 4: PRODUCT TOUR ============ */}
      <section id="tour-section" className={`${styles.section} ${styles.productTour}`}>
        <div className={styles.sectionInner}>
          <div className={revealClass(0.3)}>
            <div className={styles.sectionLabel}>How it works</div>
            <h2 className={styles.sectionHeading}>From intake to invoice</h2>
          </div>
          <div className={styles.timeline}>
            {TOUR_STEPS.map((step, i) => {
              const threshold = 0.32 + i * 0.03
              return (
                <div key={i} className={styles.timelineNode}>
                  <div className={i % 2 === 0 ? styles.nodeContent : styles.nodeEmpty}>
                    {i % 2 === 0 && (
                      <div className={revealClass(threshold)}>
                        <h4>{step.title}</h4>
                        <p>{step.desc}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.nodeDot} />
                  <div className={i % 2 === 1 ? styles.nodeContent : styles.nodeEmpty}>
                    {i % 2 === 1 && (
                      <div className={revealClass(threshold)}>
                        <h4>{step.title}</h4>
                        <p>{step.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ SECTION 5: AI IN ACTION ============ */}
      <section id="ai-section" className={`${styles.section} ${styles.aiSection}`}>
        <div className={styles.sectionInner}>
          <div className={revealClass(0.5)}>
            <div className={styles.sectionLabel}>AI in action</div>
            <h2 className={styles.sectionHeading}>
              Listen. Process. Document.
            </h2>
          </div>
          <div className={`${styles.waveformContainer} ${revealClass(0.52)}`}>
            <svg className={styles.waveformSvg} viewBox="0 0 600 80" preserveAspectRatio="xMidYMid meet">
              <path
                d="M 0,40 Q 30,10 60,40 Q 90,70 120,40 Q 150,10 180,40 Q 210,65 240,40 Q 270,15 300,40 Q 330,70 360,40 Q 390,10 420,40 Q 450,65 480,40 Q 510,20 540,40 Q 570,60 600,40"
                stroke="#423C38"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className={revealClass(0.54)}>
            <div className={styles.aiFlow}>
              <div className={styles.aiFlowStep}>
                <div className={styles.stepIcon}>{'\uD83C\uDFA4'}</div>
                <div className={styles.stepLabel}>Conversation</div>
              </div>
              <div className={styles.aiFlowArrow}>{'\u2192'}</div>
              <div className={styles.aiFlowStep}>
                <div className={styles.stepIcon}>{'\uD83E\uDDE0'}</div>
                <div className={styles.stepLabel}>AI processing</div>
              </div>
              <div className={styles.aiFlowArrow}>{'\u2192'}</div>
              <div className={styles.aiFlowStep}>
                <div className={styles.stepIcon}>{'\uD83D\uDCCB'}</div>
                <div className={styles.stepLabel}>Notes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 6: SECURITY ============ */}
      <section id="security-section" className={`${styles.section} ${styles.security}`}>
        <div className={styles.sectionInner}>
          <div className={revealClass(0.6)}>
            <div className={styles.sectionLabel}>Security</div>
            <h2 className={styles.sectionHeading}>
              Built for the strictest requirements
            </h2>
          </div>
          <div className={styles.securityGrid}>
            {SECURITY_ITEMS.map((item, i) => {
              const threshold = 0.62 + i * 0.01
              return (
                <div key={i} className={`${styles.securityItem} ${revealClass(threshold)}`}>
                  <Checkmark drawn={isRevealed(threshold)} />
                  <span>{item}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ SECTION 7: SOCIAL PROOF ============ */}
      <section id="quotes-section" className={`${styles.section} ${styles.socialProof}`}>
        <div className={styles.sectionInner}>
          <div className={revealClass(0.7)}>
            <div className={styles.sectionLabel}>Testimonials</div>
            <h2 className={styles.sectionHeading}>
              What practitioners say
            </h2>
          </div>
          <div className={styles.quotesGrid}>
            {QUOTES.map((quote, i) => (
              <div key={i} className={`${styles.quoteCard} ${revealClass(0.72 + i * 0.02)}`}>
                <p className={styles.quoteText}>{quote.text}</p>
                <div className={styles.quoteAuthor}>{quote.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 8: PRICING ============ */}
      <section id="pricing-section" className={`${styles.section} ${styles.pricing}`}>
        <div className={styles.sectionInner}>
          <div className={revealClass(0.78)}>
            <div className={styles.sectionLabel}>Pricing</div>
            <h2 className={styles.sectionHeading}>
              Fair and transparent
            </h2>
          </div>
          <div className={styles.pricingGrid}>
            {PRICING_PLANS.map((plan, i) => (
              <div
                key={i}
                className={`${styles.pricingCard} ${plan.featured ? styles.featured : ''} ${revealClass(0.8 + i * 0.02)}`}
              >
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}>
                  {plan.price}
                  {plan.period && <span>{plan.period}</span>}
                </div>
                <div className={styles.planDesc}>{plan.desc}</div>
                {plan.features.map((f, j) => (
                  <div key={j} className={styles.pricingFeature}>{f}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 9: CTA ============ */}
      <section id="cta-section" className={styles.ctaSection}>
        <div className={revealClass(0.92)}>
          <h2 className={styles.ctaHeadline}>
            Ready to transform your practice?
          </h2>
          <p className={styles.ctaSub}>
            Try Moods free for 14 days. No credit card required.
          </p>
          <a href="#" className={styles.ctaButtonLight}>
            Start free
          </a>
          <p className={styles.ctaNote}>
            Average time saved: 12 hours per week per practitioner
          </p>
        </div>
      </section>
    </div>
  )
}
