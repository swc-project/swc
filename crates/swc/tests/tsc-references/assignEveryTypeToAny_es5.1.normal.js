import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// all of these are valid
var x;
x = 1;
var a = 2;
x = a;
x = true;
var b = true;
x = b;
x = "";
var c = "";
x = c;
var d;
x = d;
var e = undefined;
x = e;
var e2;
x = e2;
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
x = E.A;
var f = E.A;
x = f;
var g;
x = g;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var h;
x = h;
var i;
x = i;
x = {
    f: function f() {
        return 1;
    }
};
x = {
    f: function f(x1) {
        return x1;
    }
};
function j(a1) {
    x = a1;
}
