export default function Design08() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,300;0,400;1,300;1,400&family=Nunito+Sans:wght@200;300;400&display=swap');

        .d08 {
          min-height: 100vh;
          background: #F7F3EC;
          font-family: 'Nunito Sans', sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Horizontal band structure — signature element */
        .d08-band-top {
          background: #EDE6D8;
          height: 5px;
          flex-shrink: 0;
        }

        .d08-band-header {
          flex-shrink: 0;
          padding: 0 56px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(100, 80, 55, 0.1);
        }

        .d08-logo {
          font-family: 'Noto Serif', serif;
          font-weight: 400;
          font-size: 1rem;
          color: #2A2218;
          letter-spacing: 0.02em;
        }

        .d08-logo span {
          font-style: italic;
          color: #8C7252;
        }

        .d08-nav {
          display: flex;
          gap: 24px;
        }

        .d08-nav a {
          font-weight: 200;
          font-size: 0.72rem;
          color: rgba(42, 34, 24, 0.45);
          text-decoration: none;
          letter-spacing: 0.06em;
          transition: color 0.2s;
        }
        .d08-nav a:hover { color: #2A2218; }

        /* Main content area */
        .d08-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px;
        }

        .d08-content {
          max-width: 680px;
          width: 100%;
        }

        /* Washi stripe decoration */
        .d08-stripe {
          width: 56px;
          height: 3px;
          background: #8C7252;
          margin-bottom: 36px;
          opacity: 0.6;
        }

        .d08-headline {
          font-family: 'Noto Serif', serif;
          font-weight: 300;
          font-size: clamp(2.4rem, 5.5vw, 4.5rem);
          color: #2A2218;
          line-height: 1.22;
          letter-spacing: -0.01em;
          margin-bottom: 36px;
        }

        .d08-headline em {
          font-style: italic;
          font-weight: 300;
          color: #8C7252;
        }

        /* Two-column lower content */
        .d08-lower {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-top: 48px;
          padding-top: 36px;
          border-top: 1px solid rgba(100, 80, 55, 0.12);
        }

        @media (max-width: 640px) {
          .d08-lower { grid-template-columns: 1fr; gap: 24px; }
        }

        .d08-col-desc {
          font-weight: 200;
          font-size: 0.9rem;
          color: rgba(42, 34, 24, 0.6);
          line-height: 1.85;
        }

        .d08-col-action {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .d08-mode {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(100, 80, 55, 0.08);
        }

        .d08-mode:last-child { border-bottom: none; }

        .d08-mode-num {
          font-family: 'Noto Serif', serif;
          font-size: 0.72rem;
          color: #8C7252;
          margin-top: 2px;
          flex-shrink: 0;
          width: 24px;
        }

        .d08-mode-title {
          font-weight: 300;
          font-size: 0.82rem;
          color: #2A2218;
          margin-bottom: 3px;
        }

        .d08-mode-desc {
          font-weight: 200;
          font-size: 0.75rem;
          color: rgba(42, 34, 24, 0.5);
          line-height: 1.5;
        }

        /* Bottom bands */
        .d08-band-cta {
          background: #2A2218;
          padding: 32px 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .d08-cta-text {
          font-family: 'Noto Serif', serif;
          font-weight: 300;
          font-style: italic;
          font-size: 1.05rem;
          color: rgba(247, 243, 236, 0.7);
        }

        .d08-cta-btn {
          font-family: 'Nunito Sans', sans-serif;
          font-weight: 300;
          font-size: 0.76rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #F7F3EC;
          border: 1px solid rgba(247, 243, 236, 0.25);
          padding: 11px 28px;
          text-decoration: none;
          border-radius: 2px;
          transition: border-color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .d08-cta-btn:hover { background: rgba(247, 243, 236, 0.08); border-color: rgba(247, 243, 236, 0.4); }

        .d08-band-bottom {
          background: #EDE6D8;
          height: 5px;
          flex-shrink: 0;
        }

        .d08-band-foot {
          padding: 16px 56px;
          display: flex;
          justify-content: space-between;
          font-weight: 200;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(42, 34, 24, 0.3);
        }

        /* Entrance */
        .d08-stripe, .d08-headline, .d08-lower {
          opacity: 0;
          animation: d08in 0.7s ease forwards;
        }
        .d08-stripe  { animation-delay: 0.1s; }
        .d08-headline { animation-delay: 0.25s; }
        .d08-lower   { animation-delay: 0.45s; }

        @keyframes d08in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="d08">
        <div className="d08-band-top" />
        <header className="d08-band-header">
          <div className="d08-logo">Moots<span>.ai</span></div>
          <nav className="d08-nav">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Sign in</a>
          </nav>
        </header>
        <main className="d08-main">
          <div className="d08-content">
            <div className="d08-stripe" />
            <h1 className="d08-headline">
              Every voice<br />
              deserves a <em>faithful</em><br />
              record.
            </h1>
            <div className="d08-lower">
              <p className="d08-col-desc">
                Moots transcribes your conversations with the care and precision they deserve. Live during video calls, or from recordings made on your phone — later, when the time is right.
              </p>
              <div className="d08-col-action">
                <div className="d08-mode">
                  <span className="d08-mode-num">一</span>
                  <div>
                    <div className="d08-mode-title">Live transcription</div>
                    <div className="d08-mode-desc">Real-time, during any video call</div>
                  </div>
                </div>
                <div className="d08-mode">
                  <span className="d08-mode-num">二</span>
                  <div>
                    <div className="d08-mode-title">Offline recording</div>
                    <div className="d08-mode-desc">Record on phone, upload to Moots</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className="d08-band-cta">
          <span className="d08-cta-text">Begin your first transcription.</span>
          <a href="#" className="d08-cta-btn">Get early access</a>
        </div>
        <div className="d08-band-bottom" />
        <div className="d08-band-foot">
          <span>Design 08 — Washi</span>
          <span>moots.ai</span>
        </div>
      </div>
    </>
  )
}
