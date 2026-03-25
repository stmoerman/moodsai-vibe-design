'use client'
import { useRef, useEffect, useCallback } from 'react'
import styles from './styles.module.css'

// Section IDs used for TOC scroll-tracking
const SECTIONS = [
  { id: 'title',         label: 'Title Page',              num: '' },
  { id: 'abstract',      label: 'Abstract',                num: '' },
  { id: 'toc',           label: 'Table of Contents',       num: '' },
  { id: 'introduction',  label: '1. Introduction',         num: '1' },
  { id: 'platform',      label: '2. The Platform',         num: '2' },
  { id: 'ai',            label: '3. AI Architecture',      num: '3' },
  { id: 'security',      label: '4. Security & Compliance',num: '4' },
  { id: 'pricing',       label: 'Appendix A: Pricing',     num: 'A' },
  { id: 'integrations',  label: 'Appendix B: Integrations',num: 'B' },
  { id: 'references',    label: 'References',              num: '' },
]

export default function Design07() {
  const rootRef = useRef<HTMLDivElement>(null)
  const tocLinksRef = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const activeIdRef = useRef<string>('')

  // Set a TOC link as active
  const setActive = useCallback((id: string) => {
    if (activeIdRef.current === id) return
    activeIdRef.current = id
    tocLinksRef.current.forEach((el, key) => {
      if (key === id) {
        el.classList.add(styles.tocLinkActive)
      } else {
        el.classList.remove(styles.tocLinkActive)
      }
    })
  }, [])

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Gather all fade-in elements
    const fadeEls = rootRef.current?.querySelectorAll<HTMLElement>(`.${styles.fadeIn}`) ?? []
    const marginNotes = rootRef.current?.querySelectorAll<HTMLElement>(`.${styles.marginNote}`) ?? []
    const figureCaptions = rootRef.current?.querySelectorAll<HTMLElement>(`.${styles.figureCaption}`) ?? []

    if (prefersReduced) {
      // Show everything immediately
      fadeEls.forEach(el => el.classList.add(styles.visible))
      marginNotes.forEach(el => el.classList.add(styles.visible))
      figureCaptions.forEach(el => el.classList.add(styles.visible))
      return
    }

    // Generic fade observer
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
            fadeObserver.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    )

    fadeEls.forEach(el => fadeObserver.observe(el))
    marginNotes.forEach(el => fadeObserver.observe(el))
    figureCaptions.forEach(el => fadeObserver.observe(el))

    // TOC active-section tracking via IntersectionObserver
    const sectionEls: HTMLElement[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(`d07-${id}`)
      if (el) sectionEls.push(el)
    })

    // Use a map to track which sections are visible
    const visibilityMap = new Map<string, boolean>()

    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          visibilityMap.set(entry.target.id, entry.isIntersecting)
        })
        // Find topmost visible section
        for (const el of sectionEls) {
          if (visibilityMap.get(el.id)) {
            setActive(el.id.replace('d07-', ''))
            break
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )

    sectionEls.forEach(el => tocObserver.observe(el))

    return () => {
      fadeObserver.disconnect()
      tocObserver.disconnect()
    }
  }, [setActive])

  const registerTocLink = (id: string) => (el: HTMLAnchorElement | null) => {
    if (el) {
      tocLinksRef.current.set(id, el)
    }
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.layout}>

        {/* ── Sticky sidebar TOC ───────────────────────── */}
        <aside className={styles.sidebar} aria-label="Table of contents">
          <p className={styles.sidebarTitle}>Contents</p>
          <ul className={styles.tocList}>
            {SECTIONS.map(({ id, label, num }) => (
              <li key={id} className={styles.tocItem}>
                <a
                  href={`#d07-${id}`}
                  className={styles.tocLink}
                  ref={registerTocLink(id)}
                >
                  {num && <span className={styles.tocNumber}>{num}</span>}
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Main content ─────────────────────────────── */}
        <main className={styles.main}>

          {/* ================================================
              Section 1: Title Page
          ================================================ */}
          <section
            id="d07-title"
            className={`${styles.section} ${styles.titlePage}`}
            aria-labelledby="d07-title-heading"
          >
            <span className={styles.pageNum}>p. 1</span>
            <div className={`${styles.titlePageInner} ${styles.fadeIn}`}>
              <h1 className={styles.paperTitle} id="d07-title-heading">
                Moods AI: An Integrated Platform for Modern
                Mental Healthcare Practice Management
              </h1>
              <p className={styles.paperMeta}>Version 1.0 &middot; March 2026</p>
              <hr className={styles.paperRule} />
              <p className={styles.paperAuthors}>Moods AI Research &amp; Product Team</p>
              <p className={styles.paperAffil}>Amsterdam, Netherlands &mdash; moods.ai</p>
            </div>
          </section>

          {/* ================================================
              Section 2: Abstract
          ================================================ */}
          <section
            id="d07-abstract"
            className={`${styles.section} ${styles.abstract}`}
            aria-labelledby="d07-abstract-heading"
          >
            <span className={styles.pageNum}>p. 2</span>
            <h2 className={styles.abstractHeading} id="d07-abstract-heading">Abstract</h2>
            <div className={`${styles.abstractBody} ${styles.fadeIn}`}>
              <p>
                Moods AI is a comprehensive practice management platform purpose-built for
                Dutch mental healthcare providers (GGZ). The platform consolidates clinical
                documentation, administrative workflows, financial reporting, and inter-system
                communications into a single, audit-ready environment. Central to the offering
                is AskMoody — an AI assistant trained on Dutch healthcare regulation and GGZ
                clinical context — which automates session report generation, responds to
                practitioner queries in natural language, and surfaces actionable intelligence
                from aggregated practice data. Moods operates in full conformance with NEN 7510
                and NEN 7513 standards, ensuring the confidentiality, integrity, and availability
                of sensitive patient information. This document presents the platform architecture,
                core feature set, security posture, integration catalogue, and pricing model.
              </p>
              <p className={styles.keywords}>
                <span className={styles.keywordsLabel}>Keywords: </span>
                mental healthcare, GGZ, AI documentation, practice management, NEN 7510,
                NEN 7513, clinical workflows, Dutch healthcare, session reporting, AskMoody
              </p>
            </div>
          </section>

          {/* ================================================
              Section 3: Table of Contents
          ================================================ */}
          <section
            id="d07-toc"
            className={`${styles.section} ${styles.tocSection}`}
            aria-labelledby="d07-toc-heading"
          >
            <span className={styles.pageNum}>p. 3</span>
            <h2 className={styles.sectionHeading} id="d07-toc-heading">Table of Contents</h2>
            <ul className={`${styles.tocPageList} ${styles.fadeIn}`}>
              {[
                { num: '1', title: 'Introduction',           page: '4' },
                { num: '2', title: 'The Platform',           page: '6' },
                { num: '3', title: 'AI Architecture',        page: '10' },
                { num: '4', title: 'Security & Compliance',  page: '14' },
                { num: 'A', title: 'Appendix A: Pricing',    page: '17' },
                { num: 'B', title: 'Appendix B: Integrations', page: '19' },
                { num: '',  title: 'References',             page: '21' },
              ].map(({ num, title, page }) => (
                <li key={title} className={styles.tocPageItem}>
                  <span className={styles.tocPageNum}>{num}</span>
                  <span className={styles.tocPageTitle}>{title}</span>
                  <span className={styles.tocPageDots} aria-hidden="true" />
                  <span className={styles.tocPageRight}>{page}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ================================================
              Section 4: 1. Introduction
          ================================================ */}
          <section
            id="d07-introduction"
            className={`${styles.section} ${styles.contentSection}`}
            aria-labelledby="d07-intro-heading"
          >
            <span className={styles.pageNum}>p. 4</span>

            <div
              className={styles.marginNote}
              style={{ top: '60px' }}
              aria-label="Margin note"
            >
              30 min avg<br />per session report
            </div>

            <div
              className={styles.marginNote}
              style={{ top: '220px' }}
              aria-label="Margin note"
            >
              5&ndash;10 tools<br />per practice on average
            </div>

            <h2 className={styles.h1} id="d07-intro-heading">
              1. Introduction
            </h2>
            <div className={styles.fadeIn}>
              <p className={styles.p}>
                The administrative burden carried by Dutch mental healthcare practitioners
                has reached a critical threshold. Research conducted across GGZ outpatient
                and specialist settings consistently identifies documentation as the primary
                source of practitioner dissatisfaction, accounting for an average of 30 minutes
                per client contact in post-session report writing alone. When aggregated across
                a full caseload, this translates to several hours of administrative work each day
                that detract directly from therapeutic capacity and practitioner wellbeing.
              </p>
              <p className={styles.p}>
                Compounding this challenge is the fragmentation of tooling within most practices.
                A typical GGZ provider operates between five and ten discrete software systems:
                an electronic health record, a scheduling platform, a billing engine, a document
                management store, a communication portal, and a reporting dashboard &mdash; each
                with its own authentication, data model, and update cycle. The absence of
                interoperability between these systems forces practitioners into repetitive
                manual data entry, introduces reconciliation errors, and creates compliance risk
                when audit trails span disconnected platforms.
              </p>
              <p className={styles.p}>
                Moods AI was developed in direct response to this landscape. Beginning in 2022
                with a focused transcription capability, the platform has evolved into a unified
                practice management environment that consolidates the workflows most critical to
                GGZ operations: client records, session documentation, financial management,
                scheduling, and regulatory reporting. The introduction of AskMoody in 2024
                extended this consolidation to include AI-assisted clinical documentation,
                natural language querying of practice data, and proactive workflow intelligence.
              </p>
            </div>
          </section>

          {/* ================================================
              Section 5: 2. The Platform
          ================================================ */}
          <section
            id="d07-platform"
            className={`${styles.section} ${styles.contentSection}`}
            aria-labelledby="d07-platform-heading"
          >
            <span className={styles.pageNum}>p. 6</span>
            <h2 className={styles.h1} id="d07-platform-heading">
              2. The Platform
            </h2>

            <div className={styles.fadeIn}>
              <h3 className={styles.h2}>2.1 Client Records</h3>
              <p className={styles.p}>
                The client record module provides a structured dossier environment aligned
                to GGZ documentation standards. Each record encompasses intake assessments,
                diagnostic classifications (DSM-5, ICD-11), treatment plans, session notes,
                correspondence, and consent documentation. Records are searchable, versionable,
                and exportable in formats compatible with regional healthcare information exchanges.
              </p>
              <p className={styles.p}>
                Access control is role-based, permitting practitioners to view only the records
                for clients within their active caseload. Supervisors and administrators hold
                configurable elevated permissions appropriate to their oversight responsibilities.
                All record accesses are logged to an immutable audit trail in conformance with
                NEN 7513 requirements.
              </p>
            </div>

            <div className={styles.fadeIn}>
              <h3 className={styles.h2}>2.2 Session Documentation &amp; Transcription</h3>
              <p className={styles.p}>
                Moods provides both live and offline transcription pathways. Live transcription
                operates within video consultation sessions, capturing the practitioner-client
                dialogue in real time without interrupting the therapeutic flow. Offline transcription
                accepts audio recordings uploaded from mobile devices or desktop, processing them
                asynchronously with equivalent accuracy. Transcripts are retained as structured
                data, enabling downstream AI processing and full-text search.
              </p>
              <p className={styles.p}>
                From each transcript, Moods AI generates a draft session report conforming to
                the practitioner&apos;s preferred template &mdash; SOAP, DAP, or custom formats
                established by the practice. Drafts are reviewed and approved by the practitioner
                before committing to the client record. The system never autonomously updates
                clinical records; practitioner review is always required.
              </p>
            </div>

            <div className={styles.fadeIn}>
              <h3 className={styles.h2}>2.3 Financial Management</h3>
              <p className={styles.p}>
                The financial module manages the complete revenue cycle for GGZ practices:
                DBC product code assignment, insurance claim submission, payment reconciliation,
                and outstanding balance tracking. Integration with major Dutch health insurers
                enables automated pre-authorisation checks and real-time claim status updates.
                Monthly revenue reports are generated automatically, with drill-down capability
                to individual practitioners, product codes, and payer categories.
              </p>
            </div>

            <div className={styles.fadeIn}>
              <h3 className={styles.h2}>2.4 Scheduling</h3>
              <p className={styles.p}>
                The scheduling module coordinates practitioner availability, client appointments,
                room allocation, and administrative blocks within a unified calendar interface.
                Automated appointment reminders are dispatched via SMS or email according to
                configurable lead times. Cancellation handling, rescheduling workflows, and
                waitlist management are supported natively. Calendar data is bidirectionally
                synchronised with HCI and connected ERP systems.
              </p>
            </div>

            <div className={styles.fadeIn}>
              <h3 className={styles.h2}>2.5 Reporting &amp; Analytics</h3>
              <p className={styles.p}>
                Practice administrators have access to a configurable reporting dashboard
                covering clinical throughput, financial performance, practitioner productivity,
                and compliance indicators. Standard report templates satisfy the reporting
                requirements of the Nederlandse Zorgautoriteit (NZa) and Zorginstituut Nederland.
                Custom report definitions can be constructed using a visual query builder,
                with scheduled delivery to designated recipients via secure email.
              </p>
            </div>
          </section>

          {/* ================================================
              Section 6: 3. AI Architecture
          ================================================ */}
          <section
            id="d07-ai"
            className={`${styles.section} ${styles.contentSection}`}
            aria-labelledby="d07-ai-heading"
          >
            <span className={styles.pageNum}>p. 10</span>
            <h2 className={styles.h1} id="d07-ai-heading">
              3. AI Architecture
            </h2>

            <div className={styles.fadeIn}>
              <h3 className={styles.h2}>3.1 AskMoody</h3>
              <p className={styles.p}>
                AskMoody is the conversational AI layer embedded throughout the Moods interface.
                It is powered by a large language model fine-tuned on Dutch healthcare
                terminology, GGZ clinical documentation conventions, and Moods&apos; own
                structured data schema. Practitioners interact with AskMoody using natural
                Dutch language to retrieve client information, draft correspondence, summarise
                session histories, and query regulatory guidance.
              </p>
              <p className={styles.p}>
                AskMoody operates within a retrieval-augmented generation (RAG) architecture,
                ensuring that responses are grounded in verified data retrieved from the
                practice&apos;s own records rather than generated from model weights alone.
                This architecture eliminates hallucination risk for factual queries while
                preserving the fluency advantages of large language model generation.
              </p>
            </div>

            <div className={styles.fadeIn}>
              <h3 className={styles.h2}>3.2 Documentation Pipeline</h3>
              <p className={styles.p}>
                Session reports are generated through a multi-stage pipeline that separates
                transcription, entity extraction, and narrative generation into discrete,
                auditable steps. Each stage produces intermediate artefacts that are retained
                for inspection, enabling practitioners and administrators to trace the provenance
                of any content appearing in a generated draft.
              </p>
            </div>

            {/* Fig. 1 */}
            <div className={styles.fadeIn}>
              <div className={styles.figure}>
                <pre className={styles.figureCode}>{`
  Audio / Video Input
         │
         ▼
  ┌─────────────────┐
  │  Transcription  │  Whisper-based ASR, Dutch language model
  └────────┬────────┘
           │  Raw transcript
           ▼
  ┌─────────────────┐
  │ Entity Extraction│  Speaker diarisation, clinical terms, timestamps
  └────────┬────────┘
           │  Structured transcript
           ▼
  ┌─────────────────┐
  │ Report Generator│  Template-aware LLM, SOAP / DAP / custom
  └────────┬────────┘
           │  Draft report
           ▼
  ┌─────────────────┐
  │ Practitioner    │  Human review & approval required
  │    Review       │
  └─────────────────┘
`}</pre>
                <p className={`${styles.figureCaption}`}>
                  Fig. 1: AI Documentation Pipeline. Each stage produces
                  auditable intermediate artefacts retained for provenance tracking.
                </p>
              </div>
            </div>

            <div className={styles.fadeIn}>
              <h3 className={styles.h2}>3.3 RAG Architecture</h3>
              <p className={styles.p}>
                The retrieval-augmented generation system underlying AskMoody maintains
                a vector index of the practice&apos;s structured records, updated incrementally
                as new data is committed. At query time, the practitioner&apos;s natural
                language input is embedded and used to retrieve the most semantically
                relevant record fragments, which are injected into the generation context
                alongside the original query.
              </p>
            </div>

            {/* Fig. 2 */}
            <div className={styles.fadeIn}>
              <div className={styles.figure}>
                <pre className={styles.figureCode}>{`
  Practitioner Query (natural language)
         │
         ▼
  ┌──────────────────┐
  │  Query Embedding │  text-embedding-3-small, 1536 dims
  └────────┬─────────┘
           │  Query vector
           ▼
  ┌──────────────────┐
  │  Vector Search   │  pgvector, cosine similarity, top-k=8
  └────────┬─────────┘
           │  Retrieved record fragments
           ▼
  ┌──────────────────┐
  │  Context Assembly│  Fragments + query + system prompt
  └────────┬─────────┘
           │  Assembled prompt
           ▼
  ┌──────────────────┐
  │    Generation    │  Claude 3.5 Sonnet (Anthropic)
  └────────┬─────────┘
           │  Grounded response
           ▼
  Practitioner receives cited answer
`}</pre>
                <p className={`${styles.figureCaption}`}>
                  Fig. 2: RAG Architecture. All responses are grounded in
                  records retrieved from the practice&apos;s own data store.
                </p>
              </div>
            </div>
          </section>

          {/* ================================================
              Section 7: 4. Security & Compliance
          ================================================ */}
          <section
            id="d07-security"
            className={`${styles.section} ${styles.contentSection}`}
            aria-labelledby="d07-security-heading"
          >
            <span className={styles.pageNum}>p. 14</span>
            <h2 className={styles.h1} id="d07-security-heading">
              4. Security &amp; Compliance
            </h2>

            <div className={styles.fadeIn}>
              <p className={styles.p}>
                Moods AI is developed and operated in conformance with NEN 7510:2017
                (Information security management in health care) and NEN 7513:2018
                (Electronic health records — Logging). All data processed by the platform
                is classified, handled, and retained in accordance with the requirements
                prescribed by these standards, as verified through annual third-party audits.
              </p>
              <p className={styles.p}>
                Patient data is processed exclusively within the European Economic Area.
                No patient-identifiable information is transmitted to AI model providers;
                all personally identifiable information is stripped prior to any external
                API call and restored from internal state upon response receipt. This
                pseudonymisation layer ensures that AI capabilities are available without
                compromising data sovereignty or regulatory standing.
              </p>
            </div>

            {/* Table 1 */}
            <div className={`${styles.tableWrapper} ${styles.fadeIn}`}>
              <p className={styles.tableCaption}>
                Table 1: Encryption methodology by data category
              </p>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Data Category</th>
                    <th>At Rest</th>
                    <th>In Transit</th>
                    <th>Key Management</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Client records</td>
                    <td>AES-256-GCM</td>
                    <td>TLS 1.3</td>
                    <td>AWS KMS, per-tenant keys</td>
                  </tr>
                  <tr>
                    <td>Audio recordings</td>
                    <td>AES-256-GCM</td>
                    <td>TLS 1.3</td>
                    <td>AWS KMS, per-tenant keys</td>
                  </tr>
                  <tr>
                    <td>Transcripts</td>
                    <td>AES-256-GCM</td>
                    <td>TLS 1.3</td>
                    <td>AWS KMS, per-tenant keys</td>
                  </tr>
                  <tr>
                    <td>Financial data</td>
                    <td>AES-256-GCM</td>
                    <td>TLS 1.3</td>
                    <td>AWS KMS, per-tenant keys</td>
                  </tr>
                  <tr>
                    <td>Audit logs</td>
                    <td>AES-256-GCM (immutable)</td>
                    <td>TLS 1.3</td>
                    <td>AWS KMS, centralised + WORM</td>
                  </tr>
                  <tr>
                    <td>Vector embeddings</td>
                    <td>AES-256-GCM</td>
                    <td>TLS 1.3</td>
                    <td>AWS KMS, per-tenant keys</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.fadeIn}>
              <p className={styles.p}>
                Access to all platform components is governed by multi-factor authentication
                (MFA). Session tokens are short-lived with a maximum duration of eight hours,
                after which re-authentication is required. All authentication events, record
                accesses, and data export actions are appended to the NEN 7513 audit log,
                which is retained for a minimum of fifteen years and cannot be modified or
                deleted by any platform user, including system administrators.
              </p>
            </div>
          </section>

          {/* ================================================
              Appendix A: Pricing
          ================================================ */}
          <section
            id="d07-pricing"
            className={`${styles.section} ${styles.contentSection}`}
            aria-labelledby="d07-pricing-heading"
          >
            <span className={styles.pageNum}>p. 17</span>
            <h2 className={styles.h1} id="d07-pricing-heading">
              Appendix A: Pricing
            </h2>

            <div className={`${styles.tableWrapper} ${styles.fadeIn}`}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Monthly (per seat)</th>
                    <th>Included Features</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Starter</strong>
                    </td>
                    <td>&euro;49</td>
                    <td>
                      Client records, scheduling, basic reporting,
                      offline transcription (10 hr/mo)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Professional</strong>
                    </td>
                    <td>&euro;89 <sup>[1]</sup></td>
                    <td>
                      All Starter features plus live transcription,
                      AI session reports, AskMoody, financial management,
                      HCI integration
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Enterprise</strong>
                    </td>
                    <td>On request <sup>[2]</sup></td>
                    <td>
                      All Professional features plus custom integrations,
                      dedicated support, SLA guarantees, on-premise
                      deployment option, annual audit support
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className={styles.footnotes}>
                <p className={styles.footnoteItem}>
                  <span className={styles.footnoteMark}>[1]</span>
                  Professional plan pricing includes a 14-day free trial. No credit card required at registration.
                </p>
                <p className={styles.footnoteItem}>
                  <span className={styles.footnoteMark}>[2]</span>
                  Enterprise pricing is negotiated based on seat volume, deployment model, and support tier.
                  Contact sales@moods.ai for a proposal.
                </p>
              </div>
            </div>
          </section>

          {/* ================================================
              Appendix B: Integrations
          ================================================ */}
          <section
            id="d07-integrations"
            className={`${styles.section} ${styles.contentSection}`}
            aria-labelledby="d07-integrations-heading"
          >
            <span className={styles.pageNum}>p. 19</span>
            <h2 className={styles.h1} id="d07-integrations-heading">
              Appendix B: Integrations
            </h2>
            <div className={styles.fadeIn}>
              <p className={styles.p}>
                Moods AI maintains production integrations with the following third-party
                systems. Each integration is maintained under a formal data processing
                agreement and subject to annual security review.
              </p>
              <ul className={styles.refList}>
                {[
                  {
                    name: 'HCI',
                    desc: 'Healthcare ERP integration for time tracking, appointments, and revenue data. Bidirectional synchronisation of scheduling and financial records. Production since 2025.',
                  },
                  {
                    name: 'Parnassia Groep EHR',
                    desc: 'Read-access integration for client record retrieval in federated practice environments. Supports HL7 FHIR R4. Production since 2025.',
                  },
                  {
                    name: 'Vecozo',
                    desc: 'Automated DBC declaration submission and pre-authorisation validation via Vecozo secure messaging gateway. Production since 2025.',
                  },
                  {
                    name: 'Zorgmail',
                    desc: 'Secure referral letter and correspondence dispatch via the Zorgmail encrypted messaging network. Production since 2025.',
                  },
                  {
                    name: 'DigiD',
                    desc: 'Client identity verification using DigiD authentication for patient-facing portal access. Production since 2025.',
                  },
                  {
                    name: 'Anthropic Claude API',
                    desc: 'AI inference for AskMoody and session report generation. All PII stripped prior to API call via pseudonymisation layer. Production since 2024.',
                  },
                ].map(({ name, desc }) => (
                  <li key={name} className={styles.refItem}>
                    <span className={styles.refNum}>&mdash;</span>
                    <span>
                      <strong>{name}</strong> &mdash; {desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ================================================
              References
          ================================================ */}
          <section
            id="d07-references"
            className={`${styles.section} ${styles.contentSection}`}
            aria-labelledby="d07-references-heading"
          >
            <span className={styles.pageNum}>p. 21</span>
            <h2 className={styles.h1} id="d07-references-heading">
              References
            </h2>
            <ul className={`${styles.refList} ${styles.fadeIn}`}>
              {[
                {
                  num: '[1]',
                  cite: 'NEN 7510:2017. Informatiebeveiliging in de zorg. Nederlands Normalisatie-instituut, Delft.',
                },
                {
                  num: '[2]',
                  cite: 'NEN 7513:2018. Medische informatica — Elektronisch pati\u00ebntendossier — Logging. Nederlands Normalisatie-instituut, Delft.',
                },
                {
                  num: '[3]',
                  cite: 'Anthropic. Claude Model Card, Claude 3.5 Sonnet. Anthropic PBC, San Francisco, 2024.',
                },
                {
                  num: '[4]',
                  cite: 'Nederlandse Zorgautoriteit (NZa). Beleidsregel DBC-bedragen GGZ. NZa, Utrecht, 2025.',
                },
                {
                  num: '[5]',
                  cite: 'Zorginstituut Nederland. Kwaliteitsstandaard GGZ. Zorginstituut Nederland, Diemen, 2024.',
                },
                {
                  num: '[6]',
                  cite: 'OpenAI. text-embedding-3-small technical report. OpenAI, San Francisco, 2024.',
                },
                {
                  num: '[7]',
                  cite: 'HL7 International. FHIR R4: Fast Healthcare Interoperability Resources, Release 4. HL7, Ann Arbor, 2019.',
                },
                {
                  num: '[8]',
                  cite: 'Ministerie van Volksgezondheid, Welzijn en Sport. Wet op de geneeskundige behandelingsovereenkomst (WGBO). Den Haag, 2020.',
                },
              ].map(({ num, cite }) => (
                <li key={num} className={styles.refItem}>
                  <span className={styles.refNum}>{num}</span>
                  <span>{cite}</span>
                </li>
              ))}
            </ul>
          </section>

        </main>
      </div>
    </div>
  )
}
