export function generateGradientCSS(colors: string[]): string {
  if (colors.length === 1) {
    return colors[0];
  }

  const incrementPerStep = 100 / colors.length;
  const colorsAndStops = colors.map((color, index) => ({
    color,
    start: Math.round(index * incrementPerStep),
    end: Math.round((index + 1) * incrementPerStep),
  }));

  const gradientStopString = colorsAndStops.reduce(
    (acc, current) =>
      `${acc}, ${current.color} ${current.start}%, ${
        current.color
      } ${Math.round(current.end)}%`,
    "",
  );

  return `linear-gradient(45deg${gradientStopString})`;
}
