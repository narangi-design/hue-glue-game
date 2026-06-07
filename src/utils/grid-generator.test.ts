import { describe, it, expect } from 'vitest'
import { generateGrid, shuffleGrid } from './grid-generator'
import Color from './color-class'

describe('generateGrid', () => {
  it('returns a grid with the correct dimensions', () => {
    const grid = generateGrid(6, 8)
    expect(grid).toHaveLength(6)
    grid.forEach(row => expect(row).toHaveLength(8))
  })

  it('marks only the four corners as anchors', () => {
    const grid = generateGrid(4, 4)
    const rows = grid.length
    const cols = grid[0].length
    const anchors = grid.flatMap((row, r) => row.map((cell, c) => ({ r, c, isAnchor: cell.isAnchor })))
      .filter(x => x.isAnchor)
    expect(anchors).toHaveLength(4)
    expect(anchors.map(a => `${a.r},${a.c}`).sort()).toEqual(
      ['0,0', `0,${cols - 1}`, `${rows - 1},0`, `${rows - 1},${cols - 1}`].sort()
    )
  })

  it('assigns a color to every cell', () => {
    generateGrid(4, 4).flat().forEach(cell => {
      expect(cell.color).toBeInstanceOf(Color)
    })
  })

  it('throws for non-positive dimensions', () => {
    expect(() => generateGrid(0, 4)).toThrow()
    expect(() => generateGrid(4, -1)).toThrow()
  })

  it('throws for non-integer dimensions', () => {
    expect(() => generateGrid(4.5, 4)).toThrow()
  })
})

describe('generateGrid single-dimension edge cases', () => {
  it('produces finite colors for a 1-row grid (no NaN from 0/0)', () => {
    const grid = generateGrid(1, 4)
    grid.flat().forEach(cell => {
      expect(Number.isFinite(cell.color.l)).toBe(true)
      expect(Number.isFinite(cell.color.a)).toBe(true)
      expect(Number.isFinite(cell.color.b)).toBe(true)
    })
  })
  it('produces finite colors for a 1-column grid', () => {
    const grid = generateGrid(4, 1)
    grid.flat().forEach(cell => {
      expect(Number.isFinite(cell.color.l)).toBe(true)
    })
  })
  it('produces a valid 1x1 grid', () => {
    const grid = generateGrid(1, 1)
    expect(grid).toHaveLength(1)
    expect(Number.isFinite(grid[0][0].color.l)).toBe(true)
  })
})

describe('shuffleGrid', () => {
  it('returns a grid with the same dimensions', () => {
    const grid = generateGrid(6, 6)
    const shuffled = shuffleGrid(grid)
    expect(shuffled).toHaveLength(6)
    shuffled.forEach(row => expect(row).toHaveLength(6))
  })

  it('preserves anchor colors exactly', () => {
    const grid = generateGrid(4, 4)
    const shuffled = shuffleGrid(grid)
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.isAnchor) {
        expect(shuffled[r][c].color.equals(cell.color)).toBe(true)
        expect(shuffled[r][c].isAnchor).toBe(true)
      }
    }))
  })

  it('handles a grid where every cell is an anchor (2x2)', () => {
    const grid = generateGrid(2, 2)
    const allAnchors = grid.flat().every(c => c.isAnchor)
    expect(allAnchors).toBe(true)
    const shuffled = shuffleGrid(grid)
    grid.forEach((row, r) => row.forEach((cell, c) => {
      expect(shuffled[r][c].color.equals(cell.color)).toBe(true)
    }))
  })

  it('preserves the multiset of non-anchor colors', () => {
    const grid = generateGrid(4, 4)
    const before = grid.flat().filter(c => !c.isAnchor).map(c => c.color.css).sort()
    const shuffled = shuffleGrid(grid)
    const after = shuffled.flat().filter(c => !c.isAnchor).map(c => c.color.css).sort()
    expect(after).toEqual(before)
  })
})
