import type { Metadata } from 'next'
import DesignSystem from '@/components/DesignSystem'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Moods AI — Design System',
  description: 'Practical brand guidelines for the Moods AI platform. reMarkable-derived palette.',
}

export default function DesignSystemPage() {
  return (
    <div className={styles.wrapper}>
      <DesignSystem />
    </div>
  )
}
