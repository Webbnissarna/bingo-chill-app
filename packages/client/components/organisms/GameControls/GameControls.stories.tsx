import { useState } from "react";
import GameControls from ".";
import type { StoryDefault } from "@ladle/react";
import type { SessionOptions } from "@webbnissarna/bingo-chill-common/src/game/types";

export function Default() {
  const [options, setOptions] = useState<SessionOptions>({
    seed: 1337,
    isLockout: false,
    taskFilters: {
      includedTags: [],
      excludedTags: [],
    },
    timeLimitMinutes: 0,
  });

  return (
    <div className="bg-polarNight-1 p-5 flex flex-col gap-3">
      <GameControls
        options={options}
        onChange={(v) => setOptions({ ...v })}
        allTags={["A", "B", "C", "D", "E", "F", "G"].map((value) => ({
          value,
          label: value,
        }))}
      />
      <div className="bg-polarNight-0 p-2 overflow-x-scroll">
        <pre className="font-monospace text-snowStorm-0">
          {JSON.stringify(options, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default {
  title: "Organisms / Game Controls",
} satisfies StoryDefault;
