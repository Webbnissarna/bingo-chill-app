"use client";

import type { Event } from "@/components/molecules/LogBox";
import type { Tile } from "@/components/organisms/Board";
import type { Profile } from "@/components/organisms/ProfileList";
import type {
  GameSetup,
  SessionOptions,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import type { Tag } from "@/components/atoms/TagsInput";
import {
  Button,
  ChecksumIndicator,
  Heading,
  MarkdownText,
} from "@/components/atoms";
import {
  EditFilled,
  FolderOpenFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import Link from "next/link";
import Board from "@/components/organisms/Board";
import ProfileList from "@/components/organisms/ProfileList";
import { ConnectionControls, LogBox } from "@/components/molecules";
import { GameControls } from "@/components/organisms";
import type { ApiLogEvent } from "@/services/ApiService/types";

interface MainTemplateProps {
  title: string;
  tiles: Tile[];
  desiredChecksum: string;
  gameSetup: GameSetup | undefined;
  sessionOptions: SessionOptions;
  profiles: Profile[];
  logEvents: Event[];
  apiLogEvents: ApiLogEvent[];
  connectionState: "connected" | "disconnected" | "connecting";
  onBoardTileClicked: (tileNo: number) => void;
  onSessionOptionsChanged: (newOptions: SessionOptions) => void;
  onLoadGameSetupClicked: () => void;
  onStartGameClicked: () => void;
  onConnectClicked: (uri: string) => void;
}

export default function MainTemplate({
  title,
  tiles,
  desiredChecksum,
  gameSetup,
  sessionOptions,
  profiles,
  logEvents,
  apiLogEvents,
  connectionState,
  onBoardTileClicked,
  onSessionOptionsChanged,
  onLoadGameSetupClicked,
  onStartGameClicked,
  onConnectClicked,
}: MainTemplateProps): JSX.Element {
  const allTags: Tag[] = [
    ...new Set((gameSetup?.tasks ?? []).map((task) => task.tags).flat()),
  ].map((value) => ({ value, label: value }));

  return (
    <div className="bg-polarNight-0 min-h-screen p-2 flex flex-col gap-4 items-center">
      {/* Top */}
      <div className="w-full flex flex-row gap-2 items-center">
        <div id="profile" className="w-10 h-10 rounded bg-polarNight-3" />
        <div className="grow" />
        <Button onClick={onLoadGameSetupClicked}>
          <FolderOpenFilled /> Load Game Setup
        </Button>
        <Link href={"/editor"}>
          <Button onClick={() => undefined}>
            <EditFilled />
            Editor
          </Button>
        </Link>
      </div>
      <div className="w-full flex justify-center items-center">
        <Heading>{title}</Heading>
      </div>

      {/* Board */}
      <div className="w-full flex items-center justify-center">
        <Board tiles={tiles} onTileClicked={onBoardTileClicked} />
      </div>

      {/* Connection */}
      <div className="bg-polarNight-1 rounded flex flex-col gap-2 p-2 w-full max-w-xl">
        <ProfileList profiles={profiles} />
        <div className="h-52">
          <LogBox events={logEvents} />
        </div>
        <ConnectionControls
          state={connectionState}
          onConnectClicked={onConnectClicked}
        />
      </div>

      {/* Controls */}
      <div className="bg-polarNight-1 rounded flex flex-col gap-2 p-2 w-full max-w-xl">
        <ChecksumIndicator
          actual={gameSetup?.checksum}
          desired={desiredChecksum}
        />
        <GameControls
          options={sessionOptions}
          onChange={onSessionOptionsChanged}
          allTags={allTags}
        />
        <Button onClick={onStartGameClicked}>
          <PlayCircleFilled />
          Start Game
        </Button>
      </div>

      {/* API Log Events */}
      <div className="bg-polarNight-1 rounded max-h-36 flex flex-col p-2 w-full max-w-xl overflow-y-auto">
        <div className="overflow-y-scroll scrollbar-thin">
          {apiLogEvents.map((value, i) => (
            <MarkdownText key={i}>{`no ${i} ${value.message}`}</MarkdownText>
          ))}
        </div>
      </div>
    </div>
  );
}
