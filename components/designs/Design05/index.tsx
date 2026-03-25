'use client'
import { useEffect, useRef } from 'react'

export default function Design05() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) return

    // Intersection observer for text-reveal elements
    const revealEls = rootRef.current?.querySelectorAll<HTMLElement>('.d05b-reveal')
    if (!revealEls) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).style.animationPlayState = 'running'
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    revealEls.forEach((el) => {
      el.style.animationPlayState = 'paused'
      io.observe(el)
    })

    // Pull-quote slide-in
    const pullQuotes = rootRef.current?.querySelectorAll<HTMLElement>('.d05b-pull')
    const pqIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).classList.add('d05b-pull--visible')
            pqIo.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    pullQuotes?.forEach((el) => pqIo.observe(el))

    // Ink-bleed section transitions
    const sectionDividers = rootRef.current?.querySelectorAll<HTMLElement>('.d05b-ink-divider')
    const idIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).classList.add('d05b-ink-divider--active')
            idIo.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )
    sectionDividers?.forEach((el) => idIo.observe(el))

    return () => {
      io.disconnect()
      pqIo.disconnect()
      idIo.disconnect()
    }
  }, [])

  const today = new Date('2026-03-25')
  const dateStr = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=Courier+Prime:wght@400;700&display=swap');

        /* ── Base ── */
        .d05b {
          min-height: 100vh;
          background: #f5f3ee;
          color: #111;
          font-family: 'Source Serif 4', 'Georgia', serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Fixed masthead nav ── */
        .d05b-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: #f5f3ee;
          border-top: 3px solid #111;
          border-bottom: 1px solid #111;
        }
        .d05b-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .d05b-nav-meta {
          font-family: 'Courier Prime', monospace;
          font-size: 0.62rem;
          color: #555;
          letter-spacing: 0.05em;
          line-height: 1.4;
          white-space: nowrap;
        }
        .d05b-nav-logo {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(1.4rem, 3vw, 2rem);
          letter-spacing: -0.02em;
          color: #111;
          text-align: center;
          flex: 1;
          line-height: 1;
        }
        .d05b-nav-links {
          display: flex;
          gap: 20px;
          list-style: none;
          margin: 0;
          padding: 0;
          justify-content: flex-end;
          flex-shrink: 0;
        }
        .d05b-nav-links a {
          font-family: 'Courier Prime', monospace;
          font-size: 0.62rem;
          color: #333;
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .d05b-nav-links a:hover { color: #8b2020; }

        /* ── Page content offset for fixed nav ── */
        .d05b-main {
          padding-top: 56px;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 32px;
          padding-right: 32px;
        }

        /* ── Horizontal rules ── */
        .d05b-rule-heavy {
          border: none;
          border-top: 3px solid #111;
          margin: 0;
        }

        /* ── Section spacing ── */
        .d05b-section {
          padding: 40px 0;
          border-bottom: 1px solid #111;
        }

        /* ── Ink-bleed divider ── */
        .d05b-ink-divider {
          position: relative;
          height: 3px;
          background: #111;
          overflow: visible;
          margin: 0;
        }
        .d05b-ink-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          background: rgba(17, 17, 17, 0.08);
          border-radius: 50%;
          filter: blur(2px);
          transition: width 400ms ease, height 400ms ease;
        }
        .d05b-ink-divider--active::after {
          width: 120%;
          height: 16px;
        }

        /* ═══════════════════════════════════════
           SECTION 1 — MASTHEAD
        ═══════════════════════════════════════ */
        .d05b-masthead {
          padding: 32px 0 0;
          text-align: center;
        }
        .d05b-dateline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .d05b-dateline-text {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          color: #555;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .d05b-dateline-rule {
          flex: 1;
          height: 1px;
          background: #bbb;
          margin: 0 16px;
        }
        .d05b-logo-main {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(3.5rem, 8vw, 6rem);
          color: #111;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-top: 10px;
          margin-bottom: 4px;
          animation: d05b-logoIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.05s;
        }
        .d05b-tagline {
          font-family: 'Source Serif 4', serif;
          font-style: italic;
          font-size: clamp(0.8rem, 1.5vw, 1rem);
          color: #555;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
          animation: d05b-fadeUp 0.6s ease both;
          animation-delay: 0.35s;
        }
        .d05b-masthead-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 3px solid #111;
          border-bottom: 3px solid #111;
          padding: 6px 0;
          gap: 16px;
        }
        .d05b-masthead-meta {
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          color: #333;
          letter-spacing: 0.06em;
          flex: 1;
          text-align: left;
        }
        .d05b-masthead-meta:last-child { text-align: right; }
        .d05b-dateline-center {
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          color: #8b2020;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          text-align: center;
          flex: 2;
        }
        @keyframes d05b-logoIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes d05b-fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ═══════════════════════════════════════
           SECTION 2 — ABOVE THE FOLD
        ═══════════════════════════════════════ */
        .d05b-fold {
          padding: 32px 0;
          border-bottom: 1px solid #111;
        }
        .d05b-fold-grid {
          display: grid;
          grid-template-columns: 2fr 1px 1fr;
          gap: 0 32px;
          align-items: start;
        }
        .d05b-fold-divider {
          background: #111;
          width: 1px;
          height: 100%;
          min-height: 300px;
          align-self: stretch;
        }
        .d05b-lead-kicker {
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8b2020;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .d05b-lead-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          color: #111;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .d05b-byline {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          color: #666;
          letter-spacing: 0.06em;
          margin-bottom: 16px;
          font-style: italic;
        }
        .d05b-body-text {
          font-family: 'Source Serif 4', serif;
          font-size: 0.92rem;
          line-height: 1.75;
          color: #222;
          margin-bottom: 14px;
        }
        .d05b-body-text:last-child { margin-bottom: 0; }

        /* Sidebar */
        .d05b-sidebar {
          background: #e8e2d4;
          border: 1px solid #bbb;
          padding: 20px 18px;
        }
        .d05b-sidebar-title {
          font-family: 'Courier Prime', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8b2020;
          font-weight: 700;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #bbb;
        }
        .d05b-stat {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(17,17,17,0.12);
        }
        .d05b-stat:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .d05b-stat-value {
          font-family: 'Courier Prime', monospace;
          font-size: 1.35rem;
          font-weight: 700;
          color: #111;
          line-height: 1;
          margin-bottom: 3px;
        }
        .d05b-stat-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.58rem;
          color: #666;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.5;
        }

        /* ═══════════════════════════════════════
           SECTION 3 — FEATURE ARTICLES
        ═══════════════════════════════════════ */
        .d05b-features {
          padding: 32px 0;
          border-bottom: 1px solid #111;
        }
        .d05b-section-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8b2020;
          font-weight: 700;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #111;
        }
        .d05b-columns {
          column-count: 2;
          column-gap: 40px;
          column-rule: 1px solid #bbb;
        }
        .d05b-article {
          break-inside: avoid;
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(17,17,17,0.15);
        }
        .d05b-article:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .d05b-article-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.05rem;
          line-height: 1.25;
          color: #111;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .d05b-article-byline {
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          font-style: italic;
          color: #888;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .d05b-article-body {
          font-family: 'Source Serif 4', serif;
          font-size: 0.85rem;
          line-height: 1.7;
          color: #333;
        }

        /* ═══════════════════════════════════════
           SECTION 4 — OPINION
        ═══════════════════════════════════════ */
        .d05b-opinion {
          padding: 48px 0;
          border-bottom: 1px solid #111;
        }
        .d05b-opinion-inner {
          max-width: 600px;
          margin: 0 auto;
        }
        .d05b-opinion-kicker {
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8b2020;
          font-weight: 700;
          text-align: center;
          margin-bottom: 20px;
        }
        .d05b-opinion-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(1.5rem, 3vw, 2rem);
          text-align: center;
          color: #111;
          line-height: 1.2;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .d05b-opinion-rule {
          width: 60px;
          height: 2px;
          background: #8b2020;
          margin: 16px auto 24px;
        }
        .d05b-opinion-body {
          font-family: 'Source Serif 4', serif;
          font-style: italic;
          font-size: 1rem;
          line-height: 1.85;
          color: #333;
          margin-bottom: 14px;
        }
        .d05b-opinion-signature {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          color: #666;
          letter-spacing: 0.1em;
          text-align: right;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #bbb;
        }

        /* ═══════════════════════════════════════
           PULL QUOTES
        ═══════════════════════════════════════ */
        .d05b-pull {
          float: left;
          width: 45%;
          margin: 8px 20px 8px -8px;
          padding: 12px 16px;
          border-top: 2px solid #111;
          border-bottom: 2px solid #111;
          transform: translateX(-32px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.5s ease;
        }
        .d05b-pull--visible {
          transform: translateX(0);
          opacity: 1;
        }
        .d05b-pull-text {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.45;
          color: #111;
        }

        /* ═══════════════════════════════════════
           SECTION 5 — CLASSIFIEDS
        ═══════════════════════════════════════ */
        .d05b-classifieds {
          padding: 32px 0;
          border-bottom: 1px solid #111;
        }
        .d05b-classifieds-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #111;
          border: 1px solid #111;
          margin-top: 16px;
        }
        .d05b-classified {
          background: #f5f3ee;
          padding: 20px 18px;
        }
        .d05b-classified-header {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111;
          margin-bottom: 6px;
          padding-bottom: 6px;
          border-bottom: 1px solid #555;
        }
        .d05b-classified-price {
          font-family: 'Courier Prime', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #8b2020;
          margin-bottom: 8px;
        }
        .d05b-classified-body {
          font-family: 'Source Serif 4', serif;
          font-size: 0.78rem;
          line-height: 1.6;
          color: #444;
          margin-bottom: 14px;
        }
        .d05b-classified-cta {
          display: inline-block;
          font-family: 'Courier Prime', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111;
          border: 1px solid #111;
          padding: 5px 10px;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .d05b-classified-cta:hover {
          background: #111;
          color: #f5f3ee;
        }

        /* ═══════════════════════════════════════
           SECTION 6 — BACK PAGE
        ═══════════════════════════════════════ */
        .d05b-backpage {
          padding: 32px 0 48px;
        }
        .d05b-backpage-grid {
          display: grid;
          grid-template-columns: 1fr 1px 1fr 1px 1fr;
          gap: 0 32px;
          align-items: start;
        }
        .d05b-backpage-divider {
          background: #bbb;
          width: 1px;
          align-self: stretch;
          min-height: 200px;
        }
        .d05b-col-title {
          font-family: 'Courier Prime', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8b2020;
          font-weight: 700;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #bbb;
        }
        .d05b-directory-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .d05b-directory-list li {
          font-family: 'Source Serif 4', serif;
          font-size: 0.8rem;
          color: #333;
          padding: 6px 0;
          border-bottom: 1px solid rgba(17,17,17,0.1);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .d05b-directory-list li:last-child { border-bottom: none; }
        .d05b-dir-bullet {
          width: 4px;
          height: 4px;
          background: #8b2020;
          flex-shrink: 0;
        }
        .d05b-cert-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(17,17,17,0.1);
        }
        .d05b-cert-item:last-child { border-bottom: none; }
        .d05b-cert-badge {
          width: 36px;
          height: 36px;
          border: 2px solid #111;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Courier Prime', monospace;
          font-size: 0.45rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #111;
          text-align: center;
          flex-shrink: 0;
          line-height: 1.2;
          white-space: pre-line;
        }
        .d05b-cert-info {
          font-family: 'Source Serif 4', serif;
          font-size: 0.78rem;
          color: #333;
          line-height: 1.4;
        }
        .d05b-cert-name {
          font-weight: 600;
          color: #111;
          font-size: 0.8rem;
          margin-bottom: 2px;
        }
        .d05b-cta-box {
          background: #111;
          padding: 24px 20px;
          text-align: center;
        }
        .d05b-cta-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #f5f3ee;
          opacity: 0.5;
          margin-bottom: 12px;
        }
        .d05b-cta-headline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.2rem;
          color: #f5f3ee;
          line-height: 1.3;
          margin-bottom: 16px;
        }
        .d05b-cta-btn {
          display: inline-block;
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 700;
          color: #111;
          background: #f5f3ee;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
        }
        .d05b-cta-btn:hover { background: #e8e2d4; }
        .d05b-cta-sub {
          font-family: 'Courier Prime', monospace;
          font-size: 0.55rem;
          color: rgba(245,243,238,0.4);
          letter-spacing: 0.06em;
          margin-top: 10px;
        }
        .d05b-backpage-contact {
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          color: #8b2020;
          letter-spacing: 0.08em;
          margin-top: 12px;
        }
        .d05b-backpage-note {
          font-family: 'Source Serif 4', serif;
          font-size: 0.78rem;
          color: #555;
          line-height: 1.65;
          margin-top: 16px;
        }

        /* ═══════════════════════════════════════
           TEXT REVEAL ANIMATION
        ═══════════════════════════════════════ */
        .d05b-reveal {
          animation: d05b-clipReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-play-state: paused;
        }
        .d05b-reveal--delay1 { animation-delay: 0.1s; }
        .d05b-reveal--delay2 { animation-delay: 0.2s; }
        .d05b-reveal--delay3 { animation-delay: 0.32s; }

        @keyframes d05b-clipReveal {
          from { clip-path: inset(0 0 100% 0); opacity: 0.6; }
          to   { clip-path: inset(0 0 0% 0);   opacity: 1; }
        }

        /* ═══════════════════════════════════════
           FOOTER / COLOPHON
        ═══════════════════════════════════════ */
        .d05b-colophon {
          border-top: 3px solid #111;
          padding: 14px 32px;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .d05b-colophon-text {
          font-family: 'Courier Prime', monospace;
          font-size: 0.58rem;
          color: #888;
          letter-spacing: 0.08em;
        }
        .d05b-colophon-text a {
          color: #8b2020;
          text-decoration: none;
        }
        .d05b-colophon-text a:hover { text-decoration: underline; }

        /* ═══════════════════════════════════════
           MOBILE
        ═══════════════════════════════════════ */
        @media (max-width: 768px) {
          .d05b-nav-meta { display: none; }
          .d05b-nav-logo { font-size: 1.2rem; }
          .d05b-main { padding-left: 16px; padding-right: 16px; padding-top: 52px; }
          .d05b-logo-main { font-size: 2.5rem; }
          .d05b-fold-grid {
            grid-template-columns: 1fr;
            gap: 24px 0;
          }
          .d05b-fold-divider { display: none; }
          .d05b-columns { column-count: 1; }
          .d05b-classifieds-grid { grid-template-columns: 1fr; }
          .d05b-backpage-grid {
            grid-template-columns: 1fr;
            gap: 32px 0;
          }
          .d05b-backpage-divider { display: none; }
          .d05b-pull {
            float: none;
            width: auto;
            margin: 16px 0;
          }
          .d05b-colophon {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
          .d05b-dateline-text { font-size: 0.55rem; }
        }
      `}</style>

      {/* ── Fixed Nav Masthead ── */}
      <nav className="d05b-nav">
        <div className="d05b-nav-inner">
          <span className="d05b-nav-meta">Vol. I, No. 1 &mdash; Est. 2024</span>
          <div className="d05b-nav-logo">Moods.ai</div>
          <ul className="d05b-nav-links">
            <li><a href="#">Product</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Sign In</a></li>
            <li><a href="#">Request Access</a></li>
          </ul>
        </div>
      </nav>

      <div className="d05b" ref={rootRef}>
        <div className="d05b-main">

          {/* ══════════════════════════════════════
              SECTION 1 — MASTHEAD
          ══════════════════════════════════════ */}
          <header className="d05b-masthead">
            <div className="d05b-dateline">
              <span className="d05b-dateline-text">Vol. I, No. 1 &mdash; Est. 2024</span>
              <div className="d05b-dateline-rule" />
              <span className="d05b-dateline-text">{dateStr}</span>
            </div>
            <hr className="d05b-rule-heavy" />
            <h1 className="d05b-logo-main">Moods.ai</h1>
            <p className="d05b-tagline">The Record of Modern Mental Healthcare</p>
            <div className="d05b-masthead-bottom">
              <span className="d05b-masthead-meta">
                NEN 7510 Certified &bull; AVG/GDPR Compliant &bull; ISO 27001
              </span>
              <span className="d05b-dateline-center">
                Clinical AI &mdash; Built for the Netherlands
              </span>
              <span className="d05b-masthead-meta">
                From &euro;29/seat/month &bull; 14-day free trial
              </span>
            </div>
          </header>

          {/* Ink-bleed divider */}
          <div className="d05b-ink-divider" />

          {/* ══════════════════════════════════════
              SECTION 2 — ABOVE THE FOLD
          ══════════════════════════════════════ */}
          <section className="d05b-fold">
            <div className="d05b-fold-grid">
              {/* Lead article */}
              <div>
                <div className="d05b-lead-kicker d05b-reveal">
                  Lead Story &mdash; AI Documentation
                </div>
                <h2 className="d05b-lead-headline d05b-reveal d05b-reveal--delay1">
                  AI Documentation Revolution Saves Therapists 25 Minutes Per Session
                </h2>
                <div className="d05b-byline d05b-reveal d05b-reveal--delay2">
                  By the Moods AI Editorial Team &bull; Mental Health Technology
                </div>

                <div className="d05b-pull">
                  <span className="d05b-pull-text">
                    &ldquo;Every minute a clinician spends on paperwork is a minute not spent with a patient.&rdquo;
                  </span>
                </div>

                <p className="d05b-body-text d05b-reveal d05b-reveal--delay2">
                  Dutch mental health organisations are confronting a documentation crisis. Clinical staff across
                  GGZ practices report spending between 30 and 45 minutes per client session producing the
                  structured reports required by regulators, insurers, and care coordinators. Moods AI has
                  developed a voice-to-report system that reduces this overhead to under five minutes, using
                  natural-language processing trained on Dutch clinical standards.
                </p>
                <p className="d05b-body-text d05b-reveal d05b-reveal--delay3">
                  The platform captures audio from live sessions or uploaded recordings, then generates
                  structured clinical notes, progress reports, and billing summaries aligned with SOAP and
                  DSM-V frameworks. Early adopters across twelve GGZ practices report a 25-minute saving per
                  session on average, translating to more than 2,340 hours recovered annually for a
                  mid-sized practice of ten clinicians.
                </p>
                <p className="d05b-body-text d05b-reveal d05b-reveal--delay3">
                  The system operates entirely within NEN 7510 and AVG-compliant infrastructure hosted on Dutch
                  soil, addressing the primary concern raised by data-protection officers at participating
                  institutions. Accuracy rates on structured output exceed 99 percent under controlled conditions,
                  with clinicians retaining full review and edit authority before any document is finalised.
                </p>
              </div>

              {/* Vertical rule */}
              <div className="d05b-fold-divider" />

              {/* Stats sidebar */}
              <aside className="d05b-sidebar">
                <div className="d05b-sidebar-title">Key Figures at a Glance</div>
                <div className="d05b-stat">
                  <div className="d05b-stat-value">2,340</div>
                  <div className="d05b-stat-label">Hours recovered / year{'\n'}(10-clinician practice)</div>
                </div>
                <div className="d05b-stat">
                  <div className="d05b-stat-value">99%</div>
                  <div className="d05b-stat-label">Report accuracy rate</div>
                </div>
                <div className="d05b-stat">
                  <div className="d05b-stat-value">NEN 7510</div>
                  <div className="d05b-stat-label">Certified &bull; AVG compliant{'\n'}Dutch-hosted infrastructure</div>
                </div>
                <div className="d05b-stat">
                  <div className="d05b-stat-value">&euro;29</div>
                  <div className="d05b-stat-label">Per seat / month{'\n'}14-day free trial included</div>
                </div>
              </aside>
            </div>
          </section>

          <div className="d05b-ink-divider" />

          {/* ══════════════════════════════════════
              SECTION 3 — FEATURE ARTICLES
          ══════════════════════════════════════ */}
          <section className="d05b-features">
            <div className="d05b-section-label">Inside This Edition</div>
            <div className="d05b-columns">

              <div className="d05b-article d05b-reveal">
                <h3 className="d05b-article-headline">
                  Practice Management Reimagined for the Modern Clinic
                </h3>
                <div className="d05b-article-byline">
                  By the Moods AI Team &bull; Practice Operations
                </div>
                <p className="d05b-article-body">
                  Moods centralises scheduling, client records, billing, and team oversight into a single
                  platform built for Dutch GGZ practices. Practice managers report a 60 percent reduction in
                  administrative overhead within the first month of deployment. The system integrates directly
                  with existing EHR workflows, eliminating the need for manual data transfer between systems
                  and reducing transcription errors to near zero.
                </p>
              </div>

              <div className="d05b-article d05b-reveal d05b-reveal--delay1">
                <h3 className="d05b-article-headline">
                  Secure Messaging Closes the Communication Gap
                </h3>
                <div className="d05b-article-byline">
                  By the Moods AI Team &bull; Clinical Communication
                </div>
                <p className="d05b-article-body">
                  Encrypted messaging between clinicians, clients, and care teams replaces unsecured email
                  and consumer WhatsApp use &mdash; a persistent compliance risk identified in recent NZa audits.
                  All communication threads are archived, auditable, and linked to client records.
                  Notification rules ensure urgent messages reach the right clinician without creating
                  alert fatigue for the broader team.
                </p>
              </div>

              <div className="d05b-article d05b-reveal d05b-reveal--delay2">
                <h3 className="d05b-article-headline">
                  HR &amp; Team Management Built for Clinical Rosters
                </h3>
                <div className="d05b-article-byline">
                  By the Moods AI Team &bull; Human Resources
                </div>
                <p className="d05b-article-body">
                  Contract management, leave tracking, and onboarding workflows are tailored to the
                  specific requirements of healthcare employment law in the Netherlands. Supervisors can
                  assign caseloads, monitor continuing education requirements, and generate performance
                  summaries without leaving the platform. Integration with AFAS and HiBob is available
                  for larger organisations.
                </p>
              </div>

              <div className="d05b-article d05b-reveal d05b-reveal--delay1">
                <h3 className="d05b-article-headline">
                  Business Intelligence Surfaces the Metrics That Matter
                </h3>
                <div className="d05b-article-byline">
                  By the Moods AI Team &bull; Analytics
                </div>
                <p className="d05b-article-body">
                  Real-time dashboards expose session throughput, no-show rates, revenue per clinician,
                  and documentation compliance scores. Practice directors can benchmark performance
                  across locations, identify bottlenecks before they become crises, and produce the
                  quarterly reports required by zorgverzekeraars in a single click. No data leaves
                  Dutch borders.
                </p>
              </div>

              <div className="d05b-article d05b-reveal d05b-reveal--delay2">
                <h3 className="d05b-article-headline">
                  Client Self-Service Portal Reduces Front-Desk Load
                </h3>
                <div className="d05b-article-byline">
                  By the Moods AI Team &bull; Client Experience
                </div>
                <p className="d05b-article-body">
                  Clients book appointments, complete intake questionnaires, and access homework materials
                  without staff involvement. The portal supports DigiD authentication for identity
                  verification and connects to the practice calendar in real time. Practices using the
                  self-service module report a 40 percent reduction in incoming phone enquiries during
                  the first six weeks of operation.
                </p>
              </div>

            </div>
          </section>

          <div className="d05b-ink-divider" />

          {/* ══════════════════════════════════════
              SECTION 4 — OPINION
          ══════════════════════════════════════ */}
          <section className="d05b-opinion">
            <div className="d05b-opinion-inner">
              <div className="d05b-opinion-kicker">Opinion &mdash; Why We Built Moods</div>
              <h2 className="d05b-opinion-headline d05b-reveal">
                Mental Healthcare Deserves Better Tooling
              </h2>
              <div className="d05b-opinion-rule" />
              <p className="d05b-opinion-body d05b-reveal">
                When we began speaking with psychologists, psychiatrists, and GGZ practice managers across
                the Netherlands, we heard the same frustration repeated in different registers: the software
                they were using had been designed for general healthcare administration, not for the specific
                rhythms and requirements of mental health treatment. Clinicians were spending the final
                hour of every working day catching up on paperwork that should have taken fifteen minutes.
              </p>
              <p className="d05b-opinion-body d05b-reveal d05b-reveal--delay1">
                We built Moods because we believe that every minute a clinician spends wrestling with
                inadequate software is a minute not spent on clinical thinking, supervision, or &mdash; most
                importantly &mdash; with a patient. The Dutch GGZ sector treats more than 900,000 people each
                year. The cumulative cost of poor tooling, measured in clinician time alone, runs to
                hundreds of millions of euros annually.
              </p>
              <p className="d05b-opinion-body d05b-reveal d05b-reveal--delay2">
                We are not building another generic SaaS platform and adapting it for healthcare. We are
                starting from the clinical workflow, the Dutch regulatory environment, and the real daily
                experience of practitioners who have been underserved by software for too long. Moods
                is purpose-built for this sector, and we intend to keep it that way.
              </p>
              <div className="d05b-opinion-signature">
                &mdash; The Founders, Moods AI &bull; Amsterdam, 2024
              </div>
            </div>
          </section>

          <div className="d05b-ink-divider" />

          {/* ══════════════════════════════════════
              SECTION 5 — CLASSIFIEDS
          ══════════════════════════════════════ */}
          <section className="d05b-classifieds">
            <div className="d05b-section-label">Notices &amp; Tariffs</div>
            <div className="d05b-classifieds-grid">

              <div className="d05b-classified d05b-reveal">
                <div className="d05b-classified-header">Free Plan</div>
                <div className="d05b-classified-price">No Charge</div>
                <p className="d05b-classified-body">
                  For practices just starting out. Up to three members included.
                  Full access to core documentation and scheduling tools.
                  No credit card required. Upgrade at any time without interruption
                  to your existing data.
                </p>
                <a href="#" className="d05b-classified-cta">Apply Within &rarr;</a>
              </div>

              <div className="d05b-classified d05b-reveal d05b-reveal--delay1">
                <div className="d05b-classified-header">Professional Plan</div>
                <div className="d05b-classified-price">&euro;29 / seat / month</div>
                <p className="d05b-classified-body">
                  For growing practices. All features included: AI documentation,
                  secure messaging, HR management, business intelligence, and the
                  client self-service portal. Fourteen-day trial, no commitment.
                  Enquire today.
                </p>
                <a href="#" className="d05b-classified-cta">Enquire Today &rarr;</a>
              </div>

              <div className="d05b-classified d05b-reveal d05b-reveal--delay2">
                <div className="d05b-classified-header">Lifetime Licence</div>
                <div className="d05b-classified-price">&euro;499 &mdash; Once, Forever</div>
                <p className="d05b-classified-body">
                  For the committed practice. Pay once and receive all future
                  updates at no additional cost. Limited availability. Reserved for
                  practices with fewer than fifteen seats. Strictly first-come, first-served.
                </p>
                <a href="#" className="d05b-classified-cta">Secure Your Place &rarr;</a>
              </div>

            </div>
          </section>

          <div className="d05b-ink-divider" />

          {/* ══════════════════════════════════════
              SECTION 6 — BACK PAGE
          ══════════════════════════════════════ */}
          <section className="d05b-backpage">
            <div className="d05b-section-label">
              Business Directory &mdash; Partners &amp; Compliance
            </div>
            <div className="d05b-backpage-grid">

              {/* Integrations */}
              <div>
                <div className="d05b-col-title">Integrations &amp; Partners</div>
                <ul className="d05b-directory-list">
                  {[
                    'Nedap Ons — EHR',
                    'ChipSoft HiX — EHR',
                    'Castor EDC — Research',
                    'AFAS Software — HR',
                    'HiBob — HR & Payroll',
                    'Zorgmail — Secure Messaging',
                    'Microsoft Teams — Video',
                    'Zoom — Video Sessions',
                    'DigiD — Client Identity',
                    'iDEAL — Payments',
                  ].map((item) => (
                    <li key={item}>
                      <div className="d05b-dir-bullet" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d05b-backpage-divider" />

              {/* Compliance */}
              <div>
                <div className="d05b-col-title">Compliance &amp; Certification</div>
                {[
                  {
                    code: 'NEN\n7510',
                    name: 'NEN 7510',
                    desc: 'Dutch information security in healthcare',
                  },
                  {
                    code: 'AVG\nGDPR',
                    name: 'AVG / GDPR',
                    desc: 'European data protection regulation',
                  },
                  {
                    code: 'ISO\n27001',
                    name: 'ISO 27001',
                    desc: 'International information security standard',
                  },
                  {
                    code: 'NEN\n7513',
                    name: 'NEN 7513',
                    desc: 'Medical records logging & audit trails',
                  },
                  {
                    code: 'BIG\nReg.',
                    name: 'BIG Register',
                    desc: 'Healthcare professional verification',
                  },
                ].map((cert) => (
                  <div key={cert.name} className="d05b-cert-item">
                    <div className="d05b-cert-badge">{cert.code}</div>
                    <div className="d05b-cert-info">
                      <div className="d05b-cert-name">{cert.name}</div>
                      {cert.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div className="d05b-backpage-divider" />

              {/* CTA */}
              <div>
                <div className="d05b-col-title">Subscribe to Moods.ai</div>
                <div className="d05b-cta-box">
                  <div className="d05b-cta-label">Begin Your Practice Transformation</div>
                  <p className="d05b-cta-headline">
                    Join the practices reclaiming their time.
                  </p>
                  <a href="#" className="d05b-cta-btn">Request Early Access</a>
                  <p className="d05b-cta-sub">
                    14-day free trial &bull; No credit card &bull; Cancel anytime
                  </p>
                </div>
                <p className="d05b-backpage-note">
                  Moods AI is currently in early access for Dutch GGZ practices.
                  We onboard new practices individually to ensure a smooth transition
                  and full compliance with your existing data-protection obligations.
                  Contact our team to arrange an onboarding call.
                </p>
                <p className="d05b-backpage-contact">
                  hallo@moods.ai &bull; Amsterdam, Netherlands
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* ── Colophon ── */}
        <footer>
          <div className="d05b-colophon">
            <span className="d05b-colophon-text">
              Design 05 &mdash; The Broadsheet &bull; Moods AI &bull; &copy; 2026
            </span>
            <span className="d05b-colophon-text">
              Published in Amsterdam &bull; Dutch Mental Healthcare Technology
            </span>
            <span className="d05b-colophon-text">
              <a href="#">Privacy</a> &bull; <a href="#">Terms</a> &bull;{' '}
              <a href="#">AVG Statement</a>
            </span>
          </div>
        </footer>
      </div>
    </>
  )
}
