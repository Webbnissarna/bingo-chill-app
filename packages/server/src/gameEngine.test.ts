import GameEngine from "./gameEngine";
import type {
  Event,
  GameSetup,
  Player,
  Profile,
  SessionOptions,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import type { ProfileUpdate } from "@webbnissarna/bingo-chill-common/src/serialization/types";
import type { DateTimeService } from "@webbnissarna/bingo-chill-common/src/dateTime/types";
import dayjs from "dayjs";

const MOCK_GAME: GameSetup = {
  name: "Mock",
  meta: {
    author: "test",
    version: "0.1.0",
    timestamp: "2023-06-01T12:00:00.000Z",
  },
  checksum: "abc",
  tasks: [
    { name: "A", tags: ["foo"], icon: "" },
    { name: "B", tags: ["foo"], icon: "" },
    { name: "C", tags: ["foo"], icon: "" },
    { name: "D", tags: ["foo"], icon: "" },
    { name: "E", tags: ["foo"], icon: "" },
    { name: "F", tags: ["foo"], icon: "" },
    { name: "G", tags: ["foo"], icon: "" },
    { name: "H", tags: ["foo"], icon: "" },
    { name: "I", tags: ["foo"], icon: "" },
    { name: "J", tags: ["foo"], icon: "" },

    { name: "K", tags: ["foo", "bar"], icon: "" },
    { name: "L", tags: ["foo", "bar"], icon: "" },
    { name: "M", tags: ["foo", "bar"], icon: "" },
    { name: "N", tags: ["foo", "bar"], icon: "" },
    { name: "O", tags: ["foo", "bar"], icon: "" },
    { name: "P", tags: ["foo", "bar"], icon: "" },
    { name: "Q", tags: ["foo", "bar"], icon: "" },
    { name: "R", tags: ["foo", "bar"], icon: "" },
    { name: "S", tags: ["foo", "bar"], icon: "" },
    { name: "T", tags: ["foo", "bar"], icon: "" },

    { name: "U", tags: ["bar"], icon: "" },
    { name: "V", tags: ["bar"], icon: "" },
    { name: "W", tags: ["bar"], icon: "" },
    { name: "X", tags: ["bar"], icon: "" },
    { name: "Y", tags: ["bar"], icon: "" },
    { name: "Z", tags: ["bar"], icon: "" },
    { name: "0", tags: ["bar"], icon: "" },
    { name: "1", tags: ["bar"], icon: "" },
    { name: "2", tags: ["bar"], icon: "" },
    { name: "3", tags: ["bar"], icon: "" },

    { name: "4", tags: ["foo", "baz"], icon: "" },
    { name: "5", tags: ["foo", "baz"], icon: "" },
    { name: "6", tags: ["foo", "baz"], icon: "" },
    { name: "7", tags: ["foo", "baz"], icon: "" },
    { name: "8", tags: ["foo", "baz"], icon: "" },
    { name: "9", tags: ["foo", "baz"], icon: "" },
    { name: "!", tags: ["foo", "baz"], icon: "" },
    { name: "@", tags: ["foo", "baz"], icon: "" },
    { name: "#", tags: ["foo", "baz"], icon: "" },
    { name: "$", tags: ["foo", "baz"], icon: "" },
  ],
};

const BLANK_OPTIONS: SessionOptions = {
  seed: 0,
  isLockout: false,
  taskFilters: { includedTags: [], excludedTags: [] },
  timeLimitMinutes: 0,
};

class MockDateTimeProvider implements DateTimeService {
  private advancedTime: number = 0;

  now(): number {
    return dayjs("2023-06-01T12:00:00.000Z").add(this.advancedTime, "s").unix();
  }

  parse(timestamp: string): number {
    return dayjs(timestamp).unix();
  }

  toTimestamp(time: number): string {
    return dayjs.unix(time).toISOString();
  }

  advanceTime(): void {
    this.advancedTime = this.advancedTime + 15;
  }
}

describe("GameEngine", () => {
  it("starts a game", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    expect(gameEngine.getGameState().startTimestamp).toBe(
      "2023-06-01T12:00:00.000Z",
    );
  });

  it("starts out blank", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    expect(gameEngine.getGameState().players).toHaveLength(0);
    expect(gameEngine.getGameState().events).toHaveLength(0);
  });

  it("restarts on successive startGame calls", () => {
    const dateTime = new MockDateTimeProvider();
    const gameEngine = new GameEngine(dateTime);
    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    const pid = gameEngine.addPlayer().id;
    dateTime.advanceTime();
    gameEngine.updateTask(pid, { index: 0, isCompleted: true });
    dateTime.advanceTime();
    gameEngine.updateTask(pid, { index: 1, isCompleted: true });

    const round1Timestamp = gameEngine.getGameState().startTimestamp;
    const round1CompletedTasks = gameEngine
      .getGameState()
      .tasks.filter((task) => task.colors.length > 0);
    const round1EventCount = gameEngine.getGameState().events.length;

    gameEngine.startGame(BLANK_OPTIONS);

    const round2Timestamp = gameEngine.getGameState().startTimestamp;
    const round2CompletedTasks = gameEngine
      .getGameState()
      .tasks.filter((task) => task.colors.length > 0);
    const round2EventCount = gameEngine.getGameState().events.length;

    expect(round1Timestamp).not.toBe(round2Timestamp);
    expect(round1CompletedTasks).toBe(2);
    expect(round1EventCount).toBe(4);
    expect(round2Timestamp).toBe(dateTime.toTimestamp(dateTime.now()));
    expect(round2CompletedTasks).toBe(0);
    expect(round2EventCount).toBe(1);
  });

  it("creates tasks", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    const tasks = gameEngine.getGameState().tasks;

    expect(tasks).toHaveLength(25);
  });

  it("picks tasks pseudo-randomly", () => {
    const expected1 = "";
    const expected2 = "";
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    gameEngine.startGame({ ...BLANK_OPTIONS, seed: 1337 });
    const result1 = gameEngine
      .getGameState()
      .tasks.map((task) => task.name)
      .join("");

    gameEngine.startGame({ ...BLANK_OPTIONS, seed: 420 });
    const result2 = gameEngine
      .getGameState()
      .tasks.map((task) => task.name)
      .join("");

    expect(result1).toBe(expected1);
    expect(result2).toBe(expected2);
  });

  it("adds a new player", () => {
    const expected: Omit<Player, "id"> = {
      profile: {
        name: "",
        icon: "",
        color: "",
      },
      completedTiles: [],
    };
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    const id = gameEngine.addPlayer();

    expect(gameEngine.getGameState().players).toHaveLength(1);
    expect(gameEngine.getGameState().players[0]).toMatchObject({
      id,
      ...expected,
    });
  });

  it("sets defaults for new players", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());
    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    gameEngine.addPlayer();
    gameEngine.addPlayer();

    expect(gameEngine.getGameState().players[0].profile).toMatchObject<Profile>(
      {
        name: "(0)",
        icon: "",
        color: expect.stringMatching(/^[A-Z0-9]{6}$/),
      },
    );
    expect(gameEngine.getGameState().players[1].profile).toMatchObject<Profile>(
      {
        name: "(0)",
        icon: "",
        color: expect.stringMatching(/^[A-Z0-9]{6}$/),
      },
    );
  });

  it("doesn't reuse player default names", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());
    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    const player1 = gameEngine.addPlayer();
    const player2 = gameEngine.addPlayer();
    gameEngine.removePlayer(player2.id);
    const player3 = gameEngine.addPlayer();
    gameEngine.removePlayer(player1.id);
    const player4 = gameEngine.addPlayer();

    const name1 = player1.profile.name;
    const name2 = player2.profile.name;
    const name3 = player3.profile.name;
    const name4 = player4.profile.name;

    expect(name1 !== name2 && name1 !== name3 && name1 !== name4).toBe(true);
    expect(name2 !== name3 && name2 !== name4).toBe(true);
    expect(name3 !== name4).toBe(true);
  });

  it("removes a player", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    const id = gameEngine.addPlayer().id;
    gameEngine.removePlayer(id);

    expect(gameEngine.getGameState().players).toHaveLength(0);
  });

  it("updates a player", () => {
    const update1: ProfileUpdate = {
      name: "my-player",
      icon: "my-icon",
    };
    const update2: ProfileUpdate = {
      color: "f00",
    };
    const expected: Omit<Player, "id"> = {
      profile: { ...update1, ...update2 } as Profile,
      completedTiles: [],
    };
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    const id = gameEngine.addPlayer().id;
    gameEngine.updateProfile(id, update1);
    gameEngine.updateProfile(id, update2);

    const player = gameEngine.getGameState().players[0];

    expect(player).toMatchObject({ id, ...expected });
  });

  it("updates task", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);
    const initial = gameEngine.getGameState().tasks[9].colors[0];
    const playerId = gameEngine.addPlayer().id;
    gameEngine.updateProfile(playerId, { color: "DEDBEF" });
    gameEngine.updateTask(playerId, { index: 9, isCompleted: true });
    const result1 = gameEngine.getGameState().tasks[9].colors[0];
    gameEngine.updateTask(playerId, { index: 9, isCompleted: false });
    const result2 = gameEngine.getGameState().tasks[9].colors[0];

    expect(initial).toBeUndefined();
    expect(result1).toBe("DEDBEF");
    expect(result2).toBeUndefined();
  });

  it("updates player when task is updated", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());
    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);
    const player = gameEngine.addPlayer();
    const playerId = player.id;
    const initial = player.completedTiles[0];
    gameEngine.updateTask(playerId, { index: 0, isCompleted: true });
    gameEngine.updateTask(playerId, { index: 1, isCompleted: true });
    gameEngine.updateTask(playerId, { index: 2, isCompleted: true });
    gameEngine.updateTask(playerId, { index: 3, isCompleted: true });
    gameEngine.updateTask(playerId, { index: 1, isCompleted: false });
    const updatedPlayer = gameEngine.getGameState().players[0];
    const result1 = updatedPlayer.completedTiles[0];
    const result2 = updatedPlayer.completedTiles[1];
    const result3 = updatedPlayer.completedTiles[2];

    expect(initial).toBeUndefined();
    expect(result1).toBe(0);
    expect(result2).toBe(2);
    expect(result3).toBe(3);
    expect(updatedPlayer.completedTiles).toHaveLength(3);
  });

  it("does nothing if lockout and player tries to claim completed task", () => {
    expect(true).toBe(false);
  });

  it("updates task when profile changes", () => {
    const gameEngine = new GameEngine(new MockDateTimeProvider());

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);
    const initial = gameEngine.getGameState().tasks[9].colors[0];
    const playerId = gameEngine.addPlayer().id;
    gameEngine.updateProfile(playerId, { color: "FACADE" });
    gameEngine.updateTask(playerId, { index: 9, isCompleted: true });
    const result1 = gameEngine.getGameState().tasks[9].colors[0];
    gameEngine.updateProfile(playerId, { color: "C0FFEE" });
    const result2 = gameEngine.getGameState().tasks[9].colors[0];

    expect(initial).toBeUndefined();
    expect(result1).toBe("FACADE");
    expect(result2).toBe("C0FFEE");
  });

  describe("Callback", () => {
    it("calls callback when player is added", () => expect(false).toBe(true));
    it("calls callback when player is removed", () => expect(false).toBe(true));
    it("calls callback when profile is updated", () =>
      expect(false).toBe(true));
    it("calls callback when task is updated", () => expect(false).toBe(true));

    // TODO: bake into Events tests instead
    it("calls callback when a new event occurred", () =>
      expect(false).toBe(true));

    it("does not call callback when profile is unchanged after update", () =>
      expect(false).toBe(true));
    it("does not call callback when task is unchanged after update", () =>
      expect(false).toBe(true));
  });

  describe("Events", () => {
    it("adds event when game starts", () => {
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine(dateTime);
      gameEngine.loadSetup(MOCK_GAME);

      dateTime.advanceTime();
      const length = gameEngine.getGameState().events.length;
      gameEngine.startGame(BLANK_OPTIONS);
      const result = gameEngine.getGameState().events[length];

      expect(result).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: "Game Started!",
      });
    });

    it("adds event when task updates", () => {
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine(dateTime);
      gameEngine.loadSetup(MOCK_GAME);
      gameEngine.startGame(BLANK_OPTIONS);
      const playerId = gameEngine.addPlayer().id;
      gameEngine.updateProfile(playerId, { name: "Me", color: "DEDBEF" });

      dateTime.advanceTime();
      const length = gameEngine.getGameState().events.length;
      gameEngine.updateTask(playerId, { index: 9, isCompleted: true });
      const result = gameEngine.getGameState().events[length];

      expect(result).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /<span color="DEDBEF">\*Me\*<\/span> completed \*TASKNAME\*$/,
        ),
      });
    });

    it("adds event when player is added", () => {
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine(dateTime);
      gameEngine.loadSetup(MOCK_GAME);
      gameEngine.startGame(BLANK_OPTIONS);

      dateTime.advanceTime();
      const length = gameEngine.getGameState().events.length;
      gameEngine.addPlayer();
      const result = gameEngine.getGameState().events[length];

      expect(result).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(/^A new player joined! \(0\)$/),
      });
    });

    it("adds event when player is removed", () => {
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine(dateTime);
      gameEngine.loadSetup(MOCK_GAME);
      gameEngine.startGame(BLANK_OPTIONS);

      const pid = gameEngine.addPlayer().id;
      gameEngine.updateProfile(pid, { name: "Me", color: "DEDBEF" });
      dateTime.advanceTime();
      const length = gameEngine.getGameState().events.length;
      gameEngine.removePlayer(pid);
      const result = gameEngine.getGameState().events[length];

      expect(result).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /^<span color="DEDBEF">\*Me\*<\/span> disconnected$/,
        ),
      });
    });

    it("adds event when profile updates", () => {
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine(dateTime);
      gameEngine.loadSetup(MOCK_GAME);
      gameEngine.startGame(BLANK_OPTIONS);

      const pid = gameEngine.addPlayer().id;

      dateTime.advanceTime();
      const length = gameEngine.getGameState().events.length;
      gameEngine.updateProfile(pid, { name: "Me", color: "DEDBEF" });
      const result1 = gameEngine.getGameState().events[length];
      const result2 = gameEngine.getGameState().events[length + 1];

      expect(result1).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /^<span color="[A-Z0-9]{6}">\*\(0\)\*<\/span> is now <span>\*Me\*<\/span>$/,
        ),
      });
      expect(result2).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /^<span color="[A-Z0-9]{6}">\*Me\*<\/span> changed color to <span color="DEDBEF">DEDBEF<\/span>$/,
        ),
      });
    });

    it("adds event when a player wins", () => {
      expect(false).toBe(true);
    });

    it.each([
      /* rows */
      ["r1", [0, 1, 2, 3, 4]],
      ["r2", [5, 6, 7, 8, 9]],
      ["r3", [10, 11, 12, 13, 14]],
      ["r4", [15, 16, 17, 18, 19]],
      ["r5", [20, 21, 22, 23, 24]],

      /* columns */
      ["c1", [0, 5, 10, 15, 20]],
      ["c2", [1, 6, 11, 16, 21]],
      ["c3", [2, 7, 12, 17, 22]],
      ["c4", [3, 8, 13, 18, 23]],
      ["c5", [4, 9, 14, 19, 24]],

      /* diagonals */
      ["d1", [0, 6, 12, 19, 24]],
      ["d2", [4, 8, 12, 16, 20]],
    ])("adds event when player wins %s %s", (_, indicesToSet) => {
      const updateHandler = jest.fn();
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine(dateTime);
      gameEngine.loadSetup(MOCK_GAME);
      gameEngine.startGame(BLANK_OPTIONS);
      const pid = gameEngine.addPlayer().id;
      gameEngine.updateProfile(pid, { name: "Me", color: "DEDBEF" });

      indicesToSet
        .slice(0, -1)
        .forEach((index) =>
          gameEngine.updateTask(pid, { index, isCompleted: true }),
        );

      dateTime.advanceTime();
      const length = gameEngine.getGameState().events.length;
      gameEngine.setGameStateChangedHandler(updateHandler);
      gameEngine.updateTask(pid, {
        index: indicesToSet.at(-1)!,
        isCompleted: true,
      });
      const result = gameEngine.getGameState().events[length];

      expect(result).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /^<span color="DEDBEF">\*Me\*<\/span> BINGO!$/,
        ),
      });
      expect(updateHandler).toHaveBeenCalledWith(gameEngine.getGameState());
    });
  });
});
