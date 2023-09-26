"use client";

import type { ReactNode } from "react";
import React, { createContext, useEffect, useState } from "react";
import type { ServiceRegistry } from "./ServiceRegistry.types";
import DefaultServiceRegistry from "./defaultServiceRegistry";
import SeedRandomRandomnessService from "../RandomnessService/seedrandomRandomnessService";
import DayjsDateTime from "@webbnissarna/bingo-chill-common/src/dateTime/dayjsDateTime";
import WsApiService from "../ApiService/wsApiService";
import ProtobufSerializer from "@webbnissarna/bingo-chill-common/src/serialization/protobufSerializer";
import { FullPageLoadingTemplate } from "@/components/templates";

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

async function getApiProtoFileContents(): Promise<string> {
  const res = await fetch("/api.proto");
  return res.text();
}

async function getDefaultServiceRegistry(): Promise<ServiceRegistry> {
  const registry = new DefaultServiceRegistry();
  registry.register("DateTime", new DayjsDateTime());
  registry.register("Randomness", new SeedRandomRandomnessService());

  const serializer = new ProtobufSerializer();
  serializer.load(await getApiProtoFileContents());
  registry.register("ApiService", new WsApiService({ serializer }));
  return registry;
}

export default function DefaultServiceRegistryProvider({
  children,
}: DefaultServiceRegistryProviderProps): JSX.Element {
  const [serviceRegistry, setServiceRegistry] =
    useState<ServiceRegistry | null>(null);

  useEffect(() => {
    void (async () => {
      if (serviceRegistry === null) {
        setServiceRegistry(await getDefaultServiceRegistry());
      }
    })();
  });

  if (serviceRegistry === null) {
    return <FullPageLoadingTemplate />;
  }

  return (
    <ServiceRegistryContext.Provider value={serviceRegistry}>
      {children}
    </ServiceRegistryContext.Provider>
  );
}
