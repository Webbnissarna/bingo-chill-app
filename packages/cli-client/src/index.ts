import chalk from "chalk";
import { WebSocket } from "ws";
import yargs from "yargs/yargs";
import readline from "readline";
import ProtobufSerializer from "@webbnissarna/bingo-chill-common/src/serialization/protobufSerializer";
import { getApiProtoFileContents } from "@webbnissarna/bingo-chill-common/src/serialization/protobufUtils";
import type {
  ApiMessageEnvelope,
  GameStateUpdate,
} from "@webbnissarna/bingo-chill-common/src/api/types";
import type {
  GameSetup,
  SessionOptions,
} from "@webbnissarna/bingo-chill-common/src/game/types";
import { patch } from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { hydrateOptions } from "@webbnissarna/bingo-chill-common/src/api/apiGameAdapter";
import fs from "fs/promises";

const state: {
  myId: string | null;
  options: SessionOptions | null;
  setup: GameSetup | null;
  gameState: GameStateUpdate | null;
  refreshTriggerStack: string[];
  sentData: number;
  receivedData: number;
} = {
  myId: null,
  options: null,
  setup: null,
  gameState: null,
  refreshTriggerStack: [],
  sentData: 0,
  receivedData: 0,
};

function parseArgs(): { uri: string } {
  return yargs()
    .option("uri", {
      type: "string",
      demandOption: true,
      requiresArg: true,
      description: "websocket connection uri",
    })
    .parseSync(process.argv.slice(2));
}

function bytesString(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1000 * 1000) return `${(bytes / 1000).toPrecision(2)} KB`;
  return `${(bytes / 1000 / 1000).toPrecision(2)} MB`;
}

function refreshScreen(triggerEvent: string) {
  state.refreshTriggerStack.push(triggerEvent);
  console.clear();
  console.log(
    chalk.bgBlack(state.refreshTriggerStack.slice(-5).reverse().join(" ")),
  );
  console.log(
    chalk.gray(
      `data in=${chalk.white(
        bytesString(state.receivedData),
      )} out=${chalk.white(bytesString(state.sentData))}`,
    ),
  );
  console.log(chalk.gray(`id=${chalk.white(state.myId)}`));
  console.log(
    chalk.gray(
      `options: seed=${chalk.white(state.options?.seed)} lockout=${chalk.white(
        state.options?.isLockout,
      )} timeLimit=${chalk.white(
        state.options?.timeLimitMinutes,
      )} tags (include)=${chalk.white(
        state.options?.taskFilters?.includedTags?.join(", "),
      )} tags (exclude)=${chalk.white(
        state.options?.taskFilters?.excludedTags?.join(", "),
      )}`,
    ),
  );
  console.log(
    `${chalk.gray("start timestamp:")} ${chalk.white(
      state.gameState?.startTimestamp,
    )}`,
  );
  console.log(
    `${chalk.gray("checksum:")} ${chalk.white(state.gameState?.checksum)}`,
  );
  console.log(
    chalk.gray(
      `players:\n\t${state.gameState?.players
        ?.map(
          (p) =>
            `${p.id} ${chalk.white(p.name)}: color=${chalk.hex(p.color)(
              p.color,
            )} score=${chalk.white(p.score)}`,
        )
        .join("\n\t")}`,
    ),
  );
  console.log(
    chalk.gray(
      `tasks: ${state.gameState?.tasks
        ?.map((t) =>
          chalk.white(
            `${t.name}:${
              t.colors ? t.colors.map((c) => chalk.hex(c)("X")).join("") : ""
            }`,
          ),
        )
        .join("\n\t")}`,
    ),
  );
  console.log(
    chalk.gray(
      `events:\n\t${state.gameState?.events
        ?.slice(-5)
        .reverse()
        .map((e) => {
          const rColor = e.message.match(/color="(#[a-fA-F0-9]{3,6})"/);
          const color = rColor ? rColor[1] : "#ffffff";
          return chalk.hex(color)(`(${e.elapsedTimeS}): ${e.message}`);
        })
        .join("\n\t")}`,
    ),
  );
}

async function run() {
  const { uri } = parseArgs();

  refreshScreen("");

  //////////////////////////////////////////////////////////////////////////
  // Protobuf
  //////////////////////////////////////////////////////////////////////////
  const serializer = new ProtobufSerializer();
  serializer.load(await getApiProtoFileContents());

  //////////////////////////////////////////////////////////////////////////
  // WebSockets connection
  //////////////////////////////////////////////////////////////////////////
  const ws = new WebSocket(uri);

  ws.on("error", (err) => {
    console.error(chalk.red(`[ws] error: ${err}`));
    process.exit(-1);
  });

  ws.on("open", () => {
    refreshScreen(chalk.green(`connected`));
  });

  ws.on("close", (code, reason) => {
    console.log(
      chalk.yellow(
        `[ws] closed (${code}): ${reason.toString() || "<no reason given>"}`,
      ),
    );
    process.exit(-1);
  });

  ws.on("message", (data) => {
    try {
      const uintdata = data as Uint8Array;
      state.receivedData = state.receivedData + uintdata.byteLength;
      const envelope = serializer.deserialize(uintdata);

      switch (envelope.type) {
        case "sReceiveId":
          state.myId = envelope.id;
          break;

        case "sOptionsUpdate":
          state.options = hydrateOptions(
            patch(state.options!, envelope.options),
          );
          break;

        case "sGameStateUpdate":
          state.gameState = envelope.gameState;
          break;

        default:
          break;
      }

      refreshScreen(envelope.type);
    } catch (error) {
      console.error(chalk.red(`bad message (${error})`));
      console.log(JSON.stringify(state.options, null, 2));
    }
  });

  //////////////////////////////////////////////////////////////////////////
  // User input
  //////////////////////////////////////////////////////////////////////////
  const rl = readline.createInterface({ input: process.stdin });
  rl.addListener("line", (line) => {
    const rCmd = line.match(/([^ ]*) (.*)/);

    if (!rCmd) {
      console.log(chalk.yellow("invalid line"));
      return;
    }

    const [cmd, payload] = rCmd.slice(1);

    switch (cmd) {
      case "send": {
        const rSend = payload.match(/^([^ ]+) (.*)$/);

        if (!rSend) {
          console.error(chalk.red(`bad "send" command (send <type> <data>)`));
          return;
        }

        const [type, rawString] = rSend.slice(1);
        const objectData = JSON.parse(rawString);

        const getEnvelope = (): ApiMessageEnvelope | undefined => {
          switch (type) {
            case "profile":
              return { type: "cUpdateProfile", profile: objectData };
            case "options":
              return {
                type: "cUpdateOptions",
                options: patch(state.options!, objectData),
              };
            case "task":
              return { type: "cUpdateTask", task: objectData };
            case "start":
              return { type: "cRequestStart" };
            case "state":
              return { type: "cRequestFullState" };
          }
        };

        const envelope = getEnvelope();
        if (!envelope) {
          console.error(chalk.red(`unknown type "${type}"`));
          return;
        }
        const data = serializer.serialize(envelope);
        state.sentData = state.sentData + data.byteLength;
        ws.send(data);
        refreshScreen(chalk.blue(type));
        break;
      }

      case "load": {
        fs.readFile(payload, { encoding: "utf-8" })
          .then((raw) => JSON.parse(raw) as GameSetup)
          .then((setup) => (state.setup = setup))
          .then(() => refreshScreen("loaded setup"))
          .catch((err) => refreshScreen(chalk.red(`load fail: ${err}`)));
        break;
      }
      default:
        console.log(
          chalk.yellow(`unknown command "${cmd}". Valid commands: send`),
        );
    }
  });
}

void run();
