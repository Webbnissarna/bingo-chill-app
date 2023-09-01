export interface DateTimeService {
  now(): number;
  parse(timestamp: string): number;
  toTimestamp(time: number): string;
}
