import Color from "./color-class"
import { lerp } from "./math"

// --- OKLCH → RGB ---

function oklchToOklab(l: number, c: number, h: number): [number, number, number] {
    const hRad = h * Math.PI / 180
    return [l, c * Math.cos(hRad), c * Math.sin(hRad)]
}

function oklabToLinearRgb(l: number, a: number, b: number): [number, number, number] {
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b

    const lCubed = l_ * l_ * l_
    const mCubed = m_ * m_ * m_
    const sCubed = s_ * s_ * s_

    return [
        +4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed,
        -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed,
        -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.7076147010 * sCubed,
    ]
}

function linearToSrgb(c: number): number {
    return c <= 0.0031308
        ? 12.92 * c
        : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

export function oklchToColor(l: number, c: number, h: number): Color {
    const [labL, labA, labB] = oklchToOklab(l, c, h)
    const [lr, lg, lb] = oklabToLinearRgb(labL, labA, labB)

    return new Color(
        Math.round(Math.max(0, Math.min(255, linearToSrgb(lr) * 255))),
        Math.round(Math.max(0, Math.min(255, linearToSrgb(lg) * 255))),
        Math.round(Math.max(0, Math.min(255, linearToSrgb(lb) * 255))),
    )
}

// --- RGB → OKLCH ---

function srgbToLinear(c: number): number {
    return c <= 0.04045
        ? c / 12.92
        : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

    const lRoot = Math.cbrt(l)
    const mRoot = Math.cbrt(m)
    const sRoot = Math.cbrt(s)

    return [
        0.2104542553 * lRoot + 0.7936177850 * mRoot - 0.0040720468 * sRoot,
        1.9779984951 * lRoot - 2.4285922050 * mRoot + 0.4505937099 * sRoot,
        0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.8086757660 * sRoot,
    ]
}

type Oklch = { l: number; c: number; h: number }

export function colorToOklch(color: Color): Oklch {
    const lr = srgbToLinear(color.r / 255)
    const lg = srgbToLinear(color.g / 255)
    const lb = srgbToLinear(color.b / 255)

    const [labL, labA, labB] = linearRgbToOklab(lr, lg, lb)

    const c = Math.sqrt(labA * labA + labB * labB)
    const h = ((Math.atan2(labB, labA) * 180 / Math.PI) % 360 + 360) % 360

    return { l: labL, c, h }
}

// --- OKLCH bilerp ---

function lerpHue(h1: number, h2: number, t: number): number {
    let diff = h2 - h1
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    return ((h1 + diff * t) % 360 + 360) % 360
}

export function oklchBilerp(
    tl: Color, tr: Color, bl: Color, br: Color,
    tx: number, ty: number
): Color {
    const tlLch = colorToOklch(tl)
    const trLch = colorToOklch(tr)
    const blLch = colorToOklch(bl)
    const brLch = colorToOklch(br)

    const topL = lerp(tlLch.l, trLch.l, tx)
    const topC = lerp(tlLch.c, trLch.c, tx)
    const topH = lerpHue(tlLch.h, trLch.h, tx)

    const botL = lerp(blLch.l, brLch.l, tx)
    const botC = lerp(blLch.c, brLch.c, tx)
    const botH = lerpHue(blLch.h, brLch.h, tx)

    return oklchToColor(
        lerp(topL, botL, ty),
        lerp(topC, botC, ty),
        lerpHue(topH, botH, ty),
    )
}