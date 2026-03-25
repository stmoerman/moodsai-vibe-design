import { notFound } from 'next/navigation'
import Design01 from '@/components/designs/Design01'
import Design02 from '@/components/designs/Design02'
import Design03 from '@/components/designs/Design03'
import Design04 from '@/components/designs/Design04'
import Design05 from '@/components/designs/Design05'
import Design06 from '@/components/designs/Design06'
import Design07 from '@/components/designs/Design07'
import Design08 from '@/components/designs/Design08'
import Design09 from '@/components/designs/Design09'
import Design10 from '@/components/designs/Design10'
import DesignNav from '@/components/DesignNav'

const designMap: Record<number, React.ComponentType> = {
  1: Design01, 2: Design02, 3: Design03, 4: Design04, 5: Design05,
  6: Design06, 7: Design07, 8: Design08, 9: Design09, 10: Design10,
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
