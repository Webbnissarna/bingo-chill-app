import DayjsDateTime from "@webbnissarna/bingo-chill-common/src/dateTime/dayjsDateTime";
import ProtobufSerializer from "@webbnissarna/bingo-chill-common/src/serialization/protobufSerializer";
import dotenv from "dotenv";
import SeedRandomRandomnessService from "./RandomnessService/seedrandomRandomnessService";
import GameEngine from "./gameEngine";
import WsGameServer from "./wsGameServer";
import { getApiProtoFileContents } from "@webbnissarna/bingo-chill-common/src/serialization/protobufUtils";

dotenv.config();

void (async () => {
  const serializer = new ProtobufSerializer();
  serializer.load(await getApiProtoFileContents());

  const server = new WsGameServer({
    serializer,
    gameEngine: new GameEngine({
      dateTime: new DayjsDateTime(),
      rng: new SeedRandomRandomnessService(),
    }),
  });

  server.listen();
})();
