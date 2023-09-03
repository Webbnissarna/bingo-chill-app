import type { DateTimeService } from "@webbnissarna/bingo-chill-common/src/dateTime/types";
import type {
  ActiveTask,
  type GameSetup,
  type GameState,
  type Player,
  type Profile,
  type SessionOptions,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import type {
  ProfileUpdate,
  TaskUpdate,
} from "@webbnissarna/bingo-chill-common/src/serialization/types";
import { getBlankGameState } from "@webbnissarna/bingo-chill-common/src/game/utils";
import { nanoid } from "nanoid";
import type { RandomnessService } from "./RandomnessService/RandomnessService.types";
import { patch } from "@webbnissarna/bingo-chill-common/src/utils/functional";
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
}

export interface GameEngineDependencies {
  dateTime: DateTimeService;
  rng: RandomnessService;
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
  }

  getElapsedTimeS(): number {
    if (this.gameState.startTimestamp === "") {
      return 0;
    }

    const { dateTime } = this.deps;

    const now = dateTime.now();
    const start = this.deps.dateTime.parse(this.gameState.startTimestamp);
    return dateTime.secondsFrom(start, now);
  }

  addEvent(message: string): void {
    this.gameState.events.push({
      message,
      elapsedTimeS: this.getElapsedTimeS(),
    });
    this.changeHandler?.(this.gameState);
  }

  addErrorEvent(baseMessage: string): void {
    this.addEvent(`<span color="#f00">(*server*): ${baseMessage}</span>`);
  }

  setGameStateChangedHandler(handler: GameStateChangedHandler): void {
    this.changeHandler = handler;
    handler(this.gameState);
  }

  getGameState(): GameState {
    return this.gameState;
  }

  loadSetup(setup: GameSetup): void {
    this.gameSetup = setup;
  }

  addPlayer(): Player {
    const id = nanoid();
    const newPlayer: Player = {
      id,
      profile: {
        name: `(${this.playerCounter})`,
        icon: "",
        color: "",
      },
      completedTiles: [],
    };

    this.playerCounter = this.playerCounter + 1;
    this.gameState.players = [...this.gameState.players, newPlayer];
    return newPlayer;
  }

  removePlayer(id: string): void {
    this.gameState.players = this.gameState.players.filter((p) => p.id !== id);
  }

  startGame(options: SessionOptions): void {
    if (!this.gameSetup) {
      this.addErrorEvent("No game setup loaded");
      return;
    }

    const { rng, dateTime } = this.deps;

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
      colors: [],
    }));

    this.gameState.startTimestamp = dateTime.toTimestamp(dateTime.now());
    this.gameState.tasks = tasks;
  }

  updateProfile(playerId: string, update: Partial<Profile>): void {
    const player = this.gameState.players.find(({ id }) => id === playerId);

    if (!player) {
      return;
    }

    player.profile = patch(player.profile, update);
  }

  updateTask(playerId: string, update: TaskUpdate): void {
    throw new Error("Method not implemented.");
  }
}
