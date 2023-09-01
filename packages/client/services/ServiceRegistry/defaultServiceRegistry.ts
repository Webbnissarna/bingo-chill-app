import type { ServiceRegistry, Services } from "./ServiceRegistry.types";

export default class DefaultServiceRegistry implements ServiceRegistry {
  private registry: Partial<Services>;

  constructor() {
    this.registry = {};
  }

  register<TService extends keyof Services>(
    key: TService,
    service: Services[TService],
  ): void {
    this.registry[key] = service;
  }

  get<TService extends keyof Services>(key: TService): Services[TService] {
    return this.registry[key] as Services[TService];
  }
}
