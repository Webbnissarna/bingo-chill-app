import type {
  GameStateUpdate,
  SessionOptionsUpdate,
} from "@webbnissarna/bingo-chill-common/src/api/types";
import type {
  ProfileUpdate,
  SessionOptions,
  TaskUpdate,
} from "@webbnissarna/bingo-chill-common/src/game/types";

export interface ApiState {
  connectionId: string;
  options: SessionOptions;
  gameState: Required<GameStateUpdate>;
}

export interface ApiActions {
  updateProfile(update: ProfileUpdate): void;
  updateOptions(update: SessionOptionsUpdate): void;
  updateTask(update: TaskUpdate): void;
  requestStart(): void;
  requestFullState(): void;
}

export type ApiStateUpdateDelegate = (apiState: ApiState) => void;

export interface IApiService extends ApiActions {
  connect(uri: string): void;
  disconnect(): void;
  addStateUpdateListener(delegate: ApiStateUpdateDelegate): void;
}
