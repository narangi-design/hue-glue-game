import { useState, useEffect } from 'react'

import CellModel from '../utils/cell-model'
import { generateGrid, shuffleGrid } from '../utils/grid-generator'
import { saveGame, loadGame, compareGrids } from '../utils/level'

export default function useGame() {
  const [currentGrid, setCurrentGrid] = useState<CellModel[][]>(() => generateGrid(8, 8))
  const [targetGrid, setTargetGrid] = useState<CellModel[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle')
  const [gridSize, setGridSize] = useState(() => localStorage.getItem('hue-glue-grid-size') ?? '8')
  const rememberGridSize = (size: string) => {
    setGridSize(size)
    localStorage.setItem('hue-glue-grid-size', size)
  }

  useEffect(() => {
    const saved = loadGame()
    if (saved) {
      setTargetGrid(saved.initialGridState)
      setCurrentGrid(saved.currentGridState)
      setGameState('playing')
    }
  }, [])

  const handleNewGame = () => {
    const size = parseInt(gridSize)
    const grid = generateGrid(size, size)
    const shuffled = shuffleGrid(grid)
    setTargetGrid(grid)
    setCurrentGrid(shuffled)
    saveGame(grid, shuffled)
    setSelectedCell(null)
    setGameState('playing')
  }

  const swapCells = (fromCol: number, fromRow: number, toCol: number, toRow: number) => {
    if (gameState !== 'playing') return

    setCurrentGrid(prev => {
      const colorA = prev[fromRow][fromCol].color
      const colorB = prev[toRow][toCol].color

      const newCells = prev.map((row, i) =>
        row.map((cell, j) => {
          if (i === fromRow && j === fromCol) {
            const newCell = new CellModel(cell.isAnchor)
            newCell.color = colorB
            return newCell
          }
          if (i === toRow && j === toCol) {
            const newCell = new CellModel(cell.isAnchor)
            newCell.color = colorA
            return newCell
          }
          return cell
        })
      )
      if (targetGrid.length > 0) {
        saveGame(targetGrid, newCells)
        if (compareGrids(newCells, targetGrid)) {
          setGameState('won')
        }
      }
      return newCells
    })
  }

  const handleCellClick = (col: number, row: number) => {
    if (gameState !== 'playing') return

    if (!selectedCell) {
      setSelectedCell({ x: col, y: row })
      return
    }

    if (selectedCell.x === col && selectedCell.y === row) {
      setSelectedCell(null)
      return
    }

    swapCells(selectedCell.x, selectedCell.y, col, row)
    setSelectedCell(null)
  }

  return {
    handleNewGame,
    gridSize,
    setGridSize: rememberGridSize,
    currentGrid,
    selectedCell,
    handleCellClick,
    swapCells,
    gameState
  }
}
