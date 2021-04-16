import { parse } from "https://deno.land/std@0.89.0/flags/mod.ts";
import printStats from "./print_stats.ts";
import { getNumericInput, printQuestion } from "./helpers/mod.ts";

const args = parse(Deno.args);

if (args.stats) {
  printStats();
} else {
  printQuestion("How many times have you played");

  console.log(await getNumericInput());
}
