import Cell from "./Cell"
import { CellModel } from "../utils/cell"
import "../styles/Grid.css"
import Color from "../utils/color"

interface GridProps {
  cells: CellModel[][]
  selectedCell?: { x: number; y: number } | null
  draggedCell?: { x: number; y: number } | null
  onCellClick?: (x: number, y: number) => void
  onCellDragStart?: (x: number, y: number) => void
  onCellDragEnd?: () => void
  onCellDragOver?: (e: React.DragEvent) => void
  onCellDrop?: (x: number, y: number) => void
}

function Grid({ cells, selectedCell, draggedCell, onCellClick, onCellDragStart, onCellDragEnd, onCellDragOver, onCellDrop }: GridProps) {
  const cols = cells?.[0]?.length || 0

  const gridStyle = {
    "--cols": cols,
  } as React.CSSProperties

  return (
    <div className="grid" style={gridStyle}>
      {cells.map((row, i) =>
        row.map((cell, j) => {
          return <Cell
            key={`${i}-${j}`}
            color={ cell.color }
            isAnchor={cell.isAnchor}
            isSelected={selectedCell?.x === j && selectedCell?.y === i}
            isDragging={draggedCell?.x === j && draggedCell?.y === i}
            onClick={() => onCellClick?.(j, i)}
            onDragStart={() => onCellDragStart?.(j, i)}
            onDragEnd={onCellDragEnd}
            onDragOver={onCellDragOver}
            onDrop={() => onCellDrop?.(j, i)}
          />
        })
      )}
    </div>
  )
}

export default Grid