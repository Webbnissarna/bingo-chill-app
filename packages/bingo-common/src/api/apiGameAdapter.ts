import type { GameState, SessionOptions } from "../game/types";
import type { GameStateUpdate } from "./types";

export function gameStateToGameStateUpdate(
  gameState: GameState,
): GameStateUpdate {
  return {
    checksum: gameState.checksum,
    startTimestamp: gameState.startTimestamp,
    events: gameState.events,
    players: gameState.players.map((p) => ({
      ...p.profile,
      id: p.id,
      score: p.completedTiles.length,
    })),
    tasks: gameState.tasks.map((t, index) => ({
      name: t.name,
      colors: gameState.players
        .filter((p) => p.completedTiles.includes(index))
        .map((p) => p.profile.color),
    })),
  };
}

export function hydrateOptions(options: SessionOptions): SessionOptions {
  return {
    ...options,
    taskFilters: {
      includedTags: options.taskFilters.includedTags ?? [],
      excludedTags: options.taskFilters.excludedTags ?? [],
    },
  };
}

export function hydrateGameStateUpdate(
  update: GameStateUpdate,
): GameStateUpdate {
  return {
    ...update,
    tasks: update.tasks?.map((t) => ({
      ...t,
      colors: t.colors ?? [],
    })),
  };
}
