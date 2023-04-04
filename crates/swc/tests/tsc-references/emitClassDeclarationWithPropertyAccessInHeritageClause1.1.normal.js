//// [emitClassDeclarationWithPropertyAccessInHeritageClause1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(foo().B);
