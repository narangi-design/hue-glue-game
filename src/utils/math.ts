// Linear interpolation without rounding for smoother gradients
export function lerp(start: number, end: number, interpolant: number): number {
    return start + (end - start) * interpolant
}

// Smooth interpolation using smoothstep for even smoother transitions
export function smoothLerp(start: number, end: number, interpolant: number): number {
    // Clamp interpolant to [0, 1]
    const t = Math.max(0, Math.min(1, interpolant))
    // Apply smoothstep formula: 3t² - 2t³
    const smooth = t * t * (3 - 2 * t)
    return start + (end - start) * smooth
}

export function randomByte(): number {
    return Math.floor(Math.random() * 256)
}
