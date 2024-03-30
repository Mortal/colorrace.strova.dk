import { GridTile } from "./types";
import { colors } from "./colors";

type Props = {
    tile: GridTile;
    blink?: boolean;
};

export function DisplayGridTile({ tile, blink }: Props) {
    return <div
        onAnimationStart={(evt: React.AnimationEvent) => {
            // Synchronize all blinking animations
            if (evt.animationName !== "blink") return;
            const elems = [...document.querySelectorAll(".GridTile.Display.blink")];
            const anims = elems
                .flatMap(elem => elem.getAnimations())
                .filter((anim): anim is CSSAnimation =>
                    // anim is an Animation, and it might be a CSSAnimation with an animationName.
                    (anim as Partial<CSSAnimation>).animationName === evt.animationName
                );
            // The static type of anim.startTime is number | CSSNumericValue | null
            // but in practice it seems to always be number.
            const startTimes = anims
                .map(anim => anim.startTime)
                .filter((startTime): startTime is number => typeof startTime === "number");
            if (startTimes.length === 0) return;
            const startTime = Math.min(...startTimes);
            for (const anim of anims) {
                anim.startTime = startTime;
            }
        }}
        className={`GridTile Display color-${tile.color} ${blink && "blink"}`}
        style={{
            transform: `translate(${tile.col * 100}%,${tile.row * 100}%) scale(80%)`,
            backgroundColor: tile.color == null ? undefined : colors[tile.color] ?? tile.color,
        }} />;
}
