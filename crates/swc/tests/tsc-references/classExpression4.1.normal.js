//// [classExpression4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
