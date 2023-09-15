import type {
  GameService,
  GameState,
  GameStateUpdate,
  MessageEnvelope,
  Player,
  Serializer,
  TaskUpdate,
} from "./GameService.types";
import clone from "lodash.clonedeep";
import { patch } from "@/utils/functional";

const BLANK_GAME_STATE: GameState = {
  players: [],
  tasks: [],
  events: [],
  options: {
    setupChecksum: "",
    seed: 0,
    includedTags: [],
    excludedTags: [],
    isLockout: false,
    timeLimitMinutes: 0,
  },
};

export interface ConnectionState {
  host: string;
  state: "idle" | "connecting" | "connected" | "closed";
  error: string | null;
}

export type GameStateUpdateHandler = (newGameState: GameState) => void;

export default class WsGameService implements GameService {
  private connectionState: ConnectionState;
  private ws: WebSocket | null;
  private gameState: GameState;
  private serializer: Serializer;
  private gameStateUpdateHandler: GameStateUpdateHandler | null;

  constructor(serializer: Serializer) {
    if (!global.WebSocket) {
      throw new Error("No 'global.WebSocket' found (unsupported browser?)");
    }

    this.connectionState = {
      host: "",
      state: "idle",
      error: null,
    };
    this.ws = null;
    this.gameState = clone(BLANK_GAME_STATE);
    this.serializer = serializer;
    this.gameStateUpdateHandler = null;
  }

  private handleConnectionClosed(event: CloseEvent): void {
    console.log(`Connection closed (${event})`);
    this.ws = null;
    this.connectionState = {
      host: "",
      error: null,
      state: "closed",
    };
  }

  private handleConnectionError(event: Event): void {
    console.error(`Connection error (${event})`);
    this.ws = null;
    this.connectionState = {
      host: "",
      error: event.toString(),
      state: "closed",
    };
  }

  private handleIncomingMessage(event: MessageEvent): void {
    const data = new Uint8Array(event.data as ArrayBuffer);
    const envelope = this.serializer.deserialize(data);

    if (envelope.type !== "gameStateUpdate") {
      throw new Error(`unsupported message type '${envelope.type}'`);
    }
    this.handleGameStateUpdate(envelope.gameState);
  }

  private handleGameStateUpdate(update: GameStateUpdate): void {
    this.gameState = patch(this.gameState, update);
    this.gameStateUpdateHandler?.(this.gameState);
  }

  private sendMessage(message: MessageEnvelope): void {
    this.ws?.send(this.serializer.serialize(message));
  }

  //////////////////////////////////////////////////////
  // GameService interface
  //////////////////////////////////////////////////////
  connect(uri: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleInitialConnectionFailure = (event: Event) => {
        this.ws = null;
        reject(event.toString());
      };
      const handleInitialConnectionSuccess = () => {
        this.ws?.removeEventListener("open", handleInitialConnectionSuccess);
        this.ws?.removeEventListener("close", this.handleConnectionClosed);
        this.ws?.removeEventListener("error", this.handleConnectionError);
        this.ws?.addEventListener("message", this.handleIncomingMessage);
        console.log(`connected to ${this.connectionState.host}`);
        this.connectionState.state = "connected";
        resolve();
        // TODO: send initial player profile
      };

      this.connectionState = {
        host: uri,
        error: null,
        state: "connecting",
      };

      this.ws = new global.WebSocket(uri);

      this.ws.addEventListener("open", handleInitialConnectionSuccess);
      this.ws.addEventListener("close", handleInitialConnectionFailure);
      this.ws.addEventListener("error", handleInitialConnectionFailure);
    });
  }

  async disconnect(): Promise<void> {
    this.ws?.close();
    this.gameState = clone(BLANK_GAME_STATE);
  }

  registerOnGameStateUpdatedHandler(handler: GameStateUpdateHandler): void {
    this.gameStateUpdateHandler = handler;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  //////////////////////////////////////////////////////
  // Client -> Server operations
  //////////////////////////////////////////////////////
  async requestStartGame(): Promise<void> {
    this.sendMessage({ type: "requestStart" });
  }

  async updateGameState(update: Partial<GameState>): Promise<void> {
    this.sendMessage({ type: "gameStateUpdate", gameState: update });

    // Client-side prediction
    this.handleGameStateUpdate(update);
  }

  async updateSelfPlayer(update: Partial<Player>): Promise<void> {
    this.sendMessage({ type: "playerUpdate", player: update });
  }

  async updateTask(update: TaskUpdate): Promise<void> {
    this.sendMessage({ type: "taskUpdate", task: update });
  }
}
