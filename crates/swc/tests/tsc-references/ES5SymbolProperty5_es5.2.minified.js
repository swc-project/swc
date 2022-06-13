import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Symbol, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype[Symbol.iterator] = function() {}, C;
}();
(new C)[Symbol.iterator](0);
