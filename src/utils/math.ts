export function lerp(start: number, end: number, interpolant: number): number {
    return Math.round(start + (end - start) * interpolant)
}

export function randomByte(): number {
    return Math.floor(Math.random() * 256)
}
