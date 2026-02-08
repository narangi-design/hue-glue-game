import './styles/App.css'
import logoImage from './assets/logo.svg?raw'
import { useState, useEffect } from 'react'
import Grid from './components/Grid'
import Button from './components/Button'
import ThemeToggle from './components/ThemeToggle'
import SizeSelector from './components/SizeSelector'
import { CellModel } from './utils/cell'
import { generateGrid, shuffleGrid } from './utils/grid-generator'
import { saveGame, loadGame, compareGrids } from './utils/level'

function App() {
  const [currentGrid, setCurrentGrid] = useState<CellModel[][]>(() => generateGrid(8, 8))
  const [targetGrid, setTargetGrid] = useState<CellModel[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null)
  const [win, setWin] = useState(true)
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
      setWin(false)
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
      if (targetGrid.length > 0) {
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
      <ThemeToggle darkTheme={darkTheme} onToggle={setDarkTheme} />
      <div className='app'>
        <h1>
          <span className="logo" aria-hidden="true" dangerouslySetInnerHTML={{ __html: logoImage }} />
          Hue Glue Game
        </h1>
        <Grid
          cells={currentGrid}
          selectedCell={selectedCell}
          win={win}
          onCellClick={handleCellClick}
          onCellSwap={swapCells}
        />
        <div className='controls'>
          <SizeSelector value={gridSize} onChange={setGridSize} />
          <Button onClick={handleNewGame}>New Game</Button>
        </div>
      </div>
      <a className="repo-link" href="https://github.com/narangiraffe/hue-glue-game" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </>
  )
}

export default App