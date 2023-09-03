import { patch, useIf } from "./functional";

describe("functional", () => {
  test.each([
    [true, "abc"],
    [true, 123],
    [true, true],
    [true, 123.456],
    [true, { hello: "world" }],
    [true, Buffer.from("hello world", "utf-8")],
    [true, null],
    [true, undefined],
    [true, {}],
  ])("useIf (true) '%s' => '%s'", (condition, expected) => {
    const result = useIf(condition, expected);

    expect(result).toEqual(expected);
  });

  test.each([
    [false, "abc"],
    [false, 123],
    [false, true],
    [false, 123.456],
    [false, { hello: "world" }],
    [false, Buffer.from("hello world", "utf-8")],
    [false, null],
    [false, undefined],
    [false, {}],
  ])("useIf (false) '%s' => undefined", (condition, input) => {
    const result = useIf(condition, input);

    expect(result).toBeUndefined();
  });

  test.each([
    ["simple prop", { prop: "A" }, { prop: "B" }, { prop: "B" }],
    [
      "overrides array (same length)",
      { players: [{ name: "a" }] },
      { players: [{ name: "b" }] },
      { players: [{ name: "b" }] },
    ],
    [
      "overrides array (shorter)",
      { players: [{ name: "a" }, { name: "b" }] },
      { players: [{ name: "c" }] },
      { players: [{ name: "c" }] },
    ],
    [
      "overrides array (longer)",
      { players: [{ name: "a" }] },
      { players: [{ name: "b" }, { name: "c" }] },
      { players: [{ name: "b" }, { name: "c" }] },
    ],
    [
      "merges object",
      { options: { seed: 1, isLockout: true } },
      { options: { seed: 5 } },
      { options: { seed: 5, isLockout: true } },
    ],
    [
      "complex",
      {
        players: [{ name: "a" }, { name: "b" }],
        options: { seed: 1, isLockout: false },
        arr: [1, 2, 3, 4],
        prop1: "hi",
        prop2: "hello",
      },
      {
        players: [{ name: "c" }, { name: "d" }],
        options: { seed: 5, setupChecksum: "abc" },
        arr: [0, 9],
        prop2: "yo",
      },
      {
        players: [{ name: "c" }, { name: "d" }],
        options: { seed: 5, isLockout: false, setupChecksum: "abc" },
        arr: [0, 9],
        prop1: "hi",
        prop2: "yo",
      },
    ],
  ])("patch %s", (_, base, update, expected) => {
    const result = patch(base, update as Partial<typeof base>);
    expect(result).toEqual(expected);
  });
});
