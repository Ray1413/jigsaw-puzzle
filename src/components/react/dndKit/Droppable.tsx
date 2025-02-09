import React from 'react'

import { useDroppable, type UniqueIdentifier } from '@dnd-kit/core'

export type DroppableProps = {
  uniqueId: UniqueIdentifier
  render?: (
    useDroppableResult: ReturnType<typeof useDroppable>
  ) => React.ReactNode
} & React.HTMLProps<HTMLDivElement>

export default function Droppable({
  uniqueId,
  render,
  ...restProps
}: DroppableProps) {
  const useDroppableResult = useDroppable({
    id: uniqueId,
  })

  if (render) {
    return render(useDroppableResult)
  } else {
    const { isOver, setNodeRef } = useDroppableResult
    return <div {...restProps} ref={setNodeRef} />
  }
}
