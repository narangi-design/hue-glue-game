import Grid from "./grid"
import { lerp as lerpMath } from "./math"
import CellIndex from "./cell-index"
import Cell from "./cell"
import {
    COLOR,
    BRIGHTNESS,
    MIN_COLOR_DISTANCE,
    MIN_BRIGHTNESS_DIFFERENCE
} from "../constants"

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

    brightness(): number {
        return 0.299 * this.r + 0.587 * this.g + 0.114 * this.b
    }

    static brightnessDifference(colorA: Color, colorB: Color): number {
        return Math.abs(colorA.brightness() - colorB.brightness())
    }

    // Linear interpolation between two colors
    static lerp(colorL: Color, colorR: Color, interpolant: number): Color {
        return new Color(
            lerpMath(colorL.r, colorR.r, interpolant),
            lerpMath(colorL.g, colorR.g, interpolant),
            lerpMath(colorL.b, colorR.b, interpolant)
        )
    }

    // Bilinear interpolation for smooth gradients across a 2D grid
    static bilerp(colorTL: Color, colorTR: Color, colorBL: Color, colorBR: Color, tx: number, ty: number): Color {
        const top = Color.lerp(colorTL, colorTR, tx)
        const bottom = Color.lerp(colorBL, colorBR, tx)
        return Color.lerp(top, bottom, ty)
    }

    static random(): Color {
        const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

        return new Color(
            randomInRange(COLOR.MIN, COLOR.MAX),
            randomInRange(COLOR.MIN, COLOR.MAX),
            randomInRange(COLOR.MIN, COLOR.MAX)
        )
    }

    static invertBrightness(color: Color): Color {
        const brightness = color.brightness()
        const targetBrightness = brightness > BRIGHTNESS.THRESHOLD ? BRIGHTNESS.MIN : BRIGHTNESS.MAX
        const factor = targetBrightness / brightness
        return new Color(
            Math.max(COLOR.MIN, Math.min(COLOR.MAX, color.r * factor)),
            Math.max(COLOR.MIN, Math.min(COLOR.MAX, color.g * factor)),
            Math.max(COLOR.MIN, Math.min(COLOR.MAX, color.b * factor))
        )
    }

    static shiftHue(color: Color, degrees: number): Color {
        const offset = degrees / 360 * 255
        return new Color(
            Math.max(COLOR.MIN, Math.min(COLOR.MAX, (color.r + offset) % 256)),
            Math.max(COLOR.MIN, Math.min(COLOR.MAX, (color.g + offset * 0.7) % 256)),
            Math.max(COLOR.MIN, Math.min(COLOR.MAX, (color.b + offset * 1.3) % 256))
        )
    }
}

interface AnchorWithColor extends CellIndex {
    color?: Color
}

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

function colorAnchors(
    anchors: CellIndex[],
    minDistance: number,
    minBrightnessDiff: number
): AnchorWithColor[] {
    let anchorColors = makeListOfAnchorColors(anchors.length, minDistance, minBrightnessDiff)
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

    let coloredAnchors = colorAnchors(grid.anchors, MIN_COLOR_DISTANCE, MIN_BRIGHTNESS_DIFFERENCE)

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
