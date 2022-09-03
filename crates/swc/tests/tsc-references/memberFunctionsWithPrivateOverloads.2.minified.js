//// [memberFunctionsWithPrivateOverloads.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var c, d, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function(x, y) {}, _proto.bar = function(x, y) {}, C.foo = function(x, y) {}, C.bar = function(x, y) {}, C;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    return _proto.foo = function(x, y) {}, _proto.bar = function(x, y) {}, D.foo = function(x, y) {}, D.bar = function(x, y) {}, D;
}(), r = c.foo(1), r2 = d.foo(2), r3 = C.foo(1), r4 = D.bar("");
