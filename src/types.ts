 type Cell = {
  value: number,
  open: boolean,
  flagged: boolean
}

export type Grid = {
  size: [number, number],
  cells_cnt: number
  grid:  Cell[][]
}