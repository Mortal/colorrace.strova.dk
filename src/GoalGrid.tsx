import React from "react";
import { DisplayGridTile } from "./DisplayGridTile";

type Props = {
    tutorial?: number;
    goal: string[][];
    onClick: () => void;
};

export function GoalGrid({ tutorial, goal, onClick }: Props): React.ReactElement {
    return <div className="GameGrid" onClick={onClick}>
        <div className="IIIbyIII">
            {goal.map((row, i) =>
                row.map((color, j) =>
                    <DisplayGridTile blink={tutorial === 4} tile={{ row: i, col: j, color }} key={`${i}-${j}`} />
                )
            )}
        </div>
    </div>;
}
