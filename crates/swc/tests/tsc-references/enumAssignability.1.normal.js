//// [enumAssignability.ts]
// enums assignable to number, any, Object, errors unless otherwise noted
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
var F = /*#__PURE__*/ function(F) {
    F[F["B"] = 0] = "B";
    return F;
}(F || {});
var e = 0;
var f = 0;
e = f;
f = e;
e = 1; // ok
f = 1; // ok
var x = e; // ok
x = f; // ok
(function(Others) {
    var a = e; // ok
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var ac;
    var ai;
    var b = e; // ok
    var c = e;
    var d = e;
    var ee = e;
    var f = e; // ok
    var g = e;
    var h = e;
    var i = e;
    var j = e;
    var k = e;
    var l = e;
    ac = e;
    ai = e;
    var m = e;
    var n = e;
    var o = e;
    var p = e;
    var q = e;
    function foo(x, y, z) {
        x = e;
        y = e;
        z = e;
        var a = e;
        var b = e;
    }
})(Others || (Others = {}));
var Others;
