"use client";
import type { Tile } from "@/components/organisms/Board";
import { MainTemplate } from "@/components/templates";
import useApiService from "@/services/ApiService/useApiService";
import { ServiceRegistryContext } from "@/services/ServiceRegistry/ServiceRegistryContext";
import { loadFileUTF8ContentFromPicker } from "@/utils/file";
import type { Task } from "@webbnissarna/bingo-chill-common/src/api/types";
import type {
  GameSetup,
  SessionOptions,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import { useContext, useState } from "react";

export default function Home() {
  /////////////////////////////////////////////////////////////////
  // API
  /////////////////////////////////////////////////////////////////
  const serviceRegistry = useContext(ServiceRegistryContext);
  const { apiState, apiService } = useApiService(
    serviceRegistry.get("ApiService"),
  );

  /////////////////////////////////////////////////////////////////
  // Game Setup + Tiles
  /////////////////////////////////////////////////////////////////
  const [gameSetup, setGameSetup] = useState<GameSetup>({
    name: "",
    meta: { author: "", timestamp: "", version: "" },
    checksum: "",
    tasks: [],
  });

  const loadGameSetup = async () => {
    const data = await loadFileUTF8ContentFromPicker(".json");
    const newGameSetup = JSON.parse(data as string) as GameSetup;
    setGameSetup(newGameSetup);
  };

  const apiTaskToTile = (task: Task): Tile => ({
    text: task.name,
    colors: task.colors,
    icon: gameSetup.tasks.find((t) => t.name === task.name)?.icon ?? "",
  });

  /////////////////////////////////////////////////////////////////
  // Session Options
  /////////////////////////////////////////////////////////////////
  const updateSessionOptions = (newOptions: SessionOptions) => {
    apiService.updateOptions(newOptions);
  };

  const onConnectClicked = (uri: string) => {
    if (apiState.status === "disconnected") {
      apiService.connect(uri);
    } else if (apiState.status === "connected") {
      apiService.disconnect();
    }
  };

  const onClickTile = (tileNo: number) => {
    const me = apiState.gameState.players.find(
      (p) => p.id === apiState.connectionId,
    );
    if (!me) return;

    const task = apiState.gameState.tasks[tileNo];
    apiService.updateTask({
      index: tileNo,
      isCompleted: !task.colors.includes(me.color),
    });
  };

  return (
    <MainTemplate
      title="Bingo Chill"
      tiles={apiState.gameState.tasks.map(apiTaskToTile)}
      desiredChecksum={apiState.gameState.checksum}
      gameSetup={gameSetup}
      sessionOptions={apiState.options}
      profiles={apiState.gameState.players.map((p) => ({
        id: p.name,
        icon: p.icon,
        badgeValue: p.score,
        trimColor: p.color,
      }))}
      logEvents={apiState.gameState.events.map((e) => ({
        message: e.message,
        timestamp: e.elapsedTimeS,
      }))}
      apiLogEvents={apiState.logEvents}
      connectionState={apiState.status}
      onBoardTileClicked={onClickTile}
      onSessionOptionsChanged={updateSessionOptions}
      onLoadGameSetupClicked={loadGameSetup}
      onStartGameClicked={() => apiService.requestStart()}
      onConnectClicked={onConnectClicked}
    />
  );
}
