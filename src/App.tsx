import logoImage from './assets/logo.svg?raw'
import './styles/App.css'

import useTheme from './hooks/useTheme'
import useGame from './hooks/useGame'

import Grid from './components/Grid'
import Button from './components/Button'
import ThemeToggle from './components/ThemeToggle'
import SizeSelector from './components/SizeSelector'

function App() {
  const { darkTheme, setDarkTheme } = useTheme()
  const { handleNewGame, gridSize, setGridSize, currentGrid, selectedCell, handleCellClick, swapCells, win } = useGame()

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
          onCellClick={handleCellClick}
          onCellSwap={swapCells}
          win={win}
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
