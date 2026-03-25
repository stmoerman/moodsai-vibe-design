export default function Design10() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        /* ─── Remarkable Tribute ───
           Paper-grey surfaces, pencil-stroke accents, deep charcoal ink,
           generous white space, typographic precision.
           No gradients. No rounded corners. No decorative noise.
        ─────────────────────────── */

        .d10 {
          min-height: 100vh;
          background: #EEEAE3;
          font-family: 'Space Mono', monospace;
          display: grid;
          grid-template-rows: 64px 1fr 48px;
          overflow: hidden;
          position: relative;
        }

        /* Subtle paper texture — crosshatch grid like rM's dotted paper */
        .d10-paper {
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(100, 90, 72, 0.18) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          opacity: 0.35;
        }

        /* ── Header ── */
        .d10-header {
          display: grid;
          grid-template-columns: 64px 1fr 64px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .d10-header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 64px; right: 64px;
          height: 1px;
          background: rgba(60, 52, 38, 0.18);
        }

        .d10-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .d10-logo {
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          color: #1C1810;
          text-transform: uppercase;
        }

        .d10-logo span {
          font-weight: 400;
          opacity: 0.45;
        }

        .d10-nav {
          display: flex;
          gap: 32px;
        }

        .d10-nav a {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(28, 24, 16, 0.4);
          text-decoration: none;
          transition: color 0.15s;
        }
        .d10-nav a:hover { color: #1C1810; }

        /* ── Main ── */
        .d10-main {
          display: grid;
          grid-template-columns: 64px 1fr 1px 380px 64px;
          grid-template-rows: 1fr;
          position: relative;
          z-index: 1;
        }

        /* Vertical rule */
        .d10-vline {
          grid-column: 3;
          background: rgba(60, 52, 38, 0.15);
          align-self: stretch;
        }

        /* Left: hero copy */
        .d10-content {
          grid-column: 2;
          padding: 80px 60px 80px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .d10-index {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(28, 24, 16, 0.3);
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .d10-index::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: currentColor;
        }

        .d10-headline {
          font-family: 'Crimson Pro', serif;
          font-weight: 300;
          font-size: clamp(3rem, 6vw, 5.2rem);
          color: #1C1810;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 0;
        }

        .d10-headline-line2 {
          font-family: 'Crimson Pro', serif;
          font-weight: 300;
          font-style: italic;
          font-size: clamp(3rem, 6vw, 5.2rem);
          color: #1C1810;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 0;
          opacity: 0.45;
        }

        .d10-headline-line3 {
          font-family: 'Crimson Pro', serif;
          font-weight: 300;
          font-size: clamp(3rem, 6vw, 5.2rem);
          color: #1C1810;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 48px;
        }

        .d10-sub {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          font-weight: 400;
          color: rgba(28, 24, 16, 0.5);
          line-height: 1.9;
          max-width: 380px;
          margin-bottom: 52px;
          letter-spacing: 0.02em;
        }

        .d10-actions {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .d10-btn {
          display: inline-block;
          background: #1C1810;
          color: #EEEAE3;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 13px 28px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .d10-btn:hover { background: #3A3428; }

        .d10-btn-ghost {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(28, 24, 16, 0.4);
          text-decoration: none;
          border-bottom: 1px solid rgba(28, 24, 16, 0.2);
          padding-bottom: 2px;
          transition: color 0.15s, border-color 0.15s;
        }
        .d10-btn-ghost:hover { color: #1C1810; border-color: rgba(28,24,16,0.5); }

        /* Right: "paper page" UI mockup */
        .d10-panel {
          grid-column: 4;
          padding: 60px 0 60px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }

        /* Mimics the rM's page view */
        .d10-page-mock {
          background: #F8F5EE;
          border: 1px solid rgba(60, 52, 38, 0.15);
          padding: 32px 28px;
          position: relative;
        }

        /* Top margin rule */
        .d10-page-mock::before {
          content: '';
          position: absolute;
          top: 52px; left: 28px; right: 28px;
          height: 1px;
          background: rgba(196, 168, 120, 0.3);
        }

        .d10-page-meta {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(28, 24, 16, 0.25);
          margin-bottom: 28px;
          display: flex;
          justify-content: space-between;
        }

        /* Simulated handwriting lines */
        .d10-hline {
          height: 1px;
          background: rgba(60, 52, 38, 0.08);
          margin-bottom: 28px;
          position: relative;
        }

        .d10-hline-text {
          position: absolute;
          top: -9px;
          left: 0;
          font-family: 'Crimson Pro', serif;
          font-style: italic;
          font-size: 0.88rem;
          color: rgba(28, 24, 16, 0.55);
          line-height: 1;
          letter-spacing: 0.01em;
        }

        .d10-hline-text.dim { color: rgba(28, 24, 16, 0.3); }
        .d10-hline-text.live { color: #1C1810; }

        .d10-page-cursor {
          display: inline-block;
          width: 1px;
          height: 0.9em;
          background: #1C1810;
          vertical-align: text-bottom;
          margin-left: 1px;
          animation: d10blink 0.9s step-end infinite;
        }
        @keyframes d10blink { 50% { opacity: 0; } }

        /* Active recording indicator */
        .d10-rec-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(60, 52, 38, 0.08);
        }

        .d10-rec-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #1C1810;
          animation: d10rec 1.6s ease-in-out infinite;
        }
        @keyframes d10rec { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .d10-rec-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(28, 24, 16, 0.35);
        }

        /* ── Footer ── */
        .d10-footer {
          display: grid;
          grid-template-columns: 64px 1fr 64px;
          align-items: center;
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(60, 52, 38, 0.15);
        }

        .d10-footer-inner {
          display: flex;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(28, 24, 16, 0.3);
        }

        /* ── Entrance animations ── */
        .d10-index, .d10-headline, .d10-headline-line2, .d10-headline-line3,
        .d10-sub, .d10-actions {
          opacity: 0;
          animation: d10in 0.65s ease forwards;
        }
        .d10-index          { animation-delay: 0.05s; }
        .d10-headline       { animation-delay: 0.18s; }
        .d10-headline-line2 { animation-delay: 0.26s; }
        .d10-headline-line3 { animation-delay: 0.34s; }
        .d10-sub            { animation-delay: 0.46s; }
        .d10-actions        { animation-delay: 0.58s; }

        .d10-page-mock {
          opacity: 0;
          animation: d10slide 0.7s ease 0.3s forwards;
        }

        @keyframes d10in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes d10slide {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 900px) {
          .d10-main {
            grid-template-columns: 24px 1fr 24px;
          }
          .d10-vline, .d10-panel { display: none; }
          .d10-content { grid-column: 2; padding-right: 0; }
        }
      `}</style>
      <div className="d10">
        <div className="d10-paper" />

        <header className="d10-header">
          <div className="d10-header-inner">
            <div className="d10-logo">Moots<span>.ai</span></div>
            <nav className="d10-nav">
              <a href="#">Product</a>
              <a href="#">Pricing</a>
              <a href="#">Sign in</a>
            </nav>
          </div>
        </header>

        <main className="d10-main">
          <div className="d10-content">
            <div className="d10-index">The paper for your spoken words</div>
            <div className="d10-headline">Transcription</div>
            <div className="d10-headline-line2">as precise</div>
            <div className="d10-headline-line3">as paper.</div>
            <p className="d10-sub">
              Live during your video calls.<br />
              Offline when you record on your phone.<br />
              Uploaded when you're ready.
            </p>
            <div className="d10-actions">
              <a href="#" className="d10-btn">Start writing</a>
              <a href="#" className="d10-btn-ghost">See demo</a>
            </div>
          </div>

          <div className="d10-vline" />

          <div className="d10-panel">
            <div className="d10-page-mock">
              <div className="d10-page-meta">
                <span>moots.ai</span>
                <span>Live · 00:04:32</span>
              </div>

              <div className="d10-hline">
                <span className="d10-hline-text dim">"Let's talk about the roadmap for Q4—"</span>
              </div>
              <div className="d10-hline">
                <span className="d10-hline-text dim">"I think we should start with the API layer."</span>
              </div>
              <div className="d10-hline">
                <span className="d10-hline-text dim">"Agreed. And we'll need to revisit pricing."</span>
              </div>
              <div className="d10-hline">
                <span className="d10-hline-text live">"Right. So the question is whether we go—"<span className="d10-page-cursor" /></span>
              </div>
              <div className="d10-hline" style={{marginBottom:0}} />

              <div className="d10-rec-bar">
                <span className="d10-rec-dot" />
                <span className="d10-rec-label">Transcribing · 3 speakers detected</span>
              </div>
            </div>
          </div>
        </main>

        <footer className="d10-footer">
          <div className="d10-footer-inner">
            <span>Design 10 — Remarkable</span>
            <span>Live · Offline · Private</span>
          </div>
        </footer>
      </div>
    </>
  )
}
