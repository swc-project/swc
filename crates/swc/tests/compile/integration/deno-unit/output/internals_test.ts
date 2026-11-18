// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert } from "./test_util.ts";
unitTest(function internalsExists() {
    var stringifyArgs = Deno[Deno.internal].stringifyArgs;
    assert(!!stringifyArgs);
});
