import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import DesignNav from '@/components/DesignNav'

const designMap: Record<number, ReturnType<typeof dynamic>> = {
  1: dynamic(() => import('@/components/designs/Design01'), { ssr: false }),
  2: dynamic(() => import('@/components/designs/Design02'), { ssr: false }),
  3: dynamic(() => import('@/components/designs/Design03'), { ssr: false }),
  4: dynamic(() => import('@/components/designs/Design04'), { ssr: false }),
  5: dynamic(() => import('@/components/designs/Design05'), { ssr: false }),
  6: dynamic(() => import('@/components/designs/Design06'), { ssr: false }),
  7: dynamic(() => import('@/components/designs/Design07'), { ssr: false }),
  8: dynamic(() => import('@/components/designs/Design08'), { ssr: false }),
  9: dynamic(() => import('@/components/designs/Design09'), { ssr: false }),
  10: dynamic(() => import('@/components/designs/Design10'), { ssr: false }),
}

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }))
}

export default function DesignPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const DesignComponent = designMap[id]
  if (!DesignComponent) notFound()
  return (
    <>
      <DesignNav current={id} total={10} />
      <DesignComponent />
    </>
  )
}
