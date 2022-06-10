import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype[Symbol.iterator] = function(x) {}, C;
}(), c = new C;
c[Symbol.iterator](""), c[Symbol.iterator](0);
