import Color from './color-class'

export default class CellModel {
    isAnchor: boolean
    color: Color = new Color(0, 0, 0)

    constructor(isAnchor: boolean = false) {
        this.isAnchor = isAnchor
    }
}