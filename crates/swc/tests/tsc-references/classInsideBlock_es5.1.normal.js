import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
function foo() {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
}
