import type { Metadata } from 'next'
import DesignSystem from '@/components/DesignSystem'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Moods.ai — Design System',
  description: 'Living design system reference for the Moods AI brand',
}

export default function DesignSystemPage() {
  return (
    <div className={styles.wrapper}>
      <DesignSystem />
    </div>
  )
}
