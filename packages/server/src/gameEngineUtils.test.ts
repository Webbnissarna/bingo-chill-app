import type { Task } from "@webbnissarna/bingo-chill-common/src/game/types";
import { filterTasks } from "./gameEngineUtils";

describe("Game Engine Utils", () => {
  const fooTasks: Task[] = [
    { name: "foo1", tags: ["foo"], icon: "" },
    { name: "foo2", tags: ["foo"], icon: "" },
  ];

  const fooBarTasks: Task[] = [
    { name: "foobar1", tags: ["foo", "bar"], icon: "" },
    { name: "foobar2", tags: ["foo", "bar"], icon: "" },
  ];

  const barTasks: Task[] = [
    { name: "bar1", tags: ["bar"], icon: "" },
    { name: "bar2", tags: ["bar"], icon: "" },
  ];

  const fooBazTasks: Task[] = [
    { name: "foobaz1", tags: ["foo", "baz"], icon: "" },
    { name: "foobaz2", tags: ["foo", "baz"], icon: "" },
  ];

  const allTasks = [...fooTasks, ...fooBarTasks, ...barTasks, ...fooBazTasks];

  it.each([
    ["all", [], [], allTasks],
    ["only foo", ["foo"], [], [...fooTasks, ...fooBazTasks, ...fooBarTasks]],
    ["not bar", [], ["bar"], [...fooTasks, ...fooBazTasks]],
    ["bar and not baz", ["bar"], ["baz"], [...fooBarTasks, ...barTasks]],
    ["bar and baz and not foo", ["bar", "baz"], ["foo"], [...barTasks]],
  ])(
    "filters '%s' include=%s exclude=%s",
    (_, includedTags, excludedTags, expected) => {
      const result = filterTasks(allTasks, { includedTags, excludedTags });
      expect(result).toEqual(expect.arrayContaining(expected));
      expect(result).toHaveLength(expected.length);
    },
  );
});
