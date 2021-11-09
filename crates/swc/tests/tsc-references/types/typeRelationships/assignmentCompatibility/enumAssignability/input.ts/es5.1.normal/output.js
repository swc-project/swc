function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var // enums assignable to number, any, Object, errors unless otherwise noted
E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
var F1;
(function(F) {
    F[F["B"] = 0] = "B";
})(F1 || (F1 = {
}));
var e = E1.A;
var f = F1.B;
e = f;
f = e;
e = 1; // ok
f = 1; // ok
var x1 = e; // ok
x1 = f; // ok
var Others;
(function(Others) {
    var foo = function foo(x, y, z) {
        x = e;
        y = e;
        z = e;
        var a = e;
        var b = e;
    };
    var a = e; // ok
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
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
})(Others || (Others = {
}));
