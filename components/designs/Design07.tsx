export default function Design07() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=IBM+Plex+Mono:wght@300;400&display=swap');

        .d07 {
          min-height: 100vh;
          background: #F9F5EE;
          font-family: 'EB Garamond', serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          position: relative;
        }

        /* Paper edge effect */
        .d07::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(to right, #C4A870, #E8D4A8, #C4A870);
          opacity: 0.5;
        }

        .d07-page {
          max-width: 620px;
          width: 100%;
        }

        .d07-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 20px;
          border-bottom: 2px solid #2C2010;
          margin-bottom: 48px;
        }

        .d07-title {
          font-size: 0.7rem;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(44, 32, 16, 0.5);
          text-transform: uppercase;
        }

        .d07-date {
          font-size: 0.7rem;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 300;
          letter-spacing: 0.06em;
          color: rgba(44, 32, 16, 0.4);
        }

        .d07-wordmark {
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-weight: 400;
          color: #2C2010;
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
        }

        .d07-wordmark span {
          font-style: italic;
          color: #8B6914;
        }

        .d07-tagline {
          font-size: 1.05rem;
          font-style: italic;
          color: rgba(44, 32, 16, 0.55);
          margin-bottom: 40px;
          letter-spacing: 0.01em;
        }

        .d07-body-text {
          font-size: 1.02rem;
          line-height: 1.85;
          color: #3A2C18;
          margin-bottom: 36px;
          column-count: 1;
        }

        .d07-body-text strong {
          font-weight: 500;
          color: #2C2010;
        }

        .d07-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 36px 0;
          color: rgba(44, 32, 16, 0.25);
        }

        .d07-divider::before,
        .d07-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(44, 32, 16, 0.15);
        }

        .d07-divider-sym {
          font-size: 0.9rem;
        }

        .d07-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 44px;
        }

        .d07-feat {
          padding: 20px;
          border: 1px solid rgba(44, 32, 16, 0.1);
          background: rgba(255, 252, 248, 0.6);
        }

        .d07-feat-head {
          font-size: 0.7rem;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 300;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8B6914;
          margin-bottom: 8px;
        }

        .d07-feat-body {
          font-size: 0.88rem;
          color: rgba(44, 32, 16, 0.65);
          line-height: 1.6;
          font-style: italic;
        }

        .d07-cta-row {
          display: flex;
          gap: 20px;
          align-items: baseline;
        }

        .d07-cta {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 400;
          font-size: 0.76rem;
          letter-spacing: 0.08em;
          color: #F9F5EE;
          background: #2C2010;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 2px;
          transition: background 0.2s;
        }
        .d07-cta:hover { background: #8B6914; }

        .d07-secondary {
          font-size: 0.88rem;
          font-style: italic;
          color: rgba(44, 32, 16, 0.5);
          border-bottom: 1px solid rgba(139, 105, 20, 0.3);
          text-decoration: none;
          transition: color 0.2s;
          padding-bottom: 1px;
        }
        .d07-secondary:hover { color: #8B6914; }

        .d07-footer {
          margin-top: 52px;
          padding-top: 16px;
          border-top: 1px solid rgba(44, 32, 16, 0.12);
          display: flex;
          justify-content: space-between;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 300;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          color: rgba(44, 32, 16, 0.3);
        }

        /* Entrance */
        .d07-page > * {
          opacity: 0;
          animation: d07in 0.6s ease forwards;
        }
        .d07-header   { animation-delay: 0.05s; }
        .d07-wordmark { animation-delay: 0.18s; }
        .d07-tagline  { animation-delay: 0.28s; }
        .d07-body-text { animation-delay: 0.36s; }
        .d07-divider  { animation-delay: 0.44s; }
        .d07-features { animation-delay: 0.5s; }
        .d07-cta-row  { animation-delay: 0.6s; }
        .d07-footer   { animation-delay: 0.7s; }

        @keyframes d07in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
      <div className="d07">
        <div className="d07-page">
          <div className="d07-header">
            <span className="d07-title">Product · Transcription</span>
            <span className="d07-date">V. 0.1 · 2025</span>
          </div>
          <div className="d07-wordmark">Moods<span>.ai</span></div>
          <div className="d07-tagline">The art of transcription, quietly perfected.</div>
          <p className="d07-body-text">
            Some conversations deserve to be remembered exactly as they happened. <strong>Moods</strong> transcribes live during your video calls and offline when you record on your phone — no setup, no noise, no compromise.
          </p>
          <div className="d07-divider">
            <span className="d07-divider-sym">✦</span>
          </div>
          <div className="d07-features">
            <div className="d07-feat">
              <div className="d07-feat-head">I. Live</div>
              <div className="d07-feat-body">Real-time transcription running inside any video call, silently.</div>
            </div>
            <div className="d07-feat">
              <div className="d07-feat-head">II. Offline</div>
              <div className="d07-feat-body">Record on your phone, upload when ready. No rush.</div>
            </div>
          </div>
          <div className="d07-cta-row">
            <a href="#" className="d07-cta">Begin</a>
            <a href="#" className="d07-secondary">Read the story</a>
          </div>
          <div className="d07-footer">
            <span>Design 07 — Manuscript</span>
            <span>moods.ai</span>
          </div>
        </div>
      </div>
    </>
  )
}
