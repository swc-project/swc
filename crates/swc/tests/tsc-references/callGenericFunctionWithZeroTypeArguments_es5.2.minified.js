import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
f3(1);
var f3, i, i2, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function(x) {
        return null;
    }, C;
}();
new C().f(1), i.f(1);
var C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.f = function(x) {
        return null;
    }, C2;
}();
new C2().f(1), i2.f(1);
