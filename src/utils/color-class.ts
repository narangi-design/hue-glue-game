import { lerp as lerpMath } from "./math"

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