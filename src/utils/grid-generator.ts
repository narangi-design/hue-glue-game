import { MIN_COLOR_DISTANCE, MIN_BRIGHTNESS_DIFFERENCE } from "./constants"

import Color from "./color-class"
import Grid from "./grid"
import CellModel from "./cell-model"

function makeListOfAnchorColors(anchorCount: number, minDistance: number, minBrightnessDiff: number): Color[] {
    const areColorsDifferent = (colors: Color[]): boolean => {
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const distance = Color.distance(colors[i], colors[j])
                const brightnessDiff = Color.brightnessDifference(colors[i], colors[j])
                if (distance < minDistance || brightnessDiff < minBrightnessDiff) {
                    return false
                }
            }
        }
        return true
    }

    let colors: Color[] = []
    let attempts = 0

    while (attempts < 100) {
        const base = Color.random()
        colors = [base]

        const spacing = 360 / anchorCount

        for (let i = 1; i < anchorCount; i++) {
            colors.push(Math.random() < 0.5
                ? Color.invertBrightness(base)
                : Color.shiftHue(base, spacing * i))
        }

        if (areColorsDifferent(colors)) {
            return colors
        }
        attempts++
    }

    return colors
}

function colorRest(grid: CellModel[][], anchorColors: Color[]): CellModel[][] {
    const rows = grid.length
    const cols = grid[0].length

    // FIXME
    const [topleft, topright, bottomleft, bottomright] = anchorColors

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!grid[i][j].isAnchor) {
                const tx = j / (cols - 1)
                const ty = i / (rows - 1)
                grid[i][j].color = Color.bilerp(topleft, topright, bottomleft, bottomright, tx, ty)
            }
        }
    }

    return grid
}

export function generateGrid(rows: number, cols: number): CellModel[][] {
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
        throw new Error(`generateGrid: invalid dimensions rows=${rows}, cols=${cols}`)
    }

    const grid = new Grid(rows, cols)

    // FIXME guarantee elementwise correspondence with grid.anchors
    let anchorColors = makeListOfAnchorColors(grid.anchors.length, MIN_COLOR_DISTANCE, MIN_BRIGHTNESS_DIFFERENCE)

    for (const [i, a] of grid.anchors.entries()) {
        grid.cells[a.y][a.x].color = anchorColors[i]
    }

    return colorRest(grid.cells, anchorColors)
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