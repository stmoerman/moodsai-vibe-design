export default function Design09() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gilda+Display&family=Mulish:wght@200;300;400&display=swap');

        .d09 {
          min-height: 100vh;
          background: #FAF0E8;
          font-family: 'Mulish', sans-serif;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .d09 { grid-template-columns: 1fr; }
          .d09-right { display: none; }
        }

        /* Left: soft content */
        .d09-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 72px 60px 72px 72px;
        }

        .d09-logo {
          font-family: 'Gilda Display', serif;
          font-size: 0.95rem;
          color: #3A2820;
          letter-spacing: 0.04em;
          margin-bottom: 72px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .d09-logo-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #D4845A;
        }

        .d09-kicker {
          font-weight: 200;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #D4845A;
          margin-bottom: 20px;
        }

        .d09-headline {
          font-family: 'Gilda Display', serif;
          font-size: clamp(2.4rem, 4.5vw, 3.8rem);
          color: #3A2820;
          line-height: 1.18;
          letter-spacing: -0.01em;
          margin-bottom: 28px;
        }

        .d09-body {
          font-weight: 200;
          font-size: 0.9rem;
          color: rgba(58, 40, 32, 0.6);
          line-height: 1.85;
          max-width: 360px;
          margin-bottom: 44px;
        }

        .d09-actions {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 60px;
        }

        .d09-btn {
          background: #3A2820;
          color: #FAF0E8;
          font-weight: 300;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          padding: 13px 32px;
          text-decoration: none;
          border-radius: 100px;
          transition: background 0.2s;
        }
        .d09-btn:hover { background: #D4845A; }

        .d09-link {
          font-weight: 200;
          font-size: 0.76rem;
          color: rgba(58, 40, 32, 0.45);
          text-decoration: none;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }
        .d09-link:hover { color: #D4845A; }

        .d09-modes {
          display: flex;
          gap: 24px;
          padding-top: 32px;
          border-top: 1px solid rgba(58, 40, 32, 0.1);
        }

        .d09-mode {
          font-size: 0.72rem;
          color: rgba(58, 40, 32, 0.45);
          font-weight: 200;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .d09-mode::before {
          content: '';
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #D4845A;
          opacity: 0.5;
        }

        /* Right: warm visual with floating UI elements */
        .d09-right {
          background: linear-gradient(160deg, #F0C9A8 0%, #E8A888 40%, #D4845A 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Large circle backdrop */
        .d09-circle {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }

        .d09-circle-sm {
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Floating transcript card */
        .d09-card {
          position: relative;
          z-index: 2;
          background: rgba(255, 252, 250, 0.92);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 24px 28px;
          width: 300px;
          box-shadow: 0 8px 40px rgba(90, 40, 20, 0.15);
        }

        .d09-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .d09-card-label {
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(58, 40, 32, 0.45);
        }

        .d09-rec-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #D4845A;
          animation: d09rec 1.4s ease-in-out infinite;
        }

        @keyframes d09rec {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .d09-card-wave {
          display: flex;
          align-items: center;
          gap: 2.5px;
          height: 24px;
          margin-bottom: 14px;
        }

        .d09-card-wave span {
          display: block;
          width: 2.5px;
          border-radius: 2px;
          background: linear-gradient(to top, #D4845A, #E8A888);
          animation: d09w 1s ease-in-out infinite alternate;
        }

        .d09-card-wave span:nth-child(1)  { height: 6px;  animation-delay: 0.0s; }
        .d09-card-wave span:nth-child(2)  { height: 14px; animation-delay: 0.08s; }
        .d09-card-wave span:nth-child(3)  { height: 20px; animation-delay: 0.16s; }
        .d09-card-wave span:nth-child(4)  { height: 10px; animation-delay: 0.24s; }
        .d09-card-wave span:nth-child(5)  { height: 18px; animation-delay: 0.12s; }
        .d09-card-wave span:nth-child(6)  { height: 24px; animation-delay: 0.2s; }
        .d09-card-wave span:nth-child(7)  { height: 14px; animation-delay: 0.04s; }
        .d09-card-wave span:nth-child(8)  { height: 8px;  animation-delay: 0.28s; }
        .d09-card-wave span:nth-child(9)  { height: 16px; animation-delay: 0.18s; }
        .d09-card-wave span:nth-child(10) { height: 6px;  animation-delay: 0.06s; }

        @keyframes d09w {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }

        .d09-transcript-line {
          font-family: 'Mulish', sans-serif;
          font-weight: 200;
          font-size: 0.8rem;
          color: rgba(58, 40, 32, 0.65);
          line-height: 1.6;
        }

        .d09-transcript-line strong {
          font-weight: 400;
          color: #3A2820;
        }

        .d09-cursor {
          display: inline-block;
          width: 2px; height: 0.8em;
          background: #D4845A;
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: d09blink 1s step-end infinite;
        }
        @keyframes d09blink { 50% { opacity: 0; } }

        .d09-label-overlay {
          position: absolute;
          bottom: 40px;
          left: 40px;
          right: 40px;
          display: flex;
          justify-content: space-between;
          font-size: 0.62rem;
          font-weight: 200;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          z-index: 1;
        }

        .d09-foot {
          position: fixed;
          bottom: 24px;
          left: 32px;
          font-weight: 200;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(58, 40, 32, 0.3);
          z-index: 10;
        }

        /* Entrance */
        .d09-left > * {
          opacity: 0;
          animation: d09in 0.65s ease forwards;
        }
        .d09-logo    { animation-delay: 0.05s; }
        .d09-kicker  { animation-delay: 0.15s; }
        .d09-headline { animation-delay: 0.25s; }
        .d09-body    { animation-delay: 0.35s; }
        .d09-actions { animation-delay: 0.45s; }
        .d09-modes   { animation-delay: 0.55s; }

        @keyframes d09in {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="d09">
        <div className="d09-left">
          <div className="d09-logo">
            <span className="d09-logo-dot" />
            Moods.ai
          </div>
          <div className="d09-kicker">Transcription · Early access</div>
          <h1 className="d09-headline">
            Words worth<br />keeping,<br />kept faithfully.
          </h1>
          <p className="d09-body">
            Live transcription during your video calls. Record offline on your phone and upload to Moods when you're back. Everything captured, nothing lost.
          </p>
          <div className="d09-actions">
            <a href="#" className="d09-btn">Get early access</a>
            <a href="#" className="d09-link">→ Watch a demo</a>
          </div>
          <div className="d09-modes">
            <span className="d09-mode">Live calls</span>
            <span className="d09-mode">Offline recording</span>
            <span className="d09-mode">Private</span>
          </div>
        </div>

        <div className="d09-right">
          <div className="d09-circle" />
          <div className="d09-circle-sm" />
          <div className="d09-card">
            <div className="d09-card-top">
              <span className="d09-card-label">Live · Google Meet</span>
              <span className="d09-rec-dot" />
            </div>
            <div className="d09-card-wave">
              {Array.from({length:10}).map((_,i) => <span key={i} />)}
            </div>
            <div className="d09-transcript-line">
              <strong>Sarah:</strong> "The research shows users prefer<br />
              voice-first interfaces when—"<span className="d09-cursor" />
            </div>
          </div>
          <div className="d09-label-overlay">
            <span>Transcribing</span>
            <span>2 speakers</span>
          </div>
        </div>
        <div className="d09-foot">Design 09 — Dawn</div>
      </div>
    </>
  )
}
