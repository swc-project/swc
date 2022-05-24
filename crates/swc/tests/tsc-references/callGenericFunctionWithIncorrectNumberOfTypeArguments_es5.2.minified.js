import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var f3, i, i2, f2 = function(x, y) {
    return null;
};
f2(1, ""), f2(1, ""), f3(1, ""), f3(1, "");
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function(x, y) {
        return null;
    }, C;
}();
new C().f(1, ""), new C().f(1, ""), i.f(1, ""), i.f(1, "");
var C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.f = function(x, y) {
        return null;
    }, C2;
}();
new C2().f(1, ""), new C2().f(1, ""), i2.f(1, ""), i2.f(1, "");
