export default function Design01() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Lato:wght@300;400&display=swap');

        .d01 {
          min-height: 100vh;
          background: #F6F1E7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grain texture overlay */
        .d01::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
          z-index: 0;
        }

        .d01-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 640px;
        }

        .d01-eyebrow {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #A08C6A;
          margin-bottom: 40px;
        }

        .d01-wordmark {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(3.5rem, 10vw, 7rem);
          color: #2C2010;
          letter-spacing: -0.03em;
          line-height: 0.9;
          margin-bottom: 8px;
        }

        .d01-wordmark span {
          color: #B8963A;
        }

        .d01-rule {
          width: 48px;
          height: 1px;
          background: #C4A86A;
          margin: 32px auto;
        }

        .d01-headline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-style: italic;
          font-size: clamp(1.1rem, 2.5vw, 1.45rem);
          color: #4A3A26;
          line-height: 1.6;
          margin-bottom: 40px;
          letter-spacing: 0.01em;
        }

        .d01-features {
          display: flex;
          gap: 40px;
          justify-content: center;
          margin-bottom: 52px;
          flex-wrap: wrap;
        }

        .d01-feat {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.78rem;
          color: #8B7355;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .d01-feat::before {
          content: '—';
          color: #C4A86A;
        }

        .d01-cta {
          display: inline-block;
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2C2010;
          border: 1px solid #C4A86A;
          padding: 14px 36px;
          text-decoration: none;
          transition: background 0.25s, color 0.25s;
        }

        .d01-cta:hover {
          background: #2C2010;
          color: #F6F1E7;
          border-color: #2C2010;
        }

        .d01-footer {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C4A86A;
          opacity: 0.6;
          z-index: 1;
        }

        /* Animation */
        .d01-inner > * {
          opacity: 0;
          transform: translateY(12px);
          animation: d01fade 0.7s ease forwards;
        }
        .d01-eyebrow { animation-delay: 0.1s; }
        .d01-wordmark { animation-delay: 0.25s; }
        .d01-rule { animation-delay: 0.4s; }
        .d01-headline { animation-delay: 0.5s; }
        .d01-features { animation-delay: 0.6s; }
        .d01-cta { animation-delay: 0.72s; }

        @keyframes d01fade {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="d01">
        <div className="d01-inner">
          <div className="d01-eyebrow">Transcription reimagined</div>
          <div className="d01-wordmark">Moods<span>.</span>ai</div>
          <div className="d01-rule" />
          <div className="d01-headline">
            Every word deserves to be remembered.<br />
            Live, or when the moment has passed.
          </div>
          <div className="d01-features">
            <span className="d01-feat">Live transcription</span>
            <span className="d01-feat">Offline recording</span>
            <span className="d01-feat">Private by design</span>
          </div>
          <a href="#" className="d01-cta">Begin listening</a>
        </div>
        <div className="d01-footer">Design 01 — Parchment</div>
      </div>
    </>
  )
}
