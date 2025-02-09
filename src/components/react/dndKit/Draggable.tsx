import React from 'react'

import { useDraggable, type UniqueIdentifier } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export type DraggableProps = {
  uniqueId: UniqueIdentifier
  data?: any
  render?: (
    useDraggableResult: ReturnType<typeof useDraggable>
  ) => React.ReactNode
} & React.HTMLProps<HTMLDivElement>

export default function Draggable({
  uniqueId,
  data,
  render,
  style,
  ...restProps
}: DraggableProps) {
  const useDraggableResult = useDraggable({
    id: uniqueId,
    data,
  })

  if (render) {
    return render(useDraggableResult)
  } else {
    const { attributes, listeners, setNodeRef, transform } = useDraggableResult
    const transformStyle = { transform: CSS.Translate.toString(transform) }
    return (
      <div
        {...restProps}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ ...transformStyle, ...style }}
      />
    )
  }
}
