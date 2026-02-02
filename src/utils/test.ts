export function getRandomInt(maxValue: number): number {
    return Math.floor(Math.random() * (maxValue + 1))
}

export function isFarEnough(a: number, x: number, distance: number): boolean {
    return (Math.abs(a - x) >= distance)
}

export function makeListOfNumbers(count: number, minDistance: number): number[] {
    let array: number[] = []
    array[0] = getRandomInt(20)

    let x = 0
    while (array.length < count) {
        x = getRandomInt(20)
        if (array.every(a => isFarEnough(a, x, minDistance))) {
            array.push(x)
        }
    }

    return array
}

let grid: number[][] = [[1, 2, 3], [4, 5, 6]]

export function getRandCell(array: number[][]): [number, number] {
  const getRandInd = (arr: any[]) => Math.floor(Math.random() * arr.length)
  return [getRandInd(array), getRandInd(array[0])]
}

export function getRandomGrid(grid: number[][]): number[][] {
  let newGrid: number[][] = [...Array(grid.length)].map(() => Array(grid[0].length))
  let usedCells: [number, number][] = []
  let randomCell = getRandCell(grid)

  const isUsed = (cell: [number, number], usedCells: [number, number][]): boolean =>
    usedCells.some(elem => elem[0] === cell[0] && elem[1] === cell[1])

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      while(isUsed(randomCell, usedCells)) {
        randomCell = getRandCell(grid)
      }

      const [x, y] = randomCell
      newGrid[x][y] = grid[i][j]

      usedCells.push([x, y])
    }
  }

  return newGrid
}

console.log('new grid is', getRandomGrid(grid))
