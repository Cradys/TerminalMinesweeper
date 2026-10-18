 type Cell = {
  value: number,
  open: boolean,
  flagged: boolean
}

export type GridType = {
  size: [number, number],
  cells_cnt: number,
  mine_count: number
  grid:  Cell[][]
}