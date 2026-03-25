export default function Design02() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .d02 {
          min-height: 100vh;
          background: #F8F4EE;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 768px) {
          .d02 { grid-template-columns: 1fr; }
          .d02-right { display: none; }
        }

        /* Left editorial column */
        .d02-left {
          padding: 72px 56px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid #E2D8CA;
        }

        .d02-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 80px;
        }

        .d02-logo {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.85rem;
          color: #2A1E12;
          letter-spacing: 0.04em;
        }

        .d02-logo span { color: #C4501A; }

        .d02-tagline {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.7rem;
          color: #A08870;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .d02-num {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(6rem, 14vw, 11rem);
          color: #EDE5D8;
          line-height: 1;
          margin-bottom: -24px;
          display: block;
        }

        .d02-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          color: #2A1E12;
          line-height: 1.15;
          margin-bottom: 28px;
          letter-spacing: -0.02em;
        }

        .d02-headline em {
          color: #C4501A;
          font-style: italic;
        }

        .d02-body {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.92rem;
          color: #6A5A48;
          line-height: 1.75;
          max-width: 340px;
          margin-bottom: 44px;
        }

        .d02-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .d02-btn-primary {
          background: #2A1E12;
          color: #F8F4EE;
          padding: 13px 28px;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-decoration: none;
          transition: background 0.2s;
          border-radius: 2px;
        }
        .d02-btn-primary:hover { background: #C4501A; }

        .d02-btn-ghost {
          color: #8B7355;
          font-size: 0.78rem;
          font-weight: 300;
          letter-spacing: 0.06em;
          text-decoration: none;
          border-bottom: 1px solid #C4A880;
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .d02-btn-ghost:hover { color: #C4501A; }

        .d02-meta {
          font-size: 0.7rem;
          color: #B0A090;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Right visual column */
        .d02-right {
          background: #2A1E12;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 60px 48px;
          position: relative;
          overflow: hidden;
        }

        /* Notebook lines */
        .d02-lines {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            transparent,
            transparent 39px,
            rgba(255,255,255,0.04) 39px,
            rgba(255,255,255,0.04) 40px
          );
        }

        .d02-wave {
          position: absolute;
          top: 0; right: 0; left: 0;
          height: 60%;
          background: radial-gradient(ellipse at 70% 30%, rgba(196, 80, 26, 0.18) 0%, transparent 65%);
        }

        .d02-card {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 28px;
          margin-bottom: 12px;
        }

        .d02-card-label {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .d02-waveform {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 32px;
        }

        .d02-waveform span {
          display: block;
          width: 3px;
          border-radius: 2px;
          background: #C4501A;
          animation: d02wave 1.2s ease-in-out infinite alternate;
        }

        .d02-waveform span:nth-child(1)  { height: 8px;  animation-delay: 0.0s; }
        .d02-waveform span:nth-child(2)  { height: 18px; animation-delay: 0.1s; }
        .d02-waveform span:nth-child(3)  { height: 28px; animation-delay: 0.2s; }
        .d02-waveform span:nth-child(4)  { height: 14px; animation-delay: 0.3s; }
        .d02-waveform span:nth-child(5)  { height: 24px; animation-delay: 0.15s; }
        .d02-waveform span:nth-child(6)  { height: 10px; animation-delay: 0.25s; }
        .d02-waveform span:nth-child(7)  { height: 20px; animation-delay: 0.05s; }
        .d02-waveform span:nth-child(8)  { height: 32px; animation-delay: 0.18s; }
        .d02-waveform span:nth-child(9)  { height: 16px; animation-delay: 0.08s; }
        .d02-waveform span:nth-child(10) { height: 12px; animation-delay: 0.3s; }
        .d02-waveform span:nth-child(11) { height: 22px; animation-delay: 0.22s; }
        .d02-waveform span:nth-child(12) { height: 8px;  animation-delay: 0.12s; }

        @keyframes d02wave {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }

        .d02-transcript {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin-top: 12px;
          position: relative;
          z-index: 1;
        }

        .d02-cursor {
          display: inline-block;
          width: 2px;
          height: 0.85em;
          background: #C4501A;
          vertical-align: text-bottom;
          animation: d02blink 1s step-end infinite;
          margin-left: 2px;
        }
        @keyframes d02blink { 50% { opacity: 0; } }

        .d02-footer {
          position: fixed;
          bottom: 28px;
          left: 28px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C4A880;
          opacity: 0.5;
          z-index: 1;
        }

        /* Entrance */
        .d02-left > * {
          opacity: 0;
          animation: d02slide 0.6s ease forwards;
        }
        .d02-topbar { animation-delay: 0.05s; }
        .d02-main-content { animation-delay: 0.2s; }
        .d02-actions { animation-delay: 0.4s; }
        .d02-meta { animation-delay: 0.5s; }

        @keyframes d02slide {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="d02">
        <div className="d02-left">
          <div className="d02-topbar">
            <div className="d02-logo">moots<span>.ai</span></div>
            <div className="d02-tagline">Transcription</div>
          </div>
          <div className="d02-main-content">
            <span className="d02-num">01</span>
            <h1 className="d02-headline">
              Your words,<br /><em>captured</em><br />as they happen.
            </h1>
            <p className="d02-body">
              Live transcription during video calls. Offline recording on your phone. Every conversation, preserved with quiet precision.
            </p>
          </div>
          <div className="d02-actions">
            <a href="#" className="d02-btn-primary">Start free</a>
            <a href="#" className="d02-btn-ghost">See how it works</a>
          </div>
          <div className="d02-meta">Live calls · Offline recording · Private</div>
        </div>
        <div className="d02-right">
          <div className="d02-lines" />
          <div className="d02-wave" />
          <div className="d02-card">
            <div className="d02-card-label">Live — Google Meet</div>
            <div className="d02-waveform">
              {Array.from({length:12}).map((_,i) => <span key={i} />)}
            </div>
          </div>
          <div className="d02-transcript">
            "Let's align on the Q4 roadmap before we bring<br />
            engineering in. I think the priority should be—"<span className="d02-cursor" />
          </div>
        </div>
        <div className="d02-footer">Design 02 — Field Notes</div>
      </div>
    </>
  )
}
