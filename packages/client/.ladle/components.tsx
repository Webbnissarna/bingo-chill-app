import React from "react";
import { ProviderStack } from "../components/utils";
import type { GlobalProvider } from "@ladle/react";

import "./style.css";

export const Provider: GlobalProvider = ({ children, globalState }) => (
  <ProviderStack>{children}</ProviderStack>
);

export const argTypes = {
  background: {
    control: { type: "background" },
    options: ["#2e3440"],
    defaultValue: "#2e3440",
  },
};
