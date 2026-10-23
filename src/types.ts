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

export type CellValueType = 0|1|2|3|4|5|6|7|8|9


export type DirentionType = "n"|"ne"|"e"|"se"|"s"|"sw"|"w"|"nw" 

export type CommandType = "up" | "down" | "left" | "right" | "open" | "flag" | "quit"
