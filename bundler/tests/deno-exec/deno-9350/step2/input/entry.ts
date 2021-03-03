import { parse } from "https://deno.land/std@0.86.0/flags/mod.ts";

import { getNumericInput, printQuestion } from "./helpers/mod";
import printStats from "./print_stats.ts";

const args = parse(Deno.args);

console.log(args.stats);

printStats();
printQuestion("How many times have you played");

console.log(await getNumericInput());
