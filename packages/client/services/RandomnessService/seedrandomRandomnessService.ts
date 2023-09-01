import type { RandomnessService } from "./RandomnessService.types";
import seedrandom from "seedrandom";

export default class SeedRandomRandomnessService implements RandomnessService {
  private rng: seedrandom.PRNG;

  constructor() {
    this.rng = seedrandom();
  }

  next(min: number, max: number): number {
    const range = max - min + 1;
    return Math.floor(this.rng() * range) + min;
  }
}
