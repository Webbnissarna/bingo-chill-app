import type { StoryDefault } from "@ladle/react";
import MainTemplate from ".";
import { SPOOKY_GHOST_IMAGE_BASE64 } from "@/.ladle/constants";
import { useState } from "react";
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
    <MainTemplate
      title="Bingo Chillin'"
      tiles={Array(25)
        .fill(0)
        .map((_, i) => ({
          text: `${i} lorem ipsum dolar sitem`,
          icon: SPOOKY_GHOST_IMAGE_BASE64,
          colors: [],
        }))}
      profiles={Array(4)
        .fill(0)
        .map((_, i) => ({
          id: `${i}`,
          icon: SPOOKY_GHOST_IMAGE_BASE64,
          badgeValue: i * 5,
          trimColor: ["#bf616a", "#a3be8c", "#d08770", "#81a1c1"][i],
        }))}
      logEvents={Array(10)
        .fill(0)
        .map((_, i) => ({
          timestamp: i,
          message: `(0${i}:${i % 3}${(i + 3) % 5}) Lorem ipsum **dolar** sitem`,
        }))}
      connectionState="disconnected"
      apiLogEvents={[]}
      onBoardTileClicked={(tileNo) => alert(`Tile ${tileNo} clicked`)}
      onLoadGameSetupClicked={() => alert("Load Game Setup clicked")}
      onStartGameClicked={() => alert("Start Game clicked")}
      onConnectClicked={(uri) =>
        alert(`Connect/Disconnect clicked, uri: ${uri}`)
      }
      gameSetup={undefined}
      sessionOptions={options}
      onSessionOptionsChanged={(o) => setOptions({ ...o })}
    />
  );
}

export default {
  title: "Templates / Main Template",
} satisfies StoryDefault;
