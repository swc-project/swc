function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
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
(function(E1) {
    E1[E1["A"] = 0] = "A";
})(E || (E = {
}));
x = E.A;
var f = E.A;
x = f;
var g;
x = g;
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var h;
x = h;
var i;
x = i;
x = {
    f: function() {
        return 1;
    }
};
x = {
    f: function(x1) {
        return x1;
x1 = i;
x1 = {
    f: function f() {
        return 1;
    }
};
x1 = {
    f: function f(x) {
        return x;
    }
};
function j(a1) {
    x = a1;
}
