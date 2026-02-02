import { useState, useEffect } from "react"
import Grid from "./components/Grid"
import { generateGrid } from "./utils/color"
import Cell from "./utils/cell"

function App() {
  const [cells, setCells] = useState<Cell[][]>([])
  const [initialGrid, setInitialGrid] = useState<Cell[][]>([])

  useEffect(() => {
    const grid = generateGrid(15, 15)
    setInitialGrid(grid)
    setCells(grid)
  }, [])

  return (
    <div className="app">
      <h1>Hue Glue</h1>
      <Grid cells={cells} />
    </div>
  )
}

export default App