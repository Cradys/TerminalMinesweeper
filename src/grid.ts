import { Cell } from "./cell.js" 


export class Grid {
  rows: number
  cols: number
  cells_amount: number
  mine_count?: number
  grid: Cell[][]

  constructor(rows: number, cols: number, mine_count?: number) {
    this.rows = rows 
    this.cols = cols
    this.cells_amount = rows * cols
    this.mine_count = mine_count
    this.grid = this.formGrid() 
  }

  formGrid(): Cell[][] {
    const grid = Array.from({length: this.rows}, ()=>{
      return Array.from({length: this.cols}, () => {
        return new Cell
      })
    })
    return this.linkCellsAround(grid)
  }

  private linkCellsAround(grid: Cell[][]): Cell[][] {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        //link neighbors cells
        //if out of index - undefined
        let cell = grid[row][col]
        cell.cells_around.n  = grid[row - 1]?.[col]
        cell.cells_around.ne = grid[row - 1]?.[col + 1]
        cell.cells_around.e  = grid[row]?.[col + 1]
        cell.cells_around.se = grid[row + 1]?.[col + 1]
        cell.cells_around.s  = grid[row + 1]?.[col]
        cell.cells_around.sw = grid[row + 1]?.[col - 1]
        cell.cells_around.w  = grid[row]?.[col - 1]
        cell.cells_around.nw = grid[row - 1]?.[col - 1]
      } 
    }
    return grid
  }
  

  placeMines(amount: number): void {
    this.mine_count = amount
    const mine_weight = 100/this.cells_amount
    for (let i=0; i<amount; i++) {
      let mine_pos = Math.trunc((Math.random() / mine_weight) * 100)
      let mine_col = Math.trunc(mine_pos/ this.cols)
      let mine_row = mine_pos % this.cols
      let cell = this.grid[mine_col][mine_row]
      if (!cell.setMine()) {
        this.placeMines(1)
      }  
    }
  }
}