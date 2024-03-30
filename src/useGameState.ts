import React from "react";
import { initRandomGameGrid, initRandomGoalGrid } from "./init";
import { GridTile, Move } from "./types";
import { doMove, isDone } from "./game-state";
import { GameState } from "./types";

export function useGameState(): GameState {
    const [state1, setState1] = React.useState(initRandomGameGrid);
    const [state2, setState2] = React.useState(state1);
    const [goal, setGoal] = React.useState(initRandomGoalGrid);
    const [winner, setWinner] = React.useState<1 | 2 | null>(null);
    const reset = () => {
        const s = initRandomGameGrid();
        const g = initRandomGoalGrid();
        setState1(s);
        setState2(s);
        setGoal(g);
        setWinner(null);
    };
    const goalCheck = React.useCallback((state: GridTile[]) => isDone(goal, state), [goal]);
    const done1 = goalCheck(state1);
    const done2 = goalCheck(state2);
    const handleChange1 = React.useCallback(
        (move: Move, _drag: boolean) =>
            handleChange(move, setState1, goalCheck, () => setWinner(w => w == null ? 1 : w)),
        [goalCheck, setState1]);
    const handleChange2 = React.useCallback(
        (move: Move, _drag: boolean) =>
            handleChange(move, setState2, goalCheck, () => setWinner(w => w == null ? 2 : w)),
        [goalCheck, setState2]);
    const onTutorialEnd = () => {
        setState1(state2);
    };
    const board1 = { state: state1, done: done1, lost: winner === 2, onChange: handleChange1 };
    const board2 = { state: state2, done: done2, lost: winner === 1, onChange: handleChange2 };
    return { board1, board2, goal, reset, onTutorialEnd };
}

async function handleChange(
    move: Move,
    setState: React.Dispatch<React.SetStateAction<GridTile[]>>,
    goalCheck: (state: GridTile[]) => boolean,
    setWinner: () => void,
): Promise<GridTile[] | null | undefined> {
    const newState = await new Promise<GridTile[] | null>(resolve => {
        setState(
            (value) => {
                const result = goalCheck(value) ? null : doMove(move, value);
                const newValue = result ?? value;
                resolve(result);
                return newValue;
            }
        );
    });
    if (newState != null && goalCheck(newState)) setWinner();
    return newState;
}
