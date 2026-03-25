import Link from 'next/link'
import styles from './page.module.css'

const designs = [
  { id: 1, name: 'The Manifesto', desc: 'Emotionally driven, story-first, snap-scroll sections' },
  { id: 10, name: 'The Remarkable', desc: 'Paper-perfect, dot-grid precision, hand-drawn SVG' },
  { id: 11, name: 'The Synthesis', desc: 'The best of both — manifesto energy meets remarkable craft' },
  { id: 12, name: 'The Sketchbook', desc: 'One continuous line drawn through every section as you scroll' },
  { id: 13, name: 'The Impossible', desc: 'Full creative mode — pushing the boundaries of what a SaaS page can be' },
]

export default function Home() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Moods.ai</div>
      <div className={styles.sub}>5 Homepage Directions</div>
      <div className={styles.grid}>
        {designs.map(d => (
          <Link key={d.id} href={`/designs/${d.id}`} className={styles.card}>
            <div className={styles.cardNum}>{String(d.id).padStart(2, '0')}</div>
            <div className={styles.cardName}>{d.name}</div>
            <div className={styles.cardDesc}>{d.desc}</div>
            <span className={styles.cardArrow}>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
