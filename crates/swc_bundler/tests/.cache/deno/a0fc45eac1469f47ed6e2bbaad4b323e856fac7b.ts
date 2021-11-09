// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/main.ts


import { setupLogging, log, flags } from "./mod.ts";
import { launch } from "./launch.ts";
import { version } from './version.ts';

export async function main() {
  const args = flags.parse(Deno.args);
  if (args["version"] === true) {
    console.log(`dnit ${version}`);
    Deno.exit(0);
  }

  await setupLogging();
  const internalLogger = log.getLogger("internal");

  if (args["verbose"] !== undefined) {
    internalLogger.levelName = "INFO";
  }

  internalLogger.info(`starting dnit launch using version: ${version}`);

  launch(internalLogger).then((st) => {
    Deno.exit(st.code);
  });
}

main();
