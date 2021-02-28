import { parse } from "https://deno.land/std@0.80.0/flags/mod.ts";

import { Args, main } from "./src/mod.ts";
import { loadFile } from "./src/utils/deno.loadFile.ts";

const args = parse(Deno.args, {
  default: {
    outputDir: `./`,
  },
});

await main(args as Args, { loadFile, writeTextFile: Deno.writeTextFile });
