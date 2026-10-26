export type CursorType = { row: number, col: number }

export type GameStateType = 'menu' | 'playing' | 'over'

export type HintType = { cmd: CommandType[], label: string}

export type CellValueType = 0|1|2|3|4|5|6|7|8|9

// export type DirentionType = 'n'|'ne'|'e'|'se'|'s'|'sw'|'w'|'nw' 

export type CommandType = 'up' | 'down' | 'left' | 'right' | 'open' | 'flag' | 'quit' | 'restart'

export type OpenCellResultType = 'gg' | 'ignored' | 'opened'
