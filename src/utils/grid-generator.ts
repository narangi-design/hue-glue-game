import { ANCHOR_LIGHTNESS_LIGHT, ANCHOR_LIGHTNESS_DARK, ANCHOR_CHROMA } from "./constants"
import { oklchToColor } from "./oklch"

import Color from "./color-class"
import Grid from "./grid"
import CellModel from "./cell-model"

function randomInRange(min: number, max: number): number {
    return min + Math.random() * (max - min)
}

// Anchors are ordered: TL(0), TR(1), BL(2), BR(3)
// Diagonals get opposite lightness so gradients have depth in both directions
// Hue spacing 20-75° keeps corners in the same color neighborhood
function makeListOfAnchorColors(count: number): Color[] {
    const baseHue = Math.random() * 360
    const hueSpacing = randomInRange(20, 75)

    // Randomly pick which diagonal is light vs dark
    const lightDiag = Math.random() < 0.5 ? [0, 3] : [1, 2]

    return Array.from({ length: count }, (_, i) => {
        const h = (baseHue + hueSpacing * i) % 360
        const band = lightDiag.includes(i) ? ANCHOR_LIGHTNESS_LIGHT : ANCHOR_LIGHTNESS_DARK
        const l = randomInRange(band.MIN, band.MAX)
        const c = randomInRange(ANCHOR_CHROMA.MIN, ANCHOR_CHROMA.MAX)
        return oklchToColor(l, c, h)
    })
}

function colorRest(grid: CellModel[][], anchorColors: Color[]): CellModel[][] {
    const rows = grid.length
    const cols = grid[0].length

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

    let anchorColors = makeListOfAnchorColors(grid.anchors.length)

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