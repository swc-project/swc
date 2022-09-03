//// [assignEveryTypeToAny.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
x = 1;
var x, d, e2, E, g, h, i, a = 2;
x = a, x = !0;
var b = !0;
x = b, x = "";
var c = "";
x = c, x = d;
var e = void 0;
x = e, x = e2, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), x = E.A;
var f = E.A;
x = f, x = g;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function j(a) {}
x = h, x = i, x = {
    f: function() {
        return 1;
    }
}, x = {
    f: function(x) {
        return x;
    }
};
