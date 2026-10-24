import { Grid } from "./grid.js"
import { Terminal } from "./terminal.js"
import type { CommandType } from "./types.js"

const ROWS = 10 // ROWS
const COLS = 10 // COLS
const mine_count = Math.round(((ROWS * COLS) / 100) * 20)
let cursor = { row: 0, col: 0 }


const grid = new Grid(ROWS, COLS, mine_count)

const terminal = new Terminal(cmdProcessor)

function cmdProcessor(cmd: CommandType) {
  switch (cmd) {
    case "up":
      cursor.row = cursor.row - 1 < 0 ? cursor.row:  cursor.row - 1
      terminal.redrawCell(grid, cursor)
      break
    case "down":
      cursor.row = cursor.row + 1 > grid.rows - 1 ? cursor.row:  cursor.row + 1
      terminal.redrawCell(grid, cursor)
      break
    case "left":
      cursor.col = cursor.col - 1 < 0? cursor.col:  cursor.col-1
      terminal.redrawCell(grid, cursor)
      break
    case "right":
      cursor.col = cursor.col + 1 > grid.cols - 1 ? cursor.col:  cursor.col + 1
      terminal.redrawCell(grid, cursor)
      break
    case "flag":
      let cell = grid.grid[cursor.row][cursor.col]
      if (cell.flagged) {
        cell.setFlagged(false)
        grid.setFlagAmount(grid.flags_amount+1)
        if (cell.value === 9) grid.mine_found -= 1
      } else {
        if (grid.flags_amount > 0) {
          if (cell.setFlagged(true)) {
            grid.setFlagAmount(grid.flags_amount-1)
            if (cell.value === 9) grid.mine_found += 1
          }
        }
      }
      terminal.drawStatus(grid)
      terminal.redrawCell(grid, cursor)
      break
    case "open":
      const result = grid.grid[cursor.row][cursor.col].openCell()
      switch (result) {
        case "gg":
          grid.revealAllCells()
          terminal.renderGameLost(grid)
          break
        case "opened":
          if (grid.isWon()) {
            terminal.renderGameWon(grid)
            break
          }
          terminal.render(grid, cursor)
          break
        case "ignored":
          break 
      }
      break
    case "quit":
      terminal.close()
      process.exit()
      break
  }
}

terminal.render(grid, cursor)
