//// [modifierOnClassExpressionMemberInFunction.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function g() {
    var _C;
    var x = (_C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
            this.prop1 = 1;
        }
        var _proto = C.prototype;
        _proto.foo = function foo() {};
        return C;
    }(), function() {
        _C.prop2 = 43;
    }(), _C);
}
