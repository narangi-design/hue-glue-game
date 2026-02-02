import Cell from "./Cell"
import CellModel from "../utils/cell"
import "../styles/Grid.css"

interface GridProps {
  cells: CellModel[][]
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
        row.map((cell, j) => (
          <Cell key={`${i}-${j}`} color={cell.color!} isAnchor={cell.isAnchor} />
        ))
      )}
    </div>
  )
}

export default Grid