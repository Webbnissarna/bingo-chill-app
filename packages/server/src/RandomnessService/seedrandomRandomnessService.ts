import type { RandomnessService } from "./RandomnessService.types";
import seedrandom from "seedrandom";

export default class SeedRandomRandomnessService implements RandomnessService {
  private rng: seedrandom.PRNG;

  constructor() {
    this.rng = seedrandom();
  }

  setSeed(seed: number): void {
    this.rng = seedrandom(seed.toString());
  }

  randRangeInt(min: number, max: number): number {
    return Math.floor(min + (max + 1 - min) * this.rng());
  }
}
