import type { GameState } from "../game/types";
import type { GameStateUpdate } from "./types";

export function gameStateToGameStateUpdate(
  gameState: GameState,
): GameStateUpdate {
  return {
    events: gameState.events,
    players: gameState.players.map((p) => p.profile),
    tasks: gameState.tasks.map((t, index) => ({
      index,
      colors: gameState.players
        .filter((p) => p.completedTiles.includes(index))
        .map((p) => p.profile.color),
    })),
  };
}
