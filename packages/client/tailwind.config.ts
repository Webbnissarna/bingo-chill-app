import type { Config } from "tailwindcss";
import formsPlugins from "@tailwindcss/forms";
import tailwindScrollbar from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      polarNight: {
        0: "#2e3440",
        1: "#3b4252",
        2: "#434c5e",
        3: "#4c566a",
      },
      snowStorm: {
        0: "#d8dee9",
        1: "#e5e9f0",
        2: "#eceff4",
      },
      frost: {
        0: "#8fbcbb",
        1: "#88c0d0",
        2: "#81a1c1",
        3: "#5e81ac",
      },
      aurora: {
        0: "#bf616a",
        1: "#d08770",
        2: "#ebcb8b",
        3: "#a3be8c",
        4: "#b48ead",
      },
    },
    fontFamily: {
      text: ["var(--font-source-sans)", "'Source Sans 3'", "sans-serif"],
      heading: ["var(--font-raleway)", "'Raleway'", "sans-serif"],
      monospace: ["var(--font-fira-code)", "'Fira Code'", "monospace"],
    },
  },
  plugins: [formsPlugins, tailwindScrollbar],
};
export default config;
