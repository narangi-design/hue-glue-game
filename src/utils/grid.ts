import CellIndex from "./cell-index"
import CellModel from "./cell-model"

export default class Grid {
    rows: number
    cols: number
    cells: CellModel[][]
    corners: CellIndex[]

    constructor(rows: number, cols: number) {
        this.rows = rows
        this.cols = cols
        this.corners = Grid.makeCornerIndexes(rows, cols)
        this.cells = Grid.makeGrid(rows, cols)
    }

    getCell(cellIndex: { row: number; col: number }) {
        return this.cells[cellIndex.row][cellIndex.col]
    }

    static makeGrid(rows: number, cols: number): CellModel[][] {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => new CellModel())
        )
    }

    static makeCornerIndexes(rows: number, cols: number): CellIndex[] {
        return [
            new CellIndex(0, 0),
            new CellIndex(0, cols - 1),
            new CellIndex(rows - 1, 0),
            new CellIndex(rows - 1, cols - 1),
        ]
    }
}