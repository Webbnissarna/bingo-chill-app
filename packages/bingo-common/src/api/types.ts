import type {
  Event,
  Profile,
  ProfileUpdate,
  SessionOptions,
  TaskUpdate,
} from "../game/types";

export type SessionOptionsUpdate = Partial<SessionOptions>;

export interface Task {
  index: number;
  colors: string[];
}

export interface GameStateUpdate {
  players?: Profile[];
  tasks?: Task[];
  events?: Event[];
}

type ServerMessageType = "sReceiveId" | "sGameStateUpdate" | "sOptionsUpdate";

type ClientMessageType =
  | "cUpdateProfile"
  | "cUpdateOptions"
  | "cRequestStart"
  | "cUpdateTask";

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

export type ApiMessageEnvelope =
  | ServerReceiveIdEnvelope
  | ServerGameStateUpdateEnvelope
  | ServerOptionsUpdateEnvelope
  | ClientProfileUpdateEnvelope
  | ClientUpdateOptionsEnvelope
  | ClientRequestStartEnvelope
  | ClientTaskUpdateEnvelope;

export interface IApiServer {
  onUpdateProfile(update: ProfileUpdate): void;
  onUpdateTask(update: TaskUpdate): void;
}

export interface IApiClient {
  updateProfile(update: ProfileUpdate): void;
  updateTask(update: TaskUpdate): void;
  requestStart(): void;
}
