export class Grid {
  size: [number, number]
  mine_count?: number
  grid: Cell[][]

  constructor(row: number, col: number, mine_count?: number) {
    this.size = [row, col]
    this.mine_count = mine_count
    this.grid = this.formGrid() 
  }

  formGrid(): Cell[][] {
    return Array.from({length: this.size[0]}, ()=>{
      return Array.from({length:this.size[1]}, () => {
        return new Cell
      })
    })
  }
}

class Cell {
  value: number
  open: boolean
  flagged: boolean
  mines_around: number
  mined_cells_around: Cell[]

  constructor() {
    this.value = 0
    this.open = false
    this.flagged = false
    this.mines_around = 0
    this.mined_cells_around = []
  }
}