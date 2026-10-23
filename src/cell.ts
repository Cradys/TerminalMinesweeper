import type { CellValueType, DirentionType } from "./types.js"


export class Cell {
  value: CellValueType
  open: boolean
  flagged: boolean
  cells_around: Partial<Record<DirentionType, Cell>>

  constructor() {
    this.value = 0
    this.open = false
    this.flagged = false
    this.cells_around = {}
  }

  setMine() {
    if (this.value === 9) {
      return false
    }
    this.value = 9
    this.incrementNeighborCounts()
    return true
  }

  private incrementNeighborCounts() {
    for (let cell of Object.values(this.cells_around)) {
      if (cell === undefined || cell.value === 9) {
        continue
      }
      if (cell.value === 8) {
        throw Error(`Amount of can't be grater then 8`)
      }
      cell.value += 1
    }
  }

  openCell(): "gg" | "ignored" | "opened" {
    if (this.open) return "ignored"

    if (this.flagged) return "ignored"

    if (this.value === 9) {
      this.open = true
      return "gg"
    }

    this.open = true

    if (this.value === 0) {
      for (let cell of Object.values(this.cells_around)){
        cell?.openCell()
      }
    }

    return "opened"
  }

  setFlagged(status: boolean): boolean {
    if (status === this.flagged) return false
    if (this.open) return false

    this.flagged = status
    return true
  }
}