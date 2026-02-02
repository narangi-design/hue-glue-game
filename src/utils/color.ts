import Grid from "./grid"
import { randomByte, lerp as lerpMath } from "./math"
import CellIndex from "./cell-index"

class Color {
    r: number
    g: number
    b: number
    private _a: number = 1.0

    constructor(r: number, g: number, b: number) {
        this.r = r
        this.g = g
        this.b = b
    }

    get a(): number {
        return this._a
    }
    set a(value: number) {
        if (value < 0 || value > 1) {
            throw new Error("Alpha value must be between 0 and 1")
        }
        this._a = value
    }

    get rgb(): string {
        return `rgb(${this.r} ${this.g} ${this.b})`
    }

    get rgba(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this._a})`
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

    static lerp(colorL: Color, colorR: Color, interpolant: number): Color {
        return new Color(
            lerpMath(colorL.r, colorR.r, interpolant),
            lerpMath(colorL.g, colorR.g, interpolant),
            lerpMath(colorL.b, colorR.b, interpolant)
        )
    }

    static bilerp(colorTL: Color, colorTR: Color, colorBL: Color, colorBR: Color, tx: number, ty: number): Color {
        const top = Color.lerp(colorTL, colorTR, tx)
        const bottom = Color.lerp(colorBL, colorBR, tx)
        return Color.lerp(top, bottom, ty)
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
        anchor.color = anchorColors.pop()
    }
    return anchorWithColors
}

function colorRest(grid: (null | Color)[][], anchors: AnchorWithColor[]): (null | Color)[][] {
    const rows = grid.length
    const cols = grid[0].length

    const [topleft, bottomleft, topright, bottomright] = anchors

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === null) {
                const tx = j / (cols - 1)
                const ty = i / (rows - 1)
                grid[i][j] = Color.bilerp(topleft.color!, topright.color!, bottomleft.color!, bottomright.color!, tx, ty)
            }
        }
    }

    return grid
}

//generate a grid of given dimensions with colored anchors and interpolated colors in between
export function generateGrid(rows: number, cols: number): (null | Color)[][] {
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
        throw new Error(`generateGrid: invalid dimensions rows=${rows}, cols=${cols}`)
    }

    const grid = new Grid(rows, cols)

    let coloredAnchors = colorAnchors(grid.anchors, 100)

    for (const a of coloredAnchors) {
        grid.cells[a.y][a.x] = a.color
    }

    //fill in the rest of the grid
    return colorRest(grid.cells, coloredAnchors)
}

export default Color
