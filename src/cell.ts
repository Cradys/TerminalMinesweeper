import type { CellValueType, DirentionType, OpenCellResultType } from "./types.js"


export class Cell {
  private value: CellValueType
  private open: boolean
  private flagged: boolean
  cells_around: Partial<Record<DirentionType, Cell>>

  constructor() {
    this.value = 0
    this.open = false
    this.flagged = false
    this.cells_around = {}
  }

  getValue(): CellValueType { return this.value }

  setMine() {
    if (this.isMine()) {
      return false
    }
    this.value = 9
    this.incrementNeighborCounts()
    return true
  }

  setOpen(): void { this.open = true }

  isFlagged(): boolean { return this.flagged }

  isOpen(): boolean { return this.open }

  isMine(): boolean { return this.value === 9 ? true : false }

  isEmpty(): boolean { return this.value === 0 ? true : false }

  openCell(): OpenCellResultType {
    if (this.isOpen()) return "ignored"

    if (this.isFlagged()) return "ignored"

    if (this.isMine()) {
      this.setOpen()
      return "gg"
    }

    this.setOpen()

    if (this.isEmpty()) {
      for (let cell of Object.values(this.cells_around)){
        cell?.openCell()
      }
    }

    return "opened"
  }

  changeFlaggedState(): boolean {
    if (this.isOpen()) return false
    this.flagged = this.isFlagged() ? false : true
    return true
  }



  private incrementNeighborCounts() {
    for (let cell of Object.values(this.cells_around)) {
      if (cell === undefined || cell.isMine()) {
        continue
      }
      if (cell.value === 8) {
        throw Error(`Amount of can't be grater then 8`)
      }
      cell.value += 1
    }
  }
}