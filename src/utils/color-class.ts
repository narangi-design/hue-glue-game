import { lerp as lerpMath, randomInRange } from "./math"
import { CORNER_LIGHTNESS_LIGHT, CORNER_LIGHTNESS_DARK, CORNER_CHROMA } from "./constants"

type Range = { MIN: number; MAX: number }

type Oklch = { lightness: number; chroma: number; hueAngle: number }
type Oklab = { lightness: number; aChannel: number; bChannel: number }
type Rgb = { red: number; green: number; blue: number }

function oklchToOklab(oklchColor: Oklch): Oklab {
    const lightness = oklchColor.lightness
    const chroma = oklchColor.chroma
    const hueAngle = oklchColor.hueAngle
    const hueRadians = hueAngle * Math.PI / 180
    return {
        lightness: lightness,
        aChannel: chroma * Math.cos(hueRadians),
        bChannel: chroma * Math.sin(hueRadians)
    }
}

function oklabToLinearRgb(oklabColor: Oklab): Rgb {
    const lightness = oklabColor.lightness
    const aChannel = oklabColor.aChannel
    const bChannel = oklabColor.bChannel

    const l = lightness + 0.3963377774 * aChannel + 0.2158037573 * bChannel
    const m = lightness - 0.1055613458 * aChannel - 0.0638541728 * bChannel
    const s = lightness - 0.0894841775 * aChannel - 1.2914855480 * bChannel

    const lCubed = l * l * l
    const mCubed = m * m * m
    const sCubed = s * s * s

    return {
        red: + 4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed,
        green: - 1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed,
        blue: - 0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.7076147010 * sCubed,
    }
}

function linearRgbToSRgb(channelValue: number): number {
    return channelValue <= 0.0031308
        ? 12.92 * channelValue
        : 1.055 * Math.pow(channelValue, 1 / 2.4) - 0.055
}

export default class Color {
    r: number
    g: number
    b: number

    constructor(r: number, g: number, b: number) {
        this.r = r
        this.g = g
        this.b = b
    }

    get rgb(): string {
        return `rgb(${Math.round(this.r)} ${Math.round(this.g)} ${Math.round(this.b)})`
    }

    static fromOklch(lightness: number, chroma: number, hueAngle: number): Color {
        const lab = oklchToOklab({ lightness, chroma, hueAngle })
        const rgb = oklabToLinearRgb(lab)

        return new Color(
            Math.round(Math.max(0, Math.min(255, linearRgbToSRgb(rgb.red) * 255))),
            Math.round(Math.max(0, Math.min(255, linearRgbToSRgb(rgb.green) * 255))),
            Math.round(Math.max(0, Math.min(255, linearRgbToSRgb(rgb.blue) * 255))),
        )
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
    // Hue spacing 20-75° keeps corners in the same color neighborhood
    static generateCornerColors(count: number): Color[] {
        const baseHue = Math.random() * 360
        const hueSpacing = randomInRange(20, 75)
        const lightDiag = Math.random() < 0.5 ? [0, 3] : [1, 2]

        return Array.from({ length: count }, (_, i) => {
            const band = lightDiag.includes(i) ? CORNER_LIGHTNESS_LIGHT : CORNER_LIGHTNESS_DARK
            const hueAngle = (baseHue + hueSpacing * i) % 360
            return Color.random(band, hueAngle)
        })
    }

    static lerp(colorL: Color, colorR: Color, interpolant: number): Color {
        return new Color(
            lerpMath(colorL.r, colorR.r, interpolant),
            lerpMath(colorL.g, colorR.g, interpolant),
            lerpMath(colorL.b, colorR.b, interpolant)
        )
    }

    static bilerp(colorTL: Color, colorTR: Color, colorBL: Color, colorBR: Color, tx: number, ty: number): Color {
        const top = Color.lerp(colorTL, colorTR, tx)
        const bottom = Color.lerp(colorBL, colorBR, tx)
        return Color.lerp(top, bottom, ty)
    }
}