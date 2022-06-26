import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    return C.bar = function() {
        return this;
    }, C;
}(), t = C.bar();
t.foo, t.bar(), new t(1);
var C2 = function() {
    "use strict";
    function C2(x) {
        _class_call_check(this, C2);
    }
    return C2.bar = function() {
        return this;
    }, C2;
}(), t2 = C2.bar();
t2.foo, t2.bar(), new t2("");
