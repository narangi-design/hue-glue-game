import { useState } from "react"
import {
  DndContext, DragOverlay, DragStartEvent, DragEndEvent,
  MouseSensor, TouchSensor, useSensor, useSensors
} from "@dnd-kit/core"
import Cell from "./Cell"
import { CellModel } from "../utils/cell"
import Color from "../utils/color"
import "../styles/Grid.css"

interface GridProps {
  cells: CellModel[][]
  selectedCell?: { x: number; y: number } | null
  win?: boolean
  onCellClick?: (col: number, row: number) => void
  onCellSwap?: (fromCol: number, fromRow: number, toCol: number, toRow: number) => void
}

interface ActiveCell {
  col: number
  row: number
  color: Color
}

function Grid({ cells, selectedCell, win, onCellClick, onCellSwap }: GridProps) {
  const cols = cells?.[0]?.length || 0
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null)
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 3 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 30, tolerance: 5 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const gridStyle = {
    "--cols": cols,
  } as React.CSSProperties

  const handleDragStart = (event: DragStartEvent) => {
    const { col, row, color } = event.active.data.current as { col: number; row: number; color: Color }
    setActiveCell({ col, row, color })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event
    if (over && activeCell) {
      const { col: targetCol, row: targetRow } = over.data.current as { col: number; row: number }
      if (targetCol !== activeCell.col || targetRow !== activeCell.row) {
        onCellSwap?.(activeCell.col, activeCell.row, targetCol, targetRow)
      }
    }
    setActiveCell(null)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={`grid${win ? " win" : ""}`} style={gridStyle}>
        {cells.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              color={cell.color}
              isAnchor={cell.isAnchor}
              isSelected={selectedCell?.x === j && selectedCell?.y === i}
              isDragging={activeCell?.col === j && activeCell?.row === i}
              col={j}
              row={i}
              onClick={() => onCellClick?.(j, i)}
            />
          ))
        )}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeCell ? (
          <div className="drag-overlay" style={{ backgroundColor: activeCell.color.rgb }} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Grid