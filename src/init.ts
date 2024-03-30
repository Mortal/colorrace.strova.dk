import { colors } from "./colors";
import { sfc32 } from "./sfc32";
import { GridTile } from "./types";

export function initRandomGameGrid(seed: number = 0): GridTile[] {
    if (!seed) seed = Date.now();
    const prng = sfc32(seed);
    const blank = 12;
    const locations = [...Array(24).fill(0).map((_, i) => [prng(), i + +(i >= blank)])];
    locations.sort(([a], [b]) => a - b);
    const colorList = (
        Object.keys(colors)
            .flatMap(c => [c, c, c, c])
            .map((color, i) => ({ color, row: (locations[i][1] / 5) | 0, col: locations[i][1] % 5 }))
    );
    return [{ color: null, row: (blank / 5) | 0, col: blank % 5 }, ...colorList];
}

export function initRandomGoalGrid(seed: number = 0): string[][] {
    if (!seed) seed = Date.now();
    const prng = sfc32(seed);
    const colorList = [...Object.keys(colors).flatMap(c => [c, c, c, c])].map((v) => ({ v, key: prng() }));
    colorList.sort((a, b) => a.key - b.key);
    return [0, 3, 6].map(i => [0, 1, 2].map(j => colorList[i + j].v));
}
