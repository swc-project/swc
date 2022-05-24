import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C), this.x = x, this.exports = [
            x
        ];
    }
    return C.prototype.m = function(y) {
        return this.x + y;
    }, C;
}();
