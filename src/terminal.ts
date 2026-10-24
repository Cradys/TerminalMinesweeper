import type { Cell } from "./cell.js"
import type { Grid } from "./grid.js"
import type { CommandType } from "./types.js"

export class Terminal {
  private out = process.stdout
  private input = process.stdin
  // де було виділення минулого разу; null — ще нічого не малювали
  private lastCursor: { row: number, col: number } | null = null

  // викликається при натисканні: Terminal не знає, ХТО слухає
  constructor(onCommand: (cmd: CommandType) => void) {
    this.input.setRawMode(true)
    this.out.write('\x1b[?1049h')

    this.input.on('data', (key) => {
      const cmd = this.parseKey(key.toString())
      if (cmd) onCommand(cmd)
    })
  }

  // сирі байти → команда (або undefined, якщо клавіша ні до чого)
  private parseKey(key: string): CommandType | undefined {
    if (key === '\x1b[A') return 'up'
    if (key === '\x1b[B') return 'down'
    if (key === '\x1b[C') return 'right'
    if (key === '\x1b[D') return 'left'
    if (key === '\r' || key === ' ') return 'open'   // Enter або пробіл
    if (key === 'f') return 'flag'
    if (key === 'q' || key === '\x03') return 'quit' // \x03 — Ctrl+C
    return undefined
  }

  render(grid: Grid, cursor: { row: number, col: number }): void {
    this.clearScreen()
    let output = ''
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        if (row === cursor.row && col === cursor.col) {
          output += `█${this.findCellSymbol(grid.grid[row][col])}█`
          continue
        }
        output += `[${this.findCellSymbol(grid.grid[row][col])}]`
      }
      output += '\n'
    }
    this.out.write(output)
    this.drawStatus(grid)
    this.redrawCell(grid, cursor)
    this.lastCursor = { ...cursor }
  }

  // перемальовує лише 2 клітинки: стару (зняти виділення) і нову (виділити)
  redrawCell(grid: Grid, cursor: { row: number, col: number }): void {
    if (this.lastCursor) {
      this.drawCell(grid, this.lastCursor.row, this.lastCursor.col, false)
    }
    this.drawCell(grid, cursor.row, cursor.col, true)
    this.out.cursorTo(cursor.col * 3 + 1, cursor.row)
    this.lastCursor = { ...cursor }
  }

  drawStatus(grid: Grid, reveal=false) {
    this.out.cursorTo(0, grid.rows+2)
    this.out.clearLine(0)
    this.out.write(`Flags left (mines): ${grid.flags_amount}`)
    if (reveal) {
      this.out.cursorTo(0, grid.rows+3)
      this.out.write(`Bombs found: ${grid.mine_found}`)
    }
  }

  // вимкнути raw-режим і повернути звичайний екран
  close(): void { 
    this.input.setRawMode(false)
    this.out.write('\x1b[?1049l')
  }

  renderGameLost(grid: Grid): void {
    this.drawRevealedGrid(grid)
    this.drawBanner(grid, [
      '💣💣💣💣💣💣💣💣💣',
      '╔═════════════════╗',
      '║    GAME OVER    ║',
      '╚═════════════════╝',
      '💣💣💣💣💣💣💣💣💣',
      'Press q to quit',
    ])
  }

  renderGameWon(grid: Grid): void {
    this.drawRevealedGrid(grid)
    this.drawBanner(grid, [
      '╔═════════════════╗',
      '║     YOU WIN     ║',
      '╚═════════════════╝',
      'Press q to quit',
    ])
  }

  // все поле з показаними мінами, без виділення курсора
  private drawRevealedGrid(grid: Grid): void {
    this.clearScreen()
    let output = ''
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        output += `[${this.findCellSymbol(grid.grid[row][col], true)}]`
      }
      output += '\n'
    }
    this.out.write(output)
    this.drawStatus(grid, true)
  }

  // кожен рядок ставимо через cursorTo: write сам на новий рядок не переходить
  private drawBanner(grid: Grid, lines: string[]): void {
    lines.forEach((line, i) => {
      this.out.cursorTo(0, grid.rows + 4 + i)
      this.out.write(line)
    })
  }

  private drawCell(grid: Grid, row: number, col: number, selected: boolean): void {
    const symbol = this.findCellSymbol(grid.grid[row][col])
    this.out.cursorTo(col * 3, row)
    this.out.write(selected ? `█${symbol}█` : `[${symbol}]`)
  }

  private clearScreen(): void { 
    this.out.cursorTo(0, 0)
    this.out.clearScreenDown()
  }

  private findCellSymbol(cell: Cell, reveal=false): string {
    if (reveal && cell.value === 9) return cell.flagged ? '⚑' : '●'
    if (reveal && cell.flagged) return 'X' // флаг стояв не на міні

    if (cell.flagged) return '⚑'
    if (!cell.open) return '#'
    if (cell.value === 0) return ' '
    if (cell.value === 9) return '●'
    return cell.value.toString()
  }
}