import type { DateTimeService } from "@webbnissarna/bingo-chill-common/src/dateTime/types";
import type {
  ActiveTask,
  GameSetup,
  GameState,
  Player,
  Profile,
  ProfileUpdate,
  SessionOptions,
  TaskUpdate,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import { getBlankGameState } from "@webbnissarna/bingo-chill-common/src/game/utils";
import {
  HSVtoHEX,
  addIfMissing,
  patch,
  removeIfPresent,
  uniqueValuesReducer,
} from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { nordThemeColors } from "@webbnissarna/bingo-chill-common/src/utils/theme";
import { nanoid } from "nanoid";
import type { RandomnessService } from "./RandomnessService/RandomnessService.types";
import { filterTasks } from "./gameEngineUtils";

export type GameStateChangedHandler = (gameState: GameState) => void;

export interface IGameEngine {
  setGameStateChangedHandler(handler: GameStateChangedHandler): void;
  getGameState(): GameState;

  loadSetup(setup: GameSetup): void;
  startGame(options: SessionOptions): void;

  addPlayer(): Player;
  removePlayer(id: string): void;
  updateProfile(playerId: string, update: ProfileUpdate): void;

  updateTask(playerId: string, update: TaskUpdate): void;
  getCompletedTasks(): ActiveTask[];
}

export interface GameEngineDependencies {
  dateTime: DateTimeService;
  rng: RandomnessService;
}

function getPlayerColoredName(player: Player): string {
  return `<span color="${player.profile.color}">*${player.profile.name}*</span>`;
}

export default class GameEngine implements IGameEngine {
  private deps: GameEngineDependencies;
  private gameSetup: GameSetup | undefined;
  private gameState: GameState;
  private changeHandler: GameStateChangedHandler | null;
  private playerCounter: number;

  constructor(deps: GameEngineDependencies) {
    this.deps = deps;
    this.gameState = getBlankGameState();
    this.changeHandler = null;
    this.playerCounter = 0;

    this.gameState.startTimestamp = this.deps.dateTime.toTimestamp(
      this.deps.dateTime.now(),
    );
  }

  private getElapsedTimeS(): number {
    const { dateTime } = this.deps;

    const now = dateTime.now();
    const start = this.deps.dateTime.parse(this.gameState.startTimestamp);
    return dateTime.secondsFrom(start, now);
  }

  private addEvent(message: string): void {
    this.gameState.events.push({
      message,
      elapsedTimeS: this.getElapsedTimeS(),
    });
    this.changeHandler?.(this.gameState);
  }

  private addErrorEvent(baseMessage: string): void {
    this.addEvent(
      `<span color="${nordThemeColors.aurora[0]}">(*server*): ${baseMessage}</span>`,
    );
  }

  private hasPlayerWon(player: Player): boolean {
    const winCombos = [
      /* rows */
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],

      /* columns */
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],

      /* diagonals */
      [0, 6, 12, 19, 24],
      [4, 8, 12, 16, 20],
    ];

    const combosWon = winCombos.filter((combo) =>
      combo.reduce(
        (acc, index) => acc && player.completedTiles.includes(index),
        true,
      ),
    );

    return combosWon.length > 0;
  }

  private getRandomNiceColor(): string {
    return HSVtoHEX(this.deps.rng.randRangeInt(0, 359), 50, 100);
  }

  /////////////////////////////////////////////////////////////////////////
  // IGameEngine interface
  /////////////////////////////////////////////////////////////////////////
  public setGameStateChangedHandler(handler: GameStateChangedHandler): void {
    this.changeHandler = handler;
    handler(this.gameState);
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public loadSetup(setup: GameSetup): void {
    const duplicateTasks = Object.entries(
      setup.tasks.reduce<Record<string, number>>(
        (acc, task) => ({
          ...acc,
          [task.name]: (acc[task.name] ?? 0) + 1,
        }),
        {},
      ),
    )
      .filter(([_, num]) => num > 1)
      .map(([t]) => `"${t}"`);

    if (duplicateTasks.length > 0) {
      this.addErrorEvent(
        `Setup for "${setup.name}" (cs=${
          setup.checksum
        }) contains duplicate task(s): ${duplicateTasks.join(", ")}`,
      );
      return;
    }

    this.gameSetup = setup;
  }

  public addPlayer(): Player {
    const id = nanoid();
    const newPlayer: Player = {
      id,
      profile: {
        name: `(${this.playerCounter})`,
        icon: "",
        color: this.getRandomNiceColor(),
      },
      completedTiles: [],
    };

    this.gameState.players = [...this.gameState.players, newPlayer];
    this.addEvent(`A new player joined! (${this.playerCounter})`);
    this.playerCounter = this.playerCounter + 1;
    return newPlayer;
  }

  public removePlayer(id: string): void {
    const player = this.gameState.players.find((p) => p.id === id);
    if (!player) {
      return;
    }

    this.gameState.players = this.gameState.players.filter((p) => p.id !== id);
    this.addEvent(`${getPlayerColoredName(player)} disconnected`);
  }

  public startGame(options: SessionOptions): void {
    if (!this.gameSetup) {
      this.addErrorEvent("No game setup loaded");
      return;
    }

    const { rng } = this.deps;

    rng.setSeed(options.seed);

    const taskPool = filterTasks(this.gameSetup.tasks, options.taskFilters);

    if (taskPool.length < 25) {
      this.addErrorEvent(
        `Not enough tasks (${taskPool.length}) after filtering`,
      );
      return;
    }

    const taskIndices = rng.randUniqueValues(25, 0, taskPool.length - 1);
    const tasks = taskIndices.map<ActiveTask>((i) => ({
      name: taskPool[i].name,
    }));

    this.gameState.tasks = tasks;
    this.gameState.isLockout = options.isLockout;
    this.gameState.players = this.gameState.players.map((p) => ({
      ...p,
      completedTiles: [],
    }));

    this.addEvent("Game Started!");
  }

  public updateProfile(playerId: string, update: Partial<Profile>): void {
    const player = this.gameState.players.find(({ id }) => id === playerId);

    if (!player) {
      return;
    }

    const initialProfile = { ...player.profile };
    player.profile = patch(player.profile, update);

    if (update.name && initialProfile.name !== update.name) {
      this.addEvent(
        `${getPlayerColoredName({
          ...player,
          profile: initialProfile,
        })} is now <span>*${update.name}*</span>`,
      );
    }

    if (update.color && initialProfile.color !== update.color) {
      this.addEvent(
        `${getPlayerColoredName({
          ...player,
          profile: { ...player.profile, color: initialProfile.color },
        })} changed color to <span color="${update.color}">${
          update.color
        }</span>`,
      );
    }

    if (update.icon && initialProfile.icon !== update.icon) {
      this.addEvent(`${getPlayerColoredName(player)} changed icon`);
    }
  }

  public updateTask(playerId: string, update: TaskUpdate): void {
    const player = this.gameState.players.find(({ id }) => id === playerId);
    const task = this.gameState.tasks[update.index];

    if (!player || !task) {
      return;
    }

    const playerHasAlreadyCompleted = player.completedTiles.includes(
      update.index,
    );

    const anyPlayerCompleted = this.gameState.players.some((p) =>
      p.completedTiles.includes(update.index),
    );
    const noop =
      (playerHasAlreadyCompleted && update.isCompleted) ||
      (!playerHasAlreadyCompleted && !update.isCompleted) ||
      (this.gameState.isLockout && anyPlayerCompleted);

    if (noop) {
      return;
    }

    const wasInitiallyWon = this.hasPlayerWon(player);

    if (update.isCompleted) {
      player.completedTiles = addIfMissing(player.completedTiles, update.index);
      this.addEvent(`${getPlayerColoredName(player)} completed *${task.name}*`);
    } else {
      player.completedTiles = removeIfPresent(
        player.completedTiles,
        update.index,
      );
      this.changeHandler?.(this.gameState);
    }

    const hasWon = this.hasPlayerWon(player);
    const didJustWin = hasWon && !wasInitiallyWon;

    if (didJustWin) {
      this.addEvent(`${getPlayerColoredName(player)} *BINGO*!`);
    }
  }

  public getCompletedTasks(): ActiveTask[] {
    return this.gameState.players
      .map((player) => player.completedTiles)
      .flat()
      .reduce<number[]>(uniqueValuesReducer, [])
      .map((i) => this.gameState.tasks[i]);
  }
}
