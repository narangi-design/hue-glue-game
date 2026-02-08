export const lerp = (start: number, end: number, interpolant: number): number =>
    start + (end - start) * interpolant

export const randomInRange = (min: number, max: number): number => min + Math.random() * (max - min)