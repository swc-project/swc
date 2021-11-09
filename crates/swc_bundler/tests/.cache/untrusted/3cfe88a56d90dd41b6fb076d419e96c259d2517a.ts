// Loaded from https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-7/modules/esm/mod.ts


import { denoHelper } from "./deps.ts";
import { setEd25519Helper } from "../../src/helper.ts";
setEd25519Helper(denoHelper);
export * from "../../src/mod.ts";
