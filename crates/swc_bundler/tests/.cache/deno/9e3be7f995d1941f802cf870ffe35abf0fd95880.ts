// Loaded from https://deno.land/x/sodium/basic.ts


// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import type { Sodium } from "./basic_types.ts";
import sodium from "./dist/browsers/sodium.js";

export default sodium as Sodium;

export * from "./basic_types.ts";
