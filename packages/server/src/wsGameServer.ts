import type { ApiMessageEnvelope } from "@webbnissarna/bingo-chill-common/src/api/types";
import type {
  GameState,
  SessionOptions,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import type { Serializer } from "@webbnissarna/bingo-chill-common/src/serialization/types";
import chalk from "chalk";
import type { IncomingMessage } from "http";
import { WebSocketServer } from "ws";
import type GameEngine from "./gameEngine";
import {
  gameStateToGameStateUpdate,
  hydrateOptions,
} from "@webbnissarna/bingo-chill-common/src/api/apiGameAdapter";
import { patch } from "@webbnissarna/bingo-chill-common/src/utils/functional";

interface SocketMeta {
  id: string;
  socket: WebSocket;
}

type PlayerSocketMap = Record<string, SocketMeta>;

export interface WsGameServerDeps {
  serializer: Serializer;
  gameEngine: GameEngine;
}

export default class WsGameServer {
  private wss: WebSocketServer | null;
  private serializer: Serializer;
  private playerSocketMap: PlayerSocketMap;
  private gameEngine: GameEngine;
  private sessionOptions: SessionOptions;

  constructor({ serializer, gameEngine }: WsGameServerDeps) {
    this.wss = null;
    this.serializer = serializer;
    this.playerSocketMap = {};
    this.gameEngine = gameEngine;
    this.sessionOptions = {
      isLockout: false,
      seed: 0,
      taskFilters: {
        excludedTags: [],
        includedTags: [],
      },
      timeLimitMinutes: 0,
    };
    gameEngine.setGameStateChangedHandler(this.onGameStateUpdated.bind(this));
  }

  listen() {
    const port = parseInt(process.env.PORT ?? "1337");
    const wss = new WebSocketServer({ port });

    const onInitialError = (error: Error) => {
      console.error(chalk.red("failed to start server", error));
    };

    wss.on("error", onInitialError);
    wss.on("listening", () => {
      const address = wss.address();
      const host = typeof address === "string" ? address : address.address;
      console.log(`server running on ${host}:${port}`);
      this.wss = wss;
      this.wss.off("error", onInitialError);
      this.wss.on("close", this.handleClose.bind(this));
      this.wss.on("error", this.handleError.bind(this));
      this.wss.on("headers", this.handleHeaders.bind(this));
      this.wss.on("connection", this.setupPlayer.bind(this));
    });
  }

  private onGameStateUpdated(gameState: GameState) {
    if (!this.wss) {
      return;
    }

    this.sendToAll({
      type: "sGameStateUpdate",
      gameState: gameStateToGameStateUpdate(gameState),
    });
  }

  private sendToAll(payload: ApiMessageEnvelope) {
    if (!this.wss) {
      return;
    }

    const data = this.serializer.serialize(payload);
    const sockets = Object.values(this.playerSocketMap);
    sockets.forEach(({ socket }) => socket.send(data));
  }

  private handleClose() {
    console.error(chalk.red(`server closed`));
  }

  private handleError(error: Error) {
    console.error(chalk.red(`server error: ${error.name} ${error.message}`));
  }

  private handleHeaders(headers: string[], request: IncomingMessage) {
    const source = request.socket.remoteAddress;
    console.log(chalk.gray(`headers: ${source} ${headers.join(", ")}`));
  }

  private removePlayer(playerId: string) {
    delete this.playerSocketMap[playerId];
  }

  private setupPlayer(socket: WebSocket, _request: IncomingMessage) {
    const { id } = this.gameEngine.addPlayer();
    this.playerSocketMap[id] = { id, socket };

    const closeHandler = (event: CloseEvent) =>
      this.handleClientClose(id, event);
    const errorHandler = (event: Event) => this.handleClientError(id, event);
    const messageHandler = (event: MessageEvent<unknown>) =>
      this.handleClientMessage(id, event);

    socket.addEventListener("message", messageHandler);
    socket.addEventListener("close", closeHandler);
    socket.addEventListener("error", errorHandler);

    const joinEvents = [
      this.serializer.serialize({ type: "sReceiveId", id: id }),
      this.serializer.serialize({
        type: "sGameStateUpdate",
        gameState: gameStateToGameStateUpdate(this.gameEngine.getGameState()),
      }),
      this.serializer.serialize({
        type: "sOptionsUpdate",
        options: this.sessionOptions,
      }),
    ];

    joinEvents.forEach((event) => socket.send(event));
  }

  private updateSessionOptions(update: SessionOptions) {
    this.sessionOptions = patch(this.sessionOptions, hydrateOptions(update));
    this.sendToAll({ type: "sOptionsUpdate", options: update });
  }

  private handleClientMessage(playerId: string, event: MessageEvent<unknown>) {
    try {
      const envelope = this.serializer.deserialize(event.data as Uint8Array);
      console.log(chalk.gray(`message: ${playerId} ${envelope.type}`));

      switch (envelope.type) {
        case "cUpdateProfile":
          this.gameEngine.updateProfile(playerId, envelope.profile);
          break;

        case "cUpdateOptions":
          this.updateSessionOptions(envelope.options);
          break;

        case "cRequestStart":
          this.gameEngine.startGame(this.sessionOptions);
          break;

        case "cUpdateTask":
          this.gameEngine.updateTask(playerId, envelope.task);
          break;

        case "cRequestFullState":
          this.playerSocketMap[playerId].socket.send(
            this.serializer.serialize({
              type: "sGameStateUpdate",
              gameState: gameStateToGameStateUpdate(
                this.gameEngine.getGameState(),
              ),
            }),
          );
          break;

        default:
          console.warn(
            chalk.yellow(`Unhandled envelope type: ${envelope.type}`),
          );
          break;
      }
    } catch (error) {
      this.playerSocketMap[playerId]?.socket?.close(1008, `you bad (${error})`);
    }
  }

  private handleClientClose(playerId: string, event: CloseEvent) {
    console.log(
      `close player=${playerId} ` +
        `clean=${event.wasClean} ` +
        `code=${event.code} ` +
        `reason=${event.reason}`,
    );
    this.removePlayer(playerId);
    this.gameEngine.removePlayer(playerId);
  }

  private handleClientError(playerId: string, event: Event) {
    console.log(`error player=${playerId} error=${event.toString()}`);
    this.removePlayer(playerId);
    this.gameEngine.removePlayer(playerId);
  }
}
