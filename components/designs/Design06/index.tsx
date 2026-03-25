'use client'

import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────
   Design 06 — The Terminal
   Dark terminal / CLI aesthetic SaaS homepage for Moods AI
   7 snap-scroll sections, typing animations, ASCII art
   ───────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'hero',     dir: '~/moods/home' },
  { id: 'overview', dir: '~/moods/platform' },
  { id: 'features', dir: '~/moods/features' },
  { id: 'demo',     dir: '~/moods/demo' },
  { id: 'security', dir: '~/moods/security' },
  { id: 'pricing',  dir: '~/moods/pricing' },
  { id: 'cta',      dir: '~/moods/start' },
]

const ASCII_DIAGRAM = [
  '┌─────────────┐     ┌──────────────┐     ┌───────────────┐',
  '│  AI Engine  │────▶│   Practice   │────▶│   Analytics   │',
  '│             │     │  Management  │     │  & Insights   │',
  '└──────┬──────┘     └──────┬───────┘     └───────────────┘',
  '       │                   │',
  '       ▼                   ▼',
  '┌─────────────┐     ┌──────────────┐',
  '│    Video    │     │   HR & Team  │',
  '│   & Comms   │     │  Management  │',
  '└─────────────┘     └──────────────┘',
]

const COMMANDS = [
  { cmd: '$ moods ai:dictate --input=voice --output=report',       desc: 'Transcribe and structure therapy session notes automatically' },
  { cmd: '$ moods ai:ask "What was revenue last month?"',          desc: 'Natural-language queries across all practice data' },
  { cmd: '$ moods schedule:view --week=current --therapist=all',   desc: 'Full team agenda with conflict detection' },
  { cmd: '$ moods hr:leave --request --type=vacation',             desc: 'Integrated leave management and approval flows' },
  { cmd: '$ moods chat:send --channel=team --encrypted',           desc: 'End-to-end encrypted team communication' },
  { cmd: '$ moods video:start --room=therapy-01 --transcribe',     desc: 'Compliant video consultations with live transcription' },
  { cmd: '$ moods analytics:dashboard --type=finance',             desc: 'Real-time financial reporting and declarability insights' },
  { cmd: '$ moods onboard:client --pipeline=intake',               desc: 'Structured intake pipeline from referral to first session' },
]

const DEMO_LINES = [
  { text: '$ moods ai:ask "Show declarability for this week"', type: 'cmd' },
  { text: '> Querying HCI data...', type: 'proc' },
  { text: '> Processing 24 therapist records...', type: 'proc' },
  { text: '', type: 'blank' },
  { text: '  Therapist       Target    Actual    Status', type: 'header' },
  { text: '  ─────────       ──────    ──────    ──────', type: 'sep' },
  { text: '  Dr. van Berg    80%       84%       ✓ Above', type: 'row-good' },
  { text: '  Dr. Jansen      75%       71%       ✗ Below', type: 'row-bad' },
  { text: '  Dr. de Vries    80%       82%       ✓ Above', type: 'row-good' },
  { text: '  Dr. Meijer      80%       80%       ✓ On target', type: 'row-good' },
  { text: '  Dr. Smit        75%       69%       ✗ Below', type: 'row-bad' },
  { text: '', type: 'blank' },
  { text: '  Average: 79% (target: 78%)  ✓ Team on track', type: 'summary' },
]

const SECURITY_LINES = [
  '╔══════════════════════════════════════════╗',
  '║  SECURITY CERTIFICATE                   ║',
  '║  ──────────────────────                 ║',
  '║  NEN 7510    Patient Data Protection    ║',
  '║  NEN 7513    Audit Logging Standard     ║',
  '║  AES-256     Field-Level Encryption     ║',
  '║  RBAC        5 Roles, 25+ Permissions   ║',
  '║  BSN Check   Auto PII Redaction         ║',
  '║  Multi-tenant Data Isolation            ║',
  '╚══════════════════════════════════════════╝',
]

export default function Design06() {
  const promptRef    = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  /* ── Section observer: update terminal prompt directory ── */
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-section]')
    if (!promptRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const id  = entry.target.getAttribute('data-section') ?? ''
            const sec = SECTIONS.find((s) => s.id === id)
            if (sec && promptRef.current) {
              promptRef.current.textContent = sec.dir
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* ── Respect prefers-reduced-motion ── */
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');

        /* ── Reset & base ── */
        .d06t {
          font-family: 'JetBrains Mono', monospace;
          background: #1e1e1e;
          color: #e0e0e0;
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          position: relative;
        }

        /* ── Section base ── */
        .d06t-section {
          height: 100vh;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 60px 8vw;
          position: relative;
          overflow: hidden;
        }

        /* ── Scanline overlay (CSS animation, non-interactive) ── */
        .d06t-scanline {
          pointer-events: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: #a8c89a;
          opacity: 0.08;
          z-index: 5;
          ${prefersReduced ? '' : 'animation: d06t-scan 8s linear infinite;'}
        }

        @keyframes d06t-scan {
          0%   { top: 0; }
          100% { top: 100vh; }
        }

        /* ── Persistent terminal prompt ── */
        .d06t-prompt-bar {
          position: fixed;
          bottom: 28px;
          left: 32px;
          z-index: 10;
          font-size: 0.72rem;
          color: #a8c89a;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(30,30,30,0.88);
          border: 1px solid rgba(168,200,154,0.2);
          padding: 6px 14px;
          border-radius: 3px;
          backdrop-filter: blur(4px);
        }

        .d06t-prompt-arrow {
          color: #d4a843;
          font-weight: 700;
        }

        /* ── Colors ── */
        .d06t-green  { color: #a8c89a; }
        .d06t-amber  { color: #d4a843; }
        .d06t-dim    { color: rgba(224,224,224,0.38); }
        .d06t-white  { color: #e0e0e0; }
        .d06t-red    { color: #e06c75; }

        /* ── Cursor blink ── */
        .d06t-cursor {
          display: inline-block;
          width: 0.55em;
          height: 1.1em;
          background: #a8c89a;
          vertical-align: middle;
          margin-left: 2px;
          ${prefersReduced ? '' : 'animation: d06t-blink 1s steps(1) infinite;'}
        }

        @keyframes d06t-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── Hero section ── */
        .d06t-hero-boot {
          font-size: clamp(0.7rem, 1.5vw, 0.9rem);
          line-height: 1.9;
          margin-bottom: 32px;
        }

        .d06t-hero-tagline {
          font-size: clamp(1.1rem, 2.6vw, 1.7rem);
          color: #a8c89a;
          font-weight: 500;
          margin-bottom: 48px;
          line-height: 1.45;
          max-width: 680px;
        }

        .d06t-stats {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
        }

        .d06t-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .d06t-stat-num {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 700;
          color: #d4a843;
        }

        .d06t-stat-label {
          font-size: 0.68rem;
          color: rgba(224,224,224,0.42);
          letter-spacing: 0.08em;
        }

        /* ── Boot animation sequence ── */
        .d06t-boot-line {
          opacity: 0;
          ${prefersReduced ? 'opacity: 1;' : 'animation: d06t-fadein 0.15s ease forwards;'}
        }
        .d06t-boot-line:nth-child(1)  { animation-delay: 0.1s; }
        .d06t-boot-line:nth-child(2)  { animation-delay: 0.5s; }
        .d06t-boot-line:nth-child(3)  { animation-delay: 0.9s; }
        .d06t-boot-line:nth-child(4)  { animation-delay: 1.3s; }
        .d06t-boot-line:nth-child(5)  { animation-delay: 1.7s; }
        .d06t-boot-line:nth-child(6)  { animation-delay: 2.1s; }

        /* Tagline types in after boot lines */
        .d06t-hero-tagline {
          opacity: 0;
          ${prefersReduced ? 'opacity: 1;' : 'animation: d06t-fadein 0.4s ease 2.6s forwards;'}
        }

        .d06t-stats {
          opacity: 0;
          ${prefersReduced ? 'opacity: 1;' : 'animation: d06t-fadein 0.4s ease 3.0s forwards;'}
        }

        @keyframes d06t-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Section label ── */
        .d06t-section-label {
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(168,200,154,0.4);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .d06t-section-label::before {
          content: '';
          display: inline-block;
          width: 20px; height: 1px;
          background: currentColor;
        }

        .d06t-section-title {
          font-size: clamp(0.85rem, 1.8vw, 1.1rem);
          font-weight: 500;
          color: #a8c89a;
          margin-bottom: 36px;
        }

        /* ── ASCII diagram ── */
        .d06t-ascii {
          font-size: clamp(0.6rem, 1.2vw, 0.82rem);
          line-height: 1.55;
          color: #a8c89a;
          white-space: pre;
        }

        .d06t-ascii-line {
          display: block;
          opacity: 0;
          ${prefersReduced ? 'opacity: 1;' : ''}
        }

        /* Triggered when section is visible via .d06t-visible class */
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(1)  { animation: d06t-fadein 0.12s ease 0.0s  forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(2)  { animation: d06t-fadein 0.12s ease 0.08s forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(3)  { animation: d06t-fadein 0.12s ease 0.16s forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(4)  { animation: d06t-fadein 0.12s ease 0.24s forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(5)  { animation: d06t-fadein 0.12s ease 0.32s forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(6)  { animation: d06t-fadein 0.12s ease 0.40s forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(7)  { animation: d06t-fadein 0.12s ease 0.48s forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(8)  { animation: d06t-fadein 0.12s ease 0.56s forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(9)  { animation: d06t-fadein 0.12s ease 0.64s forwards; }
        .d06t-section.d06t-visible .d06t-ascii-line:nth-child(10) { animation: d06t-fadein 0.12s ease 0.72s forwards; }

        /* ── Features list ── */
        .d06t-cmd-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0;
          width: 100%;
          max-width: 860px;
        }

        .d06t-cmd-item {
          padding: 14px 0;
          border-bottom: 1px solid rgba(168,200,154,0.1);
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-cmd-item:nth-child(1) { animation: d06t-fadein 0.2s ease 0.05s forwards; }
        .d06t-section.d06t-visible .d06t-cmd-item:nth-child(2) { animation: d06t-fadein 0.2s ease 0.12s forwards; }
        .d06t-section.d06t-visible .d06t-cmd-item:nth-child(3) { animation: d06t-fadein 0.2s ease 0.19s forwards; }
        .d06t-section.d06t-visible .d06t-cmd-item:nth-child(4) { animation: d06t-fadein 0.2s ease 0.26s forwards; }
        .d06t-section.d06t-visible .d06t-cmd-item:nth-child(5) { animation: d06t-fadein 0.2s ease 0.33s forwards; }
        .d06t-section.d06t-visible .d06t-cmd-item:nth-child(6) { animation: d06t-fadein 0.2s ease 0.40s forwards; }
        .d06t-section.d06t-visible .d06t-cmd-item:nth-child(7) { animation: d06t-fadein 0.2s ease 0.47s forwards; }
        .d06t-section.d06t-visible .d06t-cmd-item:nth-child(8) { animation: d06t-fadein 0.2s ease 0.54s forwards; }

        .d06t-cmd-str {
          font-size: clamp(0.65rem, 1.3vw, 0.82rem);
          color: #a8c89a;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .d06t-cmd-desc {
          font-size: 0.68rem;
          color: rgba(224,224,224,0.38);
          margin-left: 2px;
        }

        /* ── Demo section ── */
        .d06t-terminal-box {
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(168,200,154,0.18);
          border-radius: 4px;
          padding: 24px 28px;
          max-width: 700px;
          width: 100%;
          font-size: clamp(0.62rem, 1.2vw, 0.8rem);
          line-height: 1.75;
          overflow-x: auto;
        }

        .d06t-demo-line {
          display: block;
          white-space: pre;
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-demo-line:nth-child(1)  { animation: d06t-fadein 0.1s ease 0.1s  forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(2)  { animation: d06t-fadein 0.1s ease 0.5s  forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(3)  { animation: d06t-fadein 0.1s ease 0.9s  forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(4)  { animation: d06t-fadein 0.05s ease 1.1s forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(5)  { animation: d06t-fadein 0.1s ease 1.2s  forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(6)  { animation: d06t-fadein 0.05s ease 1.3s forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(7)  { animation: d06t-fadein 0.1s ease 1.4s  forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(8)  { animation: d06t-fadein 0.1s ease 1.55s forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(9)  { animation: d06t-fadein 0.1s ease 1.7s  forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(10) { animation: d06t-fadein 0.1s ease 1.85s forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(11) { animation: d06t-fadein 0.1s ease 2.0s  forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(12) { animation: d06t-fadein 0.05s ease 2.1s forwards; }
        .d06t-section.d06t-visible .d06t-demo-line:nth-child(13) { animation: d06t-fadein 0.15s ease 2.2s forwards; }

        /* ── Security certificate ── */
        .d06t-cert {
          font-size: clamp(0.62rem, 1.2vw, 0.82rem);
          color: #a8c89a;
          white-space: pre;
          line-height: 1.65;
        }

        .d06t-cert-line {
          display: block;
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-cert-line:nth-child(1)  { animation: d06t-fadein 0.12s ease 0.0s  forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(2)  { animation: d06t-fadein 0.12s ease 0.1s  forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(3)  { animation: d06t-fadein 0.12s ease 0.2s  forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(4)  { animation: d06t-fadein 0.12s ease 0.32s forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(5)  { animation: d06t-fadein 0.12s ease 0.44s forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(6)  { animation: d06t-fadein 0.12s ease 0.56s forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(7)  { animation: d06t-fadein 0.12s ease 0.68s forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(8)  { animation: d06t-fadein 0.12s ease 0.80s forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(9)  { animation: d06t-fadein 0.12s ease 0.92s forwards; }
        .d06t-section.d06t-visible .d06t-cert-line:nth-child(10) { animation: d06t-fadein 0.12s ease 1.04s forwards; }

        /* ── Pricing table ── */
        .d06t-price-cmd {
          font-size: clamp(0.68rem, 1.3vw, 0.85rem);
          color: #a8c89a;
          margin-bottom: 24px;
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-price-cmd {
          animation: d06t-fadein 0.2s ease 0.1s forwards;
        }

        .d06t-price-table {
          font-size: clamp(0.6rem, 1.1vw, 0.78rem);
          line-height: 1.9;
          white-space: pre;
          color: #e0e0e0;
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-price-table {
          animation: d06t-fadein 0.2s ease 0.5s forwards;
        }

        /* ── CTA section ── */
        .d06t-cta-cmd {
          font-size: clamp(0.75rem, 1.6vw, 1.1rem);
          color: #a8c89a;
          font-weight: 500;
          margin-bottom: 16px;
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-cta-cmd {
          animation: d06t-fadein 0.3s ease 0.2s forwards;
        }

        .d06t-cta-sub {
          font-size: 0.72rem;
          color: rgba(224,224,224,0.35);
          margin-bottom: 40px;
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-cta-sub {
          animation: d06t-fadein 0.3s ease 0.6s forwards;
        }

        .d06t-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: 1px solid #a8c89a;
          color: #a8c89a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-cta-btn {
          animation: d06t-fadein 0.3s ease 0.9s forwards;
        }

        .d06t-cta-btn:hover {
          background: #a8c89a;
          color: #1e1e1e;
        }

        .d06t-cta-note {
          margin-top: 20px;
          font-size: 0.65rem;
          color: rgba(224,224,224,0.28);
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-cta-note {
          animation: d06t-fadein 0.3s ease 1.2s forwards;
        }

        /* ── Grid layout for overview and security ── */
        .d06t-two-col {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          width: 100%;
          max-width: 1000px;
          align-items: start;
        }

        .d06t-overview-meta {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-top: 8px;
          opacity: 0;
        }

        .d06t-section.d06t-visible .d06t-overview-meta {
          animation: d06t-fadein 0.3s ease 0.8s forwards;
        }

        .d06t-meta-item {
          font-size: 0.68rem;
          color: rgba(224,224,224,0.38);
          line-height: 1.7;
          border-left: 2px solid rgba(168,200,154,0.25);
          padding-left: 12px;
        }

        .d06t-meta-item strong {
          display: block;
          color: #d4a843;
          font-weight: 500;
          margin-bottom: 2px;
        }

        /* ── Horizontal rule decoration ── */
        .d06t-hr {
          border: none;
          border-top: 1px solid rgba(168,200,154,0.12);
          margin: 0 0 32px;
          width: 100%;
          max-width: 860px;
        }

        /* ── Nav bar (top) ── */
        .d06t-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 44px;
          background: rgba(30,30,30,0.95);
          border-bottom: 1px solid rgba(168,200,154,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          z-index: 50;
          backdrop-filter: blur(6px);
          font-size: 0.72rem;
        }

        .d06t-nav-logo {
          color: #a8c89a;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .d06t-nav-links {
          display: flex;
          gap: 28px;
        }

        .d06t-nav-links a {
          color: rgba(224,224,224,0.45);
          text-decoration: none;
          transition: color 0.2s;
          font-size: 0.68rem;
        }

        .d06t-nav-links a:hover { color: #a8c89a; }

        .d06t-nav-cta {
          background: rgba(168,200,154,0.12);
          border: 1px solid rgba(168,200,154,0.3);
          color: #a8c89a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          padding: 5px 14px;
          border-radius: 2px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
        }

        .d06t-nav-cta:hover { background: rgba(168,200,154,0.22); }

        /* ── Counter animation ── */
        .d06t-counter {
          display: inline-block;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .d06t-section {
            padding: 56px 6vw 48px;
            height: auto;
            min-height: 100vh;
          }

          .d06t-prompt-bar {
            top: 52px;
            bottom: auto;
            left: 16px;
            font-size: 0.62rem;
            padding: 4px 10px;
          }

          .d06t-two-col {
            grid-template-columns: 1fr;
          }

          .d06t-overview-meta { display: none; }

          .d06t-terminal-box {
            font-size: 0.6rem;
            padding: 16px;
          }

          .d06t-stats {
            gap: 28px;
          }

          .d06t-nav-links { display: none; }

          .d06t-ascii {
            font-size: 0.45rem;
          }

          .d06t-cert {
            font-size: 0.48rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .d06t-boot-line,
          .d06t-hero-tagline,
          .d06t-stats,
          .d06t-ascii-line,
          .d06t-cmd-item,
          .d06t-demo-line,
          .d06t-cert-line,
          .d06t-price-cmd,
          .d06t-price-table,
          .d06t-cta-cmd,
          .d06t-cta-sub,
          .d06t-cta-btn,
          .d06t-cta-note,
          .d06t-overview-meta { opacity: 1 !important; animation: none !important; }
          .d06t-scanline { animation: none !important; }
          .d06t-cursor { animation: none !important; opacity: 1; }
        }
      `}</style>

      {/* Scanline overlay */}
      <div className="d06t-scanline" aria-hidden="true" />

      {/* Persistent terminal prompt */}
      <div className="d06t-prompt-bar" aria-hidden="true">
        <span className="d06t-prompt-arrow">▶</span>
        <span ref={promptRef}>~/moods/home</span>
        <span className="d06t-cursor" />
      </div>

      {/* Top nav */}
      <nav className="d06t-nav">
        <span className="d06t-nav-logo">moods.ai</span>
        <div className="d06t-nav-links">
          <a href="#">Features</a>
          <a href="#">Security</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
        </div>
        <a href="#" className="d06t-nav-cta">$ start --trial</a>
      </nav>

      {/* ══════════════════════════════════════════ */}
      {/* Scroll container                          */}
      {/* ══════════════════════════════════════════ */}
      <div className="d06t" ref={containerRef}>

        {/* ─── Section 1: Hero ─── */}
        <section className="d06t-section d06t-visible" data-section="hero" style={{ paddingTop: '80px' }}>
          <div className="d06t-section-label">Design 06 — The Terminal</div>

          <div className="d06t-hero-boot" aria-label="Terminal boot sequence">
            <span className="d06t-boot-line d06t-dim">[    0.000] Moods AI Platform v2.4.0 booting...</span><br />
            <span className="d06t-boot-line d06t-dim">[    0.182] Loading AI engine... <span className="d06t-green">OK</span></span><br />
            <span className="d06t-boot-line d06t-dim">[    0.391] Connecting to NEN 7510 vault... <span className="d06t-green">OK</span></span><br />
            <span className="d06t-boot-line d06t-dim">[    0.604] Initialising HCI integrations... <span className="d06t-green">OK</span></span><br />
            <span className="d06t-boot-line d06t-dim">[    0.817] Starting practice services... <span className="d06t-green">OK</span></span><br />
            <span className="d06t-boot-line d06t-green">$ moods --init<span className="d06t-cursor" /></span>
          </div>

          <p className="d06t-hero-tagline">
            The intelligent practice<br />for modern mental healthcare.
          </p>

          <div className="d06t-stats" role="list">
            <div className="d06t-stat" role="listitem">
              <span className="d06t-stat-num">2,340 hrs/yr</span>
              <span className="d06t-stat-label">saved per practice</span>
            </div>
            <div className="d06t-stat" role="listitem">
              <span className="d06t-stat-num">500K+</span>
              <span className="d06t-stat-label">AI tokens / month</span>
            </div>
            <div className="d06t-stat" role="listitem">
              <span className="d06t-stat-num d06t-green">NEN 7510</span>
              <span className="d06t-stat-label">certified</span>
            </div>
          </div>
        </section>

        {/* ─── Section 2: System Overview ─── */}
        <Section id="overview">
          <div className="d06t-section-label">Platform Architecture</div>
          <div className="d06t-section-title">$ moods system:overview --diagram</div>

          <div className="d06t-two-col">
            <pre className="d06t-ascii" aria-label="Platform architecture diagram">
              {ASCII_DIAGRAM.map((line, i) => (
                <span key={i} className="d06t-ascii-line">{line}{'\n'}</span>
              ))}
            </pre>

            <div className="d06t-overview-meta">
              <div className="d06t-meta-item">
                <strong>AI Engine</strong>
                GPT-4o · Dutch-tuned<br />
                Dictation, Q&A, Summaries
              </div>
              <div className="d06t-meta-item">
                <strong>Practice Mgmt</strong>
                Scheduling, dossiers<br />
                Client pipeline, intake
              </div>
              <div className="d06t-meta-item">
                <strong>Analytics</strong>
                Declarability, finance<br />
                Real-time dashboards
              </div>
              <div className="d06t-meta-item">
                <strong>Integrations</strong>
                HCI, iZi, Syntess<br />
                iCalendar, REST API
              </div>
            </div>
          </div>
        </Section>

        {/* ─── Section 3: Features as Commands ─── */}
        <Section id="features">
          <div className="d06t-section-label">Command Reference</div>
          <div className="d06t-section-title">$ moods help --all</div>
          <hr className="d06t-hr" />

          <ul className="d06t-cmd-list" aria-label="Platform features">
            {COMMANDS.map(({ cmd, desc }, i) => (
              <li key={i} className="d06t-cmd-item">
                <div className="d06t-cmd-str d06t-green">{cmd}</div>
                <div className="d06t-cmd-desc"># {desc}</div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ─── Section 4: Live Demo ─── */}
        <Section id="demo">
          <div className="d06t-section-label">Interactive Demo</div>
          <div className="d06t-section-title">AskMoody — Natural Language Analytics</div>

          <div className="d06t-terminal-box" role="region" aria-label="Live demo terminal output">
            {DEMO_LINES.map(({ text, type }, i) => {
              let cls = 'd06t-demo-line '
              if (type === 'cmd')      cls += 'd06t-green'
              else if (type === 'proc') cls += 'd06t-dim'
              else if (type === 'header') cls += 'd06t-amber'
              else if (type === 'sep')  cls += 'd06t-dim'
              else if (type === 'row-good') cls += 'd06t-white'
              else if (type === 'row-bad')  cls += 'd06t-red'
              else if (type === 'summary') cls += 'd06t-green'
              return (
                <span key={i} className={cls}>
                  {text || '\u00a0'}
                </span>
              )
            })}
          </div>
        </Section>

        {/* ─── Section 5: Security ─── */}
        <Section id="security">
          <div className="d06t-section-label">Compliance &amp; Security</div>
          <div className="d06t-section-title">$ moods security:audit --full</div>

          <pre className="d06t-cert" aria-label="Security certificate">
            {SECURITY_LINES.map((line, i) => (
              <span key={i} className="d06t-cert-line">{line}{'\n'}</span>
            ))}
          </pre>

          <p style={{ marginTop: '28px', fontSize: '0.68rem', color: 'rgba(224,224,224,0.35)', maxWidth: '480px', lineHeight: '1.8' }}>
            All data processed within Dutch borders. Hosting on ISO 27001&#8209;certified
            infrastructure. Independent penetration tests annually. SOC 2 audit in progress.
          </p>
        </Section>

        {/* ─── Section 6: Pricing ─── */}
        <Section id="pricing">
          <div className="d06t-section-label">Plans</div>
          <div className="d06t-price-cmd">$ moods plan:compare --output=table</div>

          <pre className="d06t-price-table" aria-label="Pricing table">
{`Plan       Price            Seats    AI Tokens    Storage
────       ─────            ─────    ─────────    ───────
Free       €0/mo            ≤ 3      1K/mo        1 GB
Pro        €29/seat/mo      ∞        500K/mo      100 GB
Lifetime   €499 once        ∞        500K/mo      100 GB
`}
          </pre>

          <div style={{ marginTop: '32px', fontSize: '0.68rem', color: 'rgba(224,224,224,0.32)', lineHeight: '1.9' }}>
            <span className="d06t-green"># </span>All plans include NEN 7510 compliance, RBAC, and BSN redaction.<br />
            <span className="d06t-green"># </span>Pro includes priority support and SLA guarantee.<br />
            <span className="d06t-green"># </span>Lifetime plan available during early access. Limited seats.
          </div>
        </Section>

        {/* ─── Section 7: CTA ─── */}
        <Section id="cta">
          <div className="d06t-section-label">Get Started</div>

          <p className="d06t-cta-cmd">
            $ moods practice:start --trial=14d --plan=pro
            <span className="d06t-cursor" />
          </p>

          <p className="d06t-cta-sub">
            # No credit card required · Setup in under 5 minutes · Dutch-language support
          </p>

          <a href="#" className="d06t-cta-btn">
            Press Enter to begin
            <span aria-hidden="true">→</span>
          </a>

          <p className="d06t-cta-note">
            Already running a practice?{' '}
            <a href="#" style={{ color: 'rgba(168,200,154,0.55)', textDecoration: 'underline' }}>
              Schedule a demo
            </a>
            {' '}instead.
          </p>
        </Section>

      </div>
    </>
  )
}

/* ── Helper: section wrapper that adds .d06t-visible on scroll ── */
function Section({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('d06t-visible')
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="d06t-section"
      data-section={id}
      style={{ paddingTop: '80px' }}
    >
      {children}
    </section>
  )
}
