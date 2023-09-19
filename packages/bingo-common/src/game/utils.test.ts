import type { GameSetup } from "./types";
import { calculateChecksum } from "./utils";

describe("Game Utils", () => {
  describe("calculateChecksum", () => {
    const MOCK_GAME_SETUP: GameSetup = {
      name: "My Game",
      meta: {
        author: "My Name",
        timestamp: "2023-06-01T12:00:00.000Z",
        version: "1.0.0",
      },
      tasks: [
        { name: "Task A", tags: ["tag1", "tag2"], icon: "icon1" },
        { name: "Task B", tags: ["tag2", "tag3"], icon: "icon2" },
      ],
      checksum: "123",
    };
    it("generates checksum", () => {
      const checksum = calculateChecksum(MOCK_GAME_SETUP);

      expect(checksum).toBe("7a5682c3");
    });
    it("ignores current checksum for calculations", () => {
      const setup = { ...MOCK_GAME_SETUP, checksum: "456" };
      const checksum = calculateChecksum(setup);

      expect(checksum).toBe("7a5682c3");
    });
  });
});
