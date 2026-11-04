// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assert, assertEquals, unitTest } from "./test_util.ts";
// @ts-expect-error TypeScript (as of 3.7) does not support indexing namespaces by symbol
var setPrepareStackTrace = Deno[Deno.internal].setPrepareStackTrace;
function getMockCallSite(fileName, lineNumber, columnNumber) {
    return {
        getThis: function getThis() {
            return undefined;
        },
        getTypeName: function getTypeName() {
            return "";
        },
        getFunction: function getFunction() {
            return function() {};
        },
        getFunctionName: function getFunctionName() {
            return "";
        },
        getMethodName: function getMethodName() {
            return "";
        },
        getFileName: function getFileName() {
            return fileName;
        },
        getLineNumber: function getLineNumber() {
            return lineNumber;
        },
        getColumnNumber: function getColumnNumber() {
            return columnNumber;
        },
        getEvalOrigin: function getEvalOrigin() {
            return null;
        },
        isToplevel: function isToplevel() {
            return false;
        },
        isEval: function isEval() {
            return false;
        },
        isNative: function isNative() {
            return false;
        },
        isConstructor: function isConstructor() {
            return false;
        },
        isAsync: function isAsync() {
            return false;
        },
        isPromiseAll: function isPromiseAll() {
            return false;
        },
        getPromiseIndex: function getPromiseIndex() {
            return null;
        }
    };
}
unitTest(function prepareStackTrace() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var MockError = {};
    setPrepareStackTrace(MockError);
    assert(typeof MockError.prepareStackTrace === "function");
    var prepareStackTrace = MockError.prepareStackTrace;
    var result = prepareStackTrace(new Error("foo"), [
        getMockCallSite("CLI_SNAPSHOT.js", 23, 0)
    ]);
    assert(result.startsWith("Error: foo\n"));
    assert(result.includes(".ts:"), "should remap to something in 'js/'");
});
unitTest(function captureStackTrace() {
    function foo() {
        var error = new Error();
        var stack1 = error.stack;
        Error.captureStackTrace(error, foo);
        var stack2 = error.stack;
        // stack2 should be stack1 without the first frame.
        assertEquals(stack2, stack1.replace(/(?<=^[^\n]*\n)[^\n]*\n/, ""));
    }
    foo();
});
unitTest(function applySourceMap() {
    var result = Deno.applySourceMap({
        fileName: "CLI_SNAPSHOT.js",
        lineNumber: 23,
        columnNumber: 0
    });
    assert(result.fileName.endsWith(".ts"));
    assert(result.lineNumber != null);
    assert(result.columnNumber != null);
});
