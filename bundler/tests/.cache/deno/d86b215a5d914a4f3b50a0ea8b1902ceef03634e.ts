// Loaded from https://deno.land/std@0.104.0/path/separator.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isWindows } from "../_util/os.ts";

export const SEP = isWindows ? "\\" : "/";
export const SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;
