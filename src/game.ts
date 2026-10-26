import { Grid } from "./grid.js"
import { Terminal } from "./terminal.js"
import type { CommandType, CursorType, GameStateType, HintType } from "./types.js"

const LEVELS = [
  { name: 'easy', rows: 9, cols: 9, mines: 10 },
  { name: 'medium', rows: 16, cols: 16, mines: 40 },
  { name: 'hard', rows: 16, cols: 30, mines: 99 }
]

const HINTS: Record<GameStateType, HintType[]> = {
  menu: [
    { cmd: ['up', 'down'], label: 'Move' },
    { cmd: ['open'], label: 'Choose' },
    { cmd: ['quit'], label: 'Quit' }
  ],
  playing: [
    { cmd: ['up', 'down', 'left', 'right'], label: 'Move' },
    { cmd: ['open'], label: 'Open' },
    { cmd: ['flag'], label: 'Flag' },
    { cmd: ['quit'], label: 'Quit' }
  ],
  over: [
    { cmd: ['restart'], label: 'Restart' },
    { cmd: ['quit'], label: 'Quit' }
  ]
}

export class Game {
  private game_state: GameStateType = 'menu'
  private terminal: Terminal = new Terminal(cmd => this.cmdProcessor(cmd))
  private selected_level: number = 0
  private cursor: CursorType = { row: 0, col: 0}
  private grid: Grid | undefined
  private is_won: boolean | undefined

  constructor() {
    this.redraw()
  }

  private redraw() {
    switch (this.game_state) {
      case 'menu': 
        this.terminal.renderMenu(
          LEVELS.map(level => level.name),
          this.selected_level
        )
        break
      case 'playing':
        if (!this.grid) throw new Error('Grid does not created')
        this.terminal.renderPlaying(this.grid, this.cursor)
        break
      case 'over':
        if (!this.grid) throw new Error('Grid does not created')
        if (this.is_won === undefined) throw new Error('Status is_won can\'t be undefined')
        
        this.terminal.renderGameOver(this.grid, this.is_won)
        break
    }
    this.terminal.drawFooter(HINTS[this.game_state])
  }

  private cmdProcessor(cmd: CommandType) {
    if (cmd === 'quit') {
      this.terminal.close()
      process.exit()
    }
    switch (this.game_state) {
      case 'menu':
        this.handleMenu(cmd)
        break
      case 'playing':
        this.handlePlaying(cmd)
        break
      case 'over':
        this.handleOver(cmd)
        break
    }
  }

  private handleMenu(cmd: CommandType) {
    switch (cmd) {
      case 'open':
        this.startGame()
        break
      case 'up':
        this.selected_level = Math.max(0, this.selected_level-1)
        break
      case 'down':
        this.selected_level = Math.min(LEVELS.length-1, this.selected_level+1)
        break
      default:
        return
    }
    this.redraw()
  }

  private handlePlaying(cmd: CommandType) {
    if (!this.grid) throw new Error('handlerPlaying does need initialized grid')

    const row = this.cursor.row
    const col = this.cursor.col
    switch (cmd) {
      case 'up':
        this.cursor.row = Math.max(0, row - 1)
        break
      case 'down':
        this.cursor.row = Math.min(this.grid.rows - 1, row + 1)
        break
      case 'left':
        this.cursor.col = Math.max(0, col - 1)
        break
      case 'right':
        this.cursor.col = Math.min(this.grid.cols - 1, col + 1)
        break
      case 'flag':
        if (this.grid.changeFlagState(row, col)) {
          this.terminal.drawStatus(this.grid)
        }
        break
      case 'open':
        const state = this.grid.openCell(row, col)
        if (state === 'ignored') return
        if (state === 'gg') {
          this.is_won = false
        }
        if (state === 'opened') {
          if (this.grid.isWon()) this.is_won = true
        }
       
        if (this.is_won !== undefined) this.endGame()
        this.redraw() 
        return
    }
    this.terminal.redrawCell(this.grid, this.cursor)
  }

  private handleOver(cmd: CommandType) {
    switch (cmd) {
      case 'restart':
        this.toMenu()
    }
    this.redraw()
  }

  private startGame() {
    if (this.game_state !== 'playing') this.game_state = 'playing'

    this.cursor = { row: 0, col: 0 }

    this.grid = new Grid(
      LEVELS[this.selected_level].rows, 
      LEVELS[this.selected_level].cols, 
      LEVELS[this.selected_level].mines)
  }

  private endGame() {
    if (this.game_state !== 'over') this.game_state = 'over'
  }

  private toMenu() {
    if (this.game_state !== 'menu') {
      this.game_state = 'menu'
      this.is_won = undefined
    }
  }
}







