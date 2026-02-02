import Grid from "./grid"
import { randomByte, lerp as lerpMath, smoothLerp as smoothLerpMath } from "./math"
import CellIndex from "./cell-index"
import Cell from "./cell"

class Color {
    r: number
    g: number
    b: number

    constructor(r: number, g: number, b: number) {
        this.r = r
        this.g = g
        this.b = b
    }

    get rgb(): string {
        return `rgb(${Math.round(this.r)} ${Math.round(this.g)} ${Math.round(this.b)})`
    }

    distanceTo(otherColor: Color): number {
        return Color.distance(this, otherColor)
    }

    static distance(colorA: Color, colorB: Color): number {
        return Math.sqrt(
            (colorA.r - colorB.r) ** 2 +
            (colorA.g - colorB.g) ** 2 +
            (colorA.b - colorB.b) ** 2
        )
    }

    // Linear interpolation between two colors
    static lerp(colorL: Color, colorR: Color, interpolant: number): Color {
        return new Color(
            lerpMath(colorL.r, colorR.r, interpolant),
            lerpMath(colorL.g, colorR.g, interpolant),
            lerpMath(colorL.b, colorR.b, interpolant)
        )
    }

    // Smooth interpolation between two colors using smoothstep
    static smoothLerp(colorL: Color, colorR: Color, interpolant: number): Color {
        return new Color(
            smoothLerpMath(colorL.r, colorR.r, interpolant),
            smoothLerpMath(colorL.g, colorR.g, interpolant),
            smoothLerpMath(colorL.b, colorR.b, interpolant)
        )
    }

    // Bilinear interpolation for smooth gradients across a 2D grid
    static bilerp(colorTL: Color, colorTR: Color, colorBL: Color, colorBR: Color, tx: number, ty: number): Color {
        // Use smoothLerp for even smoother gradients
        const top = Color.smoothLerp(colorTL, colorTR, tx)
        const bottom = Color.smoothLerp(colorBL, colorBR, tx)
        return Color.smoothLerp(top, bottom, ty)
    }

    static random(): Color {
        return new Color(
            randomByte(),
            randomByte(),
            randomByte()
        )
    }
}

interface AnchorWithColor extends CellIndex {
    color?: Color
}

function makeListOfAnchorColors(anchorCount: number, minDistance: number): Color[] {
    let colors: Color[] = [Color.random()]

    while (colors.length < anchorCount) {
        const randomColor = Color.random()
        if (colors.every(c => Color.distance(c, randomColor) >= minDistance)) {
            colors.push(randomColor)
        }
    }

    return colors
}

function colorAnchors(anchors: CellIndex[], minDistance: number): AnchorWithColor[] {
    let anchorColors = makeListOfAnchorColors(anchors.length, minDistance)
    const anchorWithColors = anchors as AnchorWithColor[]
    for (const anchor of anchorWithColors) {
        anchor.color = anchorColors.shift()
    }
    return anchorWithColors
}

function colorRest(grid: Cell[][], anchors: AnchorWithColor[]): Cell[][] {
    const rows = grid.length
    const cols = grid[0].length

    // Anchors are: [top-left, top-right, bottom-left, bottom-right]
    const [topleft, topright, bottomleft, bottomright] = anchors

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!grid[i][j].isAnchor) {
                const tx = j / (cols - 1)
                const ty = i / (rows - 1)
                grid[i][j].color = Color.bilerp(topleft.color!, topright.color!, bottomleft.color!, bottomright.color!, tx, ty)
            }
        }
    }

    return grid
}

//generate a grid of given dimensions with colored anchors and interpolated colors in between
export function generateGrid(rows: number, cols: number): Cell[][] {
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
        throw new Error(`generateGrid: invalid dimensions rows=${rows}, cols=${cols}`)
    }

    const grid = new Grid(rows, cols)

    let coloredAnchors = colorAnchors(grid.anchors, 100)

    for (const a of coloredAnchors) {
        grid.cells[a.y][a.x].color = a.color
    }

    //fill in the rest of the grid
    return colorRest(grid.cells, coloredAnchors)
}

//shuffle all cells except anchors
export function shuffleGrid(grid: Cell[][]): Cell[][] {
    const rows = grid.length
    const cols = grid[0].length

    const colors: Color[] = []
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!grid[i][j].isAnchor && grid[i][j].color) {
                colors.push(grid[i][j].color!)
            }
        }
    }

    for (let i = colors.length - 1; i > 0; i--) {
        let j: number = Math.floor(Math.random() * (i + 1))
        const temp = colors[i]
        colors[i] = colors[j]
        colors[j] = temp
    }

    let colorIndex = 0
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!grid[i][j].isAnchor && grid[i][j].color) {
                grid[i][j].color = colors[colorIndex++]
            }
        }
    }

    return grid
}

export default Color
