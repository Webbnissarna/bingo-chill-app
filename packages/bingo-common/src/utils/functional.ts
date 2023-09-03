import mergeWith from "lodash.mergewith";

export function useIf<T>(condition: boolean, value: T): T | undefined {
  return condition ? value : undefined;
}

export function patch<T>(base: T, update: Partial<T>): T {
  return mergeWith(base, update, (baseValue, updateValue) => {
    if (Array.isArray(baseValue)) {
      return updateValue;
    }
  });
}
