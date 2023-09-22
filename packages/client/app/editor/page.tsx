"use client";

import EditorTemplate, {
  stripTaskKeys,
} from "@/components/templates/EditorTemplate";
import {
  loadFileUTF8ContentFromPicker,
  downloadContentAsFile,
  copyToClipboard,
} from "@/utils/file";
import useLocalStorage from "@/utils/hooks/useLocalStorage";
import type { GameSetup } from "@webbnissarna/bingo-chill-common/src/game/types";

export default function Editor() {
  const [setup, setSetup] = useLocalStorage<GameSetup>("lastEditorSetup", {
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
      `${setup.name} ${setup.meta.version}.json`,
      "application/json",
    );

  const copy = () =>
    copyToClipboard(JSON.stringify(stripTaskKeys(setup), null, 2));
  return (
    <EditorTemplate
      gameSetup={setup}
      onChange={setSetup}
      onCopyClicked={copy}
      onLoadClicked={load}
      onSaveClicked={save}
    />
  );
}
