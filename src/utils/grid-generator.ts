import Color from "./color-class"
import Grid from "./grid"
import CellModel from "./cell-model"

function colorAll(grid: CellModel[][], cornerColors: Color[]): CellModel[][] {
    const rows = grid.length
    const cols = grid[0].length

    const [topleft, topright, bottomleft, bottomright] = cornerColors

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const tx = j / (cols - 1)
            const ty = i / (rows - 1)
            grid[i][j].color = Color.bilerp(topleft, topright, bottomleft, bottomright, tx, ty)
        }
    }

    return grid
}

export function generateGrid(rows: number, cols: number): CellModel[][] {
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
        throw new Error(`generateGrid: invalid dimensions rows=${rows}, cols=${cols}`)
    }

    const grid = new Grid(rows, cols)

    const cornerColors = Color.generateCornerColors(grid.corners.length)
    colorAll(grid.cells, cornerColors)

    for (const corner of grid.corners) {
        grid.cells[corner.y][corner.x].isAnchor = true
    }

    return grid.cells
}

export function shuffleGrid(grid: CellModel[][]): CellModel[][] {
    const rows = grid.length
    const cols = grid[0].length

    const colors: Color[] = []
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!grid[i][j].isAnchor && grid[i][j].color) {
                colors.push(grid[i][j].color)
            }
        }
    }

    for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = colors[i]
        colors[i] = colors[j]
        colors[j] = temp
    }

    let colorIndex = 0
    const newGrid: CellModel[][] = grid.map(row =>
        row.map(cell => {
            const newCell = new CellModel(cell.isAnchor)
            if (cell.isAnchor) {
                newCell.color = cell.color
            } else {
                newCell.color = colors[colorIndex++]
            }
            return newCell
        })
    )

    return newGrid
}