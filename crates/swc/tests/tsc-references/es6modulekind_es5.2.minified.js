import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.B = function() {
        return 42;
    }, A;
}();
export { A as default };
