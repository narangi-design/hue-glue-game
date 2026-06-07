import { Jsonizer } from "@badcafe/jsonizer"

import CellModel from "./cell-model"
import Color from "./color-class"

const STORAGE_KEY = "hue-glue-game"

export interface SavedGame {
    initialGridState: CellModel[][]
    currentGridState: CellModel[][]
}

const cellReviver = {
    '.': ({ isAnchor, color }: { isAnchor: boolean; color: Color }) => {
        const cell = new CellModel(isAnchor)
        cell.color = color
        return cell
    },
    color: {
        '.': ({ l, a, b }: { l: number; a: number; b: number }) => new Color(l, a, b)
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
            if (!cell || !target) return false
            if (!cell.color.equals(target.color)) return false
        }
    }
    return true
}