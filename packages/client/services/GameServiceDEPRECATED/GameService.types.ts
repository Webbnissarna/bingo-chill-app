//////////////////////////////////////////////////////
// Core Gameplay
//////////////////////////////////////////////////////
export interface Player {
  name: string;
  icon: string;
  color: string;
  score: number;
}

export interface Task {
  text: string;
  icon: string;
  tags: string;
  colors: string[];
}

export interface Event {
  timestamp: number;
  message: string;
}

export interface Options {
  setupChecksum: string;
  seed: number;
  includedTags: string[];
  excludedTags: string[];
  isLockout: boolean;
  timeLimitMinutes: number;
}

export interface GameState {
  players: Player[];
  tasks: Task[];
  events: Event[];
  options: Options;
}

export type GameStateUpdate = Partial<GameState>;
export type PlayerUpdate = Partial<Player>;

export interface TaskUpdate {
  name: string;
  isCompleted: boolean;
}

export interface GameService {
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
  requestStartGame(): Promise<void>;

  updateGameState(update: GameStateUpdate): Promise<void>;
  updateSelfPlayer(update: PlayerUpdate): Promise<void>;
  updateTask(update: TaskUpdate): Promise<void>;

  registerOnGameStateUpdatedHandler(
    handler: (newGameState: GameState) => void,
  ): void;
  getGameState(): GameState;
}

//////////////////////////////////////////////////////
// Serialization
//////////////////////////////////////////////////////

export type MessageType =
  | "gameStateUpdate"
  | "playerUpdate"
  | "taskUpdate"
  | "requestStart";

export interface GameStateUpdateEnvelope {
  type: "gameStateUpdate";
  gameState: Partial<GameStateUpdate>;
}

export interface PlayerUpdateEnvelope {
  type: "playerUpdate";
  player: PlayerUpdate;
}

export interface TaskUpdateEnvelope {
  type: "taskUpdate";
  task: TaskUpdate;
}

export interface RequestStartEnvelope {
  type: "requestStart";
}

export type MessageEnvelope =
  | GameStateUpdateEnvelope
  | PlayerUpdateEnvelope
  | TaskUpdateEnvelope
  | RequestStartEnvelope;

export interface Serializer {
  serialize(message: MessageEnvelope): Uint8Array;
  deserialize(data: Uint8Array): MessageEnvelope;
}

//////////////////////////////////////////////////////
// Game Setup
//////////////////////////////////////////////////////
