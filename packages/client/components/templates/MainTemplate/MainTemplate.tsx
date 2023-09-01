import { Heading, Subtitle } from "@/components/atoms";
import { LogBox, ConnectionControls } from "@/components/molecules";
import { Board, GameControls, ProfileList } from "@/components/organisms";
import type { Event } from "@/components/molecules/LogBox";
import type { Tile } from "@/components/organisms/Board";
import type { Profile } from "@/components/organisms/ProfileList";
import type { GameOptions } from "@/services/GameService/GameService.types";

interface MainTemplateProps {
  title: string;
  subtitle: string;
  tiles: Tile[];
  gameOptions: GameOptions;
  profiles: Profile[];
  logEvents: Event[];
  isConnected: boolean;
  onBoardTileClicked: (tileNo: number) => void;
  onGameOptionsChanged: (newOptions: GameOptions) => void;
  onLoadGameSetupClicked: () => void;
  onStartGameClicked: () => void;
  onConnectClicked: (uri: string) => void;
}

export default function MainTemplate({
  title,
  subtitle,
  tiles,
  gameOptions,
  profiles,
  logEvents,
  isConnected,
  onBoardTileClicked,
  onGameOptionsChanged,
  onLoadGameSetupClicked,
  onStartGameClicked,
  onConnectClicked,
}: MainTemplateProps): JSX.Element {
  return (
    <div className="w-screen h-screen max-w-full max-h-full p-2 flex flex-row gap-4">
      <div className="grow flex flex-col justify-around items-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <Heading>{title}</Heading>
          <Subtitle>{subtitle}</Subtitle>
        </div>

        <Board tiles={tiles} onTileClicked={onBoardTileClicked} />
      </div>

      <div className="bg-polarNight-1 p-4 rounded-lg basis-96 flex flex-col gap-2">
        <GameControls
          options={gameOptions}
          onChange={onGameOptionsChanged}
          onLoadGameSetup={onLoadGameSetupClicked}
          onStartGame={onStartGameClicked}
        />

        <div className="grow" />

        <ProfileList profiles={profiles} />

        <LogBox events={logEvents} />

        <ConnectionControls
          isConnected={isConnected}
          onConnectClicked={onConnectClicked}
        />
      </div>
    </div>
  );
}
