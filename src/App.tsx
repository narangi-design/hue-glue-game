import { useState, useEffect } from "react"
import Grid from "./components/Grid"
import { generateGrid } from "./utils/color"
import Color from "./utils/color"

function App() {
  const [cells, setCells] = useState<(Color | null)[][]>([])

  useEffect(() => {
    const initialGrid = generateGrid(7, 7)
    setCells(initialGrid)
  }, [])

  return (
    <div className="app">
      <h1>Hue Glue</h1>
      <Grid cells={cells} />
    </div>
  )
}

export default App