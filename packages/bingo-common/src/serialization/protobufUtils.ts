import fs from "fs/promises";
import path from "path";

export function getGameProtoFileContents(): Promise<string> {
  return fs.readFile(path.join(__dirname, "../game/game.proto"), "utf-8");
}
