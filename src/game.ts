import { Grid } from "./grid.js"
import { Terminal } from "./terminal.js"
import type { CommandType, GameStateType } from "./types.js"

const LEVELS = [
  { name: "easy", rows: 9, cols: 9, mines: 10 },
  { name: "medium", rows: 16, cols: 16, mines: 40 },
  { name: "hard", rows: 16, cols: 30, mines: 99 }
]

class Game {
  private game_state: GameStateType = "menu"
  private terminal: Terminal = new Terminal(cmd => this.cmdProcessor(cmd))
  private selected_level: number = 0
  private cursor: { row: number, col: number } | null = null
  private grid: Grid | undefined

  constructor() {}

  private cmdProcessor(cmd: CommandType) {
    if (cmd === "quit") {
      this.terminal.close()
      process.exit()
    }
    switch (this.game_state) {
      case "menu":
        this.handleMenu(cmd)
        break
      case "playing":
        break
      case "over":
        break
    }
  }

  private handleMenu(cmd: CommandType) {
    switch (cmd) {
      case "up":
        if (this.selected_level > 0) {
          this.selected_level--
        }
        break
      case "down":
        if (this.selected_level < LEVELS.length-1) {
          this.selected_level++
        }
        break
      case "open":
        this.startGame()
        break
    }
  }

  private handlePlaying(cmd: CommandType) {
    switch (cmd) {
      case "up":
        break
      case "down":
        break
      case "left":
        break
      case "right":
        break
      case "flag":
        break
      case "open":
        break
    }
  }

  private handleOver(cmd: CommandType) {}

  private startGame() {}

  private endGame() {}

  private toMenu() {}
}







