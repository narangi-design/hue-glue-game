import Color from "../utils/color"

interface CellProps {
  color: Color
  isAnchor: boolean
}

function Cell({ color, isAnchor }: CellProps) {
  return (
    <div
      className={`cell ${isAnchor ? "anchor" : ""}`}
      style={{
        backgroundColor: color.rgb
      }}
    ></div>
  )
}

export default Cell