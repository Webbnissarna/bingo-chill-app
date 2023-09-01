import dayjs from "dayjs";
import type { DateTimeService } from "./DateTimeService.types";

export default class DayJsDateTimeService implements DateTimeService {
  now(): number {
    return dayjs().unix();
  }
}
