export interface RandomnessService {
  setSeed(seed: number): void;
  randRangeInt(min: number, max: number): number;
  randUniqueValues(count: number, min: number, max: number): number[];
}
