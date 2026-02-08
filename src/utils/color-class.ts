import { lerp as lerpMath, getRandomValue, clamp } from "./math"
import {
    COLOR,
    BRIGHTNESS,
} from "./constants"

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

    static distance(colorA: Color, colorB: Color): number {
        return Math.sqrt(
            (colorA.r - colorB.r) ** 2 +
            (colorA.g - colorB.g) ** 2 +
            (colorA.b - colorB.b) ** 2
        )
    }

    brightness(): number {
        return 0.299 * this.r + 0.587 * this.g + 0.114 * this.b
    }

    static brightnessDifference(colorA: Color, colorB: Color): number {
        return Math.abs(colorA.brightness() - colorB.brightness())
    }

    // Linear interpolation between two colors
    static lerp(colorL: Color, colorR: Color, interpolant: number): Color {
        return new Color(
            lerpMath(colorL.r, colorR.r, interpolant),
            lerpMath(colorL.g, colorR.g, interpolant),
            lerpMath(colorL.b, colorR.b, interpolant)
        )
    }

    // Bilinear interpolation for smooth gradients across a 2D grid
    static bilerp(colorTL: Color, colorTR: Color, colorBL: Color, colorBR: Color, tx: number, ty: number): Color {
        const top = Color.lerp(colorTL, colorTR, tx)
        const bottom = Color.lerp(colorBL, colorBR, tx)
        return Color.lerp(top, bottom, ty)
    }

    static random(): Color {
        return new Color(
            getRandomValue(COLOR.MIN, COLOR.MAX),
            getRandomValue(COLOR.MIN, COLOR.MAX),
            getRandomValue(COLOR.MIN, COLOR.MAX)
        )
    }

    static invertBrightness(color: Color): Color {
        const brightness = color.brightness()
        const targetBrightness = brightness > BRIGHTNESS.THRESHOLD ? BRIGHTNESS.MIN : BRIGHTNESS.MAX
        const factor = targetBrightness / brightness
        return new Color(
            clamp(color.r * factor, COLOR.MIN, COLOR.MAX),
            clamp(color.g * factor, COLOR.MIN, COLOR.MAX),
            clamp(color.b * factor, COLOR.MIN, COLOR.MAX)
        )
    }

    static shiftHue(color: Color, degrees: number): Color {
        const offset = degrees / 360 * 255
        return new Color(
            clamp((color.r + offset) % 256, COLOR.MIN, COLOR.MAX),
            clamp((color.g + offset * 0.7) % 256, COLOR.MIN, COLOR.MAX),
            clamp((color.b + offset * 1.3) % 256, COLOR.MIN, COLOR.MAX)
        )
    }
}