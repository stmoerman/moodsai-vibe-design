export default function Design04() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@200;300;400&display=swap');

        .d04 {
          min-height: 100vh;
          background: #EDE8E0;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Layered fog blobs */
        .d04-blob1 {
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200, 185, 160, 0.5) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: d04drift1 12s ease-in-out infinite alternate;
        }
        .d04-blob2 {
          position: fixed;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(185, 165, 140, 0.4) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation: d04drift2 15s ease-in-out infinite alternate;
        }
        .d04-blob3 {
          position: fixed;
          width: 400px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(215, 200, 175, 0.35) 0%, transparent 70%);
          top: 30%; left: 30%;
          animation: d04drift3 18s ease-in-out infinite alternate;
        }

        @keyframes d04drift1 { to { transform: translate(60px, 40px); } }
        @keyframes d04drift2 { to { transform: translate(-50px, -30px); } }
        @keyframes d04drift3 { to { transform: translate(30px, -40px) scale(1.1); } }

        .d04-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 40px;
        }

        .d04-logo {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 200;
          font-size: 0.7rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(80, 65, 48, 0.5);
          margin-bottom: 56px;
        }

        .d04-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 400;
          color: #2E2418;
          line-height: 1.12;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
        }

        .d04-headline span {
          font-style: italic;
          color: #7A6850;
        }

        .d04-rule {
          width: 1px;
          height: 56px;
          background: linear-gradient(to bottom, transparent, #C4A88A, transparent);
          margin: 0 auto 28px;
        }

        .d04-sub {
          font-weight: 200;
          font-size: 0.92rem;
          color: rgba(60, 46, 32, 0.6);
          line-height: 1.8;
          max-width: 400px;
          margin: 0 auto 48px;
          letter-spacing: 0.02em;
        }

        /* Frosted glass cards */
        .d04-cards {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 52px;
        }

        .d04-card {
          background: rgba(255, 252, 248, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 252, 248, 0.6);
          border-radius: 12px;
          padding: 20px 24px;
          text-align: left;
          min-width: 160px;
        }

        .d04-card-icon {
          font-size: 1.1rem;
          margin-bottom: 10px;
          opacity: 0.7;
        }

        .d04-card-title {
          font-size: 0.8rem;
          font-weight: 400;
          color: #2E2418;
          margin-bottom: 4px;
        }

        .d04-card-desc {
          font-size: 0.7rem;
          font-weight: 200;
          color: rgba(60, 46, 32, 0.55);
          line-height: 1.5;
        }

        .d04-cta {
          display: inline-block;
          background: rgba(46, 36, 24, 0.08);
          backdrop-filter: blur(8px);
          color: #2E2418;
          font-weight: 300;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          padding: 14px 36px;
          border-radius: 100px;
          text-decoration: none;
          border: 1px solid rgba(46, 36, 24, 0.14);
          transition: background 0.25s;
        }
        .d04-cta:hover { background: rgba(46, 36, 24, 0.14); }

        .d04-footer {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-weight: 200;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(80, 65, 48, 0.35);
          z-index: 2;
        }

        .d04-inner > * {
          opacity: 0;
          animation: d04up 0.7s ease forwards;
        }
        .d04-logo   { animation-delay: 0.1s; }
        .d04-headline { animation-delay: 0.25s; }
        .d04-rule   { animation-delay: 0.4s; }
        .d04-sub    { animation-delay: 0.48s; }
        .d04-cards  { animation-delay: 0.58s; }
        .d04-cta    { animation-delay: 0.7s; }

        @keyframes d04up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="d04">
        <div className="d04-blob1" />
        <div className="d04-blob2" />
        <div className="d04-blob3" />
        <div className="d04-inner">
          <div className="d04-logo">moots.ai</div>
          <h1 className="d04-headline">
            Hear everything.<br /><span>Miss nothing.</span>
          </h1>
          <div className="d04-rule" />
          <p className="d04-sub">
            Transcription that moves with you — live during your calls, offline when you record on your phone.
          </p>
          <div className="d04-cards">
            <div className="d04-card">
              <div className="d04-card-icon">◎</div>
              <div className="d04-card-title">Live transcription</div>
              <div className="d04-card-desc">Runs inside any video call in real time</div>
            </div>
            <div className="d04-card">
              <div className="d04-card-icon">◈</div>
              <div className="d04-card-title">Offline recording</div>
              <div className="d04-card-desc">Record on phone, upload later</div>
            </div>
          </div>
          <a href="#" className="d04-cta">Get early access</a>
        </div>
        <div className="d04-footer">Design 04 — Soft Fog</div>
      </div>
    </>
  )
}
