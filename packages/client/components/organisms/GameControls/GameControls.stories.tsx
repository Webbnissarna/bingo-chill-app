import { useState } from "react";
import GameControls from ".";
import type { GameOptions } from "@/services/GameService/GameService.types";
import type { StoryDefault } from "@ladle/react";

export function Default() {
  const [options, setOptions] = useState<GameOptions>({
    seed: 1337,
    lockout: false,
    tags: [],
    timeLimitMinutes: 0,
  });

  return (
    <div className="bg-polarNight-1 p-5">
      <GameControls
        options={options}
        onChange={setOptions}
        onLoadGameSetup={() => alert("Load Game Setup clicked!")}
        onStartGame={() => alert("Start Game clicked!")}
      />
    </div>
  );
}

export default {
  title: "Organisms / Game Controls",
} satisfies StoryDefault;
