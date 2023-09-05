import clone from "lodash.clonedeep";
import type { GameState } from "./types";

const BLANK_GAME_STATE: GameState = {
  startTimestamp: "",
  tasks: [],
  players: [],
  events: [],
  isLockout: false,
};

export function getBlankGameState(): GameState {
  return clone(BLANK_GAME_STATE);
}
