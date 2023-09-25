"use client";

import type { Tile } from "@/components/organisms/Board";
import { MainTemplate } from "@/components/templates";
import { ServiceRegistryContext } from "@/services/ServiceRegistry/ServiceRegistryContext";
import { loadFileUTF8ContentFromPicker } from "@/utils/file";
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
  const apiService = serviceRegistry.get("ApiService");

  /////////////////////////////////////////////////////////////////
  // Game Setup + Tiles
  /////////////////////////////////////////////////////////////////
  const [gameSetup, setGameSetup] = useState<GameSetup>({
    name: "",
    meta: { author: "", timestamp: "", version: "" },
    checksum: "",
    tasks: [],
  });
  const [tiles, setTiles] = useState<Tile[]>([]);

  const loadGameSetup = async () => {
    const data = await loadFileUTF8ContentFromPicker(".json");
    const newGameSetup = JSON.parse(data as string) as GameSetup;
    setGameSetup(newGameSetup);
    setTiles(
      newGameSetup.tasks
        .slice(0, 25)
        .map((t) => ({ text: t.name, icon: t.icon, colors: [] })),
    );
  };

  /////////////////////////////////////////////////////////////////
  // Session Options
  /////////////////////////////////////////////////////////////////
  const [sessionOptions, setSessionOptions] = useState<SessionOptions>({
    seed: 0,
    isLockout: false,
    taskFilters: { includedTags: [], excludedTags: [] },
    timeLimitMinutes: 0,
  });

  const updateSessionOptions = (newOptions: SessionOptions) => {
    setSessionOptions({ ...newOptions });
  };

  return (
    <MainTemplate
      title="Bingo Chillin'"
      tiles={tiles}
      gameSetup={gameSetup}
      sessionOptions={sessionOptions}
      profiles={[]}
      logEvents={[]}
      isConnected={false}
      onBoardTileClicked={function (tileNo: number): void {
        throw new Error("Function not implemented.");
      }}
      onSessionOptionsChanged={updateSessionOptions}
      onLoadGameSetupClicked={loadGameSetup}
      onStartGameClicked={function (): void {
        throw new Error("Function not implemented.");
      }}
      onConnectClicked={function (uri: string): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
