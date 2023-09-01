import type { GameState, Profile } from "../game/types";

export type ClientMessageType = "requestStart" | "updateProfile" | "updateTask";
export type ServerMessageType = "postConnect" | "gameStateUpdate";

export type GameStateUpdate = Partial<GameState>;
export type ProfileUpdate = Partial<Profile>;
export interface TaskUpdate {
  index: number;
  isCompleted: boolean;
}

export interface ReceiveIdEnvelope {
  type: "receiveId";
  id: string;
}

export interface GameStateUpdateEnvelope {
  type: "gameStateUpdate";
  gameState: GameStateUpdate;
}

export interface ProfileUpdateEnvelope {
  type: "profileUpdate";
  player: ProfileUpdate;
}

export interface TaskUpdateEnvelope {
  type: "taskUpdate";
  task: TaskUpdate;
}

export interface RequestStartEnvelope {
  type: "requestStart";
}

export type MessageEnvelope =
  | ReceiveIdEnvelope
  | GameStateUpdateEnvelope
  | ProfileUpdateEnvelope
  | TaskUpdateEnvelope
  | RequestStartEnvelope;

export interface Serializer {
  serialize(message: MessageEnvelope): Uint8Array;
  deserialize(data: Uint8Array): MessageEnvelope;
}
