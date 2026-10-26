import { Cell } from "./cell.js" 
import type { OpenCellResultType } from "./types.js"


export class Grid {
  rows: number
  cols: number
  mine_amount: number
  flags_amount: number
  grid: Cell[][]

  constructor(rows: number, cols: number, mine_amount: number) {
    this.rows = rows 
    this.cols = cols
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

  changeFlagState(row: number, col: number): boolean {
    const cell = this.grid[row][col]

    if (cell.isFlagged()) {
      if (!cell.changeFlaggedState()) return false
      this.flags_amount++
    } else {
      if (this.flags_amount <= 0) {
        return false
      }
      if (!cell.changeFlaggedState()) return false
      this.flags_amount--
    }
    return true
  }

  openCell(row: number, col: number): OpenCellResultType {
    const cell = this.grid[row][col]
    return cell.openCell()
  }

  minesFoundAmount(): number {
    let mines_found = 0
    for (const row of this.grid) {
      for (const cell of row) {
        if(cell.isFlagged() && cell.isMine()) {
          mines_found++
        }
      }
    }
    return mines_found
  }

  revealAllCells() {
    for (const row of this.grid) {
      for (const cell of row) {
        cell.setOpen()
      }
    }
  }

  isWon() : boolean {
    for (const row of this.grid) {
      for (const cell of row) {
        if (!cell.isMine() && !cell.isOpen()) return false;
      }
    }
    return true
  }

  private linkCellsAround(grid: Cell[][]): Cell[][] {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        //link neighbors cells
        //if out of index - undefined
        const cell = grid[row][col]
        const neighbors: (Cell | undefined)[] = [
          grid[row - 1]?.[col],
          grid[row - 1]?.[col + 1],
          grid[row]?.[col + 1],
          grid[row + 1]?.[col + 1],
          grid[row + 1]?.[col],
          grid[row + 1]?.[col - 1],
          grid[row]?.[col - 1],
          grid[row - 1]?.[col - 1]
        ]

        cell.cells_around = neighbors.filter(n => n !== undefined)
      } 
    }
    return grid
  }
  

  private placeMines(amount: number): void {
    const mine_weight = 100 / (this.rows * this.cols)
    for (let i=0; i<amount; i++) {
      const mine_pos = Math.trunc((Math.random() / mine_weight) * 100)
      const mine_row = Math.trunc(mine_pos / this.cols)
      const mine_col = mine_pos % this.cols
      const cell = this.grid[mine_row][mine_col]
      if (!cell.setMine()) {
        this.placeMines(1)
      }  
    }
  }
}