import "./Tutorial.css"
import { GridTile } from "./types";

export function Tutorial({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    const showFullscreen = document.fullscreenElement == null && document.documentElement.requestFullscreen != null;
    const onStart = (e: React.MouseEvent) => { e.preventDefault(); onChange(0); };
    const onStartFullscreen = (e: React.MouseEvent) => { e.preventDefault(); document.documentElement.requestFullscreen().then(() => onChange(0)); };
    return <div className="Tutorial">
        <h1>Color Race</h1>
        <p>(inspired by - but not affiliated with - Rubik™'s Race)</p>
        {value < 4 && <>
            <p>
                (
                <a href="#" onClick={onStart}>skip tutorial</a>
                {showFullscreen && <>
                    {" - "}
                    <a href="#" onClick={onStartFullscreen}>skip and start fullscreen</a>
                </>}
                )
            </p>
            <h2>How to play</h2>
            <ol>
                <li>Click a tile next to a blank space to move it</li>
                {value >= 2 && <li>Click a tile further away to move multiple tiles</li>}
                {value >= 3 && <li>Click and drag to keep moving</li>}
            </ol></>}
        {value >= 4 && <p><b>Goal of the game: Make the center 3x3 match the target</b></p>}
        {value >= 4 &&
            <div className="buttons">
                <button className="startgame" onClick={onStart}>Start game</button>
                {showFullscreen && <button className="fullscreen" onClick={onStartFullscreen}>Start in full screen</button>}
            </div>}
        {value >= 4 && <p>When you're done, press the target in the center to <b>reset</b></p>}
    </div>;
}

export function getTutorialTiles(tutorial: number, value: GridTile[]) {
    const t = value.find(({ color }) => color == null);
    if (t == null) return null;
    if (tutorial === 1) return value.filter(
        ({ row, col }) => {
            const d = dist(t, row, col);
            return 1 === d;
        }
    );
    if (tutorial === 2) return value.filter(
        ({ row, col }) => {
            const d = dist(t, row, col);
            return 1 < d && d < Infinity;
        }
    );
    return null;
}

function dist(t: GridTile, r: number, c: number) {
    if (t.row !== r && t.col !== c) return Infinity;
    return Math.abs(t.row - r) + Math.abs(t.col - c);
}
