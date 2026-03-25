'use client'
import { useRef, useLayoutEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './styles.module.css'

gsap.registerPlugin(ScrollTrigger)

// ----------------------------------------------------------------
// Data
// ----------------------------------------------------------------

const TAB_COLORS = ['#d4a0a0', '#3a5a8c', '#8ca05a', '#a05a8c', '#5a8ca0', '#c8a040', '#8c5a3a']

const SECTION_IDS = ['hero', 'features', 'askmoody', 'transcript', 'numbers', 'pricing', 'cta'] as const
const SECTION_LABELS = ['Intro', 'Features', 'AskMoody', 'Voice', 'Numbers', 'Pricing', 'Start']

interface FeaturePage {
  category: string
  title: string
  features: string[]
  icon: string
  pageNum: string
}

const FEATURE_PAGES: FeaturePage[] = [
  {
    category: 'AI & Documentation',
    title: 'Let Moody handle the paperwork.',
    features: [
      'AskMoody: your AI assistant answers practice questions instantly',
      'Dictation with live transcription during sessions',
      'Automatic session reports — ready in minutes',
      'Smart templates for DSM-5, HoNOS, ROM',
    ],
    icon: '✦',
    pageNum: '01',
  },
  {
    category: 'Practice Management',
    title: 'Everything your front desk needs.',
    features: [
      'Online scheduling with therapist availability',
      'Digital client onboarding and consent forms',
      'Smart triage and intake routing',
      'Waiting list management with notifications',
    ],
    icon: '◈',
    pageNum: '02',
  },
  {
    category: 'Communication',
    title: 'Stay connected with clients and team.',
    features: [
      'Integrated video consultations (NEN 7510 compliant)',
      'Secure team chat and announcements',
      'Client-facing care chat portal',
      'Automated appointment reminders and follow-ups',
    ],
    icon: '◎',
    pageNum: '03',
  },
  {
    category: 'HR & Team',
    title: 'Your people, organized.',
    features: [
      'Leave requests and absence tracking',
      'Staff profiles, roles and permissions',
      'Team schedules and shift planning',
      'Onboarding workflows for new colleagues',
    ],
    icon: '⊞',
    pageNum: '04',
  },
  {
    category: 'Analytics & Finance',
    title: 'Numbers that tell the whole story.',
    features: [
      'Revenue dashboard by care category',
      'KPI tracking across all departments',
      'Custom dashboards per team or manager',
      'DBC billing and insurance claim exports',
    ],
    icon: '◇',
    pageNum: '05',
  },
]

const TRANSCRIPT_LINES = [
  { timestamp: '00:04', speaker: 'Therapeut', speakerKey: 'T', text: 'Hoe was de afgelopen week voor jou?' },
  { timestamp: '00:12', speaker: 'Patient', speakerKey: 'P', text: 'Wisselend. De maandag was zwaar, maar donderdag ging beter.' },
  { timestamp: '00:28', speaker: 'Therapeut', speakerKey: 'T', text: 'Kun je me meer vertellen over wat maandag zwaar maakte?' },
  { timestamp: '00:37', speaker: 'Patient', speakerKey: 'P', text: 'Er was een situatie op het werk. Ik reageerde anders dan ik wilde.' },
  { timestamp: '00:58', speaker: 'Therapeut', speakerKey: 'T', text: 'Wat zou je bij een vergelijkbare situatie anders willen doen?' },
  { timestamp: '01:14', speaker: 'Patient', speakerKey: 'P', text: 'Een stapje terug nemen, even ademen voor ik reageer.' },
]

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '€19',
    suffix: '/seat/mo',
    note: 'Perfect om mee te beginnen',
    recommended: false,
    features: [
      'AI-documenten (50/maand)',
      'Planning & agenda',
      'Videobelgesprekken',
      'Basis rapportages',
      '1 locatie',
    ],
    cta: 'Gratis proberen',
  },
  {
    name: 'Professional',
    price: '€29',
    suffix: '/seat/mo',
    note: 'Meest gekozen door GGZ-teams',
    recommended: true,
    features: [
      'Onbeperkte AI-documenten',
      'AskMoody assistent',
      'HR & verlofbeheer',
      'Geavanceerde analytics',
      'Meerdere locaties',
    ],
    cta: 'Start met Professional',
  },
  {
    name: 'Enterprise',
    price: 'Op maat',
    suffix: '',
    note: 'Voor grote zorgorganisaties',
    recommended: false,
    features: [
      'Alles in Professional',
      'Dedicated ondersteuning',
      'Eigen SLA & uptime-garantie',
      'API-toegang & integraties',
      'Custom onboarding',
    ],
    cta: 'Contact opnemen',
  },
]

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export default function Design03() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const heroCtaRef = useRef<HTMLDivElement>(null)
  const heroAnnotationRef = useRef<HTMLDivElement>(null)
  const featuresStackRef = useRef<HTMLDivElement>(null)
  const featuresStickyRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])
  const chatMessagesRef = useRef<(HTMLDivElement | null)[]>([])
  const transcriptLineRefs = useRef<(HTMLDivElement | null)[]>([])
  const statRefs = useRef<(HTMLDivElement | null)[]>([])
  const pricingCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const ctaHeadlineRef = useRef<HTMLHeadingElement>(null)
  const ctaHandRef = useRef<HTMLSpanElement>(null)
  const ctaActionsRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState(0)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // ---- Section tab highlighting ----
      SECTION_IDS.forEach((id, i) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveTab(i),
          onEnterBack: () => setActiveTab(i),
        })
      })

      if (reducedMotion) return

      // ---- HERO: typewriter effect ----
      const headlineEl = heroHeadlineRef.current
      if (headlineEl) {
        const text = headlineEl.dataset.text ?? ''
        headlineEl.innerHTML = ''
        const chars = text.split('').map((ch) => {
          const span = document.createElement('span')
          span.className = styles.heroChar
          span.textContent = ch === ' ' ? '\u00A0' : ch
          headlineEl.appendChild(span)
          return span
        })

        gsap.to(chars, {
          opacity: 1,
          stagger: 0.04,
          duration: 0.01,
          ease: 'none',
          delay: 0.4,
        })
      }

      // Hero sub and cta fade in
      gsap.to(heroSubRef.current, { opacity: 1, y: 0, duration: 0.7, delay: 2.2, ease: 'power2.out' })
      gsap.to(heroCtaRef.current, { opacity: 1, y: 0, duration: 0.6, delay: 2.6, ease: 'power2.out' })
      gsap.to(heroAnnotationRef.current, { opacity: 1, duration: 0.8, delay: 3.0, ease: 'power2.out' })

      // ---- FEATURES: stacked pages with ScrollTrigger ----
      const featuresSectionEl = document.getElementById('features')
      if (featuresSectionEl && featuresStackRef.current) {
        // Initial rotations
        const rotations = [0, 1.5, -1.2, 2, -0.8]
        const translateYs = [0, 6, 12, 18, 24]

        pageRefs.current.forEach((page, i) => {
          if (!page) return
          gsap.set(page, {
            rotation: rotations[i],
            y: translateYs[i],
          })
        })

        // Each page unrotates when it becomes the top page
        pageRefs.current.forEach((page, i) => {
          if (!page || i === 0) return
          ScrollTrigger.create({
            trigger: featuresSectionEl,
            start: `${(i / FEATURE_PAGES.length) * 100}% top`,
            end: `${((i + 1) / FEATURE_PAGES.length) * 100}% top`,
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress
              gsap.set(page, {
                rotation: rotations[i] * (1 - progress),
                y: translateYs[i] * (1 - progress),
              })
            },
          })
        })
      }

      // ---- ASK MOODY: chat messages reveal ----
      chatMessagesRef.current.forEach((msg, i) => {
        if (!msg) return
        gsap.to(msg, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: msg,
            start: 'top 80%',
          },
          delay: i * 0.3,
        })
      })

      // ---- TRANSCRIPT: staggered line reveal ----
      transcriptLineRefs.current.forEach((line, i) => {
        if (!line) return
        gsap.to(line, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
          },
          delay: i * 0.15,
        })
      })

      // ---- NUMBERS: scale-up on enter ----
      statRefs.current.forEach((stat) => {
        if (!stat) return
        gsap.fromTo(
          stat,
          { opacity: 0, scale: 0.97 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 80%',
            },
          }
        )
      })

      // ---- PRICING: cards slide up ----
      pricingCardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          delay: i * 0.1,
        })
      })

      // ---- CTA ----
      if (ctaHeadlineRef.current) {
        gsap.to(ctaHeadlineRef.current, {
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaHeadlineRef.current,
            start: 'top 80%',
          },
        })
      }
      if (ctaHandRef.current) {
        gsap.to(ctaHandRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaHandRef.current,
            start: 'top 80%',
          },
          delay: 0.2,
        })
      }
      if (ctaActionsRef.current) {
        gsap.to(ctaActionsRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaActionsRef.current,
            start: 'top 85%',
          },
          delay: 0.4,
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={styles.notebook}>
      {/* ---- Right-edge section tabs ---- */}
      <nav className={styles.tabs} aria-label="Section navigation">
        {SECTION_LABELS.map((label, i) => (
          <button
            key={SECTION_IDS[i]}
            className={`${styles.tab} ${activeTab === i ? styles.tabActive : ''}`}
            style={{ background: TAB_COLORS[i] }}
            onClick={() => scrollToSection(SECTION_IDS[i])}
            aria-label={`Jump to ${label}`}
            title={label}
          >
            <span className={styles.tabLabel}>{label}</span>
          </button>
        ))}
      </nav>

      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroLogo}>moods · ai</div>

        <h1
          ref={heroHeadlineRef}
          className={styles.heroHeadline}
          data-text="Everything your practice needs. Nothing it doesn't."
        >
          Everything your practice needs. Nothing it doesn&apos;t.
        </h1>

        <p ref={heroSubRef} className={styles.heroSub}>
          From scheduling to AI reports, in one place.
        </p>

        <div ref={heroCtaRef} className={styles.heroCta}>
          <a href="#pricing" className={styles.btnPrimary}>
            Gratis proberen
          </a>
          <a href="#features" className={styles.btnSecondary}>
            Ontdek de functies
          </a>
        </div>

        <div ref={heroAnnotationRef} className={styles.heroAnnotation}>
          voor de Nederlandse GGZ ↓
        </div>
      </section>

      {/* ================================================================
          SECTION 2: FEATURE PAGES
          ================================================================ */}
      <section id="features" className={styles.featuresSection}>
        <div ref={featuresStickyRef} className={styles.featuresStickyWrapper}>
          <div ref={featuresStackRef} className={styles.featuresStack}>
            {FEATURE_PAGES.map((page, i) => (
              <div
                key={page.category}
                ref={(el) => { pageRefs.current[i] = el }}
                className={`${styles.notebookPage} ${styles[`page${i}` as keyof typeof styles]}`}
              >
                <span className={styles.pageNumber}>{page.pageNum}</span>
                <div className={styles.pageCategory}>{page.category}</div>
                <h2 className={styles.pageTitle}>{page.title}</h2>
                <ul className={styles.pageFeatures}>
                  {page.features.map((feat) => (
                    <li key={feat} className={styles.pageFeature}>
                      <span className={styles.featureBullet} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className={styles.pageIllustration} aria-hidden="true">
                  {page.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3: ASK MOODY
          ================================================================ */}
      <section id="askmoody" className={styles.askSection}>
        <div className={styles.sectionLabel}>AskMoody</div>
        <h2 className={styles.sectionTitle}>Je praktijk kent al de antwoorden.</h2>
        <span className={styles.sectionHandwritten}>Stel gewoon de vraag.</span>

        <div className={styles.chatWrapper}>
          <div className={styles.chatMessages}>
            <div
              ref={(el) => { chatMessagesRef.current[0] = el }}
              className={styles.chatMessage}
            >
              <div className={`${styles.chatAvatar} ${styles.avatarUser}`}>JIJ</div>
              <div className={`${styles.chatBubble} ${styles.bubbleUser}`}>
                What was our revenue last month?
              </div>
            </div>

            <div
              ref={(el) => { chatMessagesRef.current[1] = el }}
              className={styles.chatMessage}
            >
              <div className={`${styles.chatAvatar} ${styles.avatarMoody}`}>M</div>
              <div className={`${styles.chatBubble} ${styles.bubbleMoody}`}>
                Last month your practice generated{' '}
                <strong>€142,350</strong> across 4 categories:{' '}
                Treatment (€89,200), Diagnostics (€31,400), eHealth (€14,750),
                Workshops (€7,000).<span className={styles.chatCursor} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4: VOICE-TO-REPORT
          ================================================================ */}
      <section id="transcript" className={styles.transcriptSection}>
        <div className={styles.sectionLabel}>Voice-to-Report</div>
        <h2 className={styles.sectionTitle}>Praat. Moods luistert.</h2>
        <span className={styles.sectionHandwritten}>
          Automatisch rapport klaar na de sessie.
        </span>

        <div className={styles.transcriptWrapper}>
          {TRANSCRIPT_LINES.map((line, i) => (
            <div
              key={i}
              ref={(el) => { transcriptLineRefs.current[i] = el }}
              className={styles.transcriptLine}
            >
              <span className={styles.transcriptTimestamp}>{line.timestamp}</span>
              <span
                className={`${styles.transcriptSpeaker} ${
                  line.speakerKey === 'T' ? styles.speakerT : styles.speakerP
                }`}
              >
                {line.speakerKey === 'T' ? 'THER.' : 'PAT.'}
              </span>
              <span className={styles.transcriptText}>{line.text}</span>
            </div>
          ))}

          <div className={styles.transcriptLive}>
            <span className={styles.liveDot} />
            Live transcriptie actief
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5: THE NUMBERS
          ================================================================ */}
      <section id="numbers" className={styles.numbersSection}>
        <div className={styles.sectionLabel}>De resultaten</div>
        <h2 className={styles.sectionTitle}>Cijfers die spreken voor zich.</h2>

        <div className={styles.statsGrid}>
          <div
            ref={(el) => { statRefs.current[0] = el }}
            className={styles.statItem}
          >
            <div className={styles.statValue}>
              30 min <span className={styles.statArrow}>→</span> 5 min
            </div>
            <div className={styles.statLabel}>Documentatietijd per sessie</div>
            <div className={styles.statAnnotation}>80% tijdsbesparing</div>
          </div>

          <div
            ref={(el) => { statRefs.current[1] = el }}
            className={styles.statItem}
          >
            <div className={styles.statValue}>NEN 7510</div>
            <div className={styles.statLabel}>+ NEN 7513 gecertificeerd</div>
            <div className={styles.statAnnotation}>volledig compliant</div>
          </div>

          <div
            ref={(el) => { statRefs.current[2] = el }}
            className={styles.statItem}
          >
            <div className={styles.statValue}>
              10+ tools <span className={styles.statArrow}>→</span> 1
            </div>
            <div className={styles.statLabel}>Eén platform voor alles</div>
            <div className={styles.statAnnotation}>geen tabbladen meer</div>
          </div>

          <div
            ref={(el) => { statRefs.current[3] = el }}
            className={styles.statItem}
          >
            <div className={styles.statValue}>€29</div>
            <div className={styles.statLabel}>/seat/maand — alles inbegrepen</div>
            <div className={styles.statAnnotation}>geen verborgen kosten</div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6: PRICING
          ================================================================ */}
      <section id="pricing" className={styles.pricingSection}>
        <div className={styles.sectionLabel}>Tarieven</div>
        <h2 className={styles.sectionTitle}>Eenvoudig geprijsd.</h2>
        <span className={styles.sectionHandwritten}>
          Kies het plan dat bij uw praktijk past.
        </span>

        <div className={styles.pricingGrid}>
          {PRICING_PLANS.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => { pricingCardRefs.current[i] = el }}
              className={`${styles.pricingCard} ${
                plan.recommended ? styles.pricingCardRecommended : ''
              }`}
            >
              {plan.recommended && (
                <span className={styles.recommendedBadge}>Aanbevolen</span>
              )}
              {plan.recommended && (
                <div className={styles.arrowAnnotation}>
                  <span className={styles.arrowLabel}>meest gekozen ↓</span>
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden="true">
                    <path
                      d="M16 2 C 14 8, 10 12, 16 20"
                      stroke="#3a5a8c"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M12 17 L16 22 L20 17"
                      stroke="#3a5a8c"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}

              <div className={styles.pricingPlanName}>{plan.name}</div>
              <div className={styles.pricingPrice}>
                {plan.price}
                {plan.suffix && (
                  <span className={styles.pricingPriceSuffix}>{plan.suffix}</span>
                )}
              </div>
              <div className={styles.pricingNote}>{plan.note}</div>

              <ul className={styles.pricingFeatures}>
                {plan.features.map((feat) => (
                  <li key={feat} className={styles.pricingFeature}>
                    <span className={styles.checkMark}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`${styles.pricingCta} ${
                  plan.recommended ? styles.pricingCtaFeatured : ''
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          SECTION 7: CTA
          ================================================================ */}
      <section id="cta" className={styles.ctaSection}>
        <h2 ref={ctaHeadlineRef} className={styles.ctaHeadline}>
          Start writing a new chapter.
        </h2>
        <span ref={ctaHandRef} className={styles.ctaHandwritten}>
          Uw praktijk verdient beter gereedschap.
        </span>

        <div ref={ctaActionsRef} className={styles.ctaActions}>
          <a href="#" className={styles.ctaBtn}>
            Begin gratis
          </a>
          <span className={styles.ctaMeta}>Geen creditcard vereist · AVG-proof · NEN gecertificeerd</span>
        </div>

        <div className={styles.ctaFooter}>Design 03 — The Notebook · Moods AI</div>
      </section>
    </div>
  )
}
