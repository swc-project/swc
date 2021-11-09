// Loaded from https://deno.land/x/args@1.0.7/symbols.ts


/** Value of `tag` when argv is a complete and list of valid options */
export const MAIN_COMMAND = Symbol("MAIN_COMMAND");
export type MAIN_COMMAND = typeof MAIN_COMMAND;

/** Value of `tag` when argv is failed to parse */
export const PARSE_FAILURE = Symbol("PARSE_FAILURE");
export type PARSE_FAILURE = typeof PARSE_FAILURE;
