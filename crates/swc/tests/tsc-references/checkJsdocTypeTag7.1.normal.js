//// [test.js]
/**
 * @typedef {(a: string, b: number) => void} Foo
 */ import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    /** @type {Foo} */ _proto.foo = function foo(a, b) {};
    /** @type {(optional?) => void} */ _proto.methodWithOptionalParameters = function methodWithOptionalParameters() {};
    return C;
}();
