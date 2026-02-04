import { Jsonizer } from "@badcafe/jsonizer"
import { CellModel } from "./cell"
import Color from "./color"

const STORAGE_KEY = "hue-glue-game"

export interface SavedGame {
    initialGridState: CellModel[][]
    currentGridState: CellModel[][]
}

const cellReviver = {
    '.': ({ isAnchor, _color }: { isAnchor: boolean; _color: Color }) => {
        const cell = new CellModel(isAnchor)
        cell.color = _color
        return cell
    },
    _color: {
        '.': ({ r, g, b }: { r: number; g: number; b: number }) => new Color(r, g, b)
    }
}

const savedGameReviver = Jsonizer.reviver<SavedGame>({
    initialGridState: { '*': { '*': cellReviver } },
    currentGridState: { '*': { '*': cellReviver } }
})

export function saveGame(initialGridState: CellModel[][], currentGridState: CellModel[][]): void {
    const saved: SavedGame = {
        initialGridState,
        currentGridState
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

export function loadGame(): SavedGame | null {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null

    try {
        return JSON.parse(saved, savedGameReviver)
    } catch {
        return null
    }
}

export function compareGrids(cells: CellModel[][], levelData: CellModel[][]): boolean {
    for (let y = 0; y < levelData.length; y++) {
        for (let x = 0; x < levelData[y].length; x++) {
            const target = levelData[y][x]
            const cell = cells[y]?.[x]
            if (!cell?.color || !target?.color) return false

            if (Math.round(cell.color.r) !== Math.round(target.color.r)
                || Math.round(cell.color.g) !== Math.round(target.color.g)
                || Math.round(cell.color.b) !== Math.round(target.color.b)
            ) {
                return false
            }
        }
    }
    return true
}