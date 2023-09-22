import type { Serializer } from "@webbnissarna/bingo-chill-common/src/serialization/types";
import type { ApiState, ApiStateUpdateDelegate, IApiService } from "./types";
import type {
  Profile,
  SessionOptions,
  TaskUpdate,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import type { DeepPartial } from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { patch } from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { hydrateOptions } from "@webbnissarna/bingo-chill-common/src/api/apiGameAdapter";

export interface WsApiServiceDeps {
  serializer: Serializer;
}

export default class WsApiService implements IApiService {
  private deps: WsApiServiceDeps;
  private apiState: ApiState;
  private ws: WebSocket | null = null;

  constructor(deps: WsApiServiceDeps) {
    this.deps = deps;
    this.apiState = {
      connectionId: "",
      options: {
        seed: 0,
        isLockout: false,
        taskFilters: { includedTags: [], excludedTags: [] },
        timeLimitMinutes: 0,
      },
      gameState: {
        startTimestamp: "",
        events: [],
        players: [],
        tasks: [],
      },
    };
  }

  private logMessage(message: string, ...params: unknown[]) {
    console.log(message, params);
  }

  private logError(message: string, ...params: unknown[]) {
    console.error(message, params);
  }

  private updateApiState(update: DeepPartial<ApiState>) {
    this.apiState = patch(this.apiState, update);
  }

  /////////////////////////////////////////////////////////////////
  // Socket management
  /////////////////////////////////////////////////////////////////
  private explicitlyCloseSocket(reason: string, ...params: unknown[]) {
    if (!this.ws) return;
    this.logError(reason, params);
    this.ws.close(1008, reason);
  }

  private handleSocketError(ev: Event) {
    this.logError("socket error", ev);
    this.ws = null;
  }

  private handleSocketClose(ev: CloseEvent) {
    this.logMessage("socket closed", ev);
    this.ws = null;
  }

  private handlePostConnection() {
    if (!this.ws) return;
  }

  private handleMessage(ev: MessageEvent) {
    try {
      const envelope = this.deps.serializer.deserialize(ev.data as Uint8Array);

      switch (envelope.type) {
        case "sReceiveId":
          this.updateApiState({ connectionId: envelope.id });
          break;

        case "sOptionsUpdate":
          this.updateApiState({ options: hydrateOptions(envelope.options) });
          break;

        case "sGameStateUpdate":
          this.updateApiState({ gameState: envelope.gameState });
          break;

        default:
          this.explicitlyCloseSocket("unhandled envelope type", envelope.type);
          break;
      }
    } catch (error) {
      this.explicitlyCloseSocket("error handling message", error);
    }
  }

  /////////////////////////////////////////////////////////////////
  // IApiService
  /////////////////////////////////////////////////////////////////
  connect(uri: string) {
    this.logMessage(`Connecting to '${uri}'`);
    this.ws = new WebSocket(uri);
    this.ws.onopen = this.handlePostConnection;
    this.ws.onerror = this.handleSocketError;
    this.ws.onclose = this.handleSocketClose;
    this.ws.onmessage = this.handleMessage;
  }

  disconnect(): void {
    if (!this.ws) return;
    this.ws.close();
  }

  addStateUpdateListener(delegate: ApiStateUpdateDelegate): void {
    throw new Error("Method not implemented.");
  }

  updateProfile(update: Partial<Profile>): void {
    throw new Error("Method not implemented.");
  }

  updateOptions(update: SessionOptions): void {
    throw new Error("Method not implemented.");
  }

  updateTask(update: TaskUpdate): void {
    throw new Error("Method not implemented.");
  }

  requestStart(): void {
    throw new Error("Method not implemented.");
  }

  requestFullState(): void {
    throw new Error("Method not implemented.");
  }
}