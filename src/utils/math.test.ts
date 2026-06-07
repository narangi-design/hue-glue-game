import { describe, it, expect } from 'vitest'
import { lerp, randomInRange } from './math'

describe('lerp', () => {
  it('returns start at t=0', () => expect(lerp(0, 10, 0)).toBe(0))
  it('returns end at t=1', () => expect(lerp(0, 10, 1)).toBe(10))
  it('returns midpoint at t=0.5', () => expect(lerp(0, 10, 0.5)).toBe(5))
  it('works with negative range', () => expect(lerp(-10, 10, 0.5)).toBe(0))
})

describe('randomInRange', () => {
  it('returns a value within [min, max]', () => {
    for (let i = 0; i < 50; i++) {
      const v = randomInRange(3, 7)
      expect(v).toBeGreaterThanOrEqual(3)
      expect(v).toBeLessThanOrEqual(7)
    }
  })
  it('returns min when min === max', () => {
    expect(randomInRange(5, 5)).toBe(5)
  })
})

describe('lerp edge cases', () => {
  it('extrapolates beyond t=1', () => expect(lerp(0, 10, 2)).toBe(20))
  it('extrapolates below t=0', () => expect(lerp(0, 10, -1)).toBe(-10))
  it('returns start when start === end', () => expect(lerp(7, 7, 0.5)).toBe(7))
})
