import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.x = function() {
        return 1;
    }, C;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.x = function(v) {}, D;
}();
