import { useDraggable, useDroppable } from "@dnd-kit/core"
import Color from "../utils/color-class"

interface CellProps {
  color: Color
  isAnchor: boolean
  isSelected?: boolean
  isDragging?: boolean
  col: number
  row: number
  onClick?: () => void
}

function Cell({ color, isAnchor, isSelected, isDragging, col, row, onClick }: CellProps) {
  const id = `cell-${col}-${row}`

  const { setNodeRef: setDraggableRef, listeners, attributes } = useDraggable({
    id,
    disabled: isAnchor,
    data: { col, row, color },
  })

  const { setNodeRef: setDroppableRef } = useDroppable({
    id,
    disabled: isAnchor,
    data: { col, row },
  })

  const className = [
    "cell",
    isAnchor ? "anchor" : "interactive",
    isSelected ? "selected" : "",
    isDragging ? "dragging" : "",
  ].filter(Boolean).join(" ")

  return (
    <div
      ref={(node) => {
        setDraggableRef(node)
        setDroppableRef(node)
      }}
      className={className}
      style={{ backgroundColor: color.rgb }}
      onClick={isAnchor ? undefined : onClick}
      {...(isAnchor ? {} : listeners)}
      {...(isAnchor ? {} : attributes)}
    >
      <span>{isAnchor ? "•" : ""}</span>
    </div>
  )
}

export default Cell