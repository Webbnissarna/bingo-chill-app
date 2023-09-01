import { generateGradientCSS } from "./css";

describe("css", () => {
  test.each([
    [["#f00"], "#f00"],
    [
      ["#0f0", "#00f"],
      "linear-gradient(45deg, #0f0 0%, #0f0 50%, #00f 50%, #00f 100%)",
    ],
    [
      ["#ff0", "#0ff", "#f0f"],
      "linear-gradient(45deg, #ff0 0%, #ff0 33%, #0ff 33%, #0ff 67%, #f0f 67%, #f0f 100%)",
    ],
  ])("generateGradientCSS '%s' => '%s'", (colors, expected) => {
    const result = generateGradientCSS(colors);
    expect(result).toBe(expected);
  });
});
