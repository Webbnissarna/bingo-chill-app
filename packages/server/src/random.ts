import seedrandom from "seedrandom";

export type Randomer = () => number;

export function getSeededRandom(seed: number): Randomer {
  return seedrandom(seed.toString());
}

export function randRangeInt(rng: Randomer, min: number, max: number): number {
  return Math.floor(min + (max + 1 - min) * rng());
}
