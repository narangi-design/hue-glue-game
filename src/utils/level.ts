import Cell from "./cell"
import Color from "./color"

export interface SerializedCell {
    x: number
    y: number
    r: number
    g: number
    b: number
    isAnchor: boolean
}

export type LevelData = SerializedCell[]

export function serializeGrid(grid: Cell[][]): LevelData {
    const data: LevelData = []

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x]
            if (cell.color) {
                data.push({
                    x,
                    y,
                    r: cell.color.r,
                    g: cell.color.g,
                    b: cell.color.b,
                    isAnchor: cell.isAnchor
                })
            }
        }
    }

    return data
}

export function deserializeGrid(data: LevelData): Cell[][] {
    if (data.length === 0) return []

    const maxY = Math.max(...data.map(c => c.y))
    const maxX = Math.max(...data.map(c => c.x))

    const grid: Cell[][] = []

    for (let y = 0; y <= maxY; y++) {
        const row: Cell[] = []
        for (let x = 0; x <= maxX; x++) {
            row.push(new Cell())
        }
        grid.push(row)
    }

    for (const cellData of data) {
        const cell = grid[cellData.y][cellData.x]
        cell.isAnchor = cellData.isAnchor
        cell.color = new Color(cellData.r, cellData.g, cellData.b)
    }

    return grid
}

const STORAGE_KEY = "hue-glue-game"

export interface SavedGame {
    levelData: LevelData
    cells: LevelData
}

export function saveGame(levelData: LevelData, cells: Cell[][]): void {
    const saved: SavedGame = {
        levelData,
        cells: serializeGrid(cells)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

export function loadGame(): SavedGame | null {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null

    try {
        return JSON.parse(saved) as SavedGame
    } catch {
        return null
    }
}

export function compareGrids(cells: Cell[][], levelData: LevelData): boolean {
    for (const target of levelData) {
        const cell = cells[target.y]?.[target.x]
        if (!cell?.color) return false

        if (
            Math.round(cell.color.r) !== Math.round(target.r) ||
            Math.round(cell.color.g) !== Math.round(target.g) ||
            Math.round(cell.color.b) !== Math.round(target.b)
        ) {
            return false
        }
    }
    return true
}