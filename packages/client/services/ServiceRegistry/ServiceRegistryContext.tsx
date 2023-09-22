"use client";

import type { ReactNode } from "react";
import React, { createContext, useEffect, useState } from "react";
import type { ServiceRegistry } from "./ServiceRegistry.types";
import DefaultServiceRegistry from "./defaultServiceRegistry";
import SeedRandomRandomnessService from "../RandomnessService/seedrandomRandomnessService";
import DayjsDateTime from "@webbnissarna/bingo-chill-common/src/dateTime/dayjsDateTime";

export const ServiceRegistryContext = createContext<ServiceRegistry>({
  get() {
    throw new Error("Not implemented");
  },
  register() {
    throw new Error("Not implemented");
  },
});

interface DefaultServiceRegistryProviderProps {
  children: ReactNode;
}

export default function DefaultServiceRegistryProvider({
  children,
}: DefaultServiceRegistryProviderProps): JSX.Element {
  const [serviceRegistry] = useState<ServiceRegistry>(
    new DefaultServiceRegistry(),
  );
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      // Init concrete implementations of services here
      serviceRegistry.register("DateTime", new DayjsDateTime());
      serviceRegistry.register("Randomness", new SeedRandomRandomnessService());

      setHasInitialized(true);
    }
  }, [hasInitialized, serviceRegistry]);

  return (
    <ServiceRegistryContext.Provider value={serviceRegistry}>
      {children}
    </ServiceRegistryContext.Provider>
  );
}
