import React from "react";
import { Board, Move } from "./types";
import { getTutorialTiles } from "./Tutorial";

export function useTutorial(board2: Board, onTutorialEnd: () => void) {
    const [tutorial, setTutorial] = React.useState(1);
    const handleChangeTutorial = (t: number) => {
        if (t === 0) onTutorialEnd();
        setTutorial(t);
    };
    const onlyInteractTiles = tutorial ? getTutorialTiles(tutorial, board2.state) : null;
    const tutorialBoard: Board = {
        state: board2.state,
        done: false,
        lost: false,
        onChange: async (move: Move, drag: boolean) => {
            const result = await board2.onChange(move, drag);
            if (result == null) return;
            if (result != null && tutorial) {
                if (tutorial <= 2) handleChangeTutorial(tutorial + 1);
                if (tutorial === 3 && drag) handleChangeTutorial(tutorial + 1);
            }
            return result;
        }
    };
    const blinkTiles = tutorial === 4
        ? board2.state.filter(({ row, col }) => 1 <= row && row <= 3 && 1 <= col && col <= 3)
        : onlyInteractTiles;
    const props = { onlyInteractTiles, blinkTiles, board: tutorialBoard, clickOnly: 1 <= tutorial && tutorial <= 2 };
    return { tutorial, handleChangeTutorial, props };
}
