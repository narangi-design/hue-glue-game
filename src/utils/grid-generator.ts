import Color from "./color-class"
import Grid from "./grid"
import CellModel from "./cell-model"

export function generateGrid(rows: number, cols: number): CellModel[][] {
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
        throw new Error(`generateGrid: invalid dimensions rows=${rows}, cols=${cols}`)
    }

    const grid = new Grid(rows, cols)
    const [topleft, topright, bottomleft, bottomright] = Color.generateCornerColors(grid.corners.length)

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tx = cols > 1 ? col / (cols - 1) : 0
            const ty = rows > 1 ? row / (rows - 1) : 0
            grid.cells[row][col].color = Color.bilerp(topleft, topright, bottomleft, bottomright, tx, ty)
        }
    }

    for (const corner of grid.corners) {
        grid.cells[corner.row][corner.col].isAnchor = true
    }

    return grid.cells
}

export function shuffleGrid(grid: CellModel[][]): CellModel[][] {
    const rows = grid.length
    const cols = grid[0].length

    const colors: Color[] = []
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!grid[row][col].isAnchor && grid[row][col].color) {
                colors.push(grid[row][col].color)
            }
        }
    }

    for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]]
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