//// [emitClassDeclarationWithPropertyAccessInHeritageClause1.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
function foo() {
    return {
        B: B
    };
}
var C = /*#__PURE__*/ function(_foo_B) {
    "use strict";
    _inherits(C, _foo_B);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(foo().B);
