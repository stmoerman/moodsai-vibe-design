export default function Design06() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

        .d06 {
          min-height: 100vh;
          background: #F4F2ED;
          font-family: 'Syne', sans-serif;
          display: grid;
          grid-template-rows: 72px 1fr 72px;
          overflow: hidden;
        }

        .d06-header {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 56px;
          border-bottom: 1px solid rgba(60, 55, 45, 0.12);
        }

        .d06-logo {
          font-weight: 600;
          font-size: 0.88rem;
          letter-spacing: 0.04em;
          color: #1E1C18;
        }

        .d06-header-center {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(60, 55, 45, 0.4);
        }

        .d06-header-right {
          display: flex;
          justify-content: flex-end;
          gap: 28px;
        }

        .d06-header-right a {
          font-size: 0.7rem;
          font-weight: 400;
          color: rgba(30, 28, 24, 0.5);
          text-decoration: none;
          letter-spacing: 0.06em;
          transition: color 0.2s;
        }
        .d06-header-right a:hover { color: #1E1C18; }

        /* Main hero — precise grid layout */
        .d06-main {
          display: grid;
          grid-template-columns: 56px 1fr 1px 1fr 56px;
          grid-template-rows: auto;
        }

        .d06-col-left {
          grid-column: 2;
          padding: 64px 48px 64px 0;
          border-right: 1px solid rgba(60, 55, 45, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .d06-col-right {
          grid-column: 4;
          padding: 64px 0 64px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .d06-year {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(60, 55, 45, 0.35);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .d06-year::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: currentColor;
        }

        .d06-headline {
          font-family: 'Libre Baskerville', serif;
          font-weight: 400;
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          color: #1E1C18;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin-bottom: 36px;
        }

        .d06-headline em {
          font-style: italic;
          color: #6A8060;
        }

        .d06-body {
          font-family: 'Syne', sans-serif;
          font-weight: 400;
          font-size: 0.86rem;
          color: rgba(30, 28, 24, 0.55);
          line-height: 1.8;
          max-width: 320px;
          margin-bottom: 44px;
        }

        .d06-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #1E1C18;
          color: #F4F2ED;
          font-family: 'Syne', sans-serif;
          font-weight: 500;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          padding: 13px 24px;
          text-decoration: none;
          border-radius: 2px;
          width: fit-content;
          transition: background 0.2s;
        }
        .d06-cta:hover { background: #6A8060; }

        .d06-cta-arrow { font-size: 1rem; transition: transform 0.2s; }
        .d06-cta:hover .d06-cta-arrow { transform: translateX(4px); }

        /* Right column content */
        .d06-stat-block {
          padding: 32px;
          background: rgba(106, 128, 96, 0.07);
          border: 1px solid rgba(106, 128, 96, 0.15);
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .d06-stat-num {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.8rem;
          color: #1E1C18;
          line-height: 1;
          margin-bottom: 6px;
        }

        .d06-stat-label {
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(30, 28, 24, 0.45);
        }

        .d06-feat-list {
          list-style: none;
        }

        .d06-feat-list li {
          font-size: 0.78rem;
          color: rgba(30, 28, 24, 0.6);
          padding: 11px 0;
          border-bottom: 1px solid rgba(60, 55, 45, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 0.03em;
        }

        .d06-feat-list li:last-child { border-bottom: none; }

        .d06-feat-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #6A8060;
          flex-shrink: 0;
        }

        .d06-footer {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 56px;
          border-top: 1px solid rgba(60, 55, 45, 0.12);
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(60, 55, 45, 0.35);
        }

        @media (max-width: 768px) {
          .d06-main { grid-template-columns: 24px 1fr 24px; }
          .d06-col-left { grid-column: 2; border-right: none; padding-right: 0; }
          .d06-col-right { display: none; }
        }

        .d06-col-left > * {
          opacity: 0;
          animation: d06in 0.65s ease forwards;
        }
        .d06-year     { animation-delay: 0.1s; }
        .d06-headline { animation-delay: 0.2s; }
        .d06-body     { animation-delay: 0.32s; }
        .d06-cta      { animation-delay: 0.44s; }

        @keyframes d06in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="d06">
        <header className="d06-header">
          <div className="d06-logo">Moots.ai</div>
          <div className="d06-header-center">Transcription</div>
          <div className="d06-header-right">
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Sign in</a>
          </div>
        </header>
        <main className="d06-main">
          <div className="d06-col-left">
            <div className="d06-year">2025 · Early access</div>
            <h1 className="d06-headline">
              The quiet art<br />of <em>listening</em><br />precisely.
            </h1>
            <p className="d06-body">
              Live transcription during video calls. Offline recording you upload later. Clean, private, precise.
            </p>
            <a href="#" className="d06-cta">
              Get access <span className="d06-cta-arrow">→</span>
            </a>
          </div>
          <div className="d06-col-right">
            <div className="d06-stat-block">
              <div className="d06-stat-num">99%</div>
              <div className="d06-stat-label">Accuracy rate</div>
            </div>
            <ul className="d06-feat-list">
              <li><span className="d06-feat-dot" />Live transcription in video calls</li>
              <li><span className="d06-feat-dot" />Phone recording, upload offline</li>
              <li><span className="d06-feat-dot" />Speaker identification</li>
              <li><span className="d06-feat-dot" />Private and GDPR compliant</li>
            </ul>
          </div>
        </main>
        <footer className="d06-footer">
          <span>Design 06 — Nordic</span>
          <span>moots.ai</span>
          <span style={{textAlign:'right'}}>Live · Offline · Private</span>
        </footer>
      </div>
    </>
  )
}
