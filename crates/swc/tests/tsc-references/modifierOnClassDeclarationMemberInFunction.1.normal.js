//// [modifierOnClassDeclarationMemberInFunction.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f() {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
            this.baz = 1;
        }
        var _proto = C.prototype;
        _proto.bar = function bar() {};
        C.foo = function foo() {};
        return C;
    }();
}
