export default function Design05() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Jost:wght@200;300;400&display=swap');

        .d05 {
          min-height: 100vh;
          background: #DEC4A8;
          display: grid;
          grid-template-rows: auto 1fr auto;
          font-family: 'Jost', sans-serif;
          overflow: hidden;
        }

        .d05-nav {
          padding: 32px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(90, 50, 20, 0.15);
        }

        .d05-logo {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 1.1rem;
          color: #3A1E08;
          letter-spacing: -0.01em;
        }

        .d05-nav-links {
          display: flex;
          gap: 32px;
        }

        .d05-nav-links a {
          font-weight: 200;
          font-size: 0.75rem;
          color: rgba(58, 30, 8, 0.6);
          text-decoration: none;
          letter-spacing: 0.08em;
          transition: color 0.2s;
        }
        .d05-nav-links a:hover { color: #3A1E08; }

        .d05-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
        }

        @media (max-width: 768px) {
          .d05-hero { grid-template-columns: 1fr; }
          .d05-visual { display: none; }
        }

        .d05-content {
          padding: 72px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .d05-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 300;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(58, 30, 8, 0.55);
          margin-bottom: 28px;
        }

        .d05-tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #B8501A;
        }

        .d05-headline {
          font-family: 'Fraunces', serif;
          font-weight: 300;
          font-size: clamp(2.8rem, 5.5vw, 4.8rem);
          color: #3A1E08;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
        }

        .d05-headline em {
          font-style: italic;
          display: block;
          color: #B8501A;
        }

        .d05-body {
          font-weight: 200;
          font-size: 0.9rem;
          color: rgba(58, 30, 8, 0.65);
          line-height: 1.8;
          max-width: 360px;
          margin-bottom: 40px;
        }

        .d05-row {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .d05-btn {
          background: #3A1E08;
          color: #DEC4A8;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          padding: 13px 28px;
          border-radius: 3px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .d05-btn:hover { background: #B8501A; }

        .d05-link {
          font-weight: 200;
          font-size: 0.75rem;
          color: rgba(58, 30, 8, 0.5);
          text-decoration: none;
          border-bottom: 1px solid rgba(58, 30, 8, 0.2);
          padding-bottom: 1px;
        }

        .d05-visual {
          background: #3A1E08;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Big decorative circle */
        .d05-circle {
          width: 500px; height: 500px;
          border-radius: 50%;
          border: 1px solid rgba(222, 196, 168, 0.08);
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .d05-circle-inner {
          width: 320px; height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(222, 196, 168, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .d05-circle-core {
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184, 80, 26, 0.4) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .d05-mic-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .d05-visual-label {
          position: absolute;
          bottom: 48px;
          left: 48px;
          font-family: 'Jost', sans-serif;
          font-weight: 200;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(222, 196, 168, 0.35);
        }

        .d05-footer {
          padding: 20px 48px;
          border-top: 1px solid rgba(90, 50, 20, 0.15);
          font-weight: 200;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(58, 30, 8, 0.35);
          display: flex;
          justify-content: space-between;
        }

        /* Entrance */
        .d05-content > * {
          opacity: 0;
          animation: d05in 0.6s ease forwards;
        }
        .d05-tag      { animation-delay: 0.1s; }
        .d05-headline { animation-delay: 0.22s; }
        .d05-body     { animation-delay: 0.36s; }
        .d05-row      { animation-delay: 0.48s; }

        @keyframes d05in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="d05">
        <nav className="d05-nav">
          <div className="d05-logo">moots.ai</div>
          <div className="d05-nav-links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Sign in</a>
          </div>
        </nav>
        <div className="d05-hero">
          <div className="d05-content">
            <div className="d05-tag">
              <span className="d05-tag-dot" />
              Now in early access
            </div>
            <h1 className="d05-headline">
              Transcription<br />
              <em>built for the field.</em>
            </h1>
            <p className="d05-body">
              Record during live video calls or on your phone. Upload offline recordings later. Every word, captured.
            </p>
            <div className="d05-row">
              <a href="#" className="d05-btn">Request access</a>
              <a href="#" className="d05-link">See demo</a>
            </div>
          </div>
          <div className="d05-visual">
            <div className="d05-circle">
              <div className="d05-circle-inner">
                <div className="d05-circle-core">
                  <span className="d05-mic-icon">◉</span>
                </div>
              </div>
            </div>
            <div className="d05-visual-label">Listening actively</div>
          </div>
        </div>
        <div className="d05-footer">
          <span>Design 05 — Terracotta</span>
          <span>Live · Offline · Private</span>
        </div>
      </div>
    </>
  )
}
