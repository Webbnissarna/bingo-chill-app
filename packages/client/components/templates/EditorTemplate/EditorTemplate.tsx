import {
  Heading,
  Subtitle,
  Text,
  Button,
  TextInputField,
} from "@/components/atoms";
import TaskEditTable, { stripKey } from "@/components/organisms/TaskEditTable";
import { FolderOpenFilled, SaveFilled, CopyFilled } from "@ant-design/icons";
import type {
  GameSetup,
  Task,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import {
  patch,
  type DeepPartial,
} from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { calculateChecksum } from "@webbnissarna/bingo-chill-common/src/game/utils";
import { useContext } from "react";
import { ServiceRegistryContext } from "@/services/ServiceRegistry/ServiceRegistryContext";

export interface TaskWithPossibleKey extends Task {
  key?: string;
}
export interface GameSetupWithKeys extends GameSetup {
  tasks: TaskWithPossibleKey[];
}

export function stripTaskKeys(gameSetup: GameSetupWithKeys): GameSetup {
  return {
    ...gameSetup,
    tasks: gameSetup.tasks.map(stripKey),
  };
}

export interface EditorTemplateProps {
  gameSetup: GameSetup;
  onChange: (newGameSetup: GameSetupWithKeys) => void;
  onLoadClicked: () => void;
  onSaveClicked: () => void;
  onCopyClicked: () => void;
}

export default function EditorTemplate({
  gameSetup,
  onChange,
  onLoadClicked,
  onSaveClicked,
  onCopyClicked,
}: EditorTemplateProps): JSX.Element {
  const serviceRegistry = useContext(ServiceRegistryContext);
  const dateTimeService = serviceRegistry.get("DateTime");

  const patchWithTimestampAndChecksum = (
    baseSetup: GameSetup,
    update: DeepPartial<GameSetup>,
  ): GameSetup => {
    const timestamp = dateTimeService.toTimestamp(dateTimeService.now());
    const setup = patch(baseSetup, {
      ...update,
      meta: { ...update.meta, timestamp },
    });
    const checksum = calculateChecksum(stripTaskKeys(setup));
    return { ...setup, checksum };
  };

  const triggerChange = (update: DeepPartial<GameSetup>) => {
    onChange(patchWithTimestampAndChecksum(gameSetup, update));
  };

  return (
    <div className="bg-polarNight-0 w-screen h-full min-h-screen max-w-full max-h-full flex flex-row gap-4 justify-center md:p-2 md:py-14">
      <div className="bg-polarNight-1 w-full max-w-3xl p-2 flex flex-col items-center gap-2 md:rounded-2xl">
        <div className="flex flex-col items-center justify-center">
          <Heading>Bingo Chillin&apos;</Heading>
          <Subtitle>Game Setup Editor</Subtitle>
        </div>

        <div className="flex gap-2">
          <Button onClick={onLoadClicked}>
            <FolderOpenFilled /> Load
          </Button>
          <Button onClick={onSaveClicked}>
            <SaveFilled /> Save
          </Button>
          <Button onClick={onCopyClicked}>
            <CopyFilled /> Copy
          </Button>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-2 w-full items-center">
          <Text>Game Name</Text>
          <div>
            <TextInputField
              value={gameSetup.name}
              onChange={(newName) => triggerChange({ name: newName })}
            />
          </div>

          <Text>Author</Text>
          <div>
            <TextInputField
              value={gameSetup.meta.author}
              onChange={(author) => triggerChange({ meta: { author } })}
            />
          </div>

          <Text>Version</Text>
          <div>
            <TextInputField
              value={gameSetup.meta.version}
              onChange={(version) => triggerChange({ meta: { version } })}
            />
          </div>

          <Text>Timestamp</Text>
          <div className="opacity-50">
            <Text>{gameSetup.meta.timestamp}</Text>
          </div>

          <Text>Checksum</Text>
          <div className="opacity-50">
            <Text>{gameSetup.checksum}</Text>
          </div>
        </div>

        <div className="w-full">
          <TaskEditTable
            tasks={gameSetup.tasks}
            onChanged={(tasks) => triggerChange({ tasks })}
          />
        </div>
      </div>
    </div>
  );
}
