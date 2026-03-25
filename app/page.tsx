import Link from 'next/link'
import styles from './page.module.css'

const designs = [
  { id: 1, name: 'The Manifesto', desc: 'Why mental healthcare documentation is broken' },
  { id: 2, name: 'The Blueprint', desc: 'The architectural plan for a modern practice' },
  { id: 3, name: 'The Notebook', desc: 'Your trusted companion, one page at a time' },
  { id: 4, name: 'The Grid', desc: 'A system of perfectly organized parts' },
  { id: 5, name: 'The Broadsheet', desc: 'Editorial authority, front-page treatment' },
  { id: 6, name: 'The Terminal', desc: 'Technical credibility, under the hood' },
  { id: 7, name: 'The Whitepaper', desc: 'Calm academic authority, peer-reviewed' },
  { id: 8, name: 'The Dashboard', desc: "Show, don't tell — you're already inside" },
  { id: 9, name: 'The Letterpress', desc: 'Craft and care, stamped with intention' },
  { id: 10, name: 'The Remarkable', desc: 'Paper-perfect, dot-grid precision' },
]

export default function Home() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Moods.ai</div>
      <div className={styles.sub}>10 Design Explorations</div>
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
