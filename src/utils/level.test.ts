import { describe, it, expect, beforeEach } from 'vitest'
import { saveGame, loadGame, compareGrids } from './level'
import { generateGrid } from './grid-generator'
import CellModel from './cell-model'
import Color from './color-class'

beforeEach(() => localStorage.clear())

describe('compareGrids', () => {
  it('returns true for two empty grids', () => {
    expect(compareGrids([], [])).toBe(true)
  })

  it('returns true when grids have identical colors', () => {
    const grid = generateGrid(4, 4)
    expect(compareGrids(grid, grid)).toBe(true)
  })

  it('returns false when a cell color differs', () => {
    const a = generateGrid(4, 4)
    const b = generateGrid(4, 4)
    b[0][0].color = new Color(0, 0, 0)
    a[0][0].color = new Color(1, 1, 1)
    expect(compareGrids(a, b)).toBe(false)
  })

  it('returns false when dimensions differ', () => {
    const a = generateGrid(4, 4)
    const b = generateGrid(4, 6)
    expect(compareGrids(a, b)).toBe(false)
  })
})

describe('saveGame / loadGame', () => {
  it('returns null when nothing is saved', () => {
    expect(loadGame()).toBeNull()
  })

  it('round-trips grid data', () => {
    const initial = generateGrid(4, 4)
    const current = generateGrid(4, 4)
    saveGame(initial, current)

    const loaded = loadGame()
    expect(loaded).not.toBeNull()
    expect(compareGrids(loaded!.initialGridState, initial)).toBe(true)
    expect(compareGrids(loaded!.currentGridState, current)).toBe(true)
  })

  it('restores CellModel instances with correct anchor flag', () => {
    const grid = generateGrid(4, 4)
    saveGame(grid, grid)
    const loaded = loadGame()!

    loaded.initialGridState.flat().forEach((cell, i) => {
      expect(cell).toBeInstanceOf(CellModel)
      expect(cell.isAnchor).toBe(grid.flat()[i].isAnchor)
    })
  })

  it('returns null when stored data is corrupted', () => {
    localStorage.setItem('hue-glue-game', 'not-json')
    expect(loadGame()).toBeNull()
  })
})
