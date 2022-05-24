import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        C.prototype.foo = function() {};
    }, _proto.bar = function(x1) {
        return C.prototype.bar = function() {}, C.prototype.bar = function(x) {
            return x;
        }, C.prototype.bar = function(x) {
            return 1;
        }, 1;
    }, C;
}();
