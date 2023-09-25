import fs from "fs/promises";
import path from "path";

function getApiProtoFilePath(): string {
  return path.join(__dirname, "../api/api.proto");
}

export function getApiProtoFileContents(): Promise<string> {
  return fs.readFile(getApiProtoFilePath(), "utf-8");
}
