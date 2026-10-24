import { Cell } from "./cell.js" 


export class Grid {
  rows: number
  cols: number
  cells_amount: number
  mine_amount: number
  flags_amount: number
  mine_found = 0
  grid: Cell[][]

  constructor(rows: number, cols: number, mine_amount: number) {
    this.rows = rows 
    this.cols = cols
    this.cells_amount = rows * cols
    this.mine_amount = mine_amount
    this.flags_amount = mine_amount
    this.grid = this.formGrid()
    this.placeMines(this.mine_amount)
  }

  formGrid(): Cell[][] {
    const grid = Array.from({length: this.rows}, ()=>{
      return Array.from({length: this.cols}, () => {
        return new Cell
      })
    })
    return this.linkCellsAround(grid)
    
  }

  setFlagAmount(amount: number): boolean {
    if (amount < 0 || amount > this.mine_amount) return false
    this.flags_amount = amount
    return true
  }

  revealAllCells() {
    for (const row of this.grid) {
      for (const cell of row) {
        cell.open = true
      }
    }
  }

  isWon() : boolean {
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell.value !== 9 && !cell.open) return false;
      }
    }
    return true
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
  

  private placeMines(amount: number): void {
    const mine_weight = 100/this.cells_amount
    for (let i=0; i<amount; i++) {
      let mine_pos = Math.trunc((Math.random() / mine_weight) * 100)
      let mine_row = Math.trunc(mine_pos / this.cols)
      let mine_col = mine_pos % this.cols
      let cell = this.grid[mine_row][mine_col]
      if (!cell.setMine()) {
        this.placeMines(1)
      }  
    }
  }
}