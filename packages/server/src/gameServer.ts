import type { GameState } from "@webbnissarna/bingo-chill-common/src/game/types";
import { getBlankGameState } from "@webbnissarna/bingo-chill-common/src/game/utils";
import { WebSocketServer } from "ws";
import chalk from "chalk";
import type { IncomingMessage } from "http";
import type {
  MessageEnvelope,
  Serializer,
} from "@webbnissarna/bingo-chill-common/src/serialization/types";
import { nanoid } from "nanoid";
interface SocketMeta {
  id: string;
  socket: WebSocket;
}

type PlayerSocketMap = Record<string, SocketMeta>;

export default class GameServer {
  private wss: WebSocketServer | null;
  private gameState: GameState;
  private serializer: Serializer;
  private playerSocketMap: PlayerSocketMap;

  constructor(serializer: Serializer) {
    this.wss = null;
    this.gameState = getBlankGameState();
    this.serializer = serializer;
    this.playerSocketMap = {};
  }

  listen() {
    const port = parseInt(process.env.PORT ?? "8080");
    const wss = new WebSocketServer({ port });
    wss.on("listening", () => {
      const address = wss.address();
      const host = typeof address === "string" ? address : address.address;
      console.log(`server running on ${host}:${port}`);
      this.wss = wss;
    });
  }

  private send(playerId: string, payload: MessageEnvelope) {
    if (!this.playerSocketMap[playerId]) {
      console.error(`No player found with id '${playerId}'`);
      return;
    }

    const data = this.serializer.serialize(payload);
    this.playerSocketMap[playerId].socket.send(data);
  }

  private sendToAll(payload: MessageEnvelope) {
    const data = this.serializer.serialize(payload);
    const sockets = Object.values(this.playerSocketMap);
    sockets.forEach(({ socket }) => socket.send(data));
  }

  private setupWebsocket() {
    if (!this.wss) throw new Error("No connection");

    this.wss.on("close", this.handleClose);
    this.wss.on("error", this.handleError);
    this.wss.on("headers", this.handleHeaders);
    this.wss.on("connection", this.setupPlayer);
  }

  private handleClose() {
    console.error(chalk.red(`server closed`));
  }

  private handleError(error: Error) {
    console.error(chalk.red(`error: ${error.name} ${error.message}`));
  }

  private handleHeaders(headers: string[], request: IncomingMessage) {
    const source = request.socket.remoteAddress;
    console.log(chalk.gray(`headers: ${source} ${headers.join(", ")}`));
  }

  private removePlayer(playerId: string) {}

  private setupPlayer(socket: WebSocket, _request: IncomingMessage) {
    const newPlayerId = nanoid();
    this.playerSocketMap[newPlayerId] = { id: newPlayerId, socket };

    const closeHandler = (event: CloseEvent) =>
      this.handleClientClose(newPlayerId, event);
    const errorHandler = (event: Event) =>
      this.handleClientError(newPlayerId, event);

    socket.addEventListener("close", closeHandler);
    socket.addEventListener("error", errorHandler);

    this.send(newPlayerId, { type: "receiveId", id: newPlayerId });
  }

  private handleClientClose(playerId: string, event: CloseEvent) {
    console.log(
      `close player=${playerId} ` +
        `clean=${event.wasClean} ` +
        `code=${event.code} ` +
        `reason=${event.reason}`,
    );
    this.removePlayer(playerId);
  }

  private handleClientError(playerId: string, event: Event) {
    console.log(`error player=${playerId} error=${event.toString()}`);
    this.removePlayer(playerId);
  }
}
