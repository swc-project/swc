//// [classExpression4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    var _proto = C1.prototype;
    _proto.foo = function foo() {
        return new C();
    };
    return C1;
}();
var x = (new C).foo();
