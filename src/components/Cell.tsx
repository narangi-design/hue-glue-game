import Color from "../utils/color"

interface CellProps {
  color: Color
  isAnchor: boolean
  isSelected?: boolean
  isDragging?: boolean
  onClick?: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: () => void
}

function Cell({ color, isAnchor, isSelected, isDragging, onClick, onDragStart, onDragEnd, onDragOver, onDrop }: CellProps) {
  const className = [
    "cell",
    isAnchor ? "anchor" : "interactive",
    isSelected ? "selected" : "",
    isDragging ? "dragging" : ""
  ].filter(Boolean).join(" ")

  const handleDragStart = (e: React.DragEvent) => {
    const dragImage = document.createElement("div")
    dragImage.className = "drag-image"
    dragImage.style.backgroundColor = color.rgb
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 15, 15)
    setTimeout(() => document.body.removeChild(dragImage), 0)
    onDragStart?.(e)
  }

  return (
    <div
      className={className}
      style={{ backgroundColor: color.rgb }}
      onClick={isAnchor ? undefined : onClick}
      draggable={!isAnchor}
      onDragStart={isAnchor ? undefined : handleDragStart}
      onDragEnd={isAnchor ? undefined : onDragEnd}
      onDragOver={isAnchor ? undefined : onDragOver}
      onDrop={isAnchor ? undefined : onDrop}
    >
      <span>
        {isAnchor? '•' : ''}
      </span>
    </div>
  )
}

export default Cell