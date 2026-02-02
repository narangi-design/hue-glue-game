export default class CellIndex {
    x: number
    y: number

    constructor(row: number, col: number) {
        this.x = col
        this.y = row
    }

    distanceTo(otherPoint: CellIndex): number {
        return Math.sqrt(
            (this.x - otherPoint.x) ** 2 +
            (this.y - otherPoint.y) ** 2
        )
    }

    static distance(pointA: CellIndex, pointB: CellIndex): number {
        return Math.sqrt(
            (pointA.x - pointB.x) ** 2 +
            (pointA.y - pointB.y) ** 2
        )
    }
}