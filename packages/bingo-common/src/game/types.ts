export interface Task {
  name: string;
  icon: string;
  tags: string[];
}

export interface GameSetupMeta {
  author: string;
  version: string;
  timestamp: string;
}

export interface GameSetup {
  name: string;
  meta: GameSetupMeta;
  tasks: Task[];
  checksum: string;
}

export interface TaskFilters {
  includedTags: string[];
  excludedTags: string[];
}

export interface SessionOptions {
  seed: number;
  taskFilters: TaskFilters;
  isLockout: boolean;
  timeLimitMinutes: number;
}

export interface ActiveTask {
  name: string;
}

export interface Profile {
  name: string;
  icon: string;
  color: string;
}

export interface Player {
  id: string;
  profile: Profile;
  completedTiles: number[];
}

export interface Event {
  elapsedTimeS: number;
  message: string;
}

export interface GameState {
  startTimestamp: string;
  tasks: ActiveTask[];
  players: Player[];
  events: Event[];
  isLockout: boolean;
}
