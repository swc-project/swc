//// [stringLiteralTypesInImplementationSignatures.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// String literal types are only valid in overload signatures
function foo(x) {}
var f = function foo(x) {};
var f2 = function f2(x, y) {};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {};
    return C;
}();
var a;
var b = {
    foo: function foo(x) {},
    a: function foo(x, y) {},
    b: function b(x) {}
};
