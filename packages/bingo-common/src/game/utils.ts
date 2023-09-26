import clone from "lodash.clonedeep";
import type { GameSetup, GameState } from "./types";
import crc32 from "crc/crc32";

const BLANK_GAME_STATE: GameState = {
  checksum: "",
  startTimestamp: "",
  tasks: [],
  players: [],
  events: [],
  isLockout: false,
};

export function getBlankGameState(): GameState {
  return clone(BLANK_GAME_STATE);
}

export function calculateChecksum(
  gameSetup: Omit<GameSetup, "checksum">,
): string {
  const withoutChecksum = { ...gameSetup, checksum: undefined };
  const rawForm = JSON.stringify(withoutChecksum);
  return crc32(rawForm).toString(16);
}
