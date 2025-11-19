//// [stringLiteralTypesInImplementationSignatures2.ts]
// String literal types are only valid in overload signatures
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
function foo(x) {}
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
var b = _define_property({
    foo: function foo(x) {}
}, "foo", function foo(x) {});
