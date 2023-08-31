//// [classExpression4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    function C1() {
        _class_call_check(this, C1);
    }
    return C1.prototype.foo = function() {
        return new C();
    }, C1;
}();
(new C).foo();
