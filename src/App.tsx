
import "./App.css"
import { GameGrid } from "./GameGrid"
import { GoalGrid } from "./GoalGrid";
import { Tutorial } from "./Tutorial";
import { useGameState } from "./useGameState";
import { useTutorial } from "./useTutorial";

export default function App() {
    const { board1, board2, goal, reset, onTutorialEnd } = useGameState();
    const { tutorial, handleChangeTutorial, props } = useTutorial(board2, onTutorialEnd);
    return (
        <div className="App">
            {tutorial ? <>
                <div className="AppTutorial">
                    <Tutorial value={tutorial} onChange={handleChangeTutorial} />
                </div>
            </> : <>
                <div className="AppGame">
                    <GameGrid board={board1} />
                </div>
                <div className="AppMiddle">
                    <GoalGrid tutorial={tutorial} goal={goal} onClick={() => {
                        if (tutorial) return;
                        reset();
                    }} />
                </div>
            </>}
            {tutorial ?
                <div className="AppGame">
                    <GameGrid {...props} />
                </div>
                :
                <div className="AppGame">
                    <GameGrid board={board2} />
                </div>
            }
        </div>
    );
}
