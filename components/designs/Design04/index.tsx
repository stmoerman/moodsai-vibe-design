'use client'
import { useRef, useLayoutEffect, useEffect } from 'react'

export default function Design04() {
  const rootRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const chatOutputRef = useRef<HTMLDivElement>(null)
  const chatTriggeredRef = useRef(false)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    type GsapType = typeof import('gsap').gsap
    type ScrollTriggerType = typeof import('gsap/ScrollTrigger').ScrollTrigger
    let ctx: ReturnType<GsapType['context']> | null = null
    let ScrollTriggerInstance: ScrollTriggerType | null = null

    void import('gsap').then(({ gsap }) => {
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        ScrollTriggerInstance = ScrollTrigger

        ctx = gsap.context(() => {
          // Progress bar
          if (progressRef.current) {
            gsap.to(progressRef.current, {
              width: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3,
              },
            })
          }

          if (prefersReduced) return

          // Bento cards stagger
          const cards = rootRef.current?.querySelectorAll('.d04g-card')
          if (cards && cards.length > 0) {
            ScrollTrigger.batch(Array.from(cards), {
              onEnter: (batch: Element[]) => {
                gsap.fromTo(
                  batch,
                  { y: 30, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out' }
                )
              },
              once: true,
              start: 'top 88%',
            })

            // Breathing animation
            cards.forEach((card: Element, i: number) => {
              gsap.to(card, {
                y: '+=2',
                yoyo: true,
                repeat: -1,
                duration: 3 + (i % 3) * 0.7,
                delay: i * 0.18,
                ease: 'sine.inOut',
              })
            })
          }

          // Timeline nodes sequential entrance
          const nodes = rootRef.current?.querySelectorAll('.d04g-tl-node')
          if (nodes && nodes.length > 0) {
            nodes.forEach((node: Element, i: number) => {
              gsap.fromTo(
                node,
                { scale: 0.6, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.4,
                  delay: i * 0.12,
                  ease: 'back.out(1.7)',
                  scrollTrigger: {
                    trigger: node,
                    start: 'top 85%',
                    once: true,
                  },
                }
              )
            })
          }
        }, rootRef)
      })
    })

    return () => {
      ctx?.revert()
      ScrollTriggerInstance?.getAll().forEach((t) => t.kill())
    }
  }, [])

  // AI chat streaming effect
  useEffect(() => {
    const chatEl = chatOutputRef.current
    if (!chatEl) return

    const fullText =
      'Declarabiliteit week 12\n\n' +
      'Therapeut         Sessies   Decl.   %\n' +
      '─────────────────────────────────────\n' +
      'A. de Vries       12        11      92%\n' +
      'B. Janssen        9         7       78%\n' +
      'C. Smit           14        14     100%\n' +
      'D. Bakker         10        8       80%\n' +
      '─────────────────────────────────────\n' +
      'Totaal            45        40      89%\n\n' +
      'Let op: B. Janssen ligt onder de norm van 85%.'

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !chatTriggeredRef.current) {
            chatTriggeredRef.current = true
            observer.disconnect()
            if (prefersReduced) {
              chatEl.textContent = fullText
              return
            }
            let i = 0
            const interval = setInterval(() => {
              i++
              chatEl.textContent = fullText.slice(0, i)
              chatEl.scrollTop = chatEl.scrollHeight
              if (i >= fullText.length) clearInterval(interval)
            }, 18)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(chatEl)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── Root ── */
        .d04g-root {
          min-height: 100vh;
          background-color: #f2f0eb;
          background-image: radial-gradient(circle, #d5d0c8 1px, transparent 1px);
          background-size: 20px 20px;
          font-family: 'DM Sans', sans-serif;
          color: #2a2a2a;
          overflow-x: hidden;
        }

        /* ── Progress bar ── */
        .d04g-progress-wrap {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          z-index: 200;
          background: rgba(42,42,42,0.08);
        }
        .d04g-progress-bar {
          height: 100%;
          width: 0%;
          background: #4a8c7f;
        }

        /* ── Sticky nav ── */
        .d04g-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(242,240,235,0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(42,42,42,0.1);
          padding: 0 40px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .d04g-nav-logo {
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          color: #2a2a2a;
          text-decoration: none;
        }
        .d04g-nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        .d04g-nav-links a {
          font-size: 0.78rem;
          color: rgba(42,42,42,0.6);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .d04g-nav-links a:hover { color: #2a2a2a; }
        .d04g-nav-cta {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.06em;
          color: #fff;
          background: #4a8c7f;
          border: none;
          padding: 8px 18px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
          display: inline-block;
        }
        .d04g-nav-cta:hover { background: #3d7569; }

        /* ── Section layout ── */
        .d04g-section {
          padding: 96px 48px;
          max-width: 1280px;
          margin: 0 auto;
        }
        .d04g-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #4a8c7f;
          margin-bottom: 12px;
        }
        .d04g-section-title {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: #2a2a2a;
          margin-bottom: 40px;
        }

        /* ── Hero ── */
        .d04g-hero {
          min-height: calc(100vh - 56px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 48px;
          position: relative;
        }
        .d04g-hero-logo {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(42,42,42,0.4);
          margin-bottom: 48px;
        }
        .d04g-hero-headline {
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #2a2a2a;
          max-width: 700px;
          margin: 0 0 32px;
        }
        .d04g-hero-sub {
          font-size: 1.05rem;
          font-weight: 300;
          color: rgba(42,42,42,0.6);
          max-width: 480px;
          line-height: 1.6;
          margin-bottom: 48px;
        }
        .d04g-hero-cta {
          display: inline-block;
          background: #4a8c7f;
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 40px;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .d04g-hero-cta:hover {
          background: #3d7569;
          transform: translateY(-1px);
        }
        .d04g-hero-scroll {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          color: rgba(42,42,42,0.3);
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ── Bento Grid ── */
        .d04g-bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 180px;
          gap: 1px;
          background: rgba(42,42,42,0.12);
        }
        .d04g-card {
          background: #e8e5df;
          border: 1px solid rgba(42,42,42,0.12);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          position: relative;
          transition: background 0.2s;
        }
        .d04g-card:hover { background: #dedad3; }
        .d04g-card--2x2 { grid-column: span 2; grid-row: span 2; }
        .d04g-card--2x1 { grid-column: span 2; }
        .d04g-card--1x1 { grid-column: span 1; }
        .d04g-card-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(42,42,42,0.45);
          margin-bottom: 4px;
        }
        .d04g-card-title {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #2a2a2a;
          font-weight: 400;
        }
        .d04g-card-desc {
          font-size: 0.8rem;
          font-weight: 300;
          color: rgba(42,42,42,0.65);
          line-height: 1.5;
        }
        .d04g-card-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        /* AskMoody chat preview */
        .d04g-chat-preview {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        .d04g-bubble {
          padding: 10px 14px;
          font-size: 0.78rem;
          line-height: 1.45;
          max-width: 85%;
        }
        .d04g-bubble--user {
          background: #2a2a2a;
          color: #f2f0eb;
          align-self: flex-end;
        }
        .d04g-bubble--ai {
          background: #4a8c7f;
          color: #fff;
          align-self: flex-start;
        }
        .d04g-bubble--typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 10px 14px;
          align-self: flex-start;
        }
        .d04g-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #4a8c7f;
          animation: d04gDotPulse 1.2s ease-in-out infinite;
        }
        .d04g-dot:nth-child(2) { animation-delay: 0.2s; }
        .d04g-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes d04gDotPulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }

        /* Calendar mini grid */
        .d04g-cal {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
          margin-top: 12px;
        }
        .d04g-cal-head {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          color: rgba(42,42,42,0.4);
          text-align: center;
          padding-bottom: 2px;
        }
        .d04g-cal-day {
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          color: rgba(42,42,42,0.5);
          position: relative;
        }
        .d04g-cal-dot {
          position: absolute;
          bottom: 1px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px; height: 5px;
          border-radius: 50%;
        }

        /* Waveform bars */
        .d04g-waveform {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 40px;
          margin-top: 12px;
        }
        .d04g-wave-bar {
          width: 4px;
          background: #4a8c7f;
          border-radius: 2px;
          animation: d04gWave 1.4s ease-in-out infinite;
        }
        @keyframes d04gWave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }

        /* Icons */
        .d04g-icon {
          width: 36px; height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 12px;
          margin-bottom: 4px;
          color: rgba(42,42,42,0.5);
        }

        /* Pipeline */
        .d04g-pipeline {
          display: flex;
          align-items: center;
          margin-top: 16px;
          overflow: hidden;
        }
        .d04g-pipe-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #4a8c7f;
          flex-shrink: 0;
          z-index: 1;
        }
        .d04g-pipe-dot--dim { background: rgba(42,42,42,0.2); }
        .d04g-pipe-line {
          flex: 1;
          height: 1px;
          background: rgba(42,42,42,0.2);
        }
        .d04g-pipe-line--active { background: #4a8c7f; }

        /* ── AI Spotlight ── */
        .d04g-spotlight {
          background: #2a2a2a;
          color: #f2f0eb;
          padding: 80px 48px;
        }
        .d04g-spotlight-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .d04g-spotlight-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #4a8c7f;
          margin-bottom: 12px;
        }
        .d04g-spotlight-title {
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          margin-bottom: 48px;
          color: rgba(242,240,235,0.9);
        }
        .d04g-chat-window {
          background: #1a1a1a;
          border: 1px solid rgba(242,240,235,0.08);
          overflow: hidden;
        }
        .d04g-chat-bar {
          padding: 12px 20px;
          border-bottom: 1px solid rgba(242,240,235,0.06);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .d04g-chat-dot-r { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,80,80,0.6); }
        .d04g-chat-dot-y { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,180,50,0.6); }
        .d04g-chat-dot-g { width: 10px; height: 10px; border-radius: 50%; background: rgba(80,200,100,0.6); }
        .d04g-chat-bar-title {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: rgba(242,240,235,0.3);
          margin-left: 8px;
          letter-spacing: 0.05em;
        }
        .d04g-chat-body {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 300px;
        }
        .d04g-spotlight-user {
          align-self: flex-end;
          background: rgba(242,240,235,0.1);
          padding: 10px 16px;
          font-size: 0.85rem;
          color: rgba(242,240,235,0.85);
          max-width: 75%;
          line-height: 1.5;
        }
        .d04g-spotlight-ai-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: #4a8c7f;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .d04g-spotlight-ai-output {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          line-height: 1.7;
          color: rgba(242,240,235,0.8);
          white-space: pre;
          overflow-x: auto;
          min-height: 180px;
        }
        .d04g-spotlight-cursor {
          display: inline-block;
          width: 7px;
          height: 13px;
          background: #4a8c7f;
          animation: d04gBlink 0.9s step-end infinite;
          vertical-align: text-bottom;
          margin-left: 1px;
        }
        @keyframes d04gBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* ── Timeline ── */
        .d04g-timeline-wrap {
          overflow-x: auto;
          padding-bottom: 20px;
        }
        .d04g-timeline {
          display: flex;
          align-items: flex-start;
          min-width: 720px;
          padding: 16px 0 32px;
          position: relative;
        }
        .d04g-tl-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          gap: 12px;
        }
        .d04g-tl-connector {
          position: absolute;
          top: 20px;
          left: 50%;
          right: -50%;
          height: 1px;
          background: rgba(42,42,42,0.2);
        }
        .d04g-tl-step:last-child .d04g-tl-connector { display: none; }
        .d04g-tl-node {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(42,42,42,0.25);
          background: #e8e5df;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: #2a2a2a;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }
        .d04g-tl-node--active {
          background: #4a8c7f;
          color: #fff;
          border-color: #4a8c7f;
        }
        .d04g-tl-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #2a2a2a;
          text-align: center;
          white-space: nowrap;
        }
        .d04g-tl-desc {
          font-size: 0.72rem;
          font-weight: 300;
          color: rgba(42,42,42,0.55);
          text-align: center;
          line-height: 1.45;
          max-width: 110px;
        }

        /* ── Integrations ── */
        .d04g-integrations-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(42,42,42,0.1);
          max-width: 900px;
        }
        .d04g-int-item {
          background: #e8e5df;
          border: 1px solid rgba(42,42,42,0.1);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          transition: background 0.2s;
        }
        .d04g-int-item:hover { background: #dedad3; }
        .d04g-int-logo {
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.05em;
          color: rgba(42,42,42,0.5);
          background: rgba(42,42,42,0.06);
          border: 1px solid rgba(42,42,42,0.1);
        }
        .d04g-int-name {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2a2a2a;
        }
        .d04g-int-desc {
          font-size: 0.75rem;
          font-weight: 300;
          color: rgba(42,42,42,0.5);
          line-height: 1.4;
        }

        /* ── Pricing ── */
        .d04g-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(42,42,42,0.12);
        }
        .d04g-price-card {
          background: #e8e5df;
          border: 1px solid rgba(42,42,42,0.1);
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: background 0.2s;
        }
        .d04g-price-card:hover { background: #dedad3; }
        .d04g-price-card--featured {
          background: #2a2a2a;
          color: #f2f0eb;
        }
        .d04g-price-card--featured:hover { background: #333; }
        .d04g-price-plan {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4a8c7f;
        }
        .d04g-price-card--featured .d04g-price-plan { color: #6abfb0; }
        .d04g-price-amount {
          font-size: 2.8rem;
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .d04g-price-unit {
          font-size: 0.78rem;
          font-weight: 300;
          color: rgba(42,42,42,0.5);
          margin-top: 4px;
        }
        .d04g-price-card--featured .d04g-price-unit { color: rgba(242,240,235,0.5); }
        .d04g-price-divider {
          width: 100%;
          height: 1px;
          background: rgba(42,42,42,0.12);
        }
        .d04g-price-card--featured .d04g-price-divider { background: rgba(242,240,235,0.12); }
        .d04g-price-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .d04g-price-features li {
          font-size: 0.8rem;
          font-weight: 300;
          color: rgba(42,42,42,0.7);
          padding-left: 16px;
          position: relative;
          line-height: 1.4;
        }
        .d04g-price-card--featured .d04g-price-features li { color: rgba(242,240,235,0.7); }
        .d04g-price-features li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: #4a8c7f;
          font-size: 0.65rem;
        }
        .d04g-price-cta {
          display: block;
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 12px 20px;
          text-decoration: none;
          border: 1px solid rgba(42,42,42,0.25);
          color: #2a2a2a;
          transition: background 0.2s, color 0.2s;
          margin-top: auto;
        }
        .d04g-price-cta:hover { background: #2a2a2a; color: #f2f0eb; }
        .d04g-price-card--featured .d04g-price-cta {
          background: #4a8c7f;
          border-color: #4a8c7f;
          color: #fff;
        }
        .d04g-price-card--featured .d04g-price-cta:hover { background: #3d7569; border-color: #3d7569; }
        .d04g-price-badge {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: #4a8c7f;
          color: #fff;
          padding: 3px 8px;
          display: inline-block;
          align-self: flex-start;
        }

        /* ── Footer ── */
        .d04g-footer {
          background-image: radial-gradient(circle, #d5d0c8 1px, transparent 1px);
          background-size: 20px 20px;
          background-color: #f2f0eb;
          border-top: 1px solid rgba(42,42,42,0.1);
          padding: 64px 48px 40px;
        }
        .d04g-footer-inner { max-width: 1280px; margin: 0 auto; }
        .d04g-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .d04g-footer-brand {
          font-family: 'Space Mono', monospace;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          color: #2a2a2a;
          margin-bottom: 16px;
        }
        .d04g-footer-tagline {
          font-size: 0.78rem;
          font-weight: 300;
          color: rgba(42,42,42,0.5);
          line-height: 1.6;
          max-width: 240px;
        }
        .d04g-footer-col-title {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(42,42,42,0.4);
          margin-bottom: 16px;
        }
        .d04g-footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .d04g-footer-links a {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: rgba(42,42,42,0.55);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color 0.2s;
        }
        .d04g-footer-links a:hover { color: #2a2a2a; }
        .d04g-footer-bottom {
          border-top: 1px solid rgba(42,42,42,0.1);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .d04g-footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: rgba(42,42,42,0.35);
          letter-spacing: 0.04em;
        }
        .d04g-footer-locale {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: rgba(42,42,42,0.35);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── Divider ── */
        .d04g-full-divider {
          width: 100%;
          height: 1px;
          background: rgba(42,42,42,0.1);
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .d04g-nav-links { display: none; }
          .d04g-section { padding: 64px 24px; }
          .d04g-hero { padding: 64px 24px; }
          .d04g-spotlight { padding: 64px 24px; }
          .d04g-bento-grid {
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: auto;
          }
          .d04g-card--2x2,
          .d04g-card--2x1 {
            grid-column: span 2;
            grid-row: span 1;
            min-height: 160px;
          }
          .d04g-card--1x1 {
            grid-column: span 1;
            min-height: 140px;
          }
          .d04g-timeline {
            flex-direction: column;
            min-width: unset;
            align-items: flex-start;
            gap: 24px;
          }
          .d04g-tl-step {
            flex-direction: row;
            align-items: flex-start;
            gap: 16px;
            width: 100%;
          }
          .d04g-tl-connector { display: none; }
          .d04g-tl-desc { text-align: left; }
          .d04g-pricing-grid { grid-template-columns: 1fr; }
          .d04g-integrations-grid { grid-template-columns: 1fr 1fr; }
          .d04g-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .d04g-footer { padding: 48px 24px 32px; }
          .d04g-footer-bottom { flex-direction: column; gap: 12px; align-items: flex-start; }
        }
      `}</style>

      {/* Fixed progress bar — outside scroll container */}
      <div className="d04g-progress-wrap">
        <div className="d04g-progress-bar" ref={progressRef} />
      </div>

      <div className="d04g-root" ref={rootRef}>

        {/* ── Sticky Nav ── */}
        <nav className="d04g-nav">
          <a href="#hero" className="d04g-nav-logo">Moods.ai</a>
          <ul className="d04g-nav-links">
            <li><a href="#features">Functies</a></li>
            <li><a href="#ai">AskMoody</a></li>
            <li><a href="#workflow">Workflow</a></li>
            <li><a href="#integrations">Koppelingen</a></li>
            <li><a href="#pricing">Tarieven</a></li>
          </ul>
          <a href="#pricing" className="d04g-nav-cta">Demo aanvragen</a>
        </nav>

        {/* ── Hero ── */}
        <section className="d04g-hero" id="hero">
          <div className="d04g-hero-logo">Moods.ai</div>
          <h1 className="d04g-hero-headline">
            The intelligent practice for modern mental healthcare.
          </h1>
          <p className="d04g-hero-sub">
            Het all-in-one platform voor GGZ-organisaties. Vervang 5 tot 10 losse tools door één samenhangende omgeving.
          </p>
          <a href="#features" className="d04g-hero-cta">Plan een demo</a>
          <div className="d04g-hero-scroll">Scroll om te verkennen ↓</div>
        </section>

        <div className="d04g-full-divider" />

        {/* ── Bento Grid ── */}
        <section id="features">
          <div className="d04g-section" style={{ paddingBottom: 0 }}>
            <div className="d04g-section-label">Platform overzicht</div>
            <h2 className="d04g-section-title">Alles wat een GGZ-praktijk nodig heeft.</h2>
          </div>
          <div className="d04g-bento-grid">

            {/* AskMoody 2x2 */}
            <div className="d04g-card d04g-card--2x2">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">AI assistent</div>
                <div className="d04g-card-title">AskMoody</div>
              </div>
              <div className="d04g-chat-preview">
                <div className="d04g-bubble d04g-bubble--user">
                  Wat is de gemiddelde wachttijd deze week?
                </div>
                <div className="d04g-bubble d04g-bubble--ai">
                  Gemiddeld 4,2 dagen — 0,8 dagen korter dan vorige week.
                </div>
                <div className="d04g-bubble--typing">
                  <div className="d04g-dot" />
                  <div className="d04g-dot" />
                  <div className="d04g-dot" />
                </div>
              </div>
              <div className="d04g-card-desc">
                Stel vragen in gewone taal. Krijg direct inzicht in cliënten, capaciteit en declaraties.
              </div>
            </div>

            {/* Scheduling 2x1 */}
            <div className="d04g-card d04g-card--2x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">Agenda</div>
                <div className="d04g-card-title">Afspraken plannen</div>
              </div>
              <div className="d04g-cal">
                {['Ma','Di','Wo','Do','Vr','Za','Zo'].map((d) => (
                  <div key={d} className="d04g-cal-head">{d}</div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 2
                  const teal = [3, 7, 10, 16, 21]
                  const dark = [4, 9, 14, 17, 23]
                  const dotColor = teal.includes(day) ? '#4a8c7f' : dark.includes(day) ? '#2a2a2a' : null
                  return (
                    <div key={i} className="d04g-cal-day">
                      {day > 0 && day <= 30 ? day : ''}
                      {dotColor !== null && (
                        <div className="d04g-cal-dot" style={{ background: dotColor }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Video 1x1 */}
            <div className="d04g-card d04g-card--1x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">Video</div>
                <div className="d04g-card-title">Videogesprekken</div>
              </div>
              <div className="d04g-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" opacity="0.6" />
                </svg>
              </div>
              <div className="d04g-card-desc">Whereby integratie</div>
            </div>

            {/* Team Chat 1x1 */}
            <div className="d04g-card d04g-card--1x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">Communicatie</div>
                <div className="d04g-card-title">Team Chat</div>
              </div>
              <div className="d04g-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div className="d04g-card-desc">Intern berichtenverkeer</div>
            </div>

            {/* Dictation 2x1 */}
            <div className="d04g-card d04g-card--2x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">Spraakherkenning</div>
                <div className="d04g-card-title">Dicteer — Rapport</div>
              </div>
              <div className="d04g-waveform">
                {[30,65,45,80,55,90,40,70,50,85,35,60,75,45,90,55,70,40,65,80].map((h, i) => (
                  <div
                    key={i}
                    className="d04g-wave-bar"
                    style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }}
                  />
                ))}
              </div>
              <div className="d04g-card-desc">Automatische verslaglegging via AssemblyAI</div>
            </div>

            {/* HR 1x1 */}
            <div className="d04g-card d04g-card--1x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">HR</div>
                <div className="d04g-card-title">Verlof &amp; Verzuim</div>
              </div>
              <div className="d04g-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="d04g-card-desc">Nmbrs koppeling</div>
            </div>

            {/* Analytics 1x1 */}
            <div className="d04g-card d04g-card--1x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">Data</div>
                <div className="d04g-card-title">Analytics</div>
              </div>
              <svg viewBox="0 0 120 50" width="100%" height="50" style={{ marginTop: '10px' }}>
                <defs>
                  <linearGradient id="d04gChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a8c7f" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#4a8c7f" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,40 20,32 40,35 60,18 80,22 100,10 120,14 120,50 0,50"
                  fill="url(#d04gChartGrad)"
                />
                <polyline
                  points="0,40 20,32 40,35 60,18 80,22 100,10 120,14"
                  fill="none"
                  stroke="#4a8c7f"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="d04g-card-desc">Bezetting &amp; productiviteit</div>
            </div>

            {/* Onboarding 2x1 */}
            <div className="d04g-card d04g-card--2x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">Instroom</div>
                <div className="d04g-card-title">Onboarding pipeline</div>
              </div>
              <div className="d04g-pipeline">
                {[0,1,2,3,4,5,6,7,8].map((i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 8 ? 'none' : undefined }}>
                    <div className={`d04g-pipe-dot${i > 5 ? ' d04g-pipe-dot--dim' : ''}`} />
                    {i < 8 && (
                      <div className={`d04g-pipe-line${i < 5 ? ' d04g-pipe-line--active' : ''}`} style={{ width: '100%', minWidth: '20px' }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="d04g-card-desc">Van verwijzing tot eerste sessie, volledig digitaal</div>
            </div>

            {/* Knowledge Base 1x1 */}
            <div className="d04g-card d04g-card--1x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">Kennisbank</div>
                <div className="d04g-card-title">Documenten</div>
              </div>
              <div className="d04g-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
              </div>
              <div className="d04g-card-desc">Protocollen &amp; richtlijnen</div>
            </div>

            {/* Billing 1x1 */}
            <div className="d04g-card d04g-card--1x1">
              <div className="d04g-card-meta">
                <div className="d04g-card-label">Facturering</div>
                <div className="d04g-card-title">Billing</div>
              </div>
              <div className="d04g-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div className="d04g-card-desc">Per-seat billing via Stripe</div>
            </div>

          </div>
        </section>

        <div className="d04g-full-divider" style={{ marginTop: '1px' }} />

        {/* ── AI Spotlight ── */}
        <section className="d04g-spotlight" id="ai">
          <div className="d04g-spotlight-inner">
            <div className="d04g-spotlight-label">AI in de praktijk</div>
            <h2 className="d04g-spotlight-title">
              Vraag het AskMoody — in gewone taal, in het Nederlands.
            </h2>
            <div className="d04g-chat-window">
              <div className="d04g-chat-bar">
                <div className="d04g-chat-dot-r" />
                <div className="d04g-chat-dot-y" />
                <div className="d04g-chat-dot-g" />
                <span className="d04g-chat-bar-title">AskMoody — AI assistent</span>
              </div>
              <div className="d04g-chat-body">
                <div className="d04g-spotlight-user">
                  Laat de declarabiliteit per therapeut zien voor deze week.
                </div>
                <div>
                  <div className="d04g-spotlight-ai-label">AskMoody</div>
                  <div className="d04g-spotlight-ai-output" ref={chatOutputRef} />
                  <span className="d04g-spotlight-cursor" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="d04g-full-divider" />

        {/* ── Workflow Timeline ── */}
        <section id="workflow">
          <div className="d04g-section">
            <div className="d04g-section-label">Zorgproces</div>
            <h2 className="d04g-section-title">Van verwijzing tot afsluiting.</h2>
            <div className="d04g-timeline-wrap">
              <div className="d04g-timeline">
                {[
                  { n: '01', label: 'Verwijzing', desc: 'Digitale aanmelding via verwijzer of cliënt', active: false },
                  { n: '02', label: 'Triage', desc: 'Intake-vragenlijsten & urgentiebeoordeling', active: false },
                  { n: '03', label: 'Matching', desc: 'AI-koppeling aan passende therapeut', active: false },
                  { n: '04', label: 'Intake', desc: 'Videogesprek & dossieropbouw', active: true },
                  { n: '05', label: 'Behandeling', desc: 'Sessies, voortgang & dictaten', active: false },
                  { n: '06', label: 'Afsluiting', desc: 'Rapportage & ROM-uitkomsten', active: false },
                ].map((step, i) => (
                  <div key={i} className="d04g-tl-step">
                    <div className="d04g-tl-connector" />
                    <div className={`d04g-tl-node${step.active ? ' d04g-tl-node--active' : ''}`}>
                      {step.n}
                    </div>
                    <div className="d04g-tl-label">{step.label}</div>
                    <div className="d04g-tl-desc">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="d04g-full-divider" />

        {/* ── Integrations ── */}
        <section id="integrations">
          <div className="d04g-section">
            <div className="d04g-section-label">Koppelingen</div>
            <h2 className="d04g-section-title">Verbonden met uw bestaande tools.</h2>
            <div className="d04g-integrations-grid">
              {([
                { name: 'HCI', desc: 'Elektronisch patiëntendossier', abbr: 'HCI' },
                { name: 'Nmbrs', desc: 'HR & salarisadministratie', abbr: 'NMB' },
                { name: 'Whereby', desc: 'Videoconsultaties', abbr: 'WBY' },
                { name: 'Stripe', desc: 'Betalingen & facturering', abbr: 'STR' },
                { name: 'Anthropic', desc: 'Claude AI taalmodel', abbr: 'ANT' },
                { name: 'AssemblyAI', desc: 'Spraakherkenning', abbr: 'ASM' },
              ] as { name: string; desc: string; abbr: string }[]).map((item, i) => (
                <div key={i} className="d04g-int-item">
                  <div className="d04g-int-logo">{item.abbr}</div>
                  <div className="d04g-int-name">{item.name}</div>
                  <div className="d04g-int-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="d04g-full-divider" />

        {/* ── Pricing ── */}
        <section id="pricing">
          <div className="d04g-section" style={{ paddingBottom: 0 }}>
            <div className="d04g-section-label">Tarieven</div>
            <h2 className="d04g-section-title">Transparante prijzen. Per zorgverlener.</h2>
          </div>
          <div className="d04g-pricing-grid">

            <div className="d04g-price-card">
              <div className="d04g-price-plan">Starter</div>
              <div>
                <div className="d04g-price-amount">€ 49</div>
                <div className="d04g-price-unit">per zorgverlener / maand</div>
              </div>
              <div className="d04g-price-divider" />
              <ul className="d04g-price-features">
                <li>Agenda &amp; afsprakenbeheer</li>
                <li>Cliëntdossier (basis)</li>
                <li>AskMoody AI (beperkt)</li>
                <li>Videogesprekken via Whereby</li>
                <li>E-mail support</li>
              </ul>
              <a href="#" className="d04g-price-cta">Gratis proberen</a>
            </div>

            <div className="d04g-price-card d04g-price-card--featured">
              <div className="d04g-price-badge">Meest gekozen</div>
              <div className="d04g-price-plan">Praktijk</div>
              <div>
                <div className="d04g-price-amount">€ 89</div>
                <div className="d04g-price-unit">per zorgverlener / maand</div>
              </div>
              <div className="d04g-price-divider" />
              <ul className="d04g-price-features">
                <li>Alles in Starter</li>
                <li>Dicteren &amp; automatische verslaglegging</li>
                <li>HR &amp; verlofbeheer (Nmbrs)</li>
                <li>AskMoody AI (onbeperkt)</li>
                <li>Analytics dashboard</li>
                <li>Onboarding pipeline</li>
                <li>Prioriteit support</li>
              </ul>
              <a href="#" className="d04g-price-cta">Demo aanvragen</a>
            </div>

            <div className="d04g-price-card">
              <div className="d04g-price-plan">Organisatie</div>
              <div>
                <div className="d04g-price-amount">Offerte</div>
                <div className="d04g-price-unit">op maat, multi-locatie</div>
              </div>
              <div className="d04g-price-divider" />
              <ul className="d04g-price-features">
                <li>Alles in Praktijk</li>
                <li>HCI EPD koppeling</li>
                <li>Multi-tenant &amp; meerdere locaties</li>
                <li>SSO &amp; SAML</li>
                <li>Dedicated implementatiebegeleiding</li>
                <li>SLA &amp; uptime garantie</li>
              </ul>
              <a href="#" className="d04g-price-cta">Contact opnemen</a>
            </div>

          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="d04g-footer">
          <div className="d04g-footer-inner">
            <div className="d04g-footer-grid">
              <div>
                <div className="d04g-footer-brand">Moods.ai</div>
                <div className="d04g-footer-tagline">
                  Het intelligente platform voor moderne geestelijke gezondheidszorg in Nederland.
                </div>
              </div>
              <div>
                <div className="d04g-footer-col-title">Platform</div>
                <ul className="d04g-footer-links">
                  <li><a href="#">Functies</a></li>
                  <li><a href="#">AskMoody</a></li>
                  <li><a href="#">Workflow</a></li>
                  <li><a href="#">Koppelingen</a></li>
                  <li><a href="#">Beveiliging</a></li>
                </ul>
              </div>
              <div>
                <div className="d04g-footer-col-title">Tarieven</div>
                <ul className="d04g-footer-links">
                  <li><a href="#">Starter</a></li>
                  <li><a href="#">Praktijk</a></li>
                  <li><a href="#">Organisatie</a></li>
                  <li><a href="#">Vergelijken</a></li>
                </ul>
              </div>
              <div>
                <div className="d04g-footer-col-title">Bedrijf</div>
                <ul className="d04g-footer-links">
                  <li><a href="#">Over ons</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Vacatures</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
              <div>
                <div className="d04g-footer-col-title">Juridisch</div>
                <ul className="d04g-footer-links">
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Voorwaarden</a></li>
                  <li><a href="#">AVG</a></li>
                  <li><a href="#">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="d04g-footer-bottom">
              <div className="d04g-footer-copy">© 2026 Moods.ai — Design 04 — The Grid</div>
              <div className="d04g-footer-locale">NL / EUR</div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
