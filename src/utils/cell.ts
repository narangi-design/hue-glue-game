import Color from './color-class'

export class CellModel {
    isAnchor: boolean
    private _color: Color = new Color(0, 0, 0)

    constructor(isAnchor: boolean = false) {
        this.isAnchor = isAnchor
    }

    get color(): Color  {
        return this._color
    }
    set color(value: Color) {
        this._color = value
    }
}