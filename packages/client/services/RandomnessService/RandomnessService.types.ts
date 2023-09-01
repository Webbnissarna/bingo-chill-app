export interface RandomnessService {
  next(min: number, max: number): number;
}
