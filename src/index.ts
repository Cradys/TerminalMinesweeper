import type { GridType } from "./types.js"
import { Grid } from "./grid.js"

console.log('hello')

const readable = process.stdin.setRawMode(true)
const out = process.stdout
out.write('\x1b[?1049h')
const ROWS = 5 // ROWS
const COLS = 5 // COLS
const size: [number, number] = [ROWS, COLS]
const mine_count = Math.round(((ROWS * COLS) / 100) * 30)

const mine_step = 100/(ROWS*COLS) // step for one mine 
const random_y = Math.random()

const mine_pos = Math.trunc((Math.random() / mine_step) * 100) //where mine need to be placed


out.write(mine_count.toString())
out.write('\n')
out.write(random_y.toString())
console.log('mine_step', mine_step)
console.log('mine position', mine_pos)


//mine position
let mine_pos_y = Math.trunc(mine_pos / COLS) 
let mine_pos_x = (mine_pos % ROWS) - 1 
console.log(`MINE PLACED: \n -COLUMN: ${mine_pos_y+1} \n -ROW: ${mine_pos_x+1}`)
console.log((Math.random()*100/25).toFixed())

const grid = new Grid(ROWS, COLS)
grid.placeMines(mine_count)
render()


const test_grid = new Grid(ROWS, COLS)
test_grid.placeMines(mine_count)
  



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
