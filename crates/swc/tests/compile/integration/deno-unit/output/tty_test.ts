function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert } from "./test_util.ts";
// Note tests for Deno.setRaw is in integration tests.
unitTest({
    perms: {
        read: true
    }
}, function isatty() {
    // CI not under TTY, so cannot test stdin/stdout/stderr.
    var f = Deno.openSync("cli/tests/hello.txt");
    assert(!Deno.isatty(f.rid));
    f.close();
});
unitTest(function isattyError() {
    var caught = false;
    try {
        // Absurdly large rid.
        Deno.isatty(0x7fffffff);
    } catch (e) {
        caught = true;
        assert(_instanceof(e, Deno.errors.BadResource));
    }
    assert(caught);
});
