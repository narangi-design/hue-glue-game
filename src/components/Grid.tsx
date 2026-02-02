import Cell from "./Cell"
import Color from "../utils/color"
import "../styles/Grid.css"

interface GridProps {
  cells: (Color | null)[][]
  cellSize?: number
  gap?: number
}

function Grid({ cells, cellSize = 50, gap = 4 }: GridProps) {
  const rows = cells?.length || 0
  const cols = cells?.[0]?.length || 0

  const gridStyle = {
    gridTemplateColumns: `repeat(${Math.max(cols, 0)}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${Math.max(rows, 0)}, ${cellSize}px)`,
    gap: `${gap}px`,
  }

  return (
    <div className="grid" style={gridStyle}>
      {cells.map((row, i) =>
        row.map((color, j) => <Cell key={`${i}-${j}`} color={color!} />)
      )}
    </div>
  )
}

export default Grid