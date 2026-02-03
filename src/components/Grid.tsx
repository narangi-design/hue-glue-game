import Cell from "./Cell"
import CellModel from "../utils/cell"
import "../styles/Grid.css"

interface GridProps {
  cells: CellModel[][]
  cellSize?: number
  gap?: number
  selectedCell?: { x: number; y: number } | null
  onCellClick?: (x: number, y: number) => void
}

function Grid({ cells, cellSize = 50, gap = 4, selectedCell, onCellClick }: GridProps) {
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
          <Cell
            key={`${i}-${j}`}
            color={cell.color!}
            isAnchor={cell.isAnchor}
            isSelected={selectedCell?.x === j && selectedCell?.y === i}
            onClick={() => onCellClick?.(j, i)}
          />
        ))
      )}
    </div>
  )
}

export default Grid