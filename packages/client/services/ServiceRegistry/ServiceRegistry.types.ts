import type { IApiService } from "../ApiService/types";
import type { RandomnessService } from "../RandomnessService/RandomnessService.types";
import type { DateTimeService } from "@webbnissarna/bingo-chill-common/src/dateTime/types";

export interface Services {
  Randomness: RandomnessService;
  DateTime: DateTimeService;
  ApiService: IApiService;
}

export interface ServiceRegistry {
  register<TService extends keyof Services>(
    key: TService,
    service: Services[TService],
  ): void;
  get<TService extends keyof Services>(key: TService): Services[TService];
}
