import Color from './color'

export default class Cell {
    isAnchor: boolean
    private _color?: Color

    constructor(isAnchor: boolean = false) {
        this.isAnchor = isAnchor
    }

    get color(): Color | undefined {
        return this._color
    }
    set color(value: Color | undefined) {
        this._color = value
    }
}