import { parse } from "std/flags/mod.ts";
import printStats from "./print_stats.ts";
import { getNumericInput, printQuestion } from "helpers";

const args = parse(Deno.args);

if (args.stats) {
  printStats();
} else {
  printQuestion("How many times have you played");

  console.log(await getNumericInput());
}
