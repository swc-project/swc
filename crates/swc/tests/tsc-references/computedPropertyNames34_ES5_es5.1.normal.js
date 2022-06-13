import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
// @target: es5
function foo() {
    return "";
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    C.bar = function bar() {
        var obj = _define_property({}, foo(), function() {});
        return 0;
    };
    return C;
}();
