//// [modifierOnClassExpressionMemberInFunction.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function g() {
    (function() {
        "use strict";
        function C() {
            _class_call_check(this, C), this.prop1 = 1;
        }
        return C.prototype.foo = function() {}, C;
    })().prop2 = 43;
}
