//// [modifierOnClassDeclarationMemberInFunction.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f() {
    !function() {
        "use strict";
        function C() {
            _class_call_check(this, C), this.baz = 1;
        }
        return C.prototype.bar = function() {}, C.foo = function() {}, C;
    }();
}
