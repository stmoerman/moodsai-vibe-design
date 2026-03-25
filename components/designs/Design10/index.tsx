'use client'

import { useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.css'

/* ── Types ────────────────────────────────────────────── */
interface TimelineNode {
  title: string
  desc: string
  icon: React.ReactNode
  side: 'left' | 'right'
}

interface SecurityItem {
  code: string
  desc: string
}

interface QuoteItem {
  text: string
  attrib: string
}

/* ── Data ─────────────────────────────────────────────── */
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
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="20" height="24" rx="0"/>
        <line x1="10" y1="10" x2="22" y2="10"/>
        <line x1="10" y1="14" x2="22" y2="14"/>
        <line x1="10" y1="18" x2="17" y2="18"/>
        <circle cx="22" cy="22" r="3"/>
        <line x1="24" y1="24" x2="27" y2="27"/>
      </svg>
    ),
  },
  {
    title: 'Practice Management',
    desc: 'Scheduling, intake pipeline, triage flows — all connected.',
    side: 'right',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="24" height="20" rx="0"/>
        <line x1="4" y1="11" x2="28" y2="11"/>
        <line x1="11" y1="6" x2="11" y2="11"/>
        <line x1="21" y1="6" x2="21" y2="11"/>
        <line x1="10" y1="16" x2="14" y2="16"/>
        <line x1="18" y1="16" x2="22" y2="16"/>
        <line x1="10" y1="20" x2="14" y2="20"/>
      </svg>
    ),
  },
  {
    title: 'Video & Communication',
    desc: 'Whereby-powered video, encrypted team & care chat.',
    side: 'left',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="14" rx="0"/>
        <polyline points="21,13 29,9 29,23 21,19"/>
      </svg>
    ),
  },
  {
    title: 'HR & Team',
    desc: 'Leave management, absence tracking, onboarding checklists.',
    side: 'right',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="4"/>
        <path d="M4,26 C4,20 8,17 12,17 C16,17 20,20 20,26"/>
        <circle cx="23" cy="12" r="3"/>
        <path d="M20,26 C20,22 21,20 23,19 C25,18 28,20 28,26"/>
      </svg>
    ),
  },
  {
    title: 'Business Intelligence',
    desc: 'Custom dashboards, declarability tracking, financial control.',
    side: 'left',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4,24 10,16 16,19 22,10 28,14"/>
        <line x1="4" y1="28" x2="28" y2="28"/>
        <line x1="4" y1="8" x2="4" y2="28"/>
      </svg>
    ),
  },
  {
    title: 'Security & Compliance',
    desc: 'NEN 7510/7513, field-level encryption, multi-tenant isolation.',
    side: 'right',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16,4 L28,9 L28,18 C28,23 22,28 16,30 C10,28 4,23 4,18 L4,9 Z"/>
        <polyline points="11,16 14,19 21,13"/>
      </svg>
    ),
  },
]

const SECURITY_ITEMS: SecurityItem[] = [
  { code: 'NEN 7510', desc: 'Patient data protection' },
  { code: 'NEN 7513', desc: 'Audit logging' },
  { code: 'AES-256-GCM', desc: 'Field-level encryption' },
  { code: 'RBAC', desc: '5 roles, 25+ permissions' },
  { code: 'BSN Redaction', desc: 'Automatic PII removal' },
  { code: 'Multi-tenant', desc: 'Complete data isolation' },
]

const QUOTES: QuoteItem[] = [
  {
    text: 'Finally, a platform that understands how GGZ practices actually work.',
    attrib: 'Practice Owner',
  },
  {
    text: 'I spend 25 minutes less on documentation every day.',
    attrib: 'Therapist',
  },
  {
    text: 'The declarability dashboard alone paid for itself.',
    attrib: 'HR Manager',
  },
]

/* ── Hand-drawn SVG Icons for checkmarks ─────────────── */
function CheckmarkSvg({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={styles.checkmarkSvg}
      aria-hidden="true"
    >
      <path
        d="M3,12 L9,18 L21,6"
        className={`${styles.checkPath} ${className ?? ''}`}
      />
    </svg>
  )
}

/* ── Chat streaming hook ──────────────────────────────── */
const MOODY_RESPONSE =
  'Your practice average is 79.2% across 24 therapists. That\u2019s 1.2% above your 78% target. 3 therapists are below individual targets.'

/* ── Main component ───────────────────────────────────── */
export default function Design10() {
  const rootRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const dotGridRef = useRef<HTMLDivElement>(null)
  const einkRef = useRef<HTMLDivElement>(null)
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

  /* ── Reduced motion check ─────────────────────────── */
  const prefersReducedMotion = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  /* ── E-ink flash ──────────────────────────────────── */
  const triggerEinkFlash = useCallback(() => {
    if (prefersReducedMotion()) return
    const el = einkRef.current
    if (!el) return
    // Phase 1: fade in to black (100ms)
    el.style.transition = 'opacity 100ms linear, background-color 100ms linear'
    el.style.backgroundColor = '#000'
    el.style.opacity = '1'
    // Phase 2: flip to white (80ms)
    setTimeout(() => {
      el.style.transition = 'opacity 80ms linear, background-color 80ms linear'
      el.style.backgroundColor = '#fff'
    }, 100)
    // Phase 3: fade out (200ms)
    setTimeout(() => {
      el.style.transition = 'opacity 200ms linear'
      el.style.opacity = '0'
    }, 180)
  }, [prefersReducedMotion])

  /* ── Chat streaming ───────────────────────────────── */
  const streamChat = useCallback(() => {
    if (chatStartedRef.current) return
    chatStartedRef.current = true
    const el = chatResponseRef.current
    const cursor = chatCursorRef.current
    if (!el || !cursor) return
    el.textContent = ''
    cursor.style.display = 'inline-block'
    let i = 0
    const interval = setInterval(() => {
      if (i < MOODY_RESPONSE.length) {
        el.textContent = MOODY_RESPONSE.slice(0, i + 1)
        i++
      } else {
        clearInterval(interval)
        // Keep cursor blinking after done
      }
    }, 20)
  }, [])

  /* ── Arrow redraw loop ────────────────────────────── */
  const drawArrow = useCallback(() => {
    const a = arrowRef.current
    const h = arrowHeadRef.current
    if (!a || !h) return
    a.style.transition = 'none'
    h.style.transition = 'none'
    a.style.strokeDashoffset = '120'
    h.style.strokeDashoffset = '20'
    // Force reflow
    void a.getBoundingClientRect()
    a.style.transition = 'stroke-dashoffset 1s ease-out'
    h.style.transition = 'stroke-dashoffset 0.4s ease-out 0.8s'
    a.style.strokeDashoffset = '0'
    h.style.strokeDashoffset = '0'
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    /* ── Scroll progress bar ────────────────────────── */
    const handleScroll = () => {
      const el = progressRef.current
      if (!el) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      el.style.width = `${pct}%`
    }

    /* ── Dot-grid parallax ──────────────────────────── */
    const handleParallax = () => {
      const dg = dotGridRef.current
      if (!dg) return
      const y = window.scrollY * 0.15
      dg.style.backgroundPosition = `0px ${y}px`
    }

    const onScroll = () => {
      handleScroll()
      handleParallax()
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    /* ── Underline draw (500ms delay after mount) ───── */
    const underlineTimer = setTimeout(() => {
      const path = underlineRef.current
      if (path) {
        path.classList.add(styles.drawn)
      }
    }, 500)

    /* ── IntersectionObserver for reveals ───────────── */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            // Staggered reveals
            const delay = target.dataset.delay ?? '0'
            setTimeout(() => {
              target.classList.add(styles.visible)
            }, parseInt(delay, 10))
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    const revealEls = document.querySelectorAll(
      `.${styles.reveal}, .${styles.revealLeft}, .${styles.revealRight}`
    )
    revealEls.forEach((el) => observer.observe(el))

    /* ── Tool strikethroughs ────────────────────────── */
    const strikeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = toolItemRefs.current
            items.forEach((item, i) => {
              if (item) {
                setTimeout(() => {
                  item.classList.add(styles.struck)
                }, i * 100)
              }
            })
            strikeObserver.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    const toolList = document.querySelector(`.${styles.toolList}`)
    if (toolList) strikeObserver.observe(toolList)

    /* ── Security checkmarks ────────────────────────── */
    const checkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            checkRefs.current.forEach((path, i) => {
              if (path) {
                setTimeout(() => {
                  path.classList.add(styles.drawn)
                }, i * 100)
              }
            })
            checkObserver.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    const secGrid = document.querySelector(`.${styles.securityGrid}`)
    if (secGrid) checkObserver.observe(secGrid)

    /* ── Pricing checkmarks ─────────────────────────── */
    const priceCheckObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pricingCheckRefs.current.forEach((path, i) => {
              if (path) {
                setTimeout(() => {
                  path.classList.add(styles.drawn)
                }, i * 80)
              }
            })
            priceCheckObserver.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    const priceTable = document.querySelector(`.${styles.pricingTable}`)
    if (priceTable) priceCheckObserver.observe(priceTable)

    /* ── Chat streaming trigger ─────────────────────── */
    const chatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            streamChat()
            chatObserver.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    const chatWindow = document.querySelector(`.${styles.chatWindow}`)
    if (chatWindow) chatObserver.observe(chatWindow)

    /* ── CTA arrow draw + loop ──────────────────────── */
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            drawArrow()
            // Redraw every 4s
            arrowIntervalRef.current = setInterval(drawArrow, 4000)
            ctaObserver.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    const ctaSection = document.querySelector(`.${styles.ctaSection}`)
    if (ctaSection) ctaObserver.observe(ctaSection)

    /* ── E-ink flash at section boundaries ─────────── */
    const sections = document.querySelectorAll('section[data-section]')
    const einkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerEinkFlash()
          }
        })
      },
      { threshold: 0.01, rootMargin: '-45% 0px -45% 0px' }
    )
    sections.forEach((s) => einkObserver.observe(s))

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(underlineTimer)
      observer.disconnect()
      strikeObserver.disconnect()
      checkObserver.disconnect()
      priceCheckObserver.disconnect()
      chatObserver.disconnect()
      ctaObserver.disconnect()
      einkObserver.disconnect()
      if (arrowIntervalRef.current) clearInterval(arrowIntervalRef.current)
    }
  }, [prefersReducedMotion, streamChat, drawArrow, triggerEinkFlash])

  /* ── Pricing check ref collector ─────────────────── */
  let priceCheckIdx = 0

  return (
    <div className={styles.root} ref={rootRef}>
      {/* Dot-grid background */}
      <div className={styles.dotGrid} ref={dotGridRef} aria-hidden="true" />

      {/* E-ink flash overlay */}
      <div className={styles.einkFlash} ref={einkRef} aria-hidden="true" />

      {/* Scroll progress bar */}
      <div className={styles.progressBar} ref={progressRef} role="progressbar" aria-hidden="true" />

      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        <a href="#" className={styles.navLogo}>Moods.ai</a>
        <ul className={styles.navLinks}>
          <li><a href="#product">Product</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#signin">Sign in</a></li>
        </ul>
      </nav>

      <div className={styles.page}>

        {/* ════════════════════════════════════════════
            Section 1: Hero
        ════════════════════════════════════════════ */}
        <section data-section="hero" className={styles.hero}>
          <p className={`${styles.heroEyebrow} ${styles.reveal}`} data-delay="0">
            Dutch GGZ · Mental Healthcare Platform
          </p>

          <h1 className={`${styles.heroHeadline} ${styles.reveal}`} data-delay="100">
            The intelligent practice for modern mental healthcare
          </h1>

          {/* "Moods.ai" with hand-drawn SVG underline */}
          <div className={`${styles.heroProduct} ${styles.reveal}`} data-delay="220">
            <span>Moods.ai</span>
            <svg
              className={styles.heroUnderline}
              width="240"
              height="16"
              viewBox="0 0 240 16"
              aria-hidden="true"
            >
              <path
                ref={underlineRef}
                d="M0,8 C20,2 40,14 60,6 C80,0 100,12 120,4 C140,-2 160,10 180,6 C200,2 220,10 240,8"
                className={styles.underlinePath}
              />
            </svg>
          </div>

          <p className={`${styles.heroSub} ${styles.reveal}`} data-delay="340">
            Replace your scattered tools with one platform built for Dutch GGZ.
          </p>

          <a href="#" className={`${styles.heroCta} ${styles.reveal}`} data-delay="460">
            Start free trial
          </a>
        </section>

        <div className={styles.sectionDivider} />

        {/* ════════════════════════════════════════════
            Section 2: What We Replace
        ════════════════════════════════════════════ */}
        <section data-section="replace">
          <div className={styles.replaceSection}>
            <p className={`${styles.sectionLabel} ${styles.reveal}`}>
              02 — What we replace
            </p>
            <div className={styles.replaceGrid}>
              {/* Before column */}
              <div className={`${styles.replaceCol} ${styles.revealLeft}`}>
                <h3>Before</h3>
                <ul className={styles.toolList}>
                  {TOOLS.map((tool, i) => (
                    <li
                      key={tool}
                      className={styles.toolItem}
                      ref={(el) => { toolItemRefs.current[i] = el }}
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              {/* After column */}
              <div className={`${styles.afterCol} ${styles.revealRight}`}>
                <h3 className={`${styles.replaceCol}`}>After</h3>
                <div className={styles.afterTitle}>Moods.ai</div>
                {/* SVG lines converging from 10 inputs to one node */}
                <svg
                  className={styles.convergeSvg}
                  viewBox="0 0 320 340"
                  fill="none"
                  stroke="#d0cdc6"
                  strokeWidth="1"
                  aria-hidden="true"
                >
                  {/* 10 input points on the left, spaced 32px apart, converging to center-right */}
                  {Array.from({ length: 10 }, (_, i) => {
                    const y = 16 + i * 32
                    return (
                      <g key={i}>
                        <circle cx="12" cy={y} r="3" fill="#d0cdc6" stroke="none" />
                        <path d={`M15,${y} C80,${y} 200,170 280,170`} />
                      </g>
                    )
                  })}
                  {/* Central node */}
                  <circle cx="288" cy="170" r="8" fill="#3a3a3a" stroke="none" />
                  <circle cx="288" cy="170" r="14" fill="none" stroke="#3a3a3a" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ════════════════════════════════════════════
            Section 3: Product Tour (vertical timeline)
        ════════════════════════════════════════════ */}
        <section data-section="product" id="product">
          <p className={`${styles.tourLabel} ${styles.reveal}`}>
            03 — Product tour
          </p>
          <div className={styles.timelineContainer}>
            {/* Vertical line */}
            <div className={styles.timelineLine} aria-hidden="true" />

            {TIMELINE_NODES.map((node, i) => {
              const isLeft = node.side === 'left'
              const cardClass = isLeft
                ? `${styles.timelineCard} ${styles.left} ${styles.revealLeft}`
                : `${styles.timelineCard} ${styles.right} ${styles.revealRight}`
              const emptyClass = `${styles.timelineCard} ${styles.empty}`

              return (
                <div
                  key={node.title}
                  className={styles.timelineItem}
                  style={{ transitionDelay: `${i * 0.15}s` }}
                >
                  {isLeft ? (
                    <>
                      <div className={cardClass} data-delay={String(i * 150)}>
                        <div className={styles.timelineCardIcon}>{node.icon}</div>
                        <div className={styles.timelineCardTitle}>{node.title}</div>
                        <p className={styles.timelineCardDesc}>{node.desc}</p>
                      </div>
                      <div className={styles.timelineNode} aria-hidden="true" />
                      <div className={emptyClass} />
                    </>
                  ) : (
                    <>
                      <div className={emptyClass} />
                      <div className={styles.timelineNode} aria-hidden="true" />
                      <div className={cardClass} data-delay={String(i * 150)}>
                        <div className={styles.timelineCardIcon}>{node.icon}</div>
                        <div className={styles.timelineCardTitle}>{node.title}</div>
                        <p className={styles.timelineCardDesc}>{node.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ════════════════════════════════════════════
            Section 4: AskMoody chat
        ════════════════════════════════════════════ */}
        <section data-section="askmoody">
          <div className={styles.askSection}>
            <div className={styles.askInner}>
              <p className={`${styles.askLabel} ${styles.reveal}`}>
                04 — AskMoody
              </p>
              <div className={`${styles.chatWindow} ${styles.reveal}`} data-delay="150">
                <div className={styles.chatHeader}>
                  AskMoody · Intelligence layer
                </div>
                <div className={styles.chatBody}>
                  <div className={`${styles.chatMsg} ${styles.chatMsgUser}`}>
                    What&rsquo;s our declarability average this week?
                  </div>
                  <div className={`${styles.chatMsg} ${styles.chatMsgMoody}`}>
                    <span ref={chatResponseRef} />
                    <span ref={chatCursorRef} className={styles.chatCursor} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ════════════════════════════════════════════
            Section 5: Security Spec Sheet
        ════════════════════════════════════════════ */}
        <section data-section="security">
          <div className={styles.securitySection}>
            <p className={`${styles.securityLabel} ${styles.reveal}`}>
              05 — Security &amp; compliance
            </p>
            <div className={styles.securityGrid}>
              {SECURITY_ITEMS.map((item, i) => (
                <div
                  key={item.code}
                  className={`${styles.securityItem} ${styles.reveal}`}
                  data-delay={String(i * 80)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className={styles.checkmarkSvg}
                    aria-hidden="true"
                  >
                    <path
                      d="M3,12 L9,18 L21,6"
                      ref={(el) => { checkRefs.current[i] = el }}
                      className={styles.checkPath}
                    />
                  </svg>
                  <div className={styles.securityItemTitle}>{item.code}</div>
                  <div className={styles.securityItemDesc}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ════════════════════════════════════════════
            Section 6: Social Proof
        ════════════════════════════════════════════ */}
        <section data-section="social">
          <div className={styles.socialSection}>
            <p className={`${styles.socialLabel} ${styles.reveal}`}>
              06 — From practitioners
            </p>
            <div className={styles.socialGrid}>
              {QUOTES.map((q, i) => (
                <div
                  key={q.attrib}
                  className={`${styles.quoteCard} ${styles.reveal}`}
                  data-delay={String(i * 120)}
                >
                  <p className={styles.quoteText}>{q.text}</p>
                  <p className={styles.quoteAttrib}>{q.attrib}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ════════════════════════════════════════════
            Section 7: Pricing
        ════════════════════════════════════════════ */}
        <section data-section="pricing" id="pricing">
          <div className={styles.pricingSection}>
            <p className={`${styles.pricingLabel} ${styles.reveal}`}>
              07 — Pricing
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className={`${styles.pricingTable} ${styles.reveal}`} data-delay="150">
                <thead>
                  <tr>
                    <th></th>
                    <th>Free</th>
                    <th>Pro</th>
                    <th>Lifetime</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    <td>€0</td>
                    <td>€49 / mo</td>
                    <td>€890 once</td>
                  </tr>
                  <tr>
                    <td>Seats</td>
                    <td>1</td>
                    <td>Unlimited</td>
                    <td>Unlimited</td>
                  </tr>
                  <tr>
                    <td>AI Tokens</td>
                    <td>10k / mo</td>
                    <td>500k / mo</td>
                    <td>Unlimited</td>
                  </tr>
                  <tr>
                    <td>Storage</td>
                    <td>1 GB</td>
                    <td>100 GB</td>
                    <td>500 GB</td>
                  </tr>
                  {/* Feature rows with animated checkmarks */}
                  {[
                    'AI Documentation',
                    'Video Consultations',
                    'HR & Leave Management',
                    'Business Intelligence',
                    'NEN 7510 Compliance',
                    'Priority Support',
                  ].map((feature, fi) => (
                    <tr key={feature}>
                      <td>{feature}</td>
                      {[
                        fi < 1,   // Free: only first feature
                        true,     // Pro: all
                        true,     // Lifetime: all
                      ].map((has, ci) => (
                        <td key={ci}>
                          {has ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              className={styles.pricingCheck}
                              aria-label="included"
                            >
                              <path
                                d="M3,12 L9,18 L21,6"
                                ref={(el) => {
                                  pricingCheckRefs.current[priceCheckIdx] = el
                                  priceCheckIdx++
                                }}
                                className={styles.pricingCheckPath}
                              />
                            </svg>
                          ) : (
                            <span className={styles.dash}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* ════════════════════════════════════════════
            Section 8: CTA
        ════════════════════════════════════════════ */}
        <section data-section="cta" className={styles.ctaSection}>
          {/* Hand-drawn curved arrow pointing down to button */}
          <div className={`${styles.ctaArrowWrapper} ${styles.reveal}`}>
            <svg
              width="100"
              height="90"
              viewBox="0 0 100 90"
              className={styles.ctaArrowSvg}
              aria-hidden="true"
            >
              {/* Curved path arcing down */}
              <path
                ref={arrowRef}
                d="M50,0 C40,25 20,45 28,70 Q35,82 42,80"
                className={styles.arrowPath}
              />
              {/* Arrowhead */}
              <path
                ref={arrowHeadRef}
                d="M38,80 L42,80 L44,74"
                className={styles.arrowHeadPath}
              />
            </svg>
          </div>

          <h2 className={`${styles.ctaHeadline} ${styles.reveal}`} data-delay="100">
            Start your free trial
          </h2>
          <a
            href="#"
            className={`${styles.ctaButton} ${styles.reveal}`}
            data-delay="200"
          >
            Get started — it&rsquo;s free
          </a>
          <p className={`${styles.ctaNote} ${styles.reveal}`} data-delay="300">
            14 days free. No credit card.
          </p>
        </section>

        <div className={styles.sectionDivider} />

        {/* ════════════════════════════════════════════
            Section 9: Footer
        ════════════════════════════════════════════ */}
        <footer className={styles.footer}>
          <div className={styles.footerFade} aria-hidden="true" />
          <p className={styles.footerText}>
            Moods AI &middot; Amsterdam &middot;{' '}
            <a href="mailto:info@ohmymood.com">info@ohmymood.com</a>
          </p>
        </footer>

      </div>
    </div>
  )
}
