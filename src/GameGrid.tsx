import React from "react";
import "./GameGrid.css";
import { GridTile } from "./types";
import { DisplayGridTile } from "./DisplayGridTile";
import { Board } from "./types";

type Props = {
    board: Board;
    onlyInteractTiles?: GridTile[] | null;
    blinkTiles?: GridTile[] | null;
    clickOnly?: boolean;
}

export function GameGrid({
    board: { done, lost, state, onChange },
    onlyInteractTiles,
    blinkTiles,
    clickOnly,
}: Props): React.ReactElement {
    const handleMove = (r: number, c: number, drag: boolean) => {
        const t = state.find(({ color }) => color == null);
        if (t == null) return;
        if (t.row !== r && t.col !== c) return;
        if (t.row === r && t.col === c) return;
        onChange({ fromRow: r, fromCol: c, toRow: t.row, toCol: t.col }, drag);
    };
    return <div className={`GameGrid VbyV ${lost && "loser"}`} onTouchMove={(e) => {
        const changedTouches: Touch[] = [].slice.call(e.changedTouches);
        for (const t of changedTouches) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (t.clientX - rect.x) / rect.width;
            const y = (t.clientY - rect.y) / rect.height;
            if (0 <= x && x <= 1 && 0 <= y && y <= 1) {
                const row = (y * 5) | 0;
                const col = (x * 5) | 0;
                handleMove(row, col, true);
            }
        }
    }}>
        {state.map((tile, i) => {
            if (done && !(1 <= tile.row && tile.row <= 3 && 1 <= tile.col && tile.col <= 3)) return;
            return <DisplayGridTile blink={blinkTiles?.includes(tile)} tile={tile} key={i} />;
        })}
        {Array(5).fill(null).map((_, row) => Array(5).fill(null).map((_, col) =>
            <InteractGridTile
                row={row}
                col={col}
                key={`${row}-${col}`}
                onMove={handleMove}
                onlyInteractTiles={onlyInteractTiles}
                clickOnly={clickOnly}
            />
        ))}
    </div>;
}

function InteractGridTile({ row, col, onMove, onlyInteractTiles, clickOnly }: {
    row: number,
    col: number,
    onMove: (row: number, col: number, drag: boolean) => void,
    onlyInteractTiles?: GridTile[] | null,
    clickOnly?: boolean,
}) {
    const [ref, setRefInner] = React.useState<HTMLDivElement | null>(null);
    const setRef = (r: HTMLDivElement | null) => {
        setRefInner(r);
    };
    const cannotInteract = onlyInteractTiles != null && !onlyInteractTiles.some(
        t => t.row === row && t.col === col
    )
    const noTouch = cannotInteract || clickOnly;
    const noClick = cannotInteract || !clickOnly;
    React.useLayoutEffect(() => {
        if (ref == null) return;
        if (noTouch) return;
        const cb = (e: PointerEvent) => {
            if (ref == null) return;
            if (e.defaultPrevented) return;
            e.preventDefault();
            onMove(row, col, false);
        };
        ref.addEventListener("pointerdown", cb, { passive: false });
        return () => ref.removeEventListener("pointerdown", cb);
    }, [ref, onMove, noTouch]);
    React.useLayoutEffect(() => {
        if (clickOnly) return;
        if (ref == null) return;
        const cb = (e: TouchEvent) => {
            if (e.defaultPrevented) return;
            e.preventDefault();
        };
        ref.addEventListener("touchstart", cb, { passive: false });
        return () => ref.removeEventListener("touchstart", cb);
    }, [ref, clickOnly]);
    return <div
        ref={setRef}
        className="GridTile"
        style={{
            transform: `translate(${col * 100}%,${row * 100}%)`,
            opacity: cannotInteract ? 0.5 : 1,
        }}
        onClick={noClick ? undefined : (e) => {
            if (e.isDefaultPrevented()) return;
            e.preventDefault();
            onMove(row, col, false);
        }}
        onMouseEnter={noTouch ? undefined : (e) => {
            if (!(e.buttons & 1)) return;
            if (e.isDefaultPrevented()) return;
            e.preventDefault();
            onMove(row, col, true);
        }}
        onMouseDown={noTouch ? undefined : (e) => {
            if (e.isDefaultPrevented()) return;
            e.preventDefault();
            onMove(row, col, false);
        }}
        onPointerEnter={noTouch ? undefined : (e) => {
            if (e.pointerType === "mouse") return;
            if (ref == null) return;
            if (e.isDefaultPrevented()) return;
            e.preventDefault();
            if (ref.hasPointerCapture(e.pointerId)) {
                ref.releasePointerCapture(e.pointerId);
                onMove(row, col, false);
            } else {
                onMove(row, col, true);
            }
        }}
    />;
}
