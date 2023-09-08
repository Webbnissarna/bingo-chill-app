import dayjs from "dayjs";
import type { DateTimeService } from "./types";

export default class DayjsDateTime implements DateTimeService {
  private advancedTime: number = 0;

  now(): number {
    return dayjs().unix();
  }

  parse(timestamp: string): number {
    return dayjs(timestamp).unix();
  }

  toTimestamp(time: number): string {
    return dayjs.unix(time).toISOString();
  }

  secondsFrom(start: number, end: number): number {
    return end - start;
  }
}
