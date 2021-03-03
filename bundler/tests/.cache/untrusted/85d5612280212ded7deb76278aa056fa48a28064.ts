// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/path/separator.ts


// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
const isWindows = Deno.build.os == "windows";
export const SEP = isWindows ? "\\" : "/";
export const SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;
