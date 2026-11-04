function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assert, unitTest } from "./test_util.ts";
unitTest(function formatDiagnosticBasic() {
    var fixture = [
        {
            message: "Example error",
            category: Deno.DiagnosticCategory.Error,
            sourceLine: "abcdefghijklmnopqrstuv",
            lineNumber: 1000,
            scriptResourceName: "foo.ts",
            startColumn: 1,
            endColumn: 2,
            code: 4000
        }
    ];
    var out = Deno.formatDiagnostics(fixture);
    assert(out.includes("Example error"));
    assert(out.includes("foo.ts"));
});
unitTest(function formatDiagnosticError() {
    var thrown = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var bad = [
        {
            hello: 123
        }
    ];
    try {
        Deno.formatDiagnostics(bad);
    } catch (e) {
        assert(_instanceof(e, Deno.errors.InvalidData));
        thrown = true;
    }
    assert(thrown);
});
