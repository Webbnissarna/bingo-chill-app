import {
  HSVtoHEX,
  addIfMissing,
  patch,
  removeIfPresent,
  uniqueValuesReducer,
  useIf,
} from "./functional";

describe("functional", () => {
  describe("useIf", () => {
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
    ])("(true) '%s' => '%s'", (condition, expected) => {
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
    ])("(false) '%s' => undefined", (condition, input) => {
      const result = useIf(condition, input);

      expect(result).toBeUndefined();
    });
  });

  describe("patch", () => {
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
    ])("%s", (_, base, update, expected) => {
      const result = patch(base, update as Partial<typeof base>);
      expect(result).toEqual(expected);
    });
  });

  describe("addIfMissing", () => {
    it("adds", () => {
      const base = ["a", "b", "c"];
      const expected = ["a", "b", "c", "d"];

      const result = addIfMissing(base, "d");

      expect(result).toEqual(expected);
    });

    it("doesn't add duplicates", () => {
      const base = [0, 1, 2];
      const expected = [0, 1, 2];

      const result = addIfMissing(base, 1);

      expect(result).toEqual(expected);
    });
  });

  describe("removeIfPresent", () => {
    it("removes", () => {
      const base = ["a", "b", "c"];
      const expected = ["a", "b"];

      const result = removeIfPresent(base, "c");

      expect(result).toEqual(expected);
    });

    it("ignores already missing", () => {
      const base = [0, 1, 2];
      const expected = [0, 1, 2];

      const result = removeIfPresent(base, 3);

      expect(result).toEqual(expected);
    });
  });

  describe("uniqueValuesReducer", () => {
    it("returns only uniques", () => {
      const base = ["a", "b", "c", "d", "a", "e", "b", "f", "c", "g", "g", "c"];
      const expected = ["a", "b", "c", "d", "e", "f", "g"];

      const result = base.reduce<string[]>(uniqueValuesReducer, []);

      expect(result).toEqual(expected);
    });
  });

  describe("HSVtoHEX", () => {
    it("should convert HSV to HEX (Red)", () => {
      const hexColor = HSVtoHEX(0, 100, 100);
      expect(hexColor).toBe("#ff0000");
    });

    it("should convert HSV to HEX (Green)", () => {
      const hexColor = HSVtoHEX(120, 100, 100);
      expect(hexColor).toBe("#00ff00");
    });

    it("should convert HSV to HEX (Blue)", () => {
      const hexColor = HSVtoHEX(240, 100, 100);
      expect(hexColor).toBe("#0000ff");
    });

    it("should handle saturation of 0 (Gray)", () => {
      const hexColor = HSVtoHEX(60, 0, 50);
      expect(hexColor).toBe("#808080");
    });

    it("should handle value of 0 (Black)", () => {
      const hexColor = HSVtoHEX(180, 50, 0);
      expect(hexColor).toBe("#000000");
    });

    it("should handle value of 100 with saturation 0 (White)", () => {
      const hexColor = HSVtoHEX(270, 0, 100);
      expect(hexColor).toBe("#ffffff");
    });

    it("should handle out-of-range values", () => {
      // Testing with values outside valid ranges
      const hexColor1 = HSVtoHEX(400, 150, 150);
      const hexColor2 = HSVtoHEX(-10, -20, -30);

      // Expecting both to return valid HEX color strings
      expect(hexColor1).toMatch(/^#[0-9A-F]{6}$/i);
      expect(hexColor2).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it.each([
      [0, 0, 100, "#ffffff"],
      [0, 0, 0, "#000000"],
      [354, 49, 75, "#bf626b"],
      [14, 46, 82, "#d18771"],
      [40, 41, 92, "#ebcb8a"],
      [92, 26, 75, "#a5bf8e"],
      [311, 21, 71, "#b58fae"],
    ])("converts %d %d %d => %s", (h, s, v, hex) => {
      const result = HSVtoHEX(h, s, v);
      expect(result).toBe(hex);
    });
  });
});
