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
    colors: nordThemeColors,
    fontFamily: {
      text: ["var(--font-source-sans)", "'Source Sans 3'", "sans-serif"],
      heading: ["var(--font-raleway)", "'Raleway'", "sans-serif"],
      monospace: ["var(--font-fira-code)", "'Fira Code'", "monospace"],
    },
  },
  plugins: [formsPlugins, tailwindScrollbar],
};
export default config;
