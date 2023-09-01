import type { DateTimeService } from "../DateTimeService/DateTimeService.types";
import type { RandomnessService } from "../RandomnessService/RandomnessService.types";

export interface Services {
  Randomness: RandomnessService;
  DateTime: DateTimeService;
}

export interface ServiceRegistry {
  register<TService extends keyof Services>(
    key: TService,
    service: Services[TService],
  ): void;
  get<TService extends keyof Services>(key: TService): Services[TService];
}
