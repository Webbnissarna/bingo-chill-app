import DayjsDateTime from "@webbnissarna/bingo-chill-common/src/dateTime/dayjsDateTime";
import ProtobufSerializer from "@webbnissarna/bingo-chill-common/src/serialization/protobufSerializer";
import dotenv from "dotenv";
import GameEngine from "./gameEngine";
import WsGameServer from "./wsGameServer";
import { getApiProtoFileContents } from "@webbnissarna/bingo-chill-common/src/serialization/protobufUtils";
import yargs from "yargs";
import fs from "fs/promises";
import SeededRandom from "@webbnissarna/bingo-chill-common/src/random/SeededRandom";

dotenv.config();

void (async () => {
  const params = yargs()
    .option("gameFile", {
      type: "string",
      demandOption: true,
      requiresArg: true,
      description: "Path to game setup .json file",
    })
    .parseSync(process.argv.slice(2));

  const gameSetupContents = await fs.readFile(params.gameFile, {
    encoding: "utf-8",
  });

  const serializer = new ProtobufSerializer();
  serializer.load(await getApiProtoFileContents());

  const gameEngine = new GameEngine({
    dateTime: new DayjsDateTime(),
    rng: new SeededRandom(),
  });
  gameEngine.loadSetup(JSON.parse(gameSetupContents));

  const server = new WsGameServer({
    serializer,
    gameEngine,
  });

  server.listen();
})();
