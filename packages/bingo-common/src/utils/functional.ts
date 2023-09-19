import mergeWith from "lodash.mergewith";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export function useIf<T>(condition: boolean, value: T): T | undefined {
  return condition ? value : undefined;
}

export function patch<T>(base: T, update: DeepPartial<T>): T {
  return mergeWith(base, update, (baseValue, updateValue) => {
    if (Array.isArray(baseValue)) {
      return updateValue;
    }
  });
}

export function addIfMissing<T>(list: T[], entry: T): T[] {
  if (list.includes(entry)) {
    return list;
  }

  return [...list, entry];
}

export function removeIfPresent<T>(list: T[], entry: T): T[] {
  return list.filter((v) => v !== entry);
}

export function uniqueValuesReducer<T>(acc: T[], v: T) {
  if (acc.includes(v)) {
    return acc;
  }
  return [...acc, v];
}

export function HSVtoHEX(h: number, s: number, v: number): string {
  // Ensure H, S, and V are within valid ranges
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  // Convert percentage values to 0-1 range
  const hue = h / 360;
  const saturation = s / 100;
  const value = v / 100;

  // Calculate RGB values
  let r = 0,
    g = 0,
    b = 0;
  if (s === 0) {
    // Achromatic (gray)
    r = g = b = value;
  } else {
    const i = Math.floor(hue * 6);
    const f = hue * 6 - i;
    const p = value * (1 - saturation);
    const q = value * (1 - saturation * f);
    const t = value * (1 - saturation * (1 - f));

    switch (i % 6) {
      case 0:
        r = value;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = value;
        b = p;
        break;
      case 2:
        r = p;
        g = value;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = value;
        break;
      case 4:
        r = t;
        g = p;
        b = value;
        break;
      case 5:
        r = value;
        g = p;
        b = q;
        break;
    }
  }

  // Convert RGB to HEX
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hexR = toHex(r);
  const hexG = toHex(g);
  const hexB = toHex(b);

  return `#${hexR}${hexG}${hexB}`;
}
