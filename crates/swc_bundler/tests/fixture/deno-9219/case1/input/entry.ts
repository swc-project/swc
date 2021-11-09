import { parse } from "https://deno.land/std@0.84.0/flags/mod.ts";

const args = parse(Deno.args, {
    boolean: [
        "help",
        "verbose",
    ],
    alias: {
        help: "h",
        verbose: "v",
    },
    default: {
        verbose: false,
    },
}) as {
    _: string[];
    help: boolean;
    verbose: boolean;
};

console.dir(args);