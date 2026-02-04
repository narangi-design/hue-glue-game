import './styles/App.css'
import './styles/Toggle.css'
import { useState, useEffect } from 'react'
import * as Toggle from '@radix-ui/react-toggle'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import Grid from './components/Grid'
import Button from './components/Button'
import { CellModel } from './utils/cell'
import { generateGrid, shuffleGrid } from './utils/color'
import { saveGame, loadGame, compareGrids } from './utils/level'

function App() {
  const [currentGrid, setCurrentGrid] = useState<CellModel[][]>([])
  const [targetGrid, setTargetGrid] = useState<CellModel[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null)
  const [draggedCell, setDraggedCell] = useState<{ x: number; y: number } | null>(null)
  const [win, setWin] = useState(false)
  const [darkTheme, setDarkTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [gridSize, setGridSize] = useState('8')

  useEffect(() => {
    const saved = loadGame()
    if (saved) {
      setTargetGrid(saved.initialGridState)
      setCurrentGrid(saved.currentGridState)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(darkTheme ? 'dark' : 'light')
  }, [darkTheme])

  const handleNewGame = () => {
    const size = parseInt(gridSize)
    const grid = generateGrid(size, size)
    const shuffled = shuffleGrid(grid)
    setTargetGrid(grid)
    setCurrentGrid(shuffled)
    saveGame(grid, shuffled)
    setSelectedCell(null)
    setWin(false)
  }

  const handleCellClick = (x: number, y: number) => {
    if (win) return

    if (!selectedCell) {
      setSelectedCell({ x, y })
      return
    }

    if (selectedCell.x === x && selectedCell.y === y) {
      setSelectedCell(null)
      return
    }

    setCurrentGrid(prev => {
      const colorA = prev[selectedCell.y][selectedCell.x].color
      const colorB = prev[y][x].color

      const newCells = prev.map((row, i) =>
        row.map((cell, j) => {
          if (i === selectedCell.y && j === selectedCell.x) {
            const newCell = new CellModel(cell.isAnchor)
            newCell.color = colorB
            return newCell
          }
          if (i === y && j === x) {
            const newCell = new CellModel(cell.isAnchor)
            newCell.color = colorA
            return newCell
          }
          return cell
        })
      )
      if (targetGrid) {
        saveGame(targetGrid, newCells)
        if (compareGrids(newCells, targetGrid)) {
          setWin(true)
        }
      }
      return newCells
    })
    setSelectedCell(null)
  }

  const handleDragStart = (x: number, y: number) => {
    if (win) return
    setDraggedCell({ x, y })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnd = () => {
    setDraggedCell(null)
  }

  const handleDrop = (x: number, y: number) => {
    if (win || !draggedCell) return
    if (draggedCell.x === x && draggedCell.y === y) {
      setDraggedCell(null)
      return
    }

    setCurrentGrid(prev => {
      const colorA = prev[draggedCell.y][draggedCell.x].color
      const colorB = prev[y][x].color

      const newCells = prev.map((row, i) =>
        row.map((cell, j) => {
          if (i === draggedCell.y && j === draggedCell.x) {
            const newCell = new CellModel(cell.isAnchor)
            newCell.color = colorB
            return newCell
          }
          if (i === y && j === x) {
            const newCell = new CellModel(cell.isAnchor)
            newCell.color = colorA
            return newCell
          }
          return cell
        })
      )
      if (targetGrid) {
        saveGame(targetGrid, newCells)
        if (compareGrids(newCells, targetGrid)) {
          setWin(true)
        }
      }
      return newCells
    })
    setDraggedCell(null)
  }

  return (
    <>
      <Toggle.Root
        className='theme-toggle'
        pressed={darkTheme}
        onPressedChange={setDarkTheme}
      >
        {darkTheme ? 'Dark' : 'Light'}
      </Toggle.Root>

      <div className='app'>
        <h1>Hue Glue</h1>
        <Grid
          cells={currentGrid}
          selectedCell={selectedCell}
          draggedCell={draggedCell}
          onCellClick={handleCellClick}
          onCellDragStart={handleDragStart}
          onCellDragEnd={handleDragEnd}
          onCellDragOver={handleDragOver}
          onCellDrop={handleDrop}
        />
        <div className='controls'>
          <ToggleGroup.Root
            className='toggle-group'
            type='single'
            value={gridSize}
            onValueChange={(value) => value && setGridSize(value)}
          >
            <ToggleGroup.Item className='toggle-item' value='6'>6x6</ToggleGroup.Item>
            <ToggleGroup.Item className='toggle-item' value='8'>8x8</ToggleGroup.Item>
            <ToggleGroup.Item className='toggle-item' value='10'>10x10</ToggleGroup.Item>
          </ToggleGroup.Root>
          <Button onClick={handleNewGame}>New Game</Button>
        </div>
        {win && <p className='win-message'>You won!</p>}
      </div>
    </>
  )
}

export default App