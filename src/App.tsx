import { useState, useEffect } from "react"
import Grid from "./components/Grid"
import Button from "./components/Button"
import { generateGrid, shuffleGrid } from "./utils/color"
import Cell from "./utils/cell"
import { LevelData, serializeGrid, deserializeGrid, saveGame, loadGame, compareGrids } from "./utils/level"

function App() {
  const [cells, setCells] = useState<Cell[][]>([])
  const [levelData, setLevelData] = useState<LevelData | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null)
  const [won, setWon] = useState(false)

  useEffect(() => {
    const saved = loadGame()
    if (saved) {
      setLevelData(saved.levelData)
      setCells(deserializeGrid(saved.cells))
    }
  }, [])

  const handleNewGame = () => {
    const grid = generateGrid(10, 10)
    const level = serializeGrid(grid)
    const shuffled = shuffleGrid(grid)
    setLevelData(level)
    setCells(shuffled)
    saveGame(level, shuffled)
    setSelectedCell(null)
    setWon(false)
  }

  const handleCellClick = (x: number, y: number) => {
    if (won) return

    if (!selectedCell) {
      setSelectedCell({ x, y })
      return
    }

    if (selectedCell.x === x && selectedCell.y === y) {
      setSelectedCell(null)
      return
    }

    setCells(prev => {
      const colorA = prev[selectedCell.y][selectedCell.x].color
      const colorB = prev[y][x].color

      const newCells = prev.map((row, i) =>
        row.map((cell, j) => {
          if (i === selectedCell.y && j === selectedCell.x) {
            const newCell = new Cell(cell.isAnchor)
            newCell.color = colorB
            return newCell
          }
          if (i === y && j === x) {
            const newCell = new Cell(cell.isAnchor)
            newCell.color = colorA
            return newCell
          }
          return cell
        })
      )
      if (levelData) {
        saveGame(levelData, newCells)
        if (compareGrids(newCells, levelData)) {
          setWon(true)
        }
      }
      return newCells
    })
    setSelectedCell(null)
  }

  return (
    <div className="app">
      <h1>Hue Glue</h1>
      <Grid cells={cells} selectedCell={selectedCell} onCellClick={handleCellClick} />
      <Button onClick={handleNewGame}>New Game</Button>
      {won && <p className="win-message">You won!</p>}
    </div>
  )
}

export default App