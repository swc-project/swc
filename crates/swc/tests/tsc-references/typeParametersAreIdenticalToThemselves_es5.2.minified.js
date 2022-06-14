import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo1 = function(x) {}, _proto.foo2 = function(a, x) {}, _proto.foo3 = function(x) {}, _proto.foo4 = function(x) {}, C;
}(), C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    return _proto.foo1 = function(x) {}, _proto.foo2 = function(a, x) {}, _proto.foo3 = function(x) {}, C2;
}();
