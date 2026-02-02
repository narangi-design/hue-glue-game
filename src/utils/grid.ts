import CellIndex from "./cell-index"
import Cell from "./cell"

export default class Grid {
    rows: number
    cols: number
    cells: Cell[][]
    anchors: CellIndex[]

    constructor(rows: number, cols: number) {
        this.rows = rows
        this.cols = cols
        this.anchors = Grid.makeAnchorIndexes(rows, cols)
        this.cells = Grid.#makeGrid(rows, cols, this.anchors)
    }

    getCell(cellIndex: { row: number; col: number }) {
        return this.cells[cellIndex.row][cellIndex.col]
    }

    static #makeGrid(rows: number, cols: number, anchors: CellIndex[]): Cell[][] {
        const grid: Cell[][] = []
        for (let row = 0; row < rows; row++) {
            const cellRow: Cell[] = []
            for (let col = 0; col < cols; col++) {
                const isAnchorCell = anchors.some(anchor => anchor.y === row && anchor.x === col)
                cellRow.push(new Cell(isAnchorCell))
            }
            grid.push(cellRow)
        }
        return grid
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