// Loaded from https://deno.land/std@0.67.0/path/separator.ts


// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** This module is browser compatible. */

import { isWindows } from "./_constants.ts";

export const SEP = isWindows ? "\\" : "/";
export const SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;
