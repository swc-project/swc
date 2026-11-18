// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert } from "./test_util.ts";
unitTest(function buildInfo() {
    // Deno.build is injected by rollup at compile time. Here
    // we check it has been properly transformed.
    var _Deno_build = Deno.build, arch = _Deno_build.arch, os = _Deno_build.os;
    assert(arch.length > 0);
    assert(os === "darwin" || os === "windows" || os === "linux");
});
