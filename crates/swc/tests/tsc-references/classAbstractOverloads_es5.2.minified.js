import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.baz = function() {}, A;
}(), B = function() {
    "use strict";
    _class_call_check(this, B);
};
