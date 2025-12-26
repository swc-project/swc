//// [modifierOnClassExpressionMemberInFunction.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function g() {
    var __ = new WeakMap(), C;
    var x = (C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
            this.prop1 = 1;
        }
        var _proto = C.prototype;
        _proto.foo = function foo() {};
        return C;
    }(), __.set(C, {
        writable: true,
        value: C.prop2 = 43
    }), C);
}
