'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DesignNav({ current, total }: { current: number; total: number }) {
  const router = useRouter()
  const prev = current > 1 ? current - 1 : null
  const next = current < total ? current + 1 : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400&display=swap');
        .dnav {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 2px;
          background: rgba(28, 22, 14, 0.85);
          backdrop-filter: blur(12px);
          border-radius: 100px;
          padding: 6px 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
        }
        .dnav a, .dnav button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .dnav a:hover, .dnav button:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .dnav a.disabled { opacity: 0.2; pointer-events: none; }
        .dnav-label {
          color: rgba(255,255,255,0.5);
          padding: 0 10px;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .dnav-home {
          color: rgba(255,255,255,0.55) !important;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          padding: 0 4px 0 2px;
        }
        .dnav-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.1); margin: 0 2px; }
      `}</style>
      <nav className="dnav">
        <Link href="/" className="dnav-home">ALL</Link>
        <div className="dnav-sep" />
        <Link href={prev ? `/designs/${prev}` : '#'} className={prev ? '' : 'disabled'}>←</Link>
        <span className="dnav-label">{String(current).padStart(2,'0')} / {total}</span>
        <Link href={next ? `/designs/${next}` : '#'} className={next ? '' : 'disabled'}>→</Link>
      </nav>
    </>
  )
}
