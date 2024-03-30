import { GridTile, Move } from "./types";

export const doMove = (move: Move, value: GridTile[]): GridTile[] | null => {
    const parity = (move.fromCol !== move.toCol) !== (move.fromRow !== move.toRow);
    const t = value.find(({ color }) => color == null);
    if (t == null
        || ((move.toCol !== t.col) !== (move.toRow !== t.row))
        || !parity) {
        // Invalid move - ignore
        return null;
    }
    const newValue = value.map(
        ({ row, col, ...value }) => {
            if (row === move.fromRow && move.toRow === move.fromRow) {
                if (move.fromCol <= col && col < move.toCol)
                    return ({ row: row, col: col + 1, ...value });
                else if (move.toCol < col && col <= move.fromCol)
                    return ({ row: row, col: col - 1, ...value });
                else if (col === move.toCol)
                    return ({ row: move.fromRow, col: move.fromCol, ...value });
            } else if (col === move.fromCol && move.toCol === move.fromCol) {
                if (move.fromRow <= row && row < move.toRow)
                    return ({ row: row + 1, col: col, ...value });
                else if (move.toRow < row && row <= move.fromRow)
                    return ({ row: row - 1, col: col, ...value });
                else if (row === move.toRow)
                    return ({ row: move.fromRow, col: move.fromCol, ...value });
            }
            return ({ row: row, col: col, ...value });
        }
    );
    return newValue;
};
export function isDone(goal: string[][], state: GridTile[]): boolean {
    return state.every(s => isTilePlacedCorrectly(goal, s));
}
function isTilePlacedCorrectly(goal: string[][], { row, col, color }: GridTile): boolean {
    return goal[row - 1] == null
        || goal[row - 1][col - 1] == null
        || color != null && goal[row - 1][col - 1] === color;
}
