import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
// @target: es6
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
