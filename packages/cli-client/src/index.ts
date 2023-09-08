import chalk from "chalk";
import { WebSocket } from "ws";
import yargs from "yargs/yargs";

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

async function run() {
  const { uri } = parseArgs();

  const ws = new WebSocket(uri);

  ws.on("error", (err) => {
    console.error(chalk.red(`[ws] error: ${err}`));
    process.exit(-1);
  });

  ws.on("open", () => {
    console.log(chalk.green(`[ws] connected!`));
  });

  ws.on("close", (code, reason) => {
    console.log(
      chalk.yellow(
        `[ws] closed (${code}): ${reason.toString() || "<no reason given>"}`,
      ),
    );
  });

  ws.on("message", (data, isBinary) => {
    console.log(chalk.gray(`[ws] message (binary=${isBinary}) ${data}`));
  });
}

void run();
