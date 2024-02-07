//// [controlFlowOptionalChain3.tsx]
/// <reference path="/.lib/react16.d.ts" />
// https://github.com/microsoft/TypeScript/issues/56482
import React from "react";
function test1(foo) {
    if ((foo === null || foo === void 0 ? void 0 : foo.bar) === false) {
        foo;
    }
    foo;
}
function test2(foo) {
    if ((foo === null || foo === void 0 ? void 0 : foo.bar) === false) {
        foo;
    } else {
        foo;
    }
}
function Test3(param) {
    var foo = param.foo;
    return /*#__PURE__*/ React.createElement("div", null, (foo === null || foo === void 0 ? void 0 : foo.bar) === false && "foo", foo.bar ? "true" : "false");
}
function test4(options) {
    if ((options === null || options === void 0 ? void 0 : options.a) === false || options.b) {
        options;
    }
}
