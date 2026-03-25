export default function Design03() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@200;300;400&display=swap');

        .d03 {
          min-height: 100vh;
          background: #130E07;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        /* Radial warm glow */
        .d03::before {
          content: '';
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200, 130, 30, 0.12) 0%, rgba(180, 80, 20, 0.06) 40%, transparent 70%);
          pointer-events: none;
        }

        /* Subtle vignette */
        .d03::after {
          content: '';
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%);
          pointer-events: none;
        }

        .d03-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 580px;
        }

        .d03-mark {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(200, 160, 80, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 40px;
        }

        .d03-mark-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C8A040;
          animation: d03pulse 2.5s ease-in-out infinite;
        }

        @keyframes d03pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .d03-logo {
          font-family: 'Outfit', sans-serif;
          font-weight: 200;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(200, 160, 80, 0.6);
          margin-bottom: 48px;
        }

        .d03-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          color: #F0E4C8;
          line-height: 1.18;
          letter-spacing: -0.01em;
          margin-bottom: 32px;
        }

        .d03-headline em {
          font-style: italic;
          color: #C8A040;
        }

        .d03-sub {
          font-family: 'Outfit', sans-serif;
          font-weight: 200;
          font-size: 0.95rem;
          color: rgba(220, 200, 160, 0.55);
          line-height: 1.7;
          margin-bottom: 56px;
          letter-spacing: 0.02em;
        }

        .d03-pills {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 52px;
        }

        .d03-pill {
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: rgba(200, 160, 80, 0.7);
          border: 1px solid rgba(200, 160, 80, 0.2);
          border-radius: 100px;
          padding: 7px 18px;
        }

        .d03-cta {
          display: inline-block;
          background: linear-gradient(135deg, #C8A040, #A87828);
          color: #130E07;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 15px 40px;
          border-radius: 2px;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
        }

        .d03-cta:hover { opacity: 0.85; transform: translateY(-1px); }

        .d03-footer {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-weight: 200;
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(200, 160, 80, 0.3);
          z-index: 2;
        }

        /* Entrance animations */
        .d03-inner > * {
          opacity: 0;
          animation: d03in 0.8s ease forwards;
        }
        .d03-mark   { animation-delay: 0.1s; }
        .d03-logo   { animation-delay: 0.25s; }
        .d03-headline { animation-delay: 0.4s; }
        .d03-sub    { animation-delay: 0.55s; }
        .d03-pills  { animation-delay: 0.65s; }
        .d03-cta    { animation-delay: 0.78s; }

        @keyframes d03in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="d03">
        <div className="d03-inner">
          <div className="d03-mark">
            <div className="d03-mark-dot" />
          </div>
          <div className="d03-logo">moods · ai</div>
          <h1 className="d03-headline">
            Transcription<br />as <em>quiet</em> as<br />candlelight.
          </h1>
          <p className="d03-sub">
            Live in your meetings. Ready when you're offline.<br />
            Your words, word for word.
          </p>
          <div className="d03-pills">
            <span className="d03-pill">Live calls</span>
            <span className="d03-pill">Phone recording</span>
            <span className="d03-pill">Offline upload</span>
          </div>
          <a href="#" className="d03-cta">Try Moods free</a>
        </div>
        <div className="d03-footer">Design 03 — Candlelight</div>
      </div>
    </>
  )
}
