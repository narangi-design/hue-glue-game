import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useGame from './useGame'
import { saveGame } from '../utils/level'
import { generateGrid } from '../utils/grid-generator'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useGame', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.gameState).toBe('idle')
  })

  it('transitions to playing after handleNewGame', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleNewGame())
    expect(result.current.gameState).toBe('playing')
  })

  it('swapCells is a no-op when idle', () => {
    const { result } = renderHook(() => useGame())
    const gridBefore = result.current.currentGrid
    act(() => result.current.swapCells(0, 0, 1, 1))
    expect(result.current.currentGrid).toBe(gridBefore)
  })

  it('swapCells exchanges colors of two non-anchor cells', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleNewGame())

    const grid = result.current.currentGrid
    const nonAnchors = grid.flatMap((row, r) =>
      row.flatMap((cell, c) => cell.isAnchor ? [] : [{ r, c, color: cell.color }])
    )
    const [a, b] = nonAnchors
    const colorA = a.color.css
    const colorB = b.color.css

    act(() => result.current.swapCells(a.c, a.r, b.c, b.r))

    expect(result.current.currentGrid[a.r][a.c].color.css).toBe(colorB)
    expect(result.current.currentGrid[b.r][b.c].color.css).toBe(colorA)
  })

  it('handleCellClick selects a cell then swaps on second click', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleNewGame())

    const grid = result.current.currentGrid
    const nonAnchors = grid.flatMap((row, r) =>
      row.flatMap((cell, c) => cell.isAnchor ? [] : [{ r, c, color: cell.color }])
    )
    const [a, b] = nonAnchors
    const colorA = a.color.css
    const colorB = b.color.css

    act(() => result.current.handleCellClick(a.c, a.r))
    expect(result.current.selectedCell).toEqual({ x: a.c, y: a.r })

    act(() => result.current.handleCellClick(b.c, b.r))
    expect(result.current.selectedCell).toBeNull()
    expect(result.current.currentGrid[a.r][a.c].color.css).toBe(colorB)
    expect(result.current.currentGrid[b.r][b.c].color.css).toBe(colorA)
  })

  it('clicking the same cell twice deselects it', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleNewGame())

    const { r, c } = result.current.currentGrid
      .flatMap((row, r) => row.map((cell, c) => ({ r, c, isAnchor: cell.isAnchor })))
      .find(x => !x.isAnchor)!

    act(() => result.current.handleCellClick(c, r))
    act(() => result.current.handleCellClick(c, r))
    expect(result.current.selectedCell).toBeNull()
  })

  it('persists gridSize to localStorage', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.setGridSize('10'))
    expect(localStorage.getItem('hue-glue-grid-size')).toBe('10')
  })

  it('restores playing state from a saved game on mount', () => {
    const grid = generateGrid(4, 4)
    saveGame(grid, grid)
    const { result } = renderHook(() => useGame())
    expect(result.current.gameState).toBe('playing')
  })

  it('swapCells with the same source and target is a color no-op', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleNewGame())

    const { r, c, color } = result.current.currentGrid
      .flatMap((row, r) => row.map((cell, c) => ({ r, c, color: cell.color, isAnchor: cell.isAnchor })))
      .find(x => !x.isAnchor)!
    const colorBefore = color.css

    act(() => result.current.swapCells(c, r, c, r))
    expect(result.current.currentGrid[r][c].color.css).toBe(colorBefore)
  })

  it('transitions to won when swapCells produces a solved grid', async () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleNewGame())

    // Force compareGrids to return true on the next swap
    vi.spyOn(
      await import('../utils/level'),
      'compareGrids'
    ).mockReturnValue(true)

    const nonAnchors = result.current.currentGrid
      .flatMap((row, r) => row.map((cell, c) => ({ r, c, isAnchor: cell.isAnchor })))
      .filter(x => !x.isAnchor)
    const [a, b] = nonAnchors

    act(() => result.current.swapCells(a.c, a.r, b.c, b.r))
    expect(result.current.gameState).toBe('won')
  })

  it('swapCells is a no-op when game is won', async () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.handleNewGame())

    vi.spyOn(
      await import('../utils/level'),
      'compareGrids'
    ).mockReturnValue(true)

    const nonAnchors = result.current.currentGrid
      .flatMap((row, r) => row.map((cell, c) => ({ r, c, isAnchor: cell.isAnchor })))
      .filter(x => !x.isAnchor)
    const [a, b] = nonAnchors

    act(() => result.current.swapCells(a.c, a.r, b.c, b.r))
    expect(result.current.gameState).toBe('won')

    const gridAfterWin = result.current.currentGrid
    act(() => result.current.swapCells(a.c, a.r, b.c, b.r))
    expect(result.current.currentGrid).toBe(gridAfterWin)
  })
})
