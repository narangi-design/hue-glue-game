import { lerp as lerpMath, randomInRange } from "./math"
import { CORNER_LIGHTNESS_LIGHT, CORNER_LIGHTNESS_DARK, CORNER_CHROMA } from "./constants"

type Range = { MIN: number; MAX: number }

type Oklch = { lightness: number; chroma: number; hueAngle: number }
type Oklab = { lightness: number; aChannel: number; bChannel: number }

function oklchToOklab(oklchColor: Oklch): Oklab {
    const hueRadians = oklchColor.hueAngle * Math.PI / 180
    return {
        lightness: oklchColor.lightness,
        aChannel: oklchColor.chroma * Math.cos(hueRadians),
        bChannel: oklchColor.chroma * Math.sin(hueRadians)
    }
}

export default class Color {
    l: number
    a: number
    b: number

    constructor(l: number, a: number, b: number) {
        this.l = l
        this.a = a
        this.b = b
    }

    get css(): string {
        return `oklab(${this.l} ${this.a} ${this.b})`
    }

    static fromOklch(lightness: number, chroma: number, hueAngle: number): Color {
        const lab = oklchToOklab({ lightness, chroma, hueAngle })
        return new Color(lab.lightness, lab.aChannel, lab.bChannel)
    }

    static random(lightnessBand: Range, hueAngle: number): Color {
        return Color.fromOklch(
            randomInRange(lightnessBand.MIN, lightnessBand.MAX),
            randomInRange(CORNER_CHROMA.MIN, CORNER_CHROMA.MAX),
            hueAngle,
        )
    }

    // Corners are ordered: TL(0), TR(1), BL(2), BR(3)
    // Diagonals get opposite lightness so gradients have depth in both directions
    // Hue spacing 60-160° gives wide color variety; Oklab interpolation keeps middles vibrant
    static generateCornerColors(count: number): Color[] {
        const baseHue = Math.random() * 360
        const hueSpacing = randomInRange(60, 160)
        const lightDiag = Math.random() < 0.5 ? [0, 3] : [1, 2]

        return Array.from({ length: count }, (_, i) => {
            const band = lightDiag.includes(i) ? CORNER_LIGHTNESS_LIGHT : CORNER_LIGHTNESS_DARK
            const hueAngle = (baseHue + hueSpacing * i) % 360
            return Color.random(band, hueAngle)
        })
    }

    static lerp(colorL: Color, colorR: Color, interpolant: number): Color {
        return new Color(
            lerpMath(colorL.l, colorR.l, interpolant),
            lerpMath(colorL.a, colorR.a, interpolant),
            lerpMath(colorL.b, colorR.b, interpolant)
        )
    }

    static bilerp(colorTL: Color, colorTR: Color, colorBL: Color, colorBR: Color, tx: number, ty: number): Color {
        const top = Color.lerp(colorTL, colorTR, tx)
        const bottom = Color.lerp(colorBL, colorBR, tx)
        return Color.lerp(top, bottom, ty)
    }
}
