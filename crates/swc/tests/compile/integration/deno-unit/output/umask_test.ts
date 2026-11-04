// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assertEquals } from "./test_util.ts";
unitTest({
    ignore: Deno.build.os === "windows"
}, function umaskSuccess() {
    var prevMask = Deno.umask(16);
    var newMask = Deno.umask(prevMask);
    var finalMask = Deno.umask();
    assertEquals(newMask, 16);
    assertEquals(finalMask, prevMask);
});
