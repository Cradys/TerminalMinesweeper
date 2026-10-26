import type { Cell } from "./cell.js"
import type { Grid } from "./grid.js"
import type { CommandType, CursorType, HintType } from "./types.js"

const KEY_LABELS: Record<CommandType, string> = {
  up: '↑', down: '↓', left: '←', right: '→',
  open: 'Enter/Space', flag: 'f', quit: 'q',
  restart: 'r',
}

const GAME_LOST = [
      '💣💣💣💣💣💣💣💣💣',
      '╔═════════════════╗',
      '║    GAME OVER    ║',
      '╚═════════════════╝',
      '💣💣💣💣💣💣💣💣💣',
    ].join('\n')

const YOU_WIN = [
      '╔═════════════════╗',
      '║     YOU WIN     ║',
      '╚═════════════════╝',
    ].join('\n')

export class Terminal {
  private out = process.stdout
  private input = process.stdin
  // де було виділення минулого разу; null — ще нічого не малювали
  private lastCell: CursorType | null = null
  private content_bottom: number = 0

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
    if (key === 'r') return 'restart'
    return undefined
  }

  renderMenu(levels: string[], selected_level: number) {
    this.clearScreen()
    let output: string = ''
    const cursor = { row: selected_level + 2, col: 0}

    output += 'Choose game difficulty\n\n'
    for (let i = 0; i < levels.length; i++) {
      output += selected_level === i ? (`${i+1} █${levels[i]}█\n`) : (`${i+1} [${levels[i]}]\n`)
    }
    this.out.write(output)

    this.content_bottom = output.split('\n').length - 1
    this.out.cursorTo(cursor.col, cursor.row)
  }

  drawFooter(allowed_cmd: HintType[]) {
    this.out.write('\x1b7')   // зберегти позицію курсора
    this.out.cursorTo(0, this.content_bottom + 2)
    this.out.clearLine(1)

    const output = allowed_cmd
      .map(hint => `${hint.cmd.map(k => KEY_LABELS[k]).join('')} - ${hint.label}`)
      .join('   ')

    this.out.write(output)
    this.out.write('\x1b8')   // повернути курсор туди, де він був
  }

  renderPlaying(grid: Grid, cursor: CursorType): void {
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
    this.content_bottom = output.split('\n').length - 1
    this.drawStatus(grid)
    this.redrawCell(grid, cursor)
    this.lastCell = { ...cursor }
  }

  // перемальовує лише 2 клітинки: стару (зняти виділення) і нову (виділити)
  redrawCell(grid: Grid, cursor: CursorType): void {
    if (this.lastCell) {
      this.drawCell(grid, this.lastCell.row, this.lastCell.col, false)
    }
    this.drawCell(grid, cursor.row, cursor.col, true)
    this.out.cursorTo(cursor.col * 3 + 1, cursor.row)
    this.lastCell = { ...cursor }
  }

  drawStatus(grid: Grid, reveal=false) {
    this.out.write('\x1b7') 
    this.out.cursorTo(0, grid.rows+2)
    this.out.clearLine(0)
    this.out.write(`Flags left (mines): ${grid.flags_amount}`)
    if (reveal) {
      this.out.cursorTo(0, grid.rows+3)
      this.out.write(`Bombs found: ${grid.minesFoundAmount()}`)
    }
    this.out.write('\x1b8')
  }

  // вимкнути raw-режим і повернути звичайний екран
  close(): void { 
    this.input.setRawMode(false)
    this.out.write('\x1b[?1049l')
  }

  renderGameOver(grid: Grid, won: boolean): void {
    let output = ''
    output += this.drawRevealedGrid(grid)
    output += '\n'
    output += won ? '' : `Bombs found: ${grid.minesFoundAmount()}\n`
    output += `Bombs total amount: ${grid.mine_amount} `
    output += '\n'
    output += won ? YOU_WIN : GAME_LOST
    this.out.write(output)
    this.content_bottom = output.split('\n').length -1
  }

  renderGameWon(grid: Grid): void {
    this.drawRevealedGrid(grid)
    const output = [
      '╔═════════════════╗',
      '║     YOU WIN     ║',
      '╚═════════════════╝',
    ].join('\n')
    this.out.write(output)
  }

  // все поле з показаними мінами, без виділення курсора
  private drawRevealedGrid(grid: Grid): string {
    this.clearScreen()
    let output = ''
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        output += `[${this.findCellSymbol(grid.grid[row][col], true)}]`
      }
      output += '\n'
    }
    return output
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
    if (reveal && cell.isMine()) return cell.isFlagged() ? '⚑' : '●'
    if (reveal && cell.isFlagged()) return 'X' // флаг стояв не на міні

    if (cell.isFlagged()) return '⚑'
    if (!reveal && !cell.isOpen()) return '#'
    if (cell.isEmpty()) return ' '
    if (cell.isMine()) return '●'
    return cell.getValue().toString()
  }
}