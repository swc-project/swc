//// [memberFunctionsWithPublicPrivateOverloads.ts]
var c, d;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    return _proto.foo = function(x, y) {}, _proto.bar = function(x, y) {}, _proto.baz = function(x, y) {}, D.foo = function(x, y) {}, D.bar = function(x, y) {}, D.baz = function(x, y) {}, D;
}(), c.foo(1), d.foo(2);
