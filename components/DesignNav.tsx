'use client'
import Link from 'next/link'
import styles from './DesignNav.module.css'

interface DesignNavProps {
  current: number
  featured: number[]
  showNav?: boolean
}

export default function DesignNav({ current, featured, showNav = true }: DesignNavProps) {
  if (!showNav) return null

  const currentIndex = featured.indexOf(current)
  const prev = currentIndex > 0 ? featured[currentIndex - 1] : null
  const next = currentIndex < featured.length - 1 ? featured[currentIndex + 1] : null
  const position = `${currentIndex + 1} / ${featured.length}`

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.home}>ALL</Link>
      <span className={styles.dot}>·</span>
      <Link
        href={prev ? `/designs/${prev}` : '#'}
        className={prev ? styles.link : styles.disabledLink}
      >←</Link>
      <span className={styles.label}>{position}</span>
      <Link
        href={next ? `/designs/${next}` : '#'}
        className={next ? styles.link : styles.disabledLink}
      >→</Link>
    </nav>
  )
}
