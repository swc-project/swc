//// [emitClassDeclarationWithPropertyAccessInHeritageClause1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
