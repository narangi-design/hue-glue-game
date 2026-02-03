import Color from "../utils/color"

interface CellProps {
  color: Color
  isAnchor: boolean
  isSelected?: boolean
  onClick?: () => void
}

function Cell({ color, isAnchor, isSelected, onClick }: CellProps) {
  const className = [
    "cell",
    isAnchor ? "anchor" : "interactive",
    isSelected ? "selected" : ""
  ].filter(Boolean).join(" ")

  return (
    <div
      className={className}
      style={{ backgroundColor: color.rgb }}
      onClick={isAnchor ? undefined : onClick}
    >
      <span>
        {isAnchor? '•' : ''}
      </span>
    </div>
  )
}

export default Cell