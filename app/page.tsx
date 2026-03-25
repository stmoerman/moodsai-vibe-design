import Link from 'next/link'

const designs = [
  { id: 1, name: 'Parchment',     desc: 'Warm cream, Cormorant serif, timeless paper feel' },
  { id: 2, name: 'Field Notes',   desc: 'Rust & off-white, editorial asymmetry, notebook warmth' },
  { id: 3, name: 'Candlelight',   desc: 'Dark warm brown, gold, intimate and dramatic' },
  { id: 4, name: 'Soft Fog',      desc: 'Warm mist tones, layered translucency, serene' },
  { id: 5, name: 'Terracotta',    desc: 'Clay palette, bold type, artisan energy' },
  { id: 6, name: 'Nordic',        desc: 'Ivory & sage, sparse grid, Scandinavian restraint' },
  { id: 7, name: 'Manuscript',    desc: 'Aged white, sepia ink, literary warmth' },
  { id: 8, name: 'Washi',         desc: 'Japanese paper, natural ivory, meditative calm' },
  { id: 9, name: 'Dawn',          desc: 'Peach & rose, soft split layout, gentle warmth' },
  { id: 10, name: 'Remarkable',   desc: 'Pencil-grey, paper precision, directly Remarkable-inspired' },
]

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400&display=swap');
        .gallery-root {
          min-height: 100vh;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 40px 80px;
        }
        .gallery-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(2rem, 4vw, 3.5rem);
          color: #2C2416;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .gallery-sub {
          font-size: 0.875rem;
          color: #8B7355;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 60px;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2px;
          max-width: 1200px;
        }
        .gallery-card {
          display: block;
          background: #FAF6EE;
          border: 1px solid #E8E0D0;
          padding: 32px 28px;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .gallery-card:hover {
          background: #FFFDF8;
          transform: translateY(-2px);
        }
        .gallery-card-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          color: #E0D0B8;
          line-height: 1;
          margin-bottom: 16px;
          font-weight: 300;
        }
        .gallery-card-name {
          font-size: 1rem;
          font-weight: 400;
          color: #2C2416;
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }
        .gallery-card-desc {
          font-size: 0.8rem;
          color: #8B7355;
          line-height: 1.5;
        }
        .gallery-card-arrow {
          position: absolute;
          right: 24px;
          bottom: 24px;
          font-size: 1.2rem;
          color: #C4A86A;
          opacity: 0;
          transition: opacity 0.2s, right 0.2s;
        }
        .gallery-card:hover .gallery-card-arrow {
          opacity: 1;
          right: 20px;
        }
      `}</style>
      <div className="gallery-root">
        <div className="gallery-title">Moods.ai</div>
        <div className="gallery-sub">10 Design Explorations</div>
        <div className="gallery-grid">
          {designs.map(d => (
            <Link key={d.id} href={`/designs/${d.id}`} className="gallery-card">
              <div className="gallery-card-num">0{d.id < 10 ? d.id : ''}{d.id === 10 ? '10' : ''}</div>
              <div className="gallery-card-name">{d.name}</div>
              <div className="gallery-card-desc">{d.desc}</div>
              <span className="gallery-card-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
