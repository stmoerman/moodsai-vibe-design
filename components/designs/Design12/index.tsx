'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import s from './styles.module.css'

/* ============================================================
   Design 12 — "The Kinetic Page"
   Every section has its own signature animation.
   No page-spanning SVG lines. The animations ARE the components.
   Uses IntersectionObserver only — zero scroll listeners.
   ============================================================ */

// ---- Shared Reveal Hook ----
function useRevealObserver(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add(s.visible)
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    root.querySelectorAll(`.${s.reveal}`).forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootRef])
}

// ---- Data ----
const WITHOUT_TASKS = [
  'Manually typing notes after every session',
  'Printing and entering ROM questionnaires',
  'Formatting treatment plans in Word',
  'Separate calendar, chat, and billing tools',
  'Endless admin on Friday afternoons',
]

const WITH_TASKS = [
  'AI writes your notes in real time',
  'ROM automatically administered and processed',
  'Treatment plan generated from intake',
  'Everything in one platform, one login',
  'Admin finished before your client walks out',
]

const REPLACED_TOOLS = [
  'Pen & paper', 'Word templates', 'Excel ROM', 'Separate calendar',
  'Email', 'Billing app', 'PDF generator', 'Questionnaire tool',
  'Note-taking app', 'Manual DBC',
]

const FEATURE_CARDS = [
  {
    title: 'AI Documentation',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4h12l6 6v18H8V4z" /><path d="M20 4v6h6" /><path d="M12 18h8M12 22h5" />
      </svg>
    ),
    bullets: ['Real-time session notes', 'Treatment plans from intake', 'One-click finalization'],
  },
  {
    title: 'Practice Management',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="24" height="22" rx="1" /><path d="M4 12h24" /><path d="M10 6V2M22 6V2" />
      </svg>
    ),
    bullets: ['Calendar & scheduling', 'Client management', 'DBC registration & billing'],
  },
  {
    title: 'Video & Communication',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="16" rx="1" /><path d="M21 14l8-4v12l-8-4" />
      </svg>
    ),
    bullets: ['Secure video sessions', 'In-app messaging', 'Client portal'],
  },
  {
    title: 'HR & Team',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="10" r="5" /><path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" /><circle cx="26" cy="10" r="3" /><circle cx="6" cy="10" r="3" />
      </svg>
    ),
    bullets: ['Team dashboard', 'Role-based access', 'Capacity planning'],
  },
  {
    title: 'Business Intelligence',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 28V18M10 28V12M16 28V16M22 28V8M28 28V4" />
      </svg>
    ),
    bullets: ['Revenue insights', 'Practice analytics', 'Custom reports'],
  },
  {
    title: 'Security & Compliance',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 2L4 8v8c0 8 5.3 15.3 12 18 6.7-2.7 12-10 12-18V8L16 2z" /><path d="M12 16l3 3 6-6" />
      </svg>
    ),
    bullets: ['NEN 7510 certified', 'End-to-end encryption', 'GDPR compliant'],
  },
]

const STATS = [
  { value: '25→5', suffix: ' min', label: 'Documentation time' },
  { value: '500', suffix: 'K+', label: 'AI tokens per month' },
  { value: '99.2', suffix: '%', label: 'Transcription accuracy' },
  { value: '29', suffix: '', label: 'Per seat per month', prefix: '€' },
]

const SECURITY_ITEMS = [
  { title: 'NEN 7510', desc: 'Certified information security for healthcare' },
  { title: 'Dutch Hosting', desc: 'Data stored in Dutch data centers only' },
  { title: 'Encryption', desc: 'End-to-end encryption at rest and in transit' },
  { title: 'GDPR', desc: 'Fully AVG / GDPR compliant by design' },
  { title: '2FA', desc: 'Two-factor authentication for all users' },
  { title: 'Audit Logs', desc: 'Complete audit trail of all actions' },
  { title: 'BAA', desc: 'Business Associate Agreements available' },
  { title: 'ISO 27001', desc: 'Aligned with ISO 27001 standards' },
  { title: 'Access Control', desc: 'Role-based permissions and access' },
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

const CHAT_RESPONSE = `Last month's revenue breakdown:

\u2022 Sessions billed: 342
\u2022 Total revenue: \u20ac48,230
\u2022 Average per session: \u20ac141
\u2022 Growth vs. prior month: +8.3%

Your highest-earning day was March 12th with 18 sessions.`

// ---- Counter animation (fires once via rAF) ----
function useCountUp(
  targetStr: string,
  active: boolean,
  duration = 1500
): string {
  const [display, setDisplay] = useState('0')
  const hasRun = useRef(false)

  useEffect(() => {
    if (!active || hasRun.current) return
    hasRun.current = true

    const target = parseFloat(targetStr.replace(/[^0-9.]/g, ''))
    if (isNaN(target)) {
      setDisplay(targetStr)
      return
    }

    const isDecimal = targetStr.includes('.')
    const start = performance.now()

    function step(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target

      if (isDecimal) {
        setDisplay(current.toFixed(1))
      } else {
        setDisplay(Math.round(current).toString())
      }

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [active, targetStr, duration])

  return display
}

// ---- Chat typing effect ----
function ChatSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'idle' | 'user' | 'dots' | 'typing' | 'done'>('idle')
  const [typed, setTyped] = useState('')
  const hasTriggered = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !hasTriggered.current) {
            hasTriggered.current = true
            ;(e.target as HTMLElement).classList.add(s.visible)
            setPhase('user')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (phase === 'user') {
      const t = setTimeout(() => setPhase('dots'), 800)
      return () => clearTimeout(t)
    }
    if (phase === 'dots') {
      const t = setTimeout(() => setPhase('typing'), 1200)
      return () => clearTimeout(t)
    }
    if (phase === 'typing') {
      let i = 0
      const interval = setInterval(() => {
        i++
        setTyped(CHAT_RESPONSE.slice(0, i))
        if (i >= CHAT_RESPONSE.length) {
          clearInterval(interval)
          setPhase('done')
        }
      }, 20)
      return () => clearInterval(interval)
    }
  }, [phase])

  return (
    <section className={s.chatSection}>
      <div className={s.sectionInner}>
        <div ref={sectionRef} className={`${s.reveal} ${s.chatWindow}`}>
          <div className={s.chatHeader}>
            <span className={s.chatDot} />
            <span className={s.chatTitle}>AskMoody</span>
          </div>
          <div className={s.chatBody}>
            {(phase !== 'idle') && (
              <div className={s.chatBubbleUser}>
                What was our revenue last month?
              </div>
            )}
            {phase === 'dots' && (
              <div className={s.chatBubbleAi}>
                <span className={s.typingDots}>
                  <span /><span /><span />
                </span>
              </div>
            )}
            {(phase === 'typing' || phase === 'done') && (
              <div className={s.chatBubbleAi}>
                <pre className={s.chatPre}>{typed}<span className={phase === 'typing' ? s.cursor : ''} /></pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---- Stats section with counter ----
function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(true)
            ;(e.target as HTMLElement).classList.add(s.visible)
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={s.statsSection}>
      <div className={s.sectionInner}>
        <div ref={sectionRef} className={`${s.reveal} ${s.statsGrid}`}>
          {STATS.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({ stat, index, active }: { stat: typeof STATS[0]; index: number; active: boolean }) {
  const display = useCountUp(stat.value, active)
  // Special case for the "25→5" stat
  const isRange = stat.value.includes('\u2192')
  const display1 = useCountUp('25', active)
  const display2 = useCountUp('5', active)

  return (
    <div className={s.statItem} style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
      <div className={s.statNumber}>
        {stat.prefix && <span>{stat.prefix}</span>}
        {isRange ? (
          <>{display1}<span className={s.statArrow}>{'\u2192'}</span>{display2}</>
        ) : (
          display
        )}
        {stat.suffix && <span className={s.statSuffix}>{stat.suffix}</span>}
      </div>
      <div className={s.statLabel}>{stat.label}</div>
    </div>
  )
}

// ---- Main Component ----
export default function Design12() {
  const pageRef = useRef<HTMLDivElement>(null)
  useRevealObserver(pageRef)

  return (
    <div className={s.page} ref={pageRef}>

      {/* ============ SECTION 1: HERO — "The Reveal" ============ */}
      <section className={s.hero}>
        <div className={s.heroContent}>
          <h1 className={s.heroHeadline}>
            <span className={s.word} style={{ '--i': 0 } as React.CSSProperties}>Therapists</span>{' '}
            <span className={s.word} style={{ '--i': 1 } as React.CSSProperties}>became</span>{' '}
            <span className={s.word} style={{ '--i': 2 } as React.CSSProperties}>therapists</span>{' '}
            <span className={s.word} style={{ '--i': 3 } as React.CSSProperties}>to</span>{' '}
            <span className={s.word} style={{ '--i': 4 } as React.CSSProperties}>help</span>{' '}
            <span className={s.word} style={{ '--i': 5 } as React.CSSProperties}>people.</span>{' '}
            <em className={s.heroItalic}>
              <span className={s.word} style={{ '--i': 7 } as React.CSSProperties}>Not</span>{' '}
              <span className={s.word} style={{ '--i': 8 } as React.CSSProperties}>to</span>{' '}
              <span className={s.word} style={{ '--i': 9 } as React.CSSProperties}>type</span>{' '}
              <span className={s.word} style={{ '--i': 10 } as React.CSSProperties}>reports.</span>
            </em>
          </h1>
          <div className={s.heroBrand}>Moods.ai</div>
          <hr className={s.heroRule} />
          <p className={s.heroSub}>
            AI-powered practice management for mental healthcare.<br />
            Less admin. More therapy.
          </p>
          <a href="#" className={s.ctaButton}>
            <span>Start free trial</span>
            <span className={s.ctaUnderline} />
          </a>
        </div>
      </section>

      {/* ============ SECTION 2: "The Split" — Before & After ============ */}
      <section className={s.splitSection}>
        <div className={s.sectionInner}>
          <div className={s.splitGrid}>
            <div className={`${s.reveal} ${s.splitLeft}`} style={{ '--delay': '0s' } as React.CSSProperties}>
              <h3 className={s.splitTitle}>
                <span className={s.xMark}>{'\u2717'}</span> Without Moods
              </h3>
              {WITHOUT_TASKS.map((task, i) => (
                <div key={i} className={s.taskItem}>
                  <span className={s.taskIcon} style={{ color: '#c44' }}>{'\u2717'}</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
            <div className={`${s.reveal} ${s.splitDivider}`} style={{ '--delay': '0.2s' } as React.CSSProperties} />
            <div className={`${s.reveal} ${s.splitRight}`} style={{ '--delay': '0.1s' } as React.CSSProperties}>
              <h3 className={s.splitTitle}>
                <span className={s.checkMark}>{'\u2713'}</span> With Moods
              </h3>
              {WITH_TASKS.map((task, i) => (
                <div key={i} className={s.taskItem}>
                  <span className={s.taskIcon} style={{ color: '#5a7268' }}>{'\u2713'}</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: "The Collapse" — One Platform ============ */}
      <section className={s.collapseSection}>
        <div className={s.sectionInner}>
          <h2 className={`${s.reveal} ${s.collapseHeading}`}>
            One platform. <em>Not ten.</em>
          </h2>
          <div className={`${s.reveal} ${s.toolScatter}`} style={{ '--delay': '0.2s' } as React.CSSProperties}>
            {REPLACED_TOOLS.map((tool, i) => (
              <span
                key={i}
                className={s.toolLabel}
                style={{
                  '--scatter-x': `${(i % 2 === 0 ? 1 : -1) * (15 + (i * 7) % 40)}px`,
                  '--scatter-y': `${(i % 3 === 0 ? -1 : 1) * (5 + (i * 11) % 20)}px`,
                  '--scatter-r': `${(i % 2 === 0 ? 1 : -1) * (2 + (i * 3) % 6)}deg`,
                  '--strike-delay': `${0.8 + i * 0.06}s`,
                } as React.CSSProperties}
              >
                {tool}
              </span>
            ))}
          </div>
          <div className={`${s.reveal} ${s.collapseBrand}`} style={{ '--delay': '0.6s' } as React.CSSProperties}>
            Moods.ai
          </div>
        </div>
      </section>

      {/* ============ SECTION 4: "The Cards" — Product Tour ============ */}
      <section className={s.cardsSection}>
        <div className={s.sectionInner}>
          <div className={`${s.reveal} ${s.cardsSectionHeader}`}>
            <div className={s.sectionLabel}>What you get</div>
            <h2 className={s.sectionHeading}>Everything your practice needs</h2>
          </div>
          <div className={s.cardsGrid}>
            {FEATURE_CARDS.map((card, i) => (
              <div
                key={i}
                className={`${s.reveal} ${s.featureCard}`}
                style={{ '--delay': `${i * 0.08}s` } as React.CSSProperties}
              >
                <div className={s.cardIcon}>{card.icon}</div>
                <h3 className={s.cardTitle}>{card.title}</h3>
                <ul className={s.cardBullets}>
                  {card.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 5: "The Counter" — Stats ============ */}
      <StatsSection />

      {/* ============ SECTION 6: "The Chat" — AskMoody Demo ============ */}
      <ChatSection />

      {/* ============ SECTION 7: "The Grid" — Security ============ */}
      <section className={s.securitySection}>
        <div className={s.sectionInner}>
          <div className={`${s.reveal} ${s.securityHeader}`}>
            <div className={s.sectionLabel}>Security</div>
            <h2 className={s.sectionHeading}>Built for the strictest requirements</h2>
          </div>
          <div className={s.securityGrid}>
            {SECURITY_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`${s.reveal} ${s.securityCell}`}
                style={{ '--delay': `${i * 0.05}s` } as React.CSSProperties}
              >
                <svg className={s.securityCheck} width="20" height="20" viewBox="0 0 20 20" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10l4 4 8-8" />
                </svg>
                <div>
                  <div className={s.securityTitle}>{item.title}</div>
                  <div className={s.securityDesc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 8: "The Quotes" — Testimonials ============ */}
      <section className={s.quotesSection}>
        <div className={s.sectionInner}>
          <div className={`${s.reveal} ${s.quotesHeader}`}>
            <div className={s.sectionLabel}>Testimonials</div>
            <h2 className={s.sectionHeading}>What practitioners say</h2>
          </div>
          <div className={`${s.reveal} ${s.quotesFan}`} style={{ '--delay': '0.15s' } as React.CSSProperties}>
            {QUOTES.map((quote, i) => (
              <div
                key={i}
                className={s.quoteCard}
                style={{ '--fan-i': i } as React.CSSProperties}
              >
                <p className={s.quoteText}>{quote.text}</p>
                <div className={s.quoteAuthor}>{quote.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 9: "The Pricing" — Clean & Bold ============ */}
      <section className={s.pricingSection}>
        <div className={s.sectionInner}>
          <div className={`${s.reveal} ${s.pricingHeader}`}>
            <div className={s.sectionLabel}>Pricing</div>
            <h2 className={s.sectionHeading}>Fair and transparent</h2>
          </div>
          <div className={s.pricingGrid}>
            {PRICING_PLANS.map((plan, i) => (
              <div
                key={i}
                className={`${s.reveal} ${s.pricingCard} ${plan.featured ? s.featured : ''}`}
                style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}
              >
                <div className={s.planName}>{plan.name}</div>
                <div className={s.planPrice}>
                  {plan.price}
                  {plan.period && <span className={s.planPeriod}>{plan.period}</span>}
                </div>
                <div className={s.planDesc}>{plan.desc}</div>
                <ul className={s.planFeatures}>
                  {plan.features.map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
                <a href="#" className={plan.featured ? s.planCtaFeatured : s.planCta}>
                  Get started
                </a>
              </div>
            ))}
          </div>
          <p className={s.pricingNote}>14 days free. No credit card.</p>
        </div>
      </section>

      {/* ============ SECTION 10: CTA — "The Close" ============ */}
      <section className={s.closeSection}>
        <div className={s.sectionInner}>
          <div className={`${s.reveal} ${s.closeContent}`}>
            <h2 className={s.closeHeadline}>Your practice deserves better.</h2>
            <a href="#" className={s.closeButton}>
              Start free trial
            </a>
            <p className={s.closeNote}>Moods AI &middot; Amsterdam</p>
          </div>
        </div>
      </section>
    </div>
  )
}
