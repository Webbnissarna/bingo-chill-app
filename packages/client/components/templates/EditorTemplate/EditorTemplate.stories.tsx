import type { StoryDefault } from "@ladle/react";
import EditorTemplate, { stripTaskKeys } from ".";
import { useState } from "react";
import type { GameSetup } from "@webbnissarna/bingo-chill-common/src/game/types";
import {
  copyToClipboard,
  downloadContentAsFile,
  loadFileUTF8ContentFromPicker,
} from "@/utils/file";

export function Default() {
  const [setup, setSetup] = useState<GameSetup>({
    name: "",
    tasks: [],
    checksum: "",
    meta: { author: "", timestamp: "", version: "" },
  });

  const load = () =>
    loadFileUTF8ContentFromPicker(".json")
      .then((data) => JSON.parse(data as string) as GameSetup)
      .then(setSetup);

  const save = () =>
    downloadContentAsFile(
      JSON.stringify(stripTaskKeys(setup), null, 2),
      "gameSetup.json",
      "application/json",
    );

  const copy = () =>
    copyToClipboard(JSON.stringify(stripTaskKeys(setup), null, 2));

  return (
    <div className="flex flex-col gap-3">
      <EditorTemplate
        gameSetup={setup}
        onChange={setSetup}
        onCopyClicked={copy}
        onLoadClicked={load}
        onSaveClicked={save}
      />
      <div className="bg-polarNight-0 p-2 overflow-x-scroll">
        <pre className="font-monospace text-snowStorm-0">
          {JSON.stringify(stripTaskKeys(setup), null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default {
  title: "Templates / Editor Template",
} satisfies StoryDefault;
