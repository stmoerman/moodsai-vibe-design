import Link from 'next/link'
import styles from './page.module.css'

const dashboards = [
  { href: '/therapist-dashboard', name: 'Therapist Dashboard', desc: 'Day view with interactive agenda, team chat, client management' },
  { href: '/bi-dashboard', name: 'BI Dashboard', desc: 'Revenue charts, declaration control, client flow, analytics widgets' },
]

export default function Home() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Moods.ai</div>
      <div className={styles.sub}>2 Dashboard Directions</div>
      <div className={styles.grid}>
        {dashboards.map(d => (
          <Link key={d.href} href={d.href} className={styles.card}>
            <div className={styles.cardName}>{d.name}</div>
            <div className={styles.cardDesc}>{d.desc}</div>
            <span className={styles.cardArrow}>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
