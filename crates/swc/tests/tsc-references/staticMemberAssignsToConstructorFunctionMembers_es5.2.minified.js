import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.foo = function() {
        C.foo = function() {};
    }, C.bar = function(x1) {
        return C.bar = function() {}, C.bar = function(x) {
            return x;
        }, C.bar = function(x) {
            return 1;
        }, 1;
    }, C;
}();
