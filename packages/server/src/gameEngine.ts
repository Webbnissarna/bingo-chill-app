import type { DateTimeService } from "@webbnissarna/bingo-chill-common/src/dateTime/types";
import type {
  GameSetup,
  GameState,
  Player,
  Profile,
  SessionOptions,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import type {
  ProfileUpdate,
  TaskUpdate,
} from "@webbnissarna/bingo-chill-common/src/serialization/types";
import { getBlankGameState } from "@webbnissarna/bingo-chill-common/src/game/utils";
import { nanoid } from "nanoid";
import seedrandom from "seedrandom";

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

export default class GameEngine implements IGameEngine {
  private gameSetup: GameSetup | undefined;
  private gameState: GameState;
  private dateTimeService: DateTimeService;
  private playerCounter: number;

  constructor(dateTimeProvider: DateTimeService) {
    this.gameState = getBlankGameState();
    this.dateTimeService = dateTimeProvider;
    this.playerCounter = 0;
  }

  setGameStateChangedHandler(handler: GameStateChangedHandler): void {
    throw new Error("Method not implemented.");
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
    const rng = seedrandom(options.seed.toString());

    /* const now = this.dateTimeService.now();
    console.log(`now: ${now}`); */
    this.gameState.startTimestamp = this.dateTimeService.toTimestamp(
      this.dateTimeService.now(),
    );
  }

  updateProfile(playerId: string, update: Partial<Profile>): void {
    throw new Error("Method not implemented.");
  }

  updateTask(playerId: string, update: TaskUpdate): void {
    throw new Error("Method not implemented.");
  }
}
