import fs from "fs/promises";
import path from "path";

export function getApiProtoFileContents(): Promise<string> {
  return fs.readFile(path.join(__dirname, "../api/api.proto"), "utf-8");
}
