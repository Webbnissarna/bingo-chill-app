"use client";

import { useEffect, useState } from "react";

export type LocalStorageHook<T> = [value: T, setter: (value: T) => void];

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): LocalStorageHook<T> {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const raw = window.localStorage.getItem(key);
    setValue(raw ? JSON.parse(raw) : defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setter = (newValue: T) => {
    window.localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, setter];
}
