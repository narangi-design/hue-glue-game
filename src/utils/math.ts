export const lerp = (start: number, end: number, interpolant: number): number => 
    start + (end - start) * interpolant

export const getRandomValue = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

export const clamp = (number: number, min: number, max: number): number => 
    Math.max(min, Math.min(number, max))
