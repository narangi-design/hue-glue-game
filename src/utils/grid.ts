import CellIndex from "./cell-index"

export default class Grid {
    rows: number
    cols: number
    cells: (null | any)[][]
    anchors: CellIndex[]

    constructor(rows: number, cols: number) {
        this.rows = rows
        this.cols = cols
        this.cells = Grid.#makeGrid(rows, cols)
        this.anchors = Grid.makeAnchorIndexes(rows, cols)
    }

    getCell(cellIndex: { row: number; col: number }) {
        return this.cells[cellIndex.row][cellIndex.col];
    }

    static #makeGrid(rows: number, cols: number): (null | any)[][] {
        return Array.from({ length: rows }, () => Array(cols).fill(null))
    }

    static makeAnchorIndexes(rows: number, cols: number): CellIndex[] {
        return [
            new CellIndex(0, 0),
            new CellIndex(0, cols - 1),
            new CellIndex(rows - 1, 0),
            new CellIndex(rows - 1, cols - 1),
        ]
    }
}