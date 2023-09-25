import type {
  Event,
  Profile,
  ProfileUpdate,
  SessionOptions,
  TaskUpdate,
} from "../game/types";

export type SessionOptionsUpdate = SessionOptions;

export interface Task {
  name: string;
  colors: string[];
}

export interface Player extends Profile {
  id: string;
  score: number;
}

export interface GameStateUpdate {
  startTimestamp?: string;
  players?: Player[];
  tasks?: Task[];
  events?: Event[];
}

type ServerMessageType = "sReceiveId" | "sGameStateUpdate" | "sOptionsUpdate";

type ClientMessageType =
  | "cUpdateProfile"
  | "cUpdateOptions"
  | "cRequestStart"
  | "cUpdateTask"
  | "cRequestFullState";

interface Envelope {
  type: ServerMessageType | ClientMessageType;
}

export interface ServerReceiveIdEnvelope extends Envelope {
  type: "sReceiveId";
  id: string;
}

export interface ServerGameStateUpdateEnvelope extends Envelope {
  type: "sGameStateUpdate";
  gameState: GameStateUpdate;
}

export interface ServerOptionsUpdateEnvelope extends Envelope {
  type: "sOptionsUpdate";
  options: SessionOptionsUpdate;
}

export interface ClientProfileUpdateEnvelope extends Envelope {
  type: "cUpdateProfile";
  profile: ProfileUpdate;
}

export interface ClientUpdateOptionsEnvelope extends Envelope {
  type: "cUpdateOptions";
  options: SessionOptionsUpdate;
}

export interface ClientRequestStartEnvelope extends Envelope {
  type: "cRequestStart";
}

export interface ClientTaskUpdateEnvelope extends Envelope {
  type: "cUpdateTask";
  task: TaskUpdate;
}

export interface ClientRequestFullStateEnvelope extends Envelope {
  type: "cRequestFullState";
}

export type ApiMessageEnvelope =
  | ServerReceiveIdEnvelope
  | ServerGameStateUpdateEnvelope
  | ServerOptionsUpdateEnvelope
  | ClientProfileUpdateEnvelope
  | ClientUpdateOptionsEnvelope
  | ClientRequestStartEnvelope
  | ClientTaskUpdateEnvelope
  | ClientRequestFullStateEnvelope;

export interface IApiServer {
  onUpdateProfile(update: ProfileUpdate): void;
  onUpdateTask(update: TaskUpdate): void;
}

export interface IApiClient {
  updateProfile(update: ProfileUpdate): void;
  updateTask(update: TaskUpdate): void;
  requestStart(): void;
}
