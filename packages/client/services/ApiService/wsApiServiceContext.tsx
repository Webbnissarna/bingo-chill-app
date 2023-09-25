import React from "react";
import type WsApiService from "./wsApiService";

const WsApiServiceContext = React.createContext<WsApiService>(
  {} as WsApiService,
);

export interface WsApiServiceProviderProps {
  children: React.ReactNode;
}

export default function WsApiServiceProvider({
  children,
}: WsApiServiceProviderProps) {
  return (
    <WsApiServiceContext.Provider value={}>
      {children}
    </WsApiServiceContext.Provider>
  );
}
