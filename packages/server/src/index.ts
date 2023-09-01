import dotenv from "dotenv";
import GameEngine from "./gameEngine";
import type { DateTimeService } from "@webbnissarna/bingo-chill-common/src/dateTime/types";

dotenv.config();

void (async () => {
  /* const serializer = new ProtobufSerializer();
  const proto = await getGameProtoFileContents();
  serializer.load(proto);

  const server = new GameServer(serializer);
  server.listen(); */

  const g = new GameEngine({} as DateTimeService);
  g.addPlayer();
})();
