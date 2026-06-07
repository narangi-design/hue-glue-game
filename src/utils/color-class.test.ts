import { describe, it, expect } from 'vitest'
import Color from './color-class'

describe('Color.css', () => {
  it('formats as oklab string', () => {
    expect(new Color(0.5, 0.1, -0.2).css).toBe('oklab(0.5 0.1 -0.2)')
  })
})

describe('Color.equals', () => {
  it('returns true for identical colors', () => {
    expect(new Color(0.5, 0.1, 0.2).equals(new Color(0.5, 0.1, 0.2))).toBe(true)
  })
  it('returns false when any channel differs', () => {
    expect(new Color(0.5, 0.1, 0.2).equals(new Color(0.6, 0.1, 0.2))).toBe(false)
    expect(new Color(0.5, 0.1, 0.2).equals(new Color(0.5, 0.2, 0.2))).toBe(false)
    expect(new Color(0.5, 0.1, 0.2).equals(new Color(0.5, 0.1, 0.3))).toBe(false)
  })
})

describe('Color.lerp', () => {
  it('returns left color at t=0', () => {
    const result = Color.lerp(new Color(0, 0, 0), new Color(1, 1, 1), 0)
    expect(result.equals(new Color(0, 0, 0))).toBe(true)
  })
  it('returns right color at t=1', () => {
    const result = Color.lerp(new Color(0, 0, 0), new Color(1, 1, 1), 1)
    expect(result.equals(new Color(1, 1, 1))).toBe(true)
  })
  it('interpolates channels at t=0.5', () => {
    const result = Color.lerp(new Color(0, 0, 0), new Color(1, 1, 1), 0.5)
    expect(result.l).toBeCloseTo(0.5)
    expect(result.a).toBeCloseTo(0.5)
    expect(result.b).toBeCloseTo(0.5)
  })
})

describe('Color.bilerp', () => {
  it('returns the same color when all corners are equal', () => {
    const c = new Color(0.5, 0.1, 0.2)
    const result = Color.bilerp(c, c, c, c, 0.3, 0.7)
    expect(result.l).toBeCloseTo(0.5)
    expect(result.a).toBeCloseTo(0.1)
    expect(result.b).toBeCloseTo(0.2)
  })
  it('returns top-left at (tx=0, ty=0)', () => {
    const tl = new Color(1, 0, 0)
    const result = Color.bilerp(tl, new Color(0, 0, 0), new Color(0, 0, 0), new Color(0, 0, 0), 0, 0)
    expect(result.equals(tl)).toBe(true)
  })
  it('returns bottom-right at (tx=1, ty=1)', () => {
    const br = new Color(0, 0.5, 0.5)
    const result = Color.bilerp(new Color(0, 0, 0), new Color(0, 0, 0), new Color(0, 0, 0), br, 1, 1)
    expect(result.equals(br)).toBe(true)
  })
})

describe('Color.fromOklch', () => {
  it('converts hue 0° correctly (a=chroma, b≈0)', () => {
    const c = Color.fromOklch(0.6, 0.1, 0)
    expect(c.l).toBeCloseTo(0.6)
    expect(c.a).toBeCloseTo(0.1)
    expect(c.b).toBeCloseTo(0)
  })
  it('converts hue 90° correctly (a≈0, b=chroma)', () => {
    const c = Color.fromOklch(0.6, 0.1, 90)
    expect(c.l).toBeCloseTo(0.6)
    expect(c.a).toBeCloseTo(0)
    expect(c.b).toBeCloseTo(0.1)
  })
})

describe('Color.generateCornerColors', () => {
  it('returns the requested number of colors', () => {
    expect(Color.generateCornerColors(4)).toHaveLength(4)
  })
  it('all colors have valid lightness (0–1)', () => {
    Color.generateCornerColors(4).forEach(c => {
      expect(c.l).toBeGreaterThan(0)
      expect(c.l).toBeLessThan(1)
    })
  })
  it('returns empty array for count 0', () => {
    expect(Color.generateCornerColors(0)).toHaveLength(0)
  })
})

describe('Color.bilerp corner positions', () => {
  const tl = new Color(1, 0, 0)
  const tr = new Color(0, 1, 0)
  const bl = new Color(0, 0, 1)
  const br = new Color(0.5, 0.5, 0.5)

  it('returns top-right at (tx=1, ty=0)', () => {
    expect(Color.bilerp(tl, tr, bl, br, 1, 0).equals(tr)).toBe(true)
  })
  it('returns bottom-left at (tx=0, ty=1)', () => {
    expect(Color.bilerp(tl, tr, bl, br, 0, 1).equals(bl)).toBe(true)
  })
})
