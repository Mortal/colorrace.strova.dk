export type GridTile = {
    color: string | null;
    row: number;
    col: number;
};

export type Move = {
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
};

export type Board = {
    state: GridTile[];
    done: boolean;
    lost: boolean;
    onChange: (move: Move, _drag: boolean) => Promise<GridTile[] | null | undefined>;
};

export type GameState = {
    board1: Board;
    board2: Board;
    goal: string[][];
    reset: () => void;
    onTutorialEnd: () => void;
};

