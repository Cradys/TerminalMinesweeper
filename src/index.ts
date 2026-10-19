import type { GridType } from "./types.js"
import { Grid } from "./grid.js"

console.log('hello')

const readable = process.stdin.setRawMode(true)
const out = process.stdout
out.write('\x1b[?1049h')
const ROWS = 5 // ROWS
const COLS = 5 // COLS
const mine_count = Math.round(((ROWS * COLS) / 100) * 20)


const grid = new Grid(ROWS, COLS)
grid.placeMines(mine_count)
render()

function render() {
  clearScreen()
  let output = ''
  for (let y = 0; y < COLS; y++) {
    for (let x = 0; x < ROWS; x++) {
      output += x === 0? `[${grid.grid[y][x].value}]` : ` [${grid.grid[y][x].value}]`
    }
    output += '\n'
  }
  out.write(output)
  console.log()
  console.log(mine_count)
}

readable.on('data', (key) => {
  const k = key.toString()
  if (k === 'q' || k === '\x03') {   // \x03 — це Ctrl+C
    readable.setRawMode(false)
    out.write('\x1b[?1049l')
    process.exit()
  }
  if (k === 'c') {
    clearScreen()
  }
  process.stdout.write(key)
})

function clearScreen() {
  out.cursorTo(0, 0)
  out.clearScreenDown()
}
