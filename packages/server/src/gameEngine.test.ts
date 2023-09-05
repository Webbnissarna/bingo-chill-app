import GameEngine from "./gameEngine";
import type {
  Task,
  ActiveTask,
  Event,
  GameSetup,
  Player,
  Profile,
  SessionOptions,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import type { ProfileUpdate } from "@webbnissarna/bingo-chill-common/src/serialization/types";
import type { DateTimeService } from "@webbnissarna/bingo-chill-common/src/dateTime/types";
import dayjs from "dayjs";
import SeedRandomRandomnessService from "./RandomnessService/seedrandomRandomnessService";
import { uniqueValuesReducer } from "@webbnissarna/bingo-chill-common/src/utils/functional";

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

    { name: "%", tags: ["foo", "oof"], icon: "" },
    { name: "^", tags: ["foo", "oof"], icon: "" },
    { name: "&", tags: ["foo", "oof"], icon: "" },
    { name: "*", tags: ["foo", "oof"], icon: "" },
    { name: "(", tags: ["foo", "oof"], icon: "" },
    { name: ")", tags: ["foo", "oof"], icon: "" },
    { name: "_", tags: ["foo", "oof"], icon: "" },
    { name: "+", tags: ["foo", "oof"], icon: "" },
    { name: "?", tags: ["foo", "oof"], icon: "" },
    { name: ".", tags: ["foo", "oof"], icon: "" },
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

  secondsFrom(start: number, end: number): number {
    return end - start;
  }

  advanceTime(): void {
    this.advancedTime = this.advancedTime + 15;
  }
}

describe("GameEngine", () => {
  it("fails if game setup contains duplicate tasks", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup({
      ...MOCK_GAME,
      tasks: [
        ...MOCK_GAME.tasks,
        { name: "A", icon: "", tags: [] },
        { name: "B", icon: "", tags: [] },
      ],
    });
    const lastEvent = gameEngine.getGameState().events.at(-1);

    expect(lastEvent).toMatchObject<Event>({
      elapsedTimeS: 0,
      message:
        '<span color="#bf616a">(*server*): Setup for "Mock" (cs=abc) contains duplicate task(s): "A", "B"</span>',
    });
  });

  it("starts a game", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    expect(gameEngine.getGameState().startTimestamp).toBe(
      "2023-06-01T12:00:00.000Z",
    );
  });

  it("fails to start if no game setup is loaded", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.startGame(BLANK_OPTIONS);
    const lastEvent = gameEngine.getGameState().events.at(-1);

    expect(lastEvent).toMatchObject<Event>({
      elapsedTimeS: 0,
      message: '<span color="#bf616a">(*server*): No game setup loaded</span>',
    });
  });

  it("starts out blank", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    expect(gameEngine.getGameState().players).toHaveLength(0);
    expect(gameEngine.getGameState().events).toHaveLength(0);
    expect(gameEngine.getGameState().isLockout).toBe(false);
  });

  it("respect isLockout option", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame({ ...BLANK_OPTIONS, isLockout: true });

    expect(gameEngine.getGameState().isLockout).toBe(true);
  });

  it("resets tasks on successive startGame calls", () => {
    const dateTime = new MockDateTimeProvider();
    const gameEngine = new GameEngine({
      dateTime,
      rng: new SeedRandomRandomnessService(),
    });
    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    const round1tasks = gameEngine.getGameState().tasks;

    const pid = gameEngine.addPlayer().id;
    dateTime.advanceTime();
    gameEngine.updateTask(pid, { index: 0, isCompleted: true });
    dateTime.advanceTime();
    gameEngine.updateTask(pid, { index: 1, isCompleted: true });

    const round1CompletedTasks = gameEngine.getCompletedTasks();

    gameEngine.startGame({ ...BLANK_OPTIONS, seed: BLANK_OPTIONS.seed + 1 });
    const round2tasks = gameEngine.getGameState().tasks;

    const round2CompletedTasks = gameEngine.getCompletedTasks();

    expect(round1CompletedTasks).toHaveLength(2);
    expect(round2CompletedTasks).toHaveLength(0);
    expect(round1tasks).not.toEqual(expect.arrayContaining(round2tasks));
  });

  it("creates tasks", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    const tasks = gameEngine.getGameState().tasks;

    expect(tasks).toHaveLength(25);
    expect(tasks).toEqual(
      "8.KLBHWT7)Z+R%MY?40#2ODCJ"
        .split("")
        .map((char) => <ActiveTask>{ name: char }),
    );
  });

  it("fails to generate if insufficient task pool", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup({
      ...MOCK_GAME,
      tasks: Array(20)
        .fill(0)
        .map<Task>((_, i) => ({ name: `${i}`, icon: "", tags: [] })),
    });
    gameEngine.startGame(BLANK_OPTIONS);

    const tasks = gameEngine.getGameState().tasks;
    const lastEvent = gameEngine.getGameState().events.at(-1);

    expect(tasks).toHaveLength(0);
    expect(lastEvent).toMatchObject<Event>({
      elapsedTimeS: 0,
      message:
        '<span color="#bf616a">(*server*): Not enough tasks (20) after filtering</span>',
    });
  });

  it("doesn't generate duplicate tasks", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    const uniques = gameEngine
      .getGameState()
      .tasks.map((t) => t.name)
      .reduce<string[]>(uniqueValuesReducer, []).length;

    expect(uniques).toBe(25);
  });

  it("respects includedTags filter", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame({
      ...BLANK_OPTIONS,
      taskFilters: { includedTags: ["foo"], excludedTags: [] },
    });

    const allTasksHaveTag = gameEngine
      .getGameState()
      .tasks.map((task) => MOCK_GAME.tasks.find((t) => t.name === task.name)!)
      .every((task) => task.tags.includes("foo"));

    expect(allTasksHaveTag).toBe(true);
  });

  it("respects excludedTags filter", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame({
      ...BLANK_OPTIONS,
      taskFilters: { excludedTags: ["baz"], includedTags: [] },
    });

    const anyTaskHasExcludedTag = gameEngine
      .getGameState()
      .tasks.map((task) => MOCK_GAME.tasks.find((t) => t.name === task.name)!)
      .some((task) => task.tags.includes("baz"));

    expect(anyTaskHasExcludedTag).toBe(false);
  });

  it("respects both includedTags and excludedTags filter together", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame({
      ...BLANK_OPTIONS,
      taskFilters: { excludedTags: ["baz"], includedTags: ["foo"] },
    });

    const validTasks = gameEngine
      .getGameState()
      .tasks.map((task) => MOCK_GAME.tasks.find((t) => t.name === task.name)!)
      .filter(
        (task) => task.tags.includes("foo") && !task.tags.includes("baz"),
      ).length;

    expect(validTasks).toBe(25);
  });

  it("picks tasks pseudo-randomly", () => {
    const expected1 = "";
    const expected2 = "";
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

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
        name: "(0)",
        icon: "",
        color: expect.stringMatching(/^#[a-z0-9]{6}$/),
      },
      completedTiles: [],
    };
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    const result = gameEngine.addPlayer();

    expect(result).toBeTruthy();
    expect(gameEngine.getGameState().players).toHaveLength(1);
    expect(result).toMatchObject({
      id: gameEngine.getGameState().players[0].id,
      ...expected,
    });
  });

  it("sets defaults for new players", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });
    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);

    gameEngine.addPlayer();
    gameEngine.addPlayer();

    expect(gameEngine.getGameState().players[0].profile).toMatchObject<Profile>(
      {
        name: "(0)",
        icon: "",
        color: expect.stringMatching(/^#[a-z0-9]{6}$/),
      },
    );
    expect(gameEngine.getGameState().players[1].profile).toMatchObject<Profile>(
      {
        name: "(1)",
        icon: "",
        color: expect.stringMatching(/^#[a-z0-9]{6}$/),
      },
    );
  });

  it("doesn't reuse player default names", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });
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
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

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
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    const id = gameEngine.addPlayer().id;
    gameEngine.updateProfile(id, update1);
    gameEngine.updateProfile(id, update2);

    const player = gameEngine.getGameState().players[0];

    expect(player).toMatchObject({ id, ...expected });
  });

  it("updates task", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });

    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame(BLANK_OPTIONS);
    const initial = gameEngine.getCompletedTasks();
    const playerId = gameEngine.addPlayer().id;
    gameEngine.updateProfile(playerId, { color: "#dedbef" });
    gameEngine.updateTask(playerId, { index: 9, isCompleted: true });
    const result1 = gameEngine.getCompletedTasks();
    gameEngine.updateTask(playerId, { index: 9, isCompleted: false });
    const result2 = gameEngine.getCompletedTasks();

    expect(initial).toHaveLength(0);
    expect(result1).toHaveLength(1);
    expect(result1).toEqual(
      expect.arrayContaining<ActiveTask>([{ name: ")" }]),
    );
    expect(result2).toHaveLength(0);
  });

  it("updates player when task is updated", () => {
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });
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
    const gameEngine = new GameEngine({
      dateTime: new MockDateTimeProvider(),
      rng: new SeedRandomRandomnessService(),
    });
    gameEngine.loadSetup(MOCK_GAME);
    gameEngine.startGame({ ...BLANK_OPTIONS, isLockout: true });

    const player1 = gameEngine.addPlayer();
    const player2 = gameEngine.addPlayer();

    gameEngine.updateTask(player1.id, { index: 5, isCompleted: true });
    gameEngine.updateTask(player2.id, { index: 5, isCompleted: true });

    expect(player1.completedTiles).toContain(5);
    expect(player2.completedTiles).toHaveLength(0);
  });

  describe("Callback", () => {
    it("calls callback when player is added", () => {
      const gameEngine = new GameEngine({
        dateTime: new MockDateTimeProvider(),
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();
      gameEngine.setGameStateChangedHandler(callback);

      gameEngine.addPlayer();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(gameEngine.getGameState());
    });

    it("calls callback when player is removed", () => {
      const gameEngine = new GameEngine({
        dateTime: new MockDateTimeProvider(),
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();

      const { id } = gameEngine.addPlayer();
      gameEngine.setGameStateChangedHandler(callback);
      gameEngine.removePlayer(id);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(gameEngine.getGameState());
    });

    it("calls callback when profile is updated", () => {
      const gameEngine = new GameEngine({
        dateTime: new MockDateTimeProvider(),
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();

      const { id } = gameEngine.addPlayer();
      gameEngine.setGameStateChangedHandler(callback);
      gameEngine.updateProfile(id, { name: "A" });

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(gameEngine.getGameState());
    });
    it("calls callback when task is updated", () => {
      const gameEngine = new GameEngine({
        dateTime: new MockDateTimeProvider(),
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();

      gameEngine.loadSetup(MOCK_GAME);
      gameEngine.startGame(BLANK_OPTIONS);
      const { id } = gameEngine.addPlayer();
      gameEngine.setGameStateChangedHandler(callback);
      gameEngine.updateTask(id, { index: 0, isCompleted: true });

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(gameEngine.getGameState());
    });

    it("calls callback when a new event occurred", () => {
      const gameEngine = new GameEngine({
        dateTime: new MockDateTimeProvider(),
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();

      gameEngine.setGameStateChangedHandler(callback);
      gameEngine.loadSetup(MOCK_GAME);
      // Simulate "not enough tasks" event
      gameEngine.startGame({
        ...BLANK_OPTIONS,
        taskFilters: { includedTags: ["does not exist"], excludedTags: [] },
      });

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(gameEngine.getGameState());
    });

    it("does not call callback when attempting to remove non-existing player", () => {
      const gameEngine = new GameEngine({
        dateTime: new MockDateTimeProvider(),
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();

      gameEngine.setGameStateChangedHandler(callback);
      gameEngine.removePlayer("does not exist");

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("does not call callback when attempting to update non-existing player", () => {
      const gameEngine = new GameEngine({
        dateTime: new MockDateTimeProvider(),
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();

      gameEngine.setGameStateChangedHandler(callback);
      gameEngine.updateProfile("does not exist", { name: "A" });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("does not call callback when profile is unchanged after update", () => {
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine({
        dateTime,
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();

      const { id } = gameEngine.addPlayer();
      gameEngine.updateProfile(id, { name: "A", color: "#dedbef" });
      dateTime.advanceTime();
      gameEngine.setGameStateChangedHandler(callback);
      gameEngine.updateProfile(id, { name: "A" });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("does not call callback when task is unchanged after update", () => {
      const gameEngine = new GameEngine({
        dateTime: new MockDateTimeProvider(),
        rng: new SeedRandomRandomnessService(),
      });
      const callback = jest.fn();

      const { id } = gameEngine.addPlayer();
      gameEngine.updateTask(id, { index: 0, isCompleted: true });
      gameEngine.setGameStateChangedHandler(callback);
      gameEngine.updateTask(id, { index: 0, isCompleted: true });

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Events", () => {
    it("adds event when game starts", () => {
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine({
        dateTime,
        rng: new SeedRandomRandomnessService(),
      });
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
      const gameEngine = new GameEngine({
        dateTime,
        rng: new SeedRandomRandomnessService(),
      });
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
          /<span color="DEDBEF">\*Me\*<\/span> completed \*\)\*$/,
        ),
      });
    });

    it("adds event when player is added", () => {
      const dateTime = new MockDateTimeProvider();
      const gameEngine = new GameEngine({
        dateTime,
        rng: new SeedRandomRandomnessService(),
      });
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
      const gameEngine = new GameEngine({
        dateTime,
        rng: new SeedRandomRandomnessService(),
      });
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
      const gameEngine = new GameEngine({
        dateTime,
        rng: new SeedRandomRandomnessService(),
      });
      gameEngine.loadSetup(MOCK_GAME);
      gameEngine.startGame(BLANK_OPTIONS);

      const pid = gameEngine.addPlayer().id;

      dateTime.advanceTime();
      const length = gameEngine.getGameState().events.length;
      gameEngine.updateProfile(pid, {
        name: "Me",
        color: "#DEDBEF",
        icon: "abcd",
      });
      const result1 = gameEngine.getGameState().events[length];
      const result2 = gameEngine.getGameState().events[length + 1];
      const result3 = gameEngine.getGameState().events[length + 2];

      expect(result1).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /^<span color="#[a-z0-9]{6}">\*\(0\)\*<\/span> is now <span>\*Me\*<\/span>$/,
        ),
      });
      expect(result2).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /^<span color="#[a-z0-9]{6}">\*Me\*<\/span> changed color to <span color="#DEDBEF">#DEDBEF<\/span>$/,
        ),
      });
      expect(result3).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /^<span color="#DEDBEF">\*Me\*<\/span> changed icon$/,
        ),
      });
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
      const gameEngine = new GameEngine({
        dateTime,
        rng: new SeedRandomRandomnessService(),
      });
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
      gameEngine.setGameStateChangedHandler(updateHandler);
      gameEngine.updateTask(pid, {
        index: indicesToSet.at(-1)!,
        isCompleted: true,
      });
      const result = gameEngine.getGameState().events.at(-1);

      expect(result).toMatchObject<Event>({
        elapsedTimeS: 15,
        message: expect.stringMatching(
          /^<span color="DEDBEF">\*Me\*<\/span> \*BINGO\*!$/,
        ),
      });
      expect(updateHandler).toHaveBeenCalledWith(gameEngine.getGameState());
    });
  });
});
