import React from "react";
import DefaultServiceRegistryProvider from "../services/ServiceRegistry/ServiceRegistryContext";
import type { GlobalProvider } from "@ladle/react";

import "./style.css";

export const Provider: GlobalProvider = ({ children, globalState }) => (
  <DefaultServiceRegistryProvider>{children}</DefaultServiceRegistryProvider>
);

export const argTypes = {
  background: {
    control: { type: "background" },
    options: ["#2e3440"],
    defaultValue: "#2e3440",
  },
};
