//// [test.js]
/**
 * @typedef {(a: string, b: number) => void} Foo
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
