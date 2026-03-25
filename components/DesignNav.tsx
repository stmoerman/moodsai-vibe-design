'use client'
import Link from 'next/link'
import styles from './DesignNav.module.css'

export default function DesignNav({ current, total }: { current: number; total: number }) {
  const prev = current > 1 ? current - 1 : null
  const next = current < total ? current + 1 : null

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.home}>ALL</Link>
      <span className={styles.dot}>·</span>
      <Link
        href={prev ? `/designs/${prev}` : '#'}
        className={prev ? styles.link : styles.disabledLink}
      >←</Link>
      <span className={styles.label}>{String(current).padStart(2, '0')} / {total}</span>
      <Link
        href={next ? `/designs/${next}` : '#'}
        className={next ? styles.link : styles.disabledLink}
      >→</Link>
    </nav>
  )
}
