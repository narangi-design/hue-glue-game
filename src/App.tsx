import './styles/App.css'
import './styles/Toggle.css'
import sunIcon from './assets/sun.svg?raw'
import moonIcon from './assets/moon.svg?raw'
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
  const [win, setWin] = useState(false)
  const [darkTheme, setDarkTheme] = useState(() => {
    const saved = localStorage.getItem('darkTheme')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
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
    localStorage.setItem('darkTheme', String(darkTheme))
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

  const swapCells = (fromCol: number, fromRow: number, toCol: number, toRow: number) => {
    if (win) return

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
      if (targetGrid) {
        saveGame(targetGrid, newCells)
        if (compareGrids(newCells, targetGrid)) {
          setWin(true)
        }
      }
      return newCells
    })
  }

  const handleCellClick = (col: number, row: number) => {
    if (win) return

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

  return (
    <>
      <Toggle.Root
        className='theme-toggle'
        pressed={darkTheme}
        onPressedChange={setDarkTheme}
      >
        <span className='theme-knob'>
          <span className='theme-icon' dangerouslySetInnerHTML={{ __html: darkTheme ? moonIcon : sunIcon }} />
        </span>
      </Toggle.Root>
      <div className='app'>
        <h1>Hue Glue</h1>
        <Grid
          cells={currentGrid}
          selectedCell={selectedCell}
          win={win}
          onCellClick={handleCellClick}
          onCellSwap={swapCells}
        />
        <div className='controls'>
          <ToggleGroup.Root
            className='toggle-group'
            type='single'
            value={gridSize}
            onValueChange={(value) => value && setGridSize(value)}
          >
            <ToggleGroup.Item className='toggle-item' value='6' data-label='6x6' />
            <ToggleGroup.Item className='toggle-item' value='8' data-label='8x8' />
            <ToggleGroup.Item className='toggle-item' value='10' data-label='10x10' />
            <ToggleGroup.Item className='toggle-item' value='12' data-label='12x12' />
          </ToggleGroup.Root>
          <Button onClick={handleNewGame}>New Game</Button>
        </div>
      </div>
    </>
  )
}

export default App