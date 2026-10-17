import { Grid } from "./types.js"
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

render()
out.write(mine_count.toString())
out.write('\n')
out.write(random_y.toString())
console.log('mine_step', mine_step)
console.log('mine position', mine_pos)

formGrid(size)


function formGrid(size: [number, number]): Grid {
  return{
    size: size,
    cells_cnt: size[0] * size[1],
    grid: Array.from({length: size[0]}, ()=>{
      return Array.from({length:size[1]}, () => {
        return {
          value: 0,
          open: false,
          flagged: false
        }
      })
  })
  }
}

function placeMines(grid: Grid) {
  const mine_step = 10/grid.cells_cnt
  
}


//mine position
let mine_pos_y = Math.trunc(mine_pos / COLS) 
let mine_pos_x = (mine_pos % ROWS) - 1 
console.log(`MINE PLACED: \n -COLUMN: ${mine_pos_y+1} \n -ROW: ${mine_pos_x+1}`)
console.log((Math.random()*100/25).toFixed())


function render() {
  clearScreen()
  let output = ''
  for (let y = 0; y < COLS; y++) {
    for (let x = 0; x < ROWS; x++) {
      output += x === 0? '[*]' : ' [*]'
    }
    output += '\n'
  }
  out.write(output)
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
