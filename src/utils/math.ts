// Linear interpolation without rounding for smoother gradients
export function lerp(start: number, end: number, interpolant: number): number {
    return start + (end - start) * interpolant
}

export function randomByte(): number {
    return Math.floor(Math.random() * 256)
}
