import Color from "../utils/color"

interface CellProps {
  color: Color
}

function Cell({ color }: CellProps) {
  return (
    <div
      className="cell"
      style={{
        backgroundColor: color.rgb
      }}
    ></div>
  )
}

export default Cell